from web3 import Web3
import time
import redis
import requests

from utils.hook import WebHook

POLL_INTERVAL = 10  # seconds


class BtcStreamer:
    def __init__(self, btc_config, redis_config, unchained_config):
        bcoin_endpoint = btc_config["bcoin-endpoint"]
        self.hook = WebHook(
            unchained_config["transaction-webhook-url"], unchained_config["secret"]
        )
        self.endpoint = bcoin_endpoint
        self.wallet_endpoint = btc_config["wallet-endpoint"]
        bcoin_apikey = btc_config["bcoin-apikey"]
        self.redis = redis.Redis(host=redis_config["host"], port=redis_config["port"])
        s = requests.Session()
        s.auth = ("", bcoin_apikey)
        self.sess = s
        self.monitored_xpubs = [btc_config["xpub"]]

    def process_blocks(self):
        for xpub in self.monitored_xpubs:
            if not self.wallet_exists(xpub):
                self.create_watch_only_wallet(xpub)
            self.get_wallet_tx_history(xpub)

    def create_watch_only_wallet(self, xpub):
        url = "{}/wallet/{}".format(self.wallet_endpoint, xpub[:10])
        data = {"watchOnly": True, "accountKey": xpub}
        res = self.sess.put(url, json=data).json()
        return "id" in res and res["id"] == xpub[:10]

    def wallet_exists(self, xpub):
        existing_wallets = self.sess.get(
            "{}/wallet".format(self.wallet_endpoint)
        ).json()
        return xpub[:10] in existing_wallets

    def get_wallet_tx_history(self, xpub):
        while True:
            url = "{}/wallet/{}/tx/history".format(self.wallet_endpoint, xpub[:10])
            data = self.sess.get(url).json()
            for tx in data:
                address_sums = {}
                for output in tx["outputs"]:
                    if output["path"] != None and output["path"]["account"] == 0:
                        # Only consider outputs (i.e., received values) where there is a valid BIP32 derivation path for the wallet.
                        # All other outputs do not belong to this wallet and must be ignored.
                        if output["address"] not in address_sums:
                            address_sums[output["address"]] = output["value"]
                        else:
                            address_sums[output["address"]] += output["value"]
                for address, sum in address_sums.items():
                    # Check if hook for address already fired. If so, check if the sum has changed
                    amount_fired = self.redis.get("btc_{}".format(address))
                    if amount_fired is None or sum > int(amount_fired):
                        if self.hook.fire_payment("BTC", None, 8, address, sum):
                            self.redis.set("btc_{}".format(address), sum)
            time.sleep(POLL_INTERVAL)
