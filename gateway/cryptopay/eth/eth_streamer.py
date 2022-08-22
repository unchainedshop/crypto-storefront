from web3 import Web3
from web3.middleware import geth_poa_middleware
import time
import redis
import bip_utils

from eth.erc20_utils import get_erc20_balance, parse_erc20_tx
from eth.const import ERC20_ABI
from utils.hook import WebHook

POLL_INTERVAL = 10  # seconds


class EthStreamer:
    def __init__(
        self, eth_config, redis_config, unchained_config, erc20_contract_addresses
    ):
        rpc_endpoint = eth_config["rpc-endpoint"]

        self.redis = redis.Redis(host=redis_config["host"], port=redis_config["port"])
        self.hook = WebHook(
            unchained_config["transaction-webhook-url"], unchained_config["secret"]
        )
        self.w3 = Web3(Web3.HTTPProvider(rpc_endpoint))
        
        if(self.w3.isConnected()):
            print("Connected to ethereum RPC node at ", rpc_endpoint, " successfully", end="\r"  )
            print("Chain ID: ", self.w3.eth.chainId,  end="\r" )
        else:
            print("Error connecting to RPC endpoint")

        if eth_config["poa-testnet"]:
            self.w3.middleware_onion.inject(geth_poa_middleware, layer=0)
        self.init_block_history = eth_config["init-block-history"]
        self.min_account_index = 0
        self.account_index_window = 20000  # How many derived addresses to check
        self.xpub = eth_config["xpub"]
        self.monitored_addresses = set()
        self.erc_20_tokens = erc20_contract_addresses
        self.decimals = {}
        self._init_decimals()
        self._init_monitored_addresses()

    def _init_monitored_addresses(self):
        bip44_ctx = bip_utils.Bip44.FromExtendedKey(
            self.xpub, bip_utils.Bip44Coins.ETHEREUM
        ).Change(bip_utils.Bip44Changes.CHAIN_EXT)
        for index in range(
            self.min_account_index, self.min_account_index + self.account_index_window
        ):
            derived_address = bip44_ctx.AddressIndex(index).PublicKey().ToAddress()
            self.monitored_addresses.add(derived_address)

    def _init_decimals(self):
        for erc20_address in self.erc_20_tokens:
            contract = self.w3.eth.contract(
                Web3.toChecksumAddress(erc20_address), abi=ERC20_ABI
            )
            try:
                decimals = contract.functions.decimals().call()
                self.decimals[erc20_address] = decimals
            except:
                continue

    def call_hook_eth(self, address, block_number) -> bool:
        """Call hook when there was a ETH transaction. The ETH balance at block height block_number is sent to the engine."""
        balance = self.w3.eth.getBalance(address, block_number)
        if balance > 0:
            # Check if hook for address already fired. If so, check if increased
            amount_fired = self.redis.get("eth_{}".format(address))
            if amount_fired is None or balance > int(amount_fired):
                res = self.hook.fire_payment("ETH", None, 18, address, balance)
                if res:
                    self.redis.set("eth_{}".format(address), balance)
                    return True
                else:
                    return False
        else:
            return False

    def call_hook_erc20(self, contract_address, rcpt_address, block_number) -> bool:
        """Call hook when there was a transfer() for the given ERC20 contract.
        The ERC20 token balance at block height block_number is transmitted.
        """
        balance = get_erc20_balance(
            self.w3, contract_address, rcpt_address, block_number
        )
        if contract_address not in self.decimals:
            return False
        decimals = self.decimals[contract_address]
        if balance > 0:
            amount_fired = self.redis.get(
                "eth_erc20_{}_{}".format(contract_address, rcpt_address)
            )
            if amount_fired is None or balance > int(amount_fired):
                res = self.hook.fire_payment(
                    "ETH", contract_address, decimals, rcpt_address, balance
                )
                if res:
                    self.redis.set(
                        "eth_erc20_{}_{}".format(contract_address, rcpt_address),
                        balance,
                    )
                    return True
                else:
                    return False
        else:
            return False

    def process_blocks(self):
        print("Started processing block...")
        while True:
            curr_block = self.w3.eth.get_block("latest").number
            checked_block = self.redis.get("eth_checkedblock")
            print("Processing block from ", checked_block , " to ", curr_block)
            if checked_block is None:
                checked_block = curr_block - self.init_block_history
            else:
                checked_block = int(checked_block)
            if curr_block == checked_block:
                time.sleep(POLL_INTERVAL)
            all_succ = True
            changed_addresses_eth = []
            changed_addresses_erc20 = {}
            for block_number in range(checked_block, curr_block + 1):
                print("Processing block ", block_number, end="\r")
                block = self.w3.eth.get_block(block_number, True)
                for tx in block.transactions:
                    if tx["to"] in self.monitored_addresses:
                        print("Found transaction to", tx["to"])
                        changed_addresses_eth.append(tx["to"])
                    elif tx["to"] in self.erc_20_tokens:
                        # tx['to'] is ERC20 token address for these transfers, receiver must be parsed from input for 'transfer' calls
                        (receiver, amount) = parse_erc20_tx(tx)
                        if receiver in self.monitored_addresses:
                            if tx["to"] in changed_addresses_erc20:
                                changed_addresses_erc20[tx["to"]].append(receiver)
                            else:
                                changed_addresses_erc20[tx["to"]] = [receiver]
            for address in changed_addresses_eth:
                if not self.call_hook_eth(address, curr_block):
                    all_succ = False
            for contract_address, rcpt_address in changed_addresses_erc20.items():
                if not self.call_hook_erc20(contract_address, rcpt_address, curr_block):
                    all_succ = False

            if all_succ:
                # if there was an error on the hook call, we still need to consider these blocks / addresses the next time
                self.redis.set("eth_checkedblock", curr_block)
            time.sleep(POLL_INTERVAL)
