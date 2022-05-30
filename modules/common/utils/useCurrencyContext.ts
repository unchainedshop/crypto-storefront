import { useContext } from 'react';
import { CurrencyContext } from './CurrencyContext';

const useCurrencyContext = () => {
  const currencyContext = useContext(CurrencyContext);

  return currencyContext;
};

export default useCurrencyContext;
