from web3 import Web3
from web3.middleware import geth_poa_middleware
import time
import redis
from enum import Enum

from eth.link_utils import LinkUtils
from utils.hook import WebHook

POLL_INTERVAL = 10  # seconds


class ConversionTypes(Enum):
    DIRECT = 1  # Direct conversion between base address and quote currency
    USD = 2  # Base address -> USD -> quote currency
    NONE = 100  # No conversion possible


class LinkFeeder:
    def __init__(
        self, eth_config, redis_config, unchained_config, erc20_contract_addresses
    ):
        rpc_endpoint = eth_config["rpc-endpoint"]
        self.redis = redis.Redis(host=redis_config["host"], port=redis_config["port"])
        self.hook = WebHook(
            unchained_config["price-webhook-url"], unchained_config["secret"]
        )
        self.w3 = Web3(Web3.HTTPProvider(rpc_endpoint))
        if eth_config["poa-testnet"]:
            self.w3.middleware_onion.inject(geth_poa_middleware, layer=0)
        self.feed_registry_addr = eth_config["link-feed-registry-addr"]
        self.base_currencies = ["USD", "CHF"]
        self.conversion_types = {}
        self.link_utils = LinkUtils(self.w3, self.feed_registry_addr)
        self.tokens = erc20_contract_addresses + ["ETH", "BTC"]
        self._init_conversion_types()

    def _init_conversion_types(self):
        """Cache conversion types in the beginning, such that we do not query for them on every process_block iteration"""
                
        for token in self.tokens:
            if token not in self.conversion_types:
                self.conversion_types[token] = {}
            for base_currency in self.base_currencies:
                token_address = self.link_utils.get_quote_address(token)
                if self.link_utils.feed_exists(token_address, base_currency):
                    self.conversion_types[token][base_currency] = ConversionTypes.DIRECT
                elif self.link_utils.is_usd_convertible(token_address, base_currency):
                    self.conversion_types[token][base_currency] = ConversionTypes.USD
                else:
                    self.conversion_types[token][base_currency] = ConversionTypes.NONE

    def call_hook(self, base_currency, token, exchange_rate, timestamp) -> bool:
        """Call hook when there was a ETH transaction. The ETH balance at block height block_number is sent to the engine."""
        self.hook.fire_price_update(base_currency, token, exchange_rate, timestamp)

    def process_feed(self):
        while True:
            for token in self.tokens:
                token_address = self.link_utils.get_quote_address(token)
                for base_currency in self.base_currencies:
                    rate, timestamp = False, False
                    conversion_type = self.conversion_types[token][base_currency]
                    if conversion_type == ConversionTypes.DIRECT:
                        rate_data = self.link_utils.get_exchange_rate(
                            token_address, base_currency
                        )
                        if rate_data:
                            (rate, timestamp) = rate_data
                    elif conversion_type == ConversionTypes.USD:
                        rate_data_usd = self.link_utils.get_exchange_rate(
                            token_address, "USD"
                        )
                        rate_data_currency_swap = self.link_utils.get_exchange_rate(
                            self.link_utils.get_quote_address(base_currency), "USD"
                        )
                        if rate_data_usd and rate_data_currency_swap:
                            (rate_usd, timestamp_usd) = rate_data_usd
                            (rate_swap, timestamp_swap) = rate_data_currency_swap
                            (rate, timestamp) = (
                                rate_usd * 1.0 / rate_swap,
                                min([timestamp_usd, timestamp_swap]),
                            )

                    if rate and timestamp:
                        # If we have not gotten a value / an error in the oracle occured, we skip this round and send not updated data
                        self.call_hook(base_currency, token, rate, timestamp)
            time.sleep(POLL_INTERVAL)
