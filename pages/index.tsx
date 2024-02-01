import Head from 'next/head';
import { Footer, LandingPage } from '@/components/index';

const TITLE = 'Get Trace for any Transaction Hash | txtrace.xyz';
const DESCRIPTION = 'Get a transaction trace in one click. More than 35 networks supported.';
const WEBSITE_URL = 'https://www.txtrace.xyz';
const OG_IMAGE_URL = 'https://www.txtrace.xyz/og.png';

export default function Page() {
  return (
    <div>
      <Head>
        {/* Primary Meta Tags */}
        <title>{TITLE}</title>
        <meta name="title" content={TITLE} />
        <meta name="description" content={DESCRIPTION} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={WEBSITE_URL} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta name="og:image" content={OG_IMAGE_URL} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={WEBSITE_URL} />
        <meta property="twitter:title" content={TITLE} />
        <meta property="twitter:description" content={DESCRIPTION} />
        <meta name="twitter:image" content={OG_IMAGE_URL} />
      </Head>
      <div className="flex flex-col justify-between gap-4 min-h-screen h-full">
        <LandingPage />
        <Footer />
      </div>
    </div>
  );
}
