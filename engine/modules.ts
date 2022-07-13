import type { Order } from '@unchainedshop/types/orders';
import type { Db } from '@unchainedshop/types/common';
import { OrdersCollection } from 'meteor/unchained:core-orders/src/db/OrdersCollection';
import { generateDbFilterById } from 'meteor/unchained:utils';
export type CryptoModule = {

    changeCartCurrency: (currency: string, cartId: string) =>  Promise<Array<Order>>
  };
  

  export default {
    configure: async ({
      db,
    }: {
      db: Db;
    }): Promise<CryptoModule> => {
        const Orders = await OrdersCollection(db)
        const cryptoModule: CryptoModule = {
        async changeCartCurrency(currency, cartId) {
            const selector = generateDbFilterById(cartId)
            Orders.update(selector, 
                            {
                                $set: {
                                    currency,
                                    context: {currency}
                                }
                        });
                        
            return Orders.findOne({_id: cartId})
        }
    }

    return cryptoModule;
        
    }
}