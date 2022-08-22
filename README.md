# Crypto Store

Crypto focused e-commerce Full stack application built with unchaiend engine 1.0 as a backend and unchained crypto pay gateway for processing transaction/orders on the ethereum blockchain.

### Getting Started

You need to have docker compose installed on your machine, so if you have not already go to [official docker compose website](https://docs.docker.com/compose/install/compose-desktop/)
and install it for your platform.

Next you must set few required environment values to fire up your store. go to the root director and create a `.env` file and provide this values.
There are additional environment you can set to change the default value and all of them are listed in the advanced configuration section.

```
.env

CRYPTOPAY_ETH_XPUB=
UNCHAINED_SEED_PASSWORD= (optional)(recommended)
UNCHAINED_ERC20_TOKEN_SYMBOL= (optional)
UNCHAINED_ERC20_TOKEN_CONTRACT_ADDRESS= (optional)

```

### Definition
- `CRYPTOPAY_ETH_XPUB` - The extended ethereum address of the account recieving payments in the store. the gateway will process every block in the blockchain for transactions to this account. because we are mainly targeting ethereum block chain this field is required to get up and running. However you can also provide `CRYPTOPAY_BTC_XPUB` value if you are accepting Bitcoin (`BTC`) as a payment too.

- `UNCHAINED_SEED_PASSWORD` this is the initial password the admin account will be set to, default value is set to `password`.

- `UNCHAINED_ERC20_TOKEN_CONTRACT_ADDRESS`  - Holds the address of an ERC20 token. if the store accepts a particular token for payment for example `SHIB` you set its address using to this variable. it's optional and you can set it anytime even after the store is deployed through the admin panel.

 **currently there is support for only one token but accepting multiple token for payment is possible and will be included in future releases**

 - `UNCHAINED_ERC20_TOKEN_SYMBOL` - Code of the ERC20 token you are accepting payment with.
 
 
 
 After setting the required env above the final thing remaining is starting up the. To do that go to the root director and run
 
 ```
 docker-compose up
 
 ```

Thats it, you store is ready.  you can access your store by navigating to the following pages in the browser

- [Storefront - http://localhost:3000](http://localhost:3000)
- [Admin Panel - http://localhost:4010](http://localhost:4010)
- [Graphql Playground - http://localhost:4010/graphql](http://localhost:4010/graphql)

**DEFAULT credentials**
```
username: admin@unchained.local
password: whatever value set to UNCHAINED_SEED_PASSWORD by default its 'password'

```



### Advanced Configuration

Below are list of variables available to configure to gain more control of the store


| Variable  |   Description   | Required |   Default   |
:-----------|:------------------|:----------------|:----------------|
|CRYPTOPAY_ETH_XPUB| Extended public key of a Ethereum address that will recieve payment made in store  |YES|`None`|
|UNCHAINED_ERC20_TOKEN_CONTRACT_ADDRESS| Contract address a ERC20 token you are accepting payment with in store |NO|`NONE`|
|UNCHAINED_ERC20_TOKEN_SYMBOL| Symbol/Code of the ERC20 you are accepting payment with. must relate to the contract specified by `UNCHAINED_ERC20_TOKEN_CONTRACT_ADDRESS`|NO|`NODE`|
|ETH_RPC_ENDPOINT| Synchronized ethereum node where unchained crypto pay listens to any transaction/order made in store |NO | `http://127.0.0.1:8545` |
|BCOIN_API_KEY| private API key of [Bcoin](https://bcoin.io/api-docs/) |NO|`None`|
|CRYPTOPAY_BTC_XPUB| Extended public key of a Bitcoin address that will recieve payment made in store  |NO|`None`|
|CRYPTOPAY_SECRET| hashing string used by the unchained cryptopay  gateway and Unchained engine. even though it's not required, we highly recommend you change this value to have a secure connection    |NO|`secret`|
|BCOIN_ENDPOINT| [Bcoin](https://bcoin.io/api-docs/) api  `URL` |NO|`http://127.0.0.1:18332`|
|BCOIN_WALLET_ENDPOINT|   [Bcoin](https://bcoin.io/api-docs/) wallet endpoint |NO|`http://127.0.0.1:18334`|
|CRYPTOPAY_WEBHOOK_PATH| Used for communication between the engine and gateway when a transaction occurs. Usually not necessary to configure but in the case you have an unchained engine instance running elsewhere you can change this value accordingly |NO | `/payment/cryptopay`|
|UNCHAINED_CRYPTOPAY_WEBHOOK_PATH| Used for communication between the engine and gateway when a transaction occurs. Usually not necessary to configure but in the case you have an unchained engine instance running elsewhere with different `CRYPTOPAY_WEBHOOK_PATH` you can change this value accordingly |NO | `http://127.0.0.1:4010/payment/cryptopay`|
|CRYPTOPAY_PRICING_WEBHOOK_PATH|Used for communication between the engine and gateway to get a live feed of currencies rate in order to do accurate conversion for order prices. Usually not necessary to configure but in the case you have an unchained engine instance running elsewhere you can change this value accordingly |NO|`/pricing/cryptopay-pricing` |
|UNCHAINED_CRYPTOPAY_PRICING_WEBHOOK_PATH|Used for communication between the engine and gateway to get a live feed of currencies rate in order to do accurate conversion for order prices. Usually not necessary to configure but in the case you have an unchained engine instance running elsewhere with a different value set to `CRYPTOPAY_PRICING_WEBHOOK_PATH` you can change this value accordingly |NO|`http://127.0.0.1:4010/pricing/cryptopay-pricing` |
|UNCHAINED_GRAPHQL_ENDPOINT| Where the actual engine runs and used by the storefront & gateway. Usually not necessary to configure but in the case you have an unchained engine instance running elsewhere you can change this value accordingly |NO|`http://127.0.0.1:4010/graphql`|
|   REDIS_PORT | Redis is used to store relevant block related data. and this refers to the port in which a running redis instance exposes. |NO|6379|
|REDIS_HOST|Redis is used to store relevant block related data. and this refers to the url in which a running redis instance running.|NO|`127.0.0.1`|
|MONGO_URL|Storage of the store actual data. if you want to use a different database than what is provided by default.|NO|  `mongodb://my-mongoDB`   |
|ROOT_URL|  Endpoint for the Admin panel.   | NO|  `http://localhost:4010`  |
|EMAIL_WEBSITE_NAME| Used when generating an email for various resons like order confirmation, password reset, user enrollment etc...| NO|   `Unchained` |
|EMAIL_WEBSITE_URL| Used when generating an email for various resons like order confirmation, password reset, user enrollment etc...| NO|   `http://localhost:4010` |
|UNCHAINED_SEED_PASSWORD| Initial password for the admin panel. it's not required but we highly recommend you change it as soon as you open your app for the first time.|NO|`password`|
|GETH_NETWORK_ID| Ethereum network you want to list transactions on. Default set to `Goerli`.|NO| `5 (goerli)`|





