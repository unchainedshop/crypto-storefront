import { ethers } from 'ethers';

const renderPrice = (
  args: {
    amount?: number;
    currency?: string;
    addBTCFraction?: boolean;
    gweiAmount?: string;
  } = {},
): string => {
  const { amount = 0, currency = null, gweiAmount = '0' } = args || {};
  if (currency === 'ETH') {
    return `${currency} ${ethers.utils.formatEther(
      (parseInt(gweiAmount, 10) * 1000000000).toString(),
    )}`;
  }
  return `${currency ?? ''} ${amount}`;
};

export default renderPrice;
