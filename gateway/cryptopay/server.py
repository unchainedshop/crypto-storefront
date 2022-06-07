import argparse
from config.parser import ConfigParser
from eth.eth_streamer import EthStreamer
from btc.btc_streamer import BtcStreamer
from eth.link_feeder import LinkFeeder
from concurrent.futures import ProcessPoolExecutor


def process_btc(config: ConfigParser):
    btc_streamer = BtcStreamer(
        config.get_currency_options("btc"),
        config.get_redis_config(),
        config.get_unchained_config(),
    )
    btc_streamer.process_blocks()


def process_eth(config: ConfigParser):
    eth_streamer = EthStreamer(
        config.get_currency_options("eth"),
        config.get_redis_config(),
        config.get_unchained_config(),
        config.get_contract_addresses(),
    )
    eth_streamer.process_blocks()


def feed_eth(config: ConfigParser):
    eth_feeder = LinkFeeder(
        config.get_currency_options("eth"),
        config.get_redis_config(),
        config.get_unchained_config(),
        config.get_contract_addresses(),
    )
    eth_feeder.process_feed()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Unchained Crypto Payment Gateway.")
    parser.add_argument(
        "-c", help="Path to the config yaml file", default="./config/cryptopay.yaml"
    )
    args = parser.parse_args()
    config = ConfigParser(args.c)
    with ProcessPoolExecutor(3) as executor:
        executor.submit(process_btc, config)
        executor.submit(process_eth, config)
        executor.submit(feed_eth, config)
