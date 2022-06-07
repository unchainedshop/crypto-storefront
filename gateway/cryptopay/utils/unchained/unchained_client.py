from gql import gql, Client
from gql.transport.aiohttp import AIOHTTPTransport


class UnchainedClient:
    def __init__(self, unchained_config):
        transport = AIOHTTPTransport(unchained_config["graphql-endpoint"])
        self.client = Client(transport=transport, fetch_schema_from_transport=True)

    def get_contract_addresses(self):
        query = gql(
            """
            query smartContractCurrencies {
                currencies {
                    contractAddress
                }
            }
            """
        )
        result = self.client.execute(query)
        return [
            c["contractAddress"]
            for c in result["currencies"]
            if c["contractAddress"] is not None
        ]
