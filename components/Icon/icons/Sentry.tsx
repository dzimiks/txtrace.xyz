import { SVGProps } from 'react';

const SvgSentry = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 32 32"
    fill="currentColor"
    {...props}
  >
    {/* eslint-disable-next-line max-len */}
    <path d="M31.551 28.763c.599-.997.599-1.995 0-2.992L18.591 3.242c-.596-.996-1.593-1.397-2.591-1.397s-1.993.599-2.591 1.397l-4.188 7.376.997.599a19.752 19.752 0 0 1 7.576 7.576c1.596 2.792 2.592 5.781 2.792 8.973h-2.991c-.199-2.593-.997-5.185-2.392-7.579-1.396-2.791-3.589-4.984-6.38-6.58l-.999-.596-3.987 6.779.996.599c2.592 1.593 4.387 4.185 4.785 7.177h-6.58c-.199 0-.4-.2-.4-.2s-.197-.2 0-.399l1.797-3.191c-.599-.596-1.397-.997-2.195-1.195L.445 25.772c-.599.997-.599 1.995 0 2.992.597.995 1.395 1.393 2.591 1.393h9.172v-1.195c0-2.193-.599-4.188-1.595-6.183-.799-1.593-1.995-2.791-3.389-3.787l1.396-2.593c1.796 1.395 3.391 2.991 4.585 4.985 1.396 2.391 1.995 4.984 1.995 7.576v1.195h7.775V28.96c0-3.987-.996-7.976-3.189-11.564-1.596-3.192-4.188-5.783-7.18-7.777l2.992-5.183c.201-.2.4-.2.4-.2.2 0 .2 0 .399.2l12.961 22.528c.197.197 0 .399 0 .399s-.2.2-.4.2h-2.991v2.393h2.991c1.195.199 1.993-.2 2.591-1.195z" />
  </svg>
);
export default SvgSentry;