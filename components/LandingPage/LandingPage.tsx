import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowUpRightIcon, LoaderIcon, SearchIcon, XIcon } from 'lucide-react';
import { Badge, Button, Input, Table, TableBody, TableCell, TableRow } from '@/ui/index';
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
import { excerpt, generateShortAddress, getQueryParams } from '@/utils/string';
import { NetworkSelect } from '@/components/NetworkSelect';
import { CheckIcon } from '@/components/Icons';
import { formatAmount, parseEthValue } from '@/utils/number';

const failedText = 'flex items-center text-[#E5484D]';
const successText = 'flex items-center text-[#30A46C]';

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
    name: 'Failed Avalanche Tx',
    network: '43114',
    txHash: '0xe1093a44ba28667d54b0e4d30ee0a54a5a54ad72cc5e9b36f447e23e58393720',
    className:
      'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
  },
];

const LandingPage = () => {
  const [tenderlyNetworks, setTenderlyNetworks] = useState<Network[]>([]);
  const [theme, setTheme] = useState<string>(Theme.DARK);
  const [loading, setLoading] = useState<boolean>(false);
  const [txData, setTxData] = useState<Record<string, any>>(null);
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
    setTxData(data);
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
        <div className="grid grid-cols-auto-fill-full gap-6 w-full max-w-7xl mx-auto md:grid-cols-2">
          <div className="flex flex-col gap-4 rounded-md p-4 border">
            <div className="flex flex-col gap-2 justify-between">
              <h3 className="font-semibold text-xl">Transaction Overview</h3>
              {txData?.networkId && (
                <Link
                  className="link-text-no-underline text-sm flex items-center gap-1"
                  href={`https://dashboard.tenderly.co/tx/${txData.networkId}/${txData.txHash}`}
                >
                  <span>See full trace in Tenderly Dashboard</span>
                  <ArrowUpRightIcon size={14} />
                </Link>
              )}
            </div>
            <Table className="border rounded-md">
              <TableBody className="font-semibold">
                {!txData && (
                  <TableRow>
                    <TableCell>Data will be shown here</TableCell>
                  </TableRow>
                )}
                {txData && !txData?.error && (
                  <>
                    <TableRow>
                      <TableCell>Blockchain</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-1 justify-end">
                          <img
                            className="w-6 h-6 border border-[#ADA9A9] rounded-full bg-white"
                            src={txData?.networkUrl}
                            alt={txData?.networkName}
                          />
                          <span>{txData?.networkName}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Transaction Hash</TableCell>
                      <TableCell className="text-right">
                        {generateShortAddress(txData?.txHash, 10, 10)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Status</TableCell>
                      <TableCell className="text-right">
                        {!txData?.status && (
                          <div className={`${failedText} justify-end`}>
                            <XIcon />
                            <span className="ml-1">Failed</span>
                          </div>
                        )}
                        {txData?.status && (
                          <div className={`${successText} justify-end`}>
                            <CheckIcon />
                            <span className="ml-1">Success</span>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                    {txData?.errorMessage && (
                      <TableRow>
                        <TableCell>Error Message</TableCell>
                        <TableCell className="text-right">
                          <span className={`${failedText} justify-end`}>
                            {txData?.errorMessage}
                          </span>
                        </TableCell>
                      </TableRow>
                    )}
                    <TableRow>
                      <TableCell>Block</TableCell>
                      <TableCell className="text-right">
                        {formatAmount(txData?.blockNumber, 0)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Timestamp</TableCell>
                      <TableCell className="text-right">{txData?.createdAt}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>From</TableCell>
                      <TableCell className="text-right">
                        {generateShortAddress(txData?.from, 10, 10)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>To</TableCell>
                      <TableCell className="text-right">
                        {generateShortAddress(txData?.to, 10, 10)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Gas</TableCell>
                      <TableCell className="text-right">{formatAmount(txData?.gas, 0)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Gas Price</TableCell>
                      <TableCell className="text-right">
                        {parseEthValue(txData?.gasPrice).value}{' '}
                        {parseEthValue(txData?.gasPrice).unit}
                      </TableCell>
                    </TableRow>
                    {txData?.functionName && (
                      <TableRow>
                        <TableCell>Method Name</TableCell>
                        <TableCell className="text-right">
                          {excerpt(txData?.functionName, 20)}()
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex flex-col gap-4 rounded-md p-4 border">
            <div className="flex flex-col gap-2 justify-between">
              <h3 className="font-semibold text-xl">OG Image</h3>
              {txData?.networkId && (
                <Link
                  className="link-text-no-underline text-sm flex items-center gap-1"
                  href={`https://tdly.co/tx/${txData.networkId}/${txData.txHash}`}
                >
                  <span>{`https://tdly.co/tx/${txData.networkId}/${generateShortAddress(txData.txHash, 10, 10)}`}</span>
                  <ArrowUpRightIcon size={14} />
                </Link>
              )}
            </div>
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
    </div>
  );
};

export { LandingPage };
