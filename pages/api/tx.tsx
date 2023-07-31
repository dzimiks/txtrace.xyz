import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const {
    txHash,
    networkId,
    blockNumber,
    gas,
    gasUsed,
  } = JSON.parse(searchParams.get('data'));

  return new ImageResponse(
    (
      <div tw="flex flex-col gap-8 px-4 py-8">
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
        <div tw="flex flex-wrap gap-2">
          <div tw="border p-1 w-fit">
            Network ID: {networkId}
          </div>
          <div tw="border p-1 w-fit">
            Block: {blockNumber}
          </div>
          <div tw="border p-1 w-fit">
            Gas: {gas}
          </div>
          <div tw="border p-1 w-fit">
            Gas Used: {gasUsed}
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
