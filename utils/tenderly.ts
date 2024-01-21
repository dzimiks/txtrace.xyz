import axios from 'axios';
import {
  ContractTitle,
  ContractType,
  TENDERLY_API_BASE_URL,
  TransactionTitle,
  WalletTitle,
} from '@/common/constants';
import { Network, NetworkResponseData } from '@/types/network';

/**
 * Fetches the list of networks supported by Tenderly.
 *
 * @throws {Error} When no networks are provided by Tenderly.
 * @returns {Promise<Network[]>} A promise that resolves to an array of Tenderly-supported networks.
 */
const fetchTenderlyNetworks = async (): Promise<Network[]> => {
  const response = await axios.get(`${TENDERLY_API_BASE_URL}/api/v1/public-networks`);

  if (!response?.data) {
    throw new Error('No Tenderly-supported networks are provided.');
  }

  return response.data.map((network: NetworkResponseData) => Network.buildFromResponse(network));
};

/**
 * Checks if a given network ID is supported by Tenderly.
 *
 * @param {string} networkId - The ID of the network to check.
 * @param {Network[]} tenderlyNetworks - The list of Tenderly-supported networks.
 * @returns {boolean} Returns true if the network ID is supported, false otherwise.
 */
const isNetworkSupportedByTenderly = (networkId: string, tenderlyNetworks: Network[]): boolean => {
  if (!networkId || !tenderlyNetworks) {
    return false;
  }

  const networkIds: number[] = tenderlyNetworks.map(network => Number(network.id));
  return networkIds.includes(Number(networkId));
};

/**
 * Finds and returns the network information based on its ID from the list of Tenderly-supported networks.
 *
 * @param {string} networkId - The ID of the network to find.
 * @param {Network[]} tenderlyNetworks - The list of Tenderly-supported networks.
 * @returns {Network | null} The network information if found, null otherwise.
 */
const findTenderlyNetworkById = (
  networkId: string,
  tenderlyNetworks: Network[],
): Network | null => {
  if (!networkId || !tenderlyNetworks) {
    return null;
  }

  return tenderlyNetworks.find(network => network.id === networkId) ?? null;
};

/**
 * Gets the network ID based on the route slug.
 *
 * @param {string} route - The route slug to search for.
 * @param {Network[]} networks - The array of network objects to search within.
 * @returns {string | null} - Returns the network ID if found, the original route if not found, or null for invalid inputs.
 */
const getNetworkForRouteSlug = (route: string, networks: Network[]): string | null => {
  if (!route || !networks) {
    return null;
  }

  const network: Network = networks.find(
    n => n.route === route || n?.routeAliases?.includes(route),
  );

  return network?.id ?? route;
};

/**
 * Returns the appropriate transaction title based on the input text.
 *
 * @param {string} text - The input text to determine the transaction title.
 * @returns {string} The corresponding transaction title.
 *
 * @example
 * getBottomBannerText('Simulated Transaction');
 * // returns TransactionTitle.SIMULATED_TRANSACTION
 */
const getBottomBannerText = (text: string): string => {
  if (!text) {
    return TransactionTitle.TRANSACTION;
  }

  switch (text) {
    case 'Transaction':
      return TransactionTitle.TRANSACTION;
    case 'Simulated Transaction':
      return TransactionTitle.SIMULATED_TRANSACTION;
    case 'Simulated Fork Transaction':
      return TransactionTitle.SIMULATED_FORK_TRANSACTION;
    case 'Contract':
      return ContractTitle.CONTRACT;
    case 'Wallet':
      return WalletTitle.WALLET;
    default:
      return TransactionTitle.TRANSACTION;
  }
};

/**
 * Determines the type of a contract.
 *
 * @function
 * @param {Record<string, any>} contract - The contract to evaluate.
 * @returns {{ name: string; type: ContractType }} - An object containing the name and type of the contract.
 *
 * @example
 * const contractType = getContractType(contract);
 */
const getContractType = (contract: Record<string, any>): { name: string; type: ContractType } => {
  if (contract.child_contracts) {
    return {
      type: ContractType.PROXY,
      name: 'Proxy Contract',
    };
  }

  if (contract.fork_id) {
    return {
      type: ContractType.FORK,
      name: 'Fork Contract',
    };
  }

  return {
    type: ContractType.REGULAR,
    name: null,
  };
};

export {
  fetchTenderlyNetworks,
  isNetworkSupportedByTenderly,
  findTenderlyNetworkById,
  getNetworkForRouteSlug,
  getBottomBannerText,
  getContractType,
};
