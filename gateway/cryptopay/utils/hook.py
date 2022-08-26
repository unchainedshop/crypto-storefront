import requests


class WebHook:
    def __init__(self, hook_url, secret):
        self.hook_url = hook_url
        self.secret = secret

    def fire_payment(self, currency, contract_address, decimals, rcpt_address, amount, block):
        data = {
            "currency": currency,
            "contract": contract_address,
            "decimals": decimals,
            "address": rcpt_address,
            "amount": str(amount),
            "secret": self.secret,
            "blockHeight": block,
        }
        try:
            res = requests.post(self.hook_url, json=data).json()
        except:
            return False
        if "success" in res and res["success"]:
            return True
        else:
            return False

    def fire_price_update(self, base_currency, token, exchange_rate, timestamp):
        data = {
            "baseCurrency": base_currency,
            "token": token,
            "rate": exchange_rate,
            "timestamp": timestamp,
            "secret": self.secret,
        }
        try:
            requests.post(self.hook_url, json=data).json()
        except:
            """In contrast to payment hooks, we ignore errors (e.g., when the Unchained Engine is down),
            as the hook will be called again in a short interval and no information is lost."""
            pass
