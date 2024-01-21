import axios from 'axios';
import Head from 'next/head';
import { useEffect, useRef } from 'react';
import { GetServerSidePropsContext } from 'next/types';
import { formatDate } from '@/utils/date';
import {
  fetchTenderlyNetworks,
  findTenderlyNetworkById,
  getNetworkForRouteSlug,
  isNetworkSupportedByTenderly,
} from '@/utils/tenderly';
import { getQueryParams } from '@/utils/string';
import { TENDERLY_API_BASE_URL, Theme } from '@/common/constants';
import { Network } from '@/types/network';

export default function Page(props: Record<string, any>) {
  const initialized = useRef(false);

  const { networkId, networkName, txHash } = props;

  const queryParams = getQueryParams(props);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      window.location.href = `https://dashboard.tenderly.co/tx/${networkId}/${txHash}`;
    }
  }, [networkId, txHash]);

  return (
    <div>
      <Head>
        {/* Primary Meta Tags */}
        <title>Transaction | Tenderly</title>
        <meta name="title" content="Transaction | Tenderly" />
        <meta
          name="description"
          content={`Transaction overview for the ${txHash} on ${networkName} network. See full details on Tenderly Dashboard.`}
        />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://www.tdly.co/tx/${networkId}/${txHash}`} />
        <meta property="og:title" content="Transaction | Tenderly" />
        <meta
          property="og:description"
          content={`Transaction overview for the ${txHash} on ${networkName} network. See full details on Tenderly Dashboard.`}
        />
        <meta name="og:image" content={`https://www.tdly.co/api/tx?${queryParams}`} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`https://www.tdly.co/tx/${networkId}/${txHash}`} />
        <meta property="twitter:title" content="Transaction | Tenderly" />
        <meta
          property="twitter:description"
          content={`Transaction overview for the ${txHash} on ${networkName} network. See full details on Tenderly Dashboard.`}
        />
        <meta name="twitter:image" content={`https://www.tdly.co/api/tx?${queryParams}`} />
      </Head>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const network = context.params.network || '1';
  const txHash = context.params.hash || '0x';
  const theme = context.query.theme || Theme.DARK;

  let data: Record<string, any>;

  try {
    const tenderlyNetworks: Network[] = await fetchTenderlyNetworks();
    const networkType: string = getNetworkForRouteSlug(network as string, tenderlyNetworks);

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

  // Pass data to the page via props
  return {
    props: {
      ...data,
    },
  };
}
