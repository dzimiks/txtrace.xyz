/**
 * Generates a shortened version of an Ethereum address or any string with a specified offset from the left and right.
 *
 * @param {string} address - The Ethereum address or string to be shortened.
 * @param {number} [leftOffset=10] - The number of characters to keep from the beginning of the string.
 * @param {number} [rightOffset=4] - The number of characters to keep from the end of the string.
 * @returns {string | null} - The shortened version of the address, or null if the address is not provided.
 */
const generateShortAddress = (address: string, leftOffset = 6, rightOffset = 4): string | null => {
  if (!address) {
    return null;
  }

  return `${address.slice(0, leftOffset)}...${address.slice(address.length - rightOffset)}`;
};

/**
 * Generates an excerpt of a string with a specified character limit.
 *
 * @param {string} value - The string to be excerpted.
 * @param {number} [charLimit=40] - The maximum number of characters for the excerpt.
 * @returns {string} - The excerpted string, truncated to the character limit with ellipsis if necessary.
 */
const excerpt = (value: string, charLimit = 40): string => {
  if (value.length <= charLimit) {
    return value;
  }

  return value.substring(0, charLimit - 3) + '...';
};

/**
 * Generates a query string based on the provided parameters.
 *
 * @param {Record<string, any>} params - The transaction or shared simulation parameters.
 * @property {string} [params.id] - The simulation ID.
 * @property {string} [params.txHash] - The transaction hash.
 * @property {string} [params.errorMessage] - An error message.
 * @property {string} [params.toContractName] - The name of the contract.
 * @property {number} [params.blockNumber] - The block number.
 * @property {number} [params.networkId] - The network ID.
 * @property {string} [params.networkName] - The network name.
 * @property {string} [params.networkUrl] - The network URL.
 * @property {number} [params.gas] - The gas amount.
 * @property {string} [params.gasUsed] - The gas used.
 * @property {number} [params.gasPrice] - The gas price.
 * @property {string} [params.from] - The sender address.
 * @property {string} [params.to] - The receiver address.
 * @property {boolean} [params.status] - The transaction or simulation status.
 * @property {boolean} [params.shared] - Whether the simulation is shared.
 * @property {Date} [params.createdAt] - The creation date.
 *
 * @returns {string} - The generated query string.
 */
const getQueryParams = (params: Record<string, any>): string => {
  const queryParams = new URLSearchParams();

  const keys = Object.keys(params) as (keyof typeof params)[];

  keys.forEach(key => {
    if (params[key]) {
      queryParams.append(key, params[key]);
    }
  });

  return queryParams.toString();
};

/**
 * Extracts specified query parameters from a URLSearchParams object.
 *
 * @param {URLSearchParams} searchParams - The URLSearchParams object from which to extract query parameters.
 * @param {string[]} paramNames - An array of query parameter names to extract.
 * @returns {Record<string, string | null>} - An object containing the extracted query parameters and their values.
 */
const extractQueryParams = (
  searchParams: URLSearchParams,
  paramNames: string[],
): Record<string, string | null> => {
  const result: Record<string, string | null> = {};

  paramNames.forEach(param => {
    result[param] = searchParams.get(param);
  });

  return result;
};

/**
 * Checks if the given transaction hash is valid.
 * A valid transaction hash must start with '0x' followed by 64 hexadecimal characters.
 *
 * @param {string} txHash - The transaction hash to validate.
 * @returns {boolean} True if the transaction hash is valid, false otherwise.
 */
const isValidTransactionHash = (txHash: string) => {
  const txRegex = /^0x([A-Fa-f0-9]{64})$/;
  return txRegex.test(txHash);
};

export {
  generateShortAddress,
  excerpt,
  getQueryParams,
  extractQueryParams,
  isValidTransactionHash,
};
