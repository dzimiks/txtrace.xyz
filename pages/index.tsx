import Head from 'next/head';

export default function Page() {
  return (
    <div>
      <Head>
        <meta name="og:title" content="Transaction Trace by Tenderly.co" />
        <meta name="og:description" content="Get transaction trace in one click. More than 30 EVM-based networks supported." />
        <meta
          name="og:image"
          content={
            // Because OG images must have an absolute URL, we use the
            // `VERCEL_URL` environment variable to get the deployment’s URL.
            // More info:
            // https://vercel.com/docs/concepts/projects/environment-variables
            `${
              process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : ''
            }/api/tenderly`
          }
        />
      </Head>
      <h1>Transaction Trace</h1>
    </div>
  );
}
