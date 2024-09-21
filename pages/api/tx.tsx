import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { formatAmount, parseEthValue } from '@/utils/number';
import { excerpt, extractQueryParams, generateShortAddress } from '@/utils/string';
import {
  DarkBoxStyle,
  DarkTextStyle,
  getThemeBackgroundCSS,
} from '@/utils/theme';
import {
  ArrowRightIcon,
  BoxIcon,
  CheckIcon,
  CoinsIcon,
  FlameIcon,
  FunctionSquareIcon,
  XIcon,
} from '@/components/Icons';
import { Theme } from '@/common/constants';

export const config = {
  runtime: 'edge',
};

const fontSemiBold = fetch(
  new URL('../../assets/fonts/Inter-SemiBold.ttf', import.meta.url),
).then(res => res.arrayBuffer());

export default async function handler(req: NextRequest) {
  const fontSemiBoldData = await fontSemiBold;

  const { searchParams } = req.nextUrl;

  const {
    id,
    error,
    errorMessage,
    toContractName,
    blockNumber,
    networkName,
    networkUrl,
    gas,
    gasPrice,
    txHash,
    from,
    to,
    status,
    functionName,
  } = extractQueryParams(searchParams, [
    'id',
    'error',
    'errorMessage',
    'toContractName',
    'blockNumber',
    'networkName',
    'networkUrl',
    'gas',
    'gasPrice',
    'txHash',
    'from',
    'to',
    'status',
    'functionName',
  ]);
  const theme = Theme.DARK;
  const boxStyle: string = DarkBoxStyle;
  const textStyle: string = DarkTextStyle;
  const failedText: string = 'flex items-center text-[#E5484D]';
  const failedBox =
    'flex items-center rounded border-2 border-[#E5484D19] bg-[#E5484D19] text-[#E5484D] text-4xl px-2 py-1';
  const successBox =
    'flex items-center rounded border-2 border-[#30A46C19] bg-[#30A46C19] text-[#30A46C] text-4xl px-2 py-1';

  return new ImageResponse(
    (
      <div
        tw="flex flex-col justify-between w-full h-screen"
        style={{
          fontFamily: 'Inter, sans-serif',
          background: getThemeBackgroundCSS(theme),
        }}
      >
        {error && (
          <div tw="flex flex-col items-center justify-between pt-[15%] px-12">
            <img
              tw="rounded w-28 h-28 mb-4"
              src="https://storage.googleapis.com/tenderly-public-assets/tenderly-symbol.svg"
              alt="Tenderly"
            />
            <div tw={`flex flex-col text-5xl ${textStyle} mb-4`}>
              <div tw="text-[#A09FA6]">{generateShortAddress(txHash ?? id, 10, 10)}</div>
            </div>
            <div tw={`${failedText} text-5xl`}>{error}</div>
          </div>
        )}
        {!error && (
          <div tw="flex flex-col justify-between h-screen p-12">
            <div tw="flex w-full justify-between">
              <div tw={`flex flex-col text-left text-5xl ${textStyle}`}>
                <div tw="flex items-center font-medium mb-4">
                  <span tw="text-5xl">{generateShortAddress(txHash, 10, 10)}</span>
                  {!status && (
                    <div tw={`${failedBox} ml-2`}>
                      <XIcon />
                      <span tw="ml-1">Failed</span>
                    </div>
                  )}
                  {status && (
                    <div tw={`${successBox} ml-2`}>
                      <CheckIcon />
                      <span tw="ml-1">Success</span>
                    </div>
                  )}
                </div>
                <div tw="flex">
                  <div tw={`${boxStyle} mr-4`}>
                    <img
                      tw="w-10 h-10"
                      src={networkUrl}
                      alt={networkName}
                    />
                    <span tw="ml-2">{networkName}</span>
                  </div>
                  <div tw={`${boxStyle} mr-4`}>
                    <div tw="flex text-[#A09FA6]">
                      <BoxIcon />
                    </div>
                    <span tw="ml-2">{formatAmount(blockNumber, 0)}</span>
                  </div>
                </div>
              </div>
              <img
                tw="rounded w-28 h-28"
                src="https://storage.googleapis.com/tenderly-public-assets/tenderly-symbol.svg"
                alt="Tenderly"
              />
            </div>
            {errorMessage && <div tw={`${failedText} text-5xl`}>{excerpt(errorMessage, 80)}</div>}
            <div tw="flex flex-col">
              <div tw="flex mb-4">
                <div tw={`${boxStyle} mr-4`}>
                  <div tw="flex text-[#A09FA6]">
                    <FlameIcon />
                  </div>
                  <span tw="ml-2">{formatAmount(gas, 0)}</span>
                </div>
                <div tw={boxStyle}>
                  <div tw="flex text-[#A09FA6]">
                    <CoinsIcon />
                  </div>
                  <span tw="ml-2">
                    {parseEthValue(gasPrice).value} {parseEthValue(gasPrice).unit}
                  </span>
                </div>
                {functionName && (
                  <div tw={`${boxStyle} ml-4`}>
                    <div tw="flex text-[#A09FA6]">
                      <FunctionSquareIcon />
                    </div>
                    <span tw="ml-2">{excerpt(functionName, 20)}()</span>
                  </div>
                )}
              </div>
              <div tw="flex">
                <div tw={`${boxStyle} mr-4`}>{generateShortAddress(from)}</div>
                <div tw={`${boxStyle} text-[#A09FA6] mr-4`}>
                  <ArrowRightIcon />
                </div>
                <div tw={boxStyle}>
                  {toContractName
                    ? `${excerpt(toContractName, 24)} (${generateShortAddress(to)})`
                    : generateShortAddress(to)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: fontSemiBoldData,
          style: 'normal',
          weight: 500,
        },
      ],
    },
  );
}
