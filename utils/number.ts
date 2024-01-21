import BigNumber from 'bignumber.js';

const GWEI_DISPLAY_LIMIT = new BigNumber(10).pow(6);

const ETH_DISPLAY_LIMIT = new BigNumber(10).pow(15);

const DEFAULT_NATIVE_CURRENCY = 'ETH';

const GWEI_VALUE = new BigNumber(10).pow(9);

const ETH_VALUE = new BigNumber(10).pow(18);

/**
 * Parses an Ethereum value and determines its unit (Wei, Gwei, or ETH).
 *
 * @param {string} value - The Ethereum value to parse.
 * @param {string} [currency] - Optional currency label (default is "Wei").
 * @returns {Object} An object with the parsed value, its unit, and its value in Wei.
 */
const parseEthValue = (value: string, currency?: string): Record<string, any> => {
  if (!value || value === '0x') {
    return {
      value: 0,
      unit: currency ?? 'Wei',
      weiValue: 0,
    };
  }

  const bigNumber = new BigNumber(value);

  const weiValue = bigNumber.decimalPlaces(3).toFormat();
  let transactionValue: string;
  let unit: string;

  if (bigNumber.isLessThanOrEqualTo(GWEI_DISPLAY_LIMIT)) {
    transactionValue = weiValue;
    unit = 'Wei';
  } else if (bigNumber.isLessThanOrEqualTo(ETH_DISPLAY_LIMIT)) {
    transactionValue = bigNumber.dividedBy(GWEI_VALUE).decimalPlaces(3).toFormat();
    unit = 'Gwei';
  } else {
    transactionValue = bigNumber.dividedBy(ETH_VALUE).decimalPlaces(3).toFormat();
    unit = currency ?? DEFAULT_NATIVE_CURRENCY;
  }

  return {
    value: transactionValue,
    unit,
    weiValue,
  };
};

/**
 * Formats a number with specified decimals and formatting options.
 *
 * @param {string | number} num - The number to format.
 * @param {number} [decimal=2] - The number of decimal places.
 * @param {BigNumber.Format} [opt={}] - Optional BigNumber formatting options.
 * @returns {string} The formatted number.
 */
const formatNumber = (
  num: string | number,
  decimal: number = 2,
  opt: BigNumber.Format = {} as BigNumber.Format,
): string => {
  const n = new BigNumber(num);
  const format = {
    prefix: '',
    decimalSeparator: '.',
    groupSeparator: ',',
    groupSize: 3,
    secondaryGroupSize: 0,
    fractionGroupSeparator: ' ',
    fractionGroupSize: 0,
    suffix: '',
    ...opt,
  };
  // hide the after-point part if number is more than 1000000
  if (n.isGreaterThan(1000000)) {
    if (n.gte(1e9)) {
      return `${n.div(1e9).toFormat(decimal, format)}B`;
    }

    return n.decimalPlaces(0).toFormat(format);
  }

  return n.toFormat(decimal, format);
};

/**
 * Formats a USD value with a dollar sign.
 *
 * @param {string} value - The value to format in USD.
 * @returns {string} The formatted USD value.
 */
const formatUsdValue = (value: string): string => {
  const bnValue = new BigNumber(value);

  if (bnValue.lt(0)) {
    return `-$${formatNumber(Math.abs(Number(value)))}`;
  }

  if (bnValue.gte(0.01) || bnValue.eq(0)) {
    return `$${formatNumber(value)}`;
  }

  return '<$0.01';
};

/**
 * Formats an amount, adjusting the format based on the size of the amount.
 *
 * @param {string} amount - The amount to format.
 * @param {number} [decimals=4] - The number of decimal places.
 * @returns {string} The formatted amount.
 */
const formatAmount = (amount: string, decimals: number = 4): string => {
  const bnValue = new BigNumber(amount);

  if (bnValue.gt(1e9)) {
    return `${bnValue.div(1e9).toFormat(4)}B`;
  }

  if (bnValue.gt(10000)) {
    return formatNumber(bnValue.toString());
  }

  if (bnValue.gt(1)) {
    return formatNumber(bnValue.toString(), 4);
  }

  if (bnValue.lt(0.00001)) {
    if (bnValue.toString().length > 10) {
      return Number(bnValue.toString()).toExponential(4);
    }

    return bnValue.toString();
  }

  return formatNumber(bnValue.toString(), decimals);
};

export {
  GWEI_DISPLAY_LIMIT,
  ETH_DISPLAY_LIMIT,
  ETH_VALUE,
  GWEI_VALUE,
  DEFAULT_NATIVE_CURRENCY,
  parseEthValue,
  formatNumber,
  formatAmount,
  formatUsdValue,
};
