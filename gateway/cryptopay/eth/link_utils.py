from typing import Union, Tuple, List
from unicodedata import decimal

import web3
from eth.const import (
    LINK_FEEDREGISTRY_ABI,
    BTC_DENOMINATION,
    ETH_DENOMINATION,
    FIAT_DENOMINATIONS,
)


class LinkUtils:
    def __init__(self, w3, feed_registry_address):
        self.w3 = w3
        self.contract = w3.eth.contract(
            feed_registry_address, abi=LINK_FEEDREGISTRY_ABI
        )
        self.decimals = {}

    def get_quote_address(self, quote_currency):
        if quote_currency[:2] == "0x":  # Address passed
            return quote_currency
        elif quote_currency == "BTC":
            quote_address = BTC_DENOMINATION
        elif quote_currency == "ETH":
            quote_address = ETH_DENOMINATION
        elif quote_currency in FIAT_DENOMINATIONS:
            quote_address = FIAT_DENOMINATIONS[quote_currency]
        else:
            return False
        return quote_address

    def is_usd_convertible(self, base_address, quote_currency) -> bool:
        """Check if it is possible to conver the base_address first to USD, and then the USD amount to the quote currency.
        Can be used as a fallback if no direct feed exists (e.g. 1INCH / USD and then CHF / USD).
        The second rate always needs to be inverted, as USD is always the quote currency."""
        return (
            quote_currency != "USD"
            and self.feed_exists(base_address, "USD")
            and self.feed_exists(self.get_quote_address(quote_currency), "USD")
        )

    def is_eth_convertible(self, base_address, quote_currency) -> bool:
        """Check if it is possible to convert the base_address first to ETH, and then the ETH amount to the quote currency.
        Can be used as a fallback if no direct feed exists (e.g. SHIB / ETH and then ETH / USD)."""
        return (
            quote_currency != "ETH"
            and self.feed_exists(base_address, "ETH")
            and self.feed_exists(self.get_quote_address("ETH"), quote_currency)
        )

    def is_eth_usd_convertible(self, base_address, quote_currency) -> bool:
        """Check if the conversion path base_address -> ETH -> USD -> quote_currency is possible,
        e.g. SHIB -> ETH -> USD -> CHF
        """
        return (
            quote_currency != "ETH"
            and quote_currency != "USD"
            and self.feed_exists(base_address, "ETH")
            and self.feed_exists(self.link_utils.get_quote_address("ETH"), "USD")
            and self.feed_exists(
                self.link_utils.get_quote_address(quote_currency), "USD"
            )
        )

    def feed_exists(self, base_address, quote_currency) -> bool:
        """Check if the feed for a given base_address / quote_currency pair exists"""
        quote_address = self.get_quote_address(quote_currency)
        try:
            self.contract.functions.latestRoundData(
                web3.Web3.toChecksumAddress(base_address),
                web3.Web3.toChecksumAddress(quote_address),
            ).call()
        except web3.exceptions.ContractLogicError as e:
            if e.args and e.args[0] == "execution reverted: Feed not found":
                return False
        return True

    def get_exchange_rate(
        self, base_address, quote_currency
    ) -> Union[Tuple[float, int], bool]:
        """
        Get the exchange rate for base_address in quote_currency. Returns false if no oracle is available or the currency is not supported.
        """
        quote_address = self.get_quote_address(quote_currency)
        if base_address not in self.decimals:
            self.decimals[base_address] = {}
        try:
            if quote_address not in self.decimals[base_address]:
                self.decimals[base_address][
                    quote_address
                ] = self.contract.functions.decimals(
                    web3.Web3.toChecksumAddress(base_address),
                    web3.Web3.toChecksumAddress(quote_address),
                ).call()
            decimals = self.decimals[base_address][quote_address]
            (
                roundID,
                price,
                startedAt,
                timeStamp,
                answeredInRound,
            ) = self.contract.functions.latestRoundData(
                web3.Web3.toChecksumAddress(base_address),
                web3.Web3.toChecksumAddress(quote_address),
            ).call()
        except:
            return False
        return (price / (10.0**decimals), timeStamp)
