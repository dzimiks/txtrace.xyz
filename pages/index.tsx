import Head from 'next/head';

export default function Page() {
  return (
    <div>
      <Head>
        <meta name="og:title" content="Transaction Trace by Tenderly.co" />
        <meta name="og:description"
              content="Get transaction trace in one click. More than 30 EVM-based networks supported." />
      </Head>
      <h1>Transaction Trace Simlified.</h1>
    </div>
  );
}
