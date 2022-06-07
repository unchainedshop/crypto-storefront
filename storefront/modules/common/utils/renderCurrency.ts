require('@formatjs/intl-numberformat/locale-data/en'); // locale-data for en

// TODO: Please use useIntl, take the correct locale here, also take the currency of the price
const renderCurrency = (amount, currency = null, locale = null) => {
  if (!currency) return 'N/A';
  try {
    return new Intl.NumberFormat(locale || 'en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: currency === 'BTC' ? 4 : 0,
    }).format(amount);
  } catch {
    return `${currency}${amount}`;
  }
};
export default renderCurrency;
