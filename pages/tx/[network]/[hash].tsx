import axios from 'axios';
import Head from 'next/head';
import { useEffect, useRef } from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next/types';
import { DateTime } from 'luxon';
import { Icon } from '../../../components/Icon/Icon';

export default function Page(props: Record<string, any>) {
  const initialized = useRef(false);

  const {
    errorMessage,
    blockNumber,
    networkId,
    networkName,
    gas,
    gasUsed,
    txHash,
    from,
    to,
    status,
    createdAt,
  } = props;

  const queryParams = new URLSearchParams();

  if (errorMessage) {
    queryParams.append('errorMessage', errorMessage);
  }

  if (blockNumber) {
    queryParams.append('blockNumber', blockNumber);
  }

  if (networkId) {
    queryParams.append('networkId', networkId);
  }

  if (networkName) {
    queryParams.append('networkName', networkName);
  }

  if (gas) {
    queryParams.append('gas', gas);
  }

  if (gasUsed) {
    queryParams.append('gasUsed', gasUsed);
  }

  if (txHash) {
    queryParams.append('txHash', txHash);
  }

  if (from) {
    queryParams.append('from', from);
  }

  if (to) {
    queryParams.append('to', to);
  }

  if (status) {
    queryParams.append('status', status);
  }

  if (createdAt) {
    queryParams.append('createdAt', createdAt);
  }

  console.log({ queryParams: queryParams.toString() });

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      window.open(`https://dashboard.tenderly.co/tx/${networkId}/${txHash}`, '_self');
    }
  }, []);

  return (
    <div>
      <Head>
        {/* Primary Meta Tags */}
        <title>Tenderly Transaction</title>
        <meta name="title" content="Tenderly Transaction" />
        <meta name="description" content={`Transaction details for the ${txHash} on ${networkName} network.`} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://www.txtrace.xyz/tx/${networkId}/${txHash}`} />
        <meta property="og:title" content="Tenderly Transaction" />
        <meta property="og:description" content={`Transaction details for the ${txHash} on ${networkName} network.`} />
        <meta
          name="og:image"
          content={
            `${
              process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : ''
            }/api/tx?${queryParams.toString()}`}
        />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`https://www.txtrace.xyz/tx/${networkId}/${txHash}`} />
        <meta property="twitter:title" content="Tenderly Transaction" />
        <meta property="twitter:description" content={`Transaction details for the ${txHash} on ${networkName} network.`} />
        <meta
          name="twitter:image"
          content={
            `${
              process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : ''
            }/api/tx?${queryParams.toString()}`}
        />
      </Head>
      <h1>Tenderly Transaction</h1>
      <pre>{JSON.stringify(props, null, 2)}</pre>
      <Icon icon="globe" />
      <Icon icon="box" />
      <Icon icon="arrow-right" />
      <Icon icon="flame" />
      <Icon icon="coins" />
      <Icon icon="check" />
      <Icon icon="x" />
    </div>
  );
}

const formatDate = (date: string) => {
  if (!date) {
    return null;
  }

  return DateTime.fromISO(date).toFormat('ff');
};

// /tx/1/0x849dc9d371da5060defcdd4d4df36202ea8e4ebfb29bc061d718ad8dd5d15e32 - failed
// /tx/1/0xb1db15f95ff8939fea97bba2782a1c7b2f4d0dc7d67097fdb9648d9fb7766870 - success
export async function getServerSideProps(context: GetServerSidePropsContext) {
  // const accountName: string = process.env.TENDERLY_ACCOUNT;
  // const projectName: string = process.env.TENDERLY_PROJECT;
  const network = context.params.network || '1';
  const txHash = context.params.hash || '0x';

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
      // `${TENDERLY_API_BASE_URL}/api/v1/account/${accountName}/project/${projectName}/network/${network}/transaction/${txHash}`,
      // `${TENDERLY_API_BASE_URL}/api/v1/public-contract/${network}/trace/${txHash}`,
      `${TENDERLY_API_BASE_URL}/api/v1/public-contract/${network}/tx/${txHash}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Access-Key': process.env.TENDERLY_ACCESS_TOKEN,
        },
      },
    );

    console.log({
      responseData: response.data,
    });

    // Check if the network is supported by Tenderly
    if (!networkIds.includes(Number(response.data.network_id))) {
      throw new Error(
        `Chain ID ${response.data.network_id} is not supported by Tenderly.`,
      );
    }

    const networkName = tenderlyNetworks.data
      .find((network: any) => network.id === response.data.network_id)?.name;

    data = {
      errorMessage: response.data.error_message ?? null,
      blockNumber: response.data.block_number,
      networkId: response.data.network_id,
      networkName,
      gas: response.data.gas,
      // gasUsed: response.data.gas_used,
      gasUsed: response.data.gas_price,
      gasPrice: response.data.gas_price,
      txHash: response.data.hash,
      from: response.data.from,
      to: response.data.to,
      status: response.data.status,
      createdAt: formatDate(response.data.timestamp),
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
