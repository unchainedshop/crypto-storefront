import renderCurrency from './renderCurrency';

const renderPrice = (
  args: { amount?: number; currency?: string; addBTCFraction?: boolean } = {},
): string => {
  const { amount = 0, currency = null, addBTCFraction = true } = args || {};

  if (currency === 'BTC' || currency === 'ETH') {
    if (addBTCFraction) {
      return `${currency} ${amount}`;
    }
    return `${currency} ${amount}`;
  }
  return `${renderCurrency(currency, amount)}`;
};

export default renderPrice;
