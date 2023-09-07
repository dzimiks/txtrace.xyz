import axios from 'axios';
import Head from 'next/head';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next/types';

export default function Page(props: Record<string, any>) {
  const {
    errorMessage,
    blockNumber,
    networkId,
    gas,
    gasUsed,
    txHash,
    from,
    to,
  } = props;

  const queryParams = new URLSearchParams();
  queryParams.append('errorMessage', errorMessage);
  queryParams.append('blockNumber', blockNumber);
  queryParams.append('networkId', networkId);
  queryParams.append('gas', gas);
  queryParams.append('gasUsed', gasUsed);
  queryParams.append('txHash', txHash);
  queryParams.append('from', from);
  queryParams.append('to', to);

  console.log({ queryParams: queryParams.toString() });

  return (
    <div>
      <Head>
        <meta name="og:title" content="Tenderly Tx OG Image Test" />
        <meta name="og:description" content="dzimiks testing..." />
        <meta
          name="og:image"
          content={
            `${
              process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : ''
            }/api/tx?${queryParams.toString()}`}
        />
      </Head>
      <h1>Tenderly Transaction</h1>
      <pre>{JSON.stringify(props, null, 2)}</pre>
    </div>
  );
}

// /tx/1/0xb1db15f95ff8939fea97bba2782a1c7b2f4d0dc7d67097fdb9648d9fb7766870
export async function getServerSideProps(context: GetServerSidePropsContext) {
  // const accountName: string = process.env.TENDERLY_ACCOUNT;
  // const projectName: string = process.env.TENDERLY_PROJECT;
  const network = context.params.network || '1';
  const txHash = context.params.hash || '0x';

  const TENDERLY_API_BASE_URL = 'https://api.tenderly.co';
  let data: Record<string, any>;

  try {
    const response = await axios.get(
      // `${TENDERLY_API_BASE_URL}/api/v1/account/${accountName}/project/${projectName}/network/${network}/transaction/${txHash}`,
      `${TENDERLY_API_BASE_URL}/api/v1/public-contract/${network}/trace/${txHash}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Access-Key': process.env.TENDERLY_ACCESS_TOKEN,
        },
      },
    );

    data = {
      errorMessage: response.data.error_message ?? '',
      blockNumber: response.data.block_number,
      networkId: response.data.call_trace.network_id || '1',
      gas: response.data.call_trace.gas,
      gasUsed: response.data.call_trace.gas_used,
      txHash: response.data.call_trace.hash,
      from: response.data.call_trace.from,
      to: response.data.call_trace.to,
    };
  } catch (error) {
    data = {
      errorMessage: error.response?.data?.message ?? 'Error occurred',
    };
  }

  // Pass data to the page via props
  return {
    props: {
      ...data,
    },
  };
}
