import Price from "./Price";

export default {
  
  Mutation: {
    changeCartCurrency: async (
      _,
      { currency },
      context
      
    ) => {

      const {modules, user, countryContext} = context
      const cart =  await  modules.orders.cart({countryContext}, user)         
      const order = await modules.cryptoModule.changeCartCurrency(currency, cart._id)
      await modules.orders.updateCalculation(order._id, context)
      
      return order

  }
},
  Query: {

  },
Price
};
