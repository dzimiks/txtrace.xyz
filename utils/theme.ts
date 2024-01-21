import { Theme } from '@/common/constants';

/**
 * Determines if the provided theme is a light theme.
 *
 * @param {Theme | string} theme - The theme to check.
 * @returns {boolean} True if the theme is light or not provided, otherwise false.
 */
const isLightTheme = (theme: Theme | string): boolean => {
  if (!theme) {
    return false;
  }

  switch (theme) {
    case Theme.LIGHT:
      return true;
    case Theme.DARK:
      return false;
    default:
      return false;
  }
};

/**
 * Returns the background CSS value based on the provided theme.
 *
 * @param {Theme | string} theme - The theme for which to get the background CSS value.
 * @returns {string} The background CSS value corresponding to the theme.
 */
const getThemeBackgroundCSS = (theme: Theme | string): string => {
  if (!theme) {
    return 'linear-gradient(116deg, #2A165B 0%, #000 16.14%, #111113 52.16%, #000 82.51%, #11536B 100%)';
  }

  switch (theme) {
    case Theme.LIGHT:
      return '#fff';
    case Theme.DARK:
      return 'linear-gradient(116deg, #2A165B 0%, #000 16.14%, #111113 52.16%, #000 82.51%, #11536B 100%)';
    default:
      return 'linear-gradient(116deg, #2A165B 0%, #000 16.14%, #111113 52.16%, #000 82.51%, #11536B 100%)';
  }
};

/**
 * Returns the appropriate CSS classes for the bottom banner based on the provided theme and title.
 *
 * @param {Theme|string} theme - The theme (or string representing the theme) to determine the CSS classes.
 * @param {string} title - The title used to further determine the CSS classes.
 * @returns {string} The corresponding CSS classes for the bottom banner.
 */
const getBottomBannerBackgroundCSS = (theme: Theme | string, title: string): string => {
  if (!theme || !title) {
    return 'bg-[#6E56CF] text-white';
  }

  let style: string;

  switch (title) {
    case 'Simulated Transaction':
      style = 'bg-[#3D8AF7] text-white';
      break;
    case 'Contract':
      style = 'bg-[#FFB81F] text-white';
      break;
    case 'Wallet':
      style = 'bg-[#30A46C] text-white';
      break;
    // case 'Simulated Fork Transaction':
    //   style = 'bg-indigo-500';
    //   break;
    default:
      style = 'bg-[#6E56CF] text-white';
      break;
  }

  return style;
};

const LightBoxStyle: string =
  'flex items-center border-2 rounded border-[#E3DFDF] bg-[#34343A07] text-[#1e1e1e] text-4xl px-2 py-1';

const DarkBoxStyle: string =
  'flex items-center border-2 rounded border-[#28282C] bg-[#1C1C1F] text-[#EDEDEF] text-4xl px-2 py-1';

const LightTextStyle: string = 'text-gray-900';
const DarkTextStyle: string = 'text-[#EDEDEF]';

export {
  getThemeBackgroundCSS,
  getBottomBannerBackgroundCSS,
  isLightTheme,
  LightBoxStyle,
  DarkBoxStyle,
  LightTextStyle,
  DarkTextStyle,
};
