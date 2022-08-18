import { ethers } from 'ethers';

const isNumber = (value) => {
  if (/^[-+]?(\d+|Infinity)$/.test(value)) {
    return Number(value);
  }
  return NaN;
};

const renderPrice = (
  args: {
    amount?: number;
    currency?: string;
    addBTCFraction?: boolean;
    gweiAmount?: string;
  } = {},
): string => {
  const { currency = null, gweiAmount } = args || {};
  if (Number.isNaN(isNumber(gweiAmount))) return null;
  if (currency === 'ETH') {
    return `${currency} ${ethers.utils.formatEther(
      (parseInt(gweiAmount, 10) * 1000000000).toString(),
    )}`;
  }
  return `${currency ?? ''} ${gweiAmount}`;
};

export default renderPrice;
