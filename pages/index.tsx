import Head from 'next/head';
import axios from 'axios';

// /tx/mainnet/0x2e7dc8b2fb7e25fd00ed9565dcc0ad4546363171d5e00f196d48103983ae477c
export default function Page({ data }) {
  return (
    <div>
      <Head>
        <meta name="og:title" content="Transaction Trace by Tenderly.co" />
        <meta name="og:description"
              content="Get transaction trace in one click. More than 30 EVM-based networks supported." />
        <meta
          name="og:image"
          content={
            // Because OG images must have an absolute URL, we use the
            // `VERCEL_URL` environment variable to get the deployment’s URL.
            // More info:
            // https://vercel.com/docs/concepts/projects/environment-variables
            `${
              process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : ''
            }/api/tenderly?from=${data.from}&to=${data.to}&blockNumber=${data.block_number}`
          }
        />
      </Head>
      <h1>Transaction Trace</h1>
    </div>
  );
}
// https://openchain.xyz/trace/ethereum/0x2e7dc8b2fb7e25fd00ed9565dcc0ad4546363171d5e00f196d48103983ae477c
export async function getServerSideProps() {
  // Fetch data from external API
  const accountName: string = process.env.TENDERLY_ACCOUNT;
  const projectName: string = process.env.TENDERLY_PROJECT;

  const options = {
    network_id: '1',
    from: '0x0000000000000000000000000000000000000000',
    to: '0x81dbcc69937dad14e358b1a16ba7ea047703c404',
    save: true,
    save_if_fails: true,
    simulation_type: 'full',
  };
  const TENDERLY_API_BASE_URL = 'https://api.tenderly.co';

  const { data } = await axios.post(
    `${TENDERLY_API_BASE_URL}/api/v1/account/${accountName}/project/${projectName}/simulate`,
    options,
    {
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Key': process.env.TENDERLY_ACCESS_TOKEN,
      },
    },
  );

  // Pass data to the page via props
  return {
    props: {
      data: data?.simulation ?? {},
    },
  };
}
