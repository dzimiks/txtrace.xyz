import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const config = {
  runtime: 'edge',
};

const generateShortAddress = (address: string, leftOffset = 8, rightOffset = 4) => {
  if (!address) {
    return null;
  }

  return `${address.slice(0, leftOffset)}...${address.slice(address.length - rightOffset)}`;
};

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
      <div tw="flex flex-col justify-between bg-white w-full h-screen gap-8 px-4 py-8">
        <div tw="flex w-full justify-between items-center gap-2">
          <div tw="flex flex-col text-left text-5xl font-bold text-gray-900">
            <div tw="flex items-center">
              <span tw="mr-4">Transaction</span>
              {!status && <span tw="text-3xl text-[#E5484D]">Failed</span>}
              {status && <span tw="text-3xl text-[#30A46C]">Success</span>}
            </div>
            <span tw="text-indigo-600">
              {generateShortAddress(txHash)}
            </span>
          </div>
          <img
            tw="rounded w-24 h-24"
            src="https://storage.googleapis.com/tenderly-public-assets/node-extensions/tenderly.png"
            alt="Tenderly"
          />
        </div>
        <div tw="flex flex-col flex-wrap">
          <div tw="flex flex-col flex-wrap">
            <div tw="flex items-center mb-4">
              <div tw="flex border border-[#ADA9A9] bg-[#E3DFDF] text-[#1e1e1e] text-4xl p-1 w-fit mr-4">
                {networkId}
              </div>
              <div tw="flex border border-[#ADA9A9] bg-[#E3DFDF] text-[#1e1e1e] text-4xl p-1 w-fit">
                {blockNumber}
              </div>
            </div>
            <div tw="flex items-center mb-4">
              <div tw="flex border border-[#ADA9A9] bg-[#E3DFDF] text-[#1e1e1e] text-4xl p-1 w-fit mr-4">
                {generateShortAddress(from)}
              </div>
              <div tw="flex border border-[#ADA9A9] bg-[#E3DFDF] text-[#1e1e1e] text-4xl p-1 w-fit mr-4">
                {'->'}
              </div>
              <div tw="flex border border-[#ADA9A9] bg-[#E3DFDF] text-[#1e1e1e] text-4xl p-1 w-fit">
                {generateShortAddress(to)}
              </div>
            </div>
            <div tw="flex items-center">
              <div tw="flex border border-[#ADA9A9] bg-[#E3DFDF] text-[#1e1e1e] text-4xl p-1 w-fit mr-4">
                {gas}
              </div>
              <div tw="flex border border-[#ADA9A9] bg-[#E3DFDF] text-[#1e1e1e] text-4xl p-1 w-fit">
                {gasUsed}
              </div>
            </div>
          </div>
          <div tw="flex flex-col mt-8">
            <div tw="text-2xl text-slate-500">
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
