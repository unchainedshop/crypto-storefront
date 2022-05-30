import React from 'react';

export const CurrencyContext = React.createContext({
  selectedCurrency: 'CHF',
  changeCurrency: (val) => val,
});

export default CurrencyContext;
