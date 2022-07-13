import Price from "./Price";

export default {
  
  Mutation: {
    changeCartCurrency: async (
      _,
      { currency },
      { user, countryContext, modules, },
    ) => {
      
      const cart =  await  modules.orders.cart({countryContext}, user)         
      const order = await modules.cryptoModule.changeCartCurrency(currency, cart._id)
      return order

  }
},
  Query: {

  },
Price
};
