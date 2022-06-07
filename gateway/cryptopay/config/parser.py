import os
import logging
import yaml
import sys
import re

from utils.unchained.unchained_client import UnchainedClient


class ConfigParser:
    def __init__(self, path):
        if not os.path.isfile(path):
            self.critical_exit("Invalid configuration path specified: {}".format(path))
        with open(path, "r") as stream:
            self.config = yaml.safe_load(stream)

    @staticmethod
    def critical_exit(message):
        logging.critical(message)
        sys.exit()

    def get_currency_options(self, currency):
        if "currencies" not in self.config or currency not in self.config["currencies"]:
            self.critical_exit(
                "currencies.{} not found in configuration file".format(currency)
            )
        options = self.config["currencies"][currency]
        return self.replace_env_vars(options)

    def get_redis_config(self):
        if "redis" not in self.config:
            self.critical_exit("redis not found in configuration file")
        return self.replace_env_vars(self.config["redis"])

    def get_unchained_config(self):
        if "unchained" not in self.config:
            self.critical_exit("unchained not found in configuration file")
        return self.replace_env_vars(self.config["unchained"])

    def get_contract_addresses(self):
        unchained_config = self.get_unchained_config()
        unchained_client = UnchainedClient(unchained_config)
        return unchained_client.get_contract_addresses()

    def replace_env_vars(self, options):
        for key, val in options.items():
            if not isinstance(val, str):
                continue
            env_var_match = re.search(r"^\$\{(\w+)\}$", val)
            if env_var_match:
                env_var = env_var_match.group(1)
                if env_var not in os.environ:
                    self.critical_exit(
                        "Environment variable {} referenced in config file, but not set".format(
                            env_var
                        )
                    )
                options[key] = os.environ.get(env_var)
        return options
