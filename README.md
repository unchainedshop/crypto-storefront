# Crypto Store

Crypto focused e-commerce Full stack application built with unchaiend engine 1.0 as a backend and unchained crypto pay gateway for processing transaction/orders on the ethereum blockchain.

### Setup

You need to have docker compose installed on your machine, so if you have not already go to [official docker compose website](https://docs.docker.com/compose/install/compose-desktop/)
and install it for your platform.

Next there are few environments you must set to fire up your store. go to the root director of your project and provide the required fields for each file accordingly.

```
.env

CRYPTOPAY_ETH_XPUB=
UNCHAINED_CRYPTO_CURRENCY_CODE= (optional)
UNCHAINED_CRYPTO_CURRENCY_CONTRACT_ADDRESS= (optional)
 
CRYPTOPAY_ETH_XPUB

```

### Definition
- `CRYPTOPAY_ETH_XPUB` - the extended ethereum address of the account recieving payments in the store. the gateway will process every block in the blockchain for transactions to this account.
- `UNCHAINED_SEED_PASSWORD` this is the initial password the admin account will be set to.
- UNCHAINED_CRYPTO_CURRENCY_CONTRACT_ADDRESS  - Holds the address of an ERC20 token. if the store accepts a particular token for payment for example `SHIB` you set its address using to this env. 
 it's optional and you can set it anytime even after the store is deployed.
 currently there is support for only one token but accepting multiple token for payment is possible and will be included in future releases
 - UNCHAINED_CRYPTO_CURRENCY_CODE - Code of the ERC20 token you are accepting payment with.
 
 
 
 After setting the required env above the final thing remaining is starting up the. To do that go to the root director and run
 
 ```
 docker-compose up
 
 ```

Thats it, you store is ready.



