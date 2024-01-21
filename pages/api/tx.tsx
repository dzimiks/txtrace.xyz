import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { formatAmount, parseEthValue } from '@/utils/number';
import { excerpt, extractQueryParams, generateShortAddress } from '@/utils/string';
import {
  DarkBoxStyle,
  DarkTextStyle,
  getBottomBannerBackgroundCSS,
  getThemeBackgroundCSS,
  isLightTheme,
  LightBoxStyle,
  LightTextStyle,
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

export const config = {
  runtime: 'edge',
};

const fontInterRegular = fetch(
  new URL('../../assets/fonts/Inter-Regular.ttf', import.meta.url),
).then(res => res.arrayBuffer());

const fontInterSemiBold = fetch(
  new URL('../../assets/fonts/Inter-SemiBold.ttf', import.meta.url),
).then(res => res.arrayBuffer());

const fontInterBold = fetch(new URL('../../assets/fonts/Inter-Bold.ttf', import.meta.url)).then(
  res => res.arrayBuffer(),
);

export default async function handler(req: NextRequest) {
  const [fontInterRegularData, fontInterSemiBoldData, fontInterBoldData] = await Promise.all([
    fontInterRegular,
    fontInterSemiBold,
    fontInterBold,
  ]);

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
    theme,
    title,
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
    'theme',
    'title',
  ]);
  const boxStyle: string = isLightTheme(theme) ? LightBoxStyle : DarkBoxStyle;
  const textStyle: string = isLightTheme(theme) ? LightTextStyle : DarkTextStyle;
  const bottomBannerText: string = 'TRANSACTION';
  const bottomBannerStyle: string = getBottomBannerBackgroundCSS(theme, title);
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
          <div tw="flex flex-col justify-between h-screen">
            <div tw="flex flex-col justify-between h-[90%] pt-12 px-12">
              <div tw="flex w-full justify-between">
                <div tw={`flex flex-col text-left text-5xl ${textStyle}`}>
                  <div tw="flex items-center font-medium mb-4">
                    <span tw="text-5xl">{generateShortAddress(txHash, 10, 10)}</span>
                    {!status && (
                      <span tw={`${failedBox} ml-2`}>
                        <XIcon />
                        <span tw="ml-1">Failed</span>
                      </span>
                    )}
                    {status && (
                      <span tw={`${successBox} ml-2`}>
                        <CheckIcon />
                        <span tw="ml-1">Success</span>
                      </span>
                    )}
                  </div>
                  <div tw="flex">
                    <div tw={`${boxStyle} mr-4`}>
                      <img
                        tw="w-10 h-10 border border-[#ADA9A9] rounded-full bg-white"
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
            </div>
            <div
              tw={`flex flex-col text-2xl font-bold p-1 w-full items-center justify-center ${bottomBannerStyle}`}
            >
              {bottomBannerText}
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
          data: fontInterRegularData,
          style: 'normal',
          weight: 400,
        },
        {
          name: 'Inter',
          data: fontInterSemiBoldData,
          style: 'normal',
          weight: 500,
        },
        {
          name: 'Inter',
          data: fontInterBoldData,
          style: 'normal',
          weight: 700,
        },
      ],
    },
  );
}
