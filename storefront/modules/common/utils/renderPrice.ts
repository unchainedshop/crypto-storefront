import { ethers } from 'ethers';
import renderCurrency from './renderCurrency';

const renderPrice = (
  args: { amount?: number; currency?: string; addBTCFraction?: boolean } = {},
): string => {
  const { amount = 0, currency = null } = args || {};

  if (currency === 'ETH') {
    return `${currency} ${ethers.utils.formatEther(
      (parseInt(String(amount), 10) * 1000000000000).toString(),
    )}`;
  }
  return `${renderCurrency(currency, amount / 100)}`;
};

export default renderPrice;
