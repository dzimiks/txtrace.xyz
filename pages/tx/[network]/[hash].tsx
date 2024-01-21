import axios from 'axios';
import Head from 'next/head';
import { useEffect, useRef } from 'react';
import { GetServerSidePropsContext } from 'next/types';
import { formatDate } from '../../../utils/date';
import { getTxQueryParams } from '../../../utils/tenderly';

export default function Page(props: Record<string, any>) {
  const initialized = useRef(false);

  const { networkId, networkName, txHash } = props;

  const queryParams = getTxQueryParams(props);

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
        <meta
          name="description"
          content={`Transaction details for the ${txHash} on ${networkName} network.`}
        />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://www.txtrace.xyz/tx/${networkId}/${txHash}`} />
        <meta property="og:title" content="Tenderly Transaction" />
        <meta
          property="og:description"
          content={`Transaction details for the ${txHash} on ${networkName} network.`}
        />
        <meta
          name="og:image"
          content={`${
            process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : ''
          }/api/tx?${queryParams}`}
        />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content={`https://www.txtrace.xyz/tx/${networkId}/${txHash}`}
        />
        <meta property="twitter:title" content="Tenderly Transaction" />
        <meta
          property="twitter:description"
          content={`Transaction details for the ${txHash} on ${networkName} network.`}
        />
        <meta
          name="twitter:image"
          content={`${
            process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : ''
          }/api/tx?${queryParams}`}
        />
      </Head>
      <h1>Tenderly Transaction</h1>
      <pre>{JSON.stringify(props, null, 2)}</pre>
    </div>
  );
}

// /tx/1/0x849dc9d371da5060defcdd4d4df36202ea8e4ebfb29bc061d718ad8dd5d15e32 - failed
// /tx/1/0xb1db15f95ff8939fea97bba2782a1c7b2f4d0dc7d67097fdb9648d9fb7766870 - success
export async function getServerSideProps(context: GetServerSidePropsContext) {
  // const accountName: string = process.env.TENDERLY_ACCOUNT;
  // const projectName: string = process.env.TENDERLY_PROJECT;
  const network = context.params.network || '1';
  const txHash = context.params.hash || '0x';

  const TENDERLY_API_BASE_URL = 'https://api.tenderly.co';
  let data: Record<string, any>;

  const tenderlyNetworks = await axios.get(`${TENDERLY_API_BASE_URL}/api/v1/public-networks`);

  if (!tenderlyNetworks?.data) {
    throw new Error('No Tenderly-supported networks are provided.');
  }

  const networkIds: number[] = tenderlyNetworks.data.map((network: any) => Number(network.id));

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
      throw new Error(`Chain ID ${response.data.network_id} is not supported by Tenderly.`);
    }

    const tenderlyNetwork = tenderlyNetworks.data.find(
      (network: any) => network.id === response.data.network_id,
    );

    data = {
      errorMessage: response.data.error_message ?? null,
      blockNumber: response.data.block_number,
      networkId: response.data.network_id,
      networkName: tenderlyNetwork?.name ?? null,
      networkUrl: tenderlyNetwork?.metadata?.icon ?? null,
      gas: response.data.gas,
      gasUsed: response.data.gas_used,
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
