import axios from 'axios';
import Head from 'next/head';

export default function Page({ tx }) {
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
            }/api/tx?from=${tx.from}&errorMessage=${tx.error_message}&blockNumber=${tx.block_number}&gasPrice=${tx.gas_price}`}
        />
      </Head>
      <h1>Tenderly Transaction</h1>
      <pre>{JSON.stringify(tx, null, 2)}</pre>
    </div>
  );
}

export async function getServerSideProps(context) {
  const accountName: string = process.env.TENDERLY_ACCOUNT;
  const projectName: string = process.env.TENDERLY_PROJECT;
  const network = context.params.network || '1';
  const txHash = context.params.hash || '0x';
  console.log({
    accountName,
    projectName,
    network,
    txHash,
  });

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

    data = response.data;
  } catch (error) {
    console.error({ error: error.response?.data?.error });
    data = error.response?.data?.error;
  }

  // Pass data to the page via props
  return {
    props: {
      tx: data ?? {},
    },
  };
}
