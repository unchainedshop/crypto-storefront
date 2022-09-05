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
    amount?: string;
  } = {},
): string => {
  const { currency = null, amount } = args || {};
  if (Number.isNaN(isNumber(amount))) return null;
  if (currency === 'ETH') {
    return `${currency} ${ethers.utils.formatEther(
      (parseInt(amount, 10) * 1000000000).toString(),
    )}`;
  }
  return `${currency ?? ''} ${amount}`;
};

export default renderPrice;
