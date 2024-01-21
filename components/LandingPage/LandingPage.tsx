import Link from 'next/link';
import { useEffect, useState } from 'react';
import { LoaderIcon, SearchIcon } from 'lucide-react';
import { Badge, Button, Input } from '@/ui/index';
import { Network } from '@/types/network';
import {
  fetchTenderlyNetworks,
  findTenderlyNetworkById,
  getNetworkForRouteSlug,
  isNetworkSupportedByTenderly,
} from '@/utils/tenderly';
import axios from 'axios';
import { TENDERLY_API_BASE_URL, Theme } from '@/common/constants';
import { formatDate } from '@/utils/date';
import { getQueryParams } from '@/utils/string';
import { NetworkSelect } from '@/components/NetworkSelect';

const predefinedSearches = [
  {
    name: 'Mainnet Swap & Mint',
    network: '1',
    txHash: '0x0134a0780c75b2caa08d481d3f03006e1330b853d929a8f3b94e11f52d264b00',
    className: 'border-transparent bg-gray-700 text-primary-foreground hover:bg-gray-700/80',
  },
  {
    name: 'Arbitrum Approve',
    network: '42161',
    txHash: '0x2fa31e0877fa4084e09643881e6f167bbd982a8de0ea3b9e12b94e8d7a6b7722',
    className: 'border-transparent bg-sky-500 text-primary-foreground hover:bg-sky-500/80',
  },
  {
    name: 'Avalanche Fail',
    network: '43114',
    txHash: '0x0a41073661facdb9051a52ece0b7ec25bfa6e795a24105571979a4b6035546b4',
    className:
      'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
  },
];

const LandingPage = () => {
  const [tenderlyNetworks, setTenderlyNetworks] = useState<Network[]>([]);
  const [theme, setTheme] = useState<string>(Theme.DARK);
  const [loading, setLoading] = useState<boolean>(false);
  const [network, setNetwork] = useState<string>('1');
  const [imageUrl, setImageUrl] = useState<string>(
    'https://dashboard.tenderly.co/Assets/og_image.jpg',
  );
  const [txHash, setTxHash] = useState<string>('');

  const updateSearch = (newNetwork: string, newTxHash: string) => {
    setNetwork(newNetwork);
    setTxHash(newTxHash);
  };

  const getTransactionTrace = async () => {
    let data: Record<string, any>;

    try {
      setLoading(true);
      const networkType: string = getNetworkForRouteSlug(network, tenderlyNetworks);

      const response = await axios.get(
        `${TENDERLY_API_BASE_URL}/api/v1/public-contract/${networkType}/tx/${txHash}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Access-Key': process.env.TENDERLY_ACCESS_TOKEN,
          },
        },
      );

      const responseNetworkId: string = response.data.network_id;

      // Check if the network is supported by Tenderly
      if (!isNetworkSupportedByTenderly(responseNetworkId, tenderlyNetworks)) {
        throw new Error(`Chain ID ${responseNetworkId} is not supported by Tenderly.`);
      }

      const traceResponse = await axios.get(
        `${TENDERLY_API_BASE_URL}/api/v1/public-contract/${networkType}/trace/${txHash}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Access-Key': process.env.TENDERLY_ACCESS_TOKEN,
          },
        },
      );

      const tenderlyNetwork: Network = findTenderlyNetworkById(responseNetworkId, tenderlyNetworks);
      const functionName: string = traceResponse.data?.call_trace?.function_name ?? null;
      const toContract: string = traceResponse.data?.call_trace?.contract_name;

      data = {
        errorMessage: response.data.error_message ?? null,
        toContractName: toContract ?? null,
        blockNumber: response.data.block_number,
        networkId: response.data.network_id,
        networkName: tenderlyNetwork?.name ?? null,
        networkUrl: tenderlyNetwork?.logo ?? null,
        gas: response.data.gas,
        gasPrice: response.data.gas_price,
        txHash,
        from: response.data.from,
        to: response.data.to,
        status: response.data.status,
        createdAt: formatDate(response.data.timestamp),
        title: 'Transaction',
        functionName,
        theme,
      };
    } catch (error) {
      data = {
        error:
          error.response?.data?.error?.message ??
          error ??
          'Transaction hash is invalid. Please check the hash and try again.',
        txHash,
        networkName: network,
      };
    }

    const queryParams = getQueryParams(data);
    setImageUrl(`https://www.txtrace.xyz/api/tx?${queryParams}`);
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      const networks: Network[] = await fetchTenderlyNetworks();
      setTenderlyNetworks(networks.sort((a, b) => a.sortOrder - b.sortOrder));
    })();
  }, []);

  return (
    <div className="flex min-h-screen flex-col justify-between px-4">
      <div className="flex flex-col items-center justify-center gap-12 py-16">
        <h1 className="text-2xl font-bold text-center text-black sm:text-5xl">
          Get trace for any <br />
          <span className="bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent">
            Transaction Hash
          </span>
        </h1>
        <div className="flex flex-col gap-4 w-full max-w-4xl">
          <div className="flex flex-col gap-2 md:items-center md:flex-row">
            <NetworkSelect options={tenderlyNetworks} network={network} setNetwork={setNetwork} />
            <div className="flex items-center relative w-full">
              <Input
                className="peer block w-full rounded-md border border-gray-200 bg-white p-4 pr-24 shadow-lg"
                placeholder="Search transaction hash..."
                type="text"
                value={txHash}
                onChange={e => setTxHash(e.target.value)}
              />
              <Button
                className="absolute flex items-center right-0 h-8 my-1.5 mr-1"
                size="sm"
                variant="primary"
                onClick={getTransactionTrace}
                disabled={!network || !txHash}
              >
                {loading && <LoaderIcon size={14} className="mr-1 animate-spin" />}
                {loading && <span>Searching...</span>}
                {!loading && <SearchIcon size={14} className="mr-1" />}
                {!loading && <span>Search</span>}
              </Button>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap border px-2 py-1 rounded-md mx-auto">
            <div className="text-sm font-semibold">Choose from predefined searches:</div>
            <div className="flex gap-1 flex-wrap">
              {predefinedSearches.map(item => (
                <Badge
                  key={item.name}
                  className={`cursor-pointer rounded-md ${item.className}`}
                  onClick={() => updateSearch(item.network, item.txHash)}
                >
                  {item.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full max-w-2xl">
          <Link
            href={
              txHash
                ? `https://dashboard.tenderly.co/tx/${findTenderlyNetworkById(network, tenderlyNetworks)?.name}/${txHash}`
                : '#'
            }
          >
            <div className="border rounded-md overflow-hidden hover:opacity-90">
              <img className="w-full" src={loading ? '/og.png' : imageUrl} alt="Tenderly" />
              <div className="flex flex-col gap-2 p-4">
                <h3 className="font-semibold">Transaction Trace</h3>
                <p className="break-words text-sm">
                  {`Transaction overview for the ${txHash || 'tx hash'} on ${findTenderlyNetworkById(network, tenderlyNetworks)?.name} network. See full details on Tenderly Dashboard.`}
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export { LandingPage };
