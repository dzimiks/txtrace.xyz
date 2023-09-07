import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const config = {
  runtime: 'edge',
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
  console.log({
    errorMessage,
    blockNumber,
    txHash,
  });

  return new ImageResponse(
    (
      <div tw="flex flex-col w-full gap-8 px-4 py-8">
        <div tw="flex w-full justify-between items-center gap-2">
          <div tw="flex flex-col text-left text-2xl font-bold text-gray-900">
            <span>Transaction Trace</span>
            <span tw="text-indigo-600">{txHash}</span>
          </div>
          <img
            tw="rounded w-10 h-10"
            src="https://storage.googleapis.com/tenderly-public-assets/node-extensions/tenderly.png"
            alt="Tenderly"
          />
        </div>
        <div tw="flex flex-col flex-wrap gap-2">
          {from && to && (
            <div tw="flex border p-1 w-fit">
              From: {from} {'->'} To: {to}
            </div>
          )}
          {networkId && (
            <div tw="flex border p-1 w-fit">
              Network ID: {networkId}
            </div>
          )}
          {blockNumber && (
            <div tw="flex border p-1 w-fit">
              Block: {blockNumber}
            </div>
          )}
          {gas && gasUsed && (
            <>
              <div tw="flex border p-1 w-fit">
                Gas: {gas}
              </div>
              <div tw="flex border p-1 w-fit">
                Gas Used: {gasUsed}
              </div>
            </>
          )}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
