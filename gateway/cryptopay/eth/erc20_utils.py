from typing import Tuple, Union
from web3 import Web3
from eth.const import ERC20_ABI, ERC20_TRANSFER_METHOD_ID


def parse_erc20_tx(tx) -> Tuple[Union[str, None], Union[str, None]]:
    """
    Returns (receiver, amount) for valid ERC20 transactions, (None, None) for invalid ones
    """
    method_id = tx["input"][2:10]
    if method_id == ERC20_TRANSFER_METHOD_ID:
        receiver = "0x{}".format(tx["input"][34:74])
        amount = int(tx["input"][74:], 16)
        return (receiver, amount)
    return (None, None)


def get_erc20_balance(w3, contract_address, account_address, block_number) -> int:
    contract = w3.eth.contract(contract_address, abi=ERC20_ABI)
    # TODO: calling at specific block_identifiers need ETH node with --gcmode=archive --syncmode=full, https://github.com/ethereum/go-ethereum/issues/16123
    # raw_balance = contract.functions.balanceOf(Web3.toChecksumAddress(account_address)).call(block_identifier=block_number)
    raw_balance = contract.functions.balanceOf(
        Web3.toChecksumAddress(account_address)
    ).call()
    return raw_balance
