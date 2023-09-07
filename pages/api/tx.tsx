import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const config = {
  runtime: 'edge',
};

const generateShortAddress = (address: string, leftOffset = 10, rightOffset = 4) => {
  if (!address) {
    return null;
  }

  return `${address.slice(0, leftOffset)}...${address.slice(address.length - rightOffset)}`;
};

const GlobeIcon = () => (
  <i className="Icon">
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none"
         stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-globe">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" x2="22" y1="12" y2="12"></line>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
  </i>
);

const BoxIcon = () => (
  <i className="Icon">
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
         className="lucide lucide-box">
      <path
        d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
      <path d="m3.3 7 8.7 5 8.7-5"></path>
      <path d="M12 22V12"></path>
    </svg>
  </i>
);

const ArrowRightIcon = () => (
  <i className="Icon">
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
         className="lucide lucide-arrow-right">
      <path d="M5 12h14"></path>
      <path d="m12 5 7 7-7 7"></path>
    </svg>
  </i>
);

const FlameIcon = () => (
  <i className="Icon">
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
         className="lucide lucide-flame">
      <path
        d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
    </svg>
  </i>
);

const CoinsIcon = () => (
  <i className="Icon">
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
         className="lucide lucide-coins">
      <circle cx="8" cy="8" r="6"></circle>
      <path d="M18.09 10.37A6 6 0 1 1 10.34 18"></path>
      <path d="M7 6h1v4"></path>
      <path d="m16.71 13.88.7.71-2.82 2.82"></path>
    </svg>
  </i>
);

const CheckIcon = () => (
  <i className="Icon">
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
         className="lucide lucide-check">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  </i>
);

const XIcon = () => (
  <i className="Icon">
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
         className="lucide lucide-x">
      <path d="M18 6 6 18"></path>
      <path d="m6 6 12 12"></path>
    </svg>
  </i>
);

const boxStyle = 'flex items-center border rounded border-[#ADA9A9] bg-[#E3DFDF] text-[#1e1e1e] text-4xl p-1';

// /api/tx?errorMessage=&blockNumber=18079533&networkId=1&gas=326829&gasUsed=70118&txHash=0xb1db15f95ff8939fea97bba2782a1c7b2f4d0dc7d67097fdb9648d9fb7766870&from=0xd312818347fb054d30925488a7dcfab6e19e9421&to=0xcf5540fffcdc3d510b18bfca6d2b9987b0772559
export default async function handler(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const errorMessage = searchParams.get('errorMessage');
  const blockNumber = searchParams.get('blockNumber');
  const networkId = searchParams.get('networkId');
  const gas = searchParams.get('gas');
  const gasUsed = searchParams.get('gasUsed');
  const txHash = searchParams.get('txHash');
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const status = searchParams.get('status');
  const createdAt = searchParams.get('createdAt');
  console.log({
    errorMessage,
    blockNumber,
    txHash,
    createdAt,
  });

  return new ImageResponse(
    (
      <div tw="flex flex-col justify-between bg-white w-full h-screen p-12">
        <div tw="flex w-full justify-between items-center">
          <div tw="flex flex-col text-left text-6xl font-bold text-gray-900">
            <div tw="flex items-center mb-4">
              <span tw="mr-4">Transaction</span>
              {!status && (
                <span tw="flex items-center text-5xl text-[#E5484D]">
                  <XIcon />
                  <span tw="ml-2">Failed</span>
                </span>
              )}
              {status && (
                <span tw="flex items-center text-5xl text-[#30A46C]">
                  <CheckIcon />
                  <span tw="ml-2">Success</span>
                </span>
              )}
            </div>
            <span tw="text-indigo-600 text-4xl">
              {generateShortAddress(txHash, 10, 8)}
            </span>
          </div>
          <img
            tw="rounded w-32 h-32"
            src="https://storage.googleapis.com/tenderly-public-assets/node-extensions/tenderly.png"
            alt="Tenderly"
          />
        </div>
        {errorMessage && (
          <div tw="flex items-center text-5xl text-[#E5484D]">
            {errorMessage}
          </div>
        )}
        <div tw="flex flex-col">
          <div tw="flex flex-col mb-8">
            <div tw="flex items-center mb-4">
              <div tw={`${boxStyle} mr-4`}>
                <GlobeIcon />
                <span tw="ml-2">{networkId}</span>
              </div>
              <div tw={boxStyle}>
                <BoxIcon />
                <span tw="ml-2">{blockNumber}</span>
              </div>
            </div>
            <div tw="flex mb-4">
              <div tw={`${boxStyle} mr-4`}>
                {generateShortAddress(from)}
              </div>
              <div tw={`${boxStyle} mr-4`}>
                <ArrowRightIcon />
              </div>
              <div tw={boxStyle}>
                {generateShortAddress(to)}
              </div>
            </div>
            <div tw="flex items-center">
              <div tw={`${boxStyle} mr-4`}>
                <FlameIcon />
                <span tw="ml-2">{gas}</span>
              </div>
              <div tw={boxStyle}>
                <CoinsIcon />
                <span tw="ml-2">{gasUsed} Wei</span>
              </div>
            </div>
          </div>
          <div tw="flex flex-col">
            <div tw="flex items-center text-3xl text-slate-500">
              {createdAt}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
