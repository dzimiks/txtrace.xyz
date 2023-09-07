import axios from 'axios';
import Head from 'next/head';
import { useEffect, useRef } from 'react';
import { GetServerSidePropsContext } from 'next/types';
import { formatDate } from '../../../utils/date';
import { getSharedSimulationQueryParams } from '../../../utils/tenderly';

export default function Page(props: Record<string, any>) {
  const initialized = useRef(false);

  const {
    id,
    txHash,
    networkName,
  } = props;

  const queryParams = getSharedSimulationQueryParams(props);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      window.open(`https://dashboard.tenderly.co/shared/simulation/${id}`, '_self');
    }
  }, []);

  return (
    <div>
      <Head>
        {/* Primary Meta Tags */}
        <title>Simulated Transaction</title>
        <meta name="title" content="Simulated Transaction" />
        <meta name="description"
              content={`Simulated transaction details for the ${txHash} on ${networkName} network.`} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://www.txtrace.xyz/shared/simulation/${id}`} />
        <meta property="og:title" content="Simulated Transaction" />
        <meta property="og:description"
              content={`Simulated transaction details for the ${txHash} on ${networkName} network.`} />
        <meta
          name="og:image"
          content={
            `${
              process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : ''
            }/api/shared-simulation?${queryParams.toString()}`}
        />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`https://www.txtrace.xyz/shared/simulation/${id}`} />
        <meta property="twitter:title" content="Simulated Transaction" />
        <meta property="twitter:description"
              content={`Simulated transaction details for the ${txHash} on ${networkName} network.`} />
        <meta
          name="twitter:image"
          content={
            `${
              process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : ''
            }/api/shared-simulation?${queryParams.toString()}`}
        />
      </Head>
      <h1>Simulated Transaction</h1>
      <pre>{JSON.stringify(props, null, 2)}</pre>
    </div>
  );
}

// /shared/simulation/e53cb49a-0cfa-463b-9084-a6f3bc4174c8 - success
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const id = context.params.id || '0x';

  const TENDERLY_API_BASE_URL = 'https://api.tenderly.co';
  let data: Record<string, any>;

  const tenderlyNetworks = await axios.get(
    `${TENDERLY_API_BASE_URL}/api/v1/public-networks`,
  );

  if (!tenderlyNetworks?.data) {
    throw new Error('No Tenderly-supported networks are provided.');
  }

  const networkIds: number[] = tenderlyNetworks.data.map((network: any) =>
    Number(network.id),
  );

  try {
    const response = await axios.get(
      `${TENDERLY_API_BASE_URL}/api/v1/simulations/${id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Access-Key': process.env.TENDERLY_ACCESS_TOKEN,
        },
      },
    );

    // Check if the network is supported by Tenderly
    if (!networkIds.includes(Number(response.data.simulation.network_id))) {
      throw new Error(
        `Chain ID ${response.data.simulation.network_id} is not supported by Tenderly.`,
      );
    }

    const tenderlyNetwork = tenderlyNetworks.data
      .find((network: any) => network.id === response.data.simulation.network_id);

    data = {
      errorMessage: response.data.simulation.error_message ?? null,
      blockNumber: response.data.simulation.block_number,
      networkId: response.data.simulation.network_id,
      networkName: tenderlyNetwork?.name ?? null,
      networkUrl: tenderlyNetwork?.metadata?.icon ?? null,
      gas: response.data.simulation.gas,
      gasUsed: response.data.simulation.gas_used,
      gasPrice: response.data.simulation.gas_price,
      id: response.data.simulation.id,
      txHash: response.data.transaction.hash,
      from: response.data.simulation.from,
      to: response.data.simulation.to,
      status: response.data.simulation.status,
      shared: response.data.simulation.shared,
      createdAt: formatDate(response.data.simulation.created_at),
    };
  } catch (error) {
    data = {
      errorMessage: error.response?.data?.error?.message ?? error ?? 'Error occurred',
    };
  }

  // Pass data to the page via props
  return {
    props: {
      ...data,
    },
  };
}
