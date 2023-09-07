import { SVGProps } from 'react';

const SvgWindows = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 32 32"
    fill="currentColor"
    {...props}
  >
    {/* eslint-disable-next-line max-len */}
    <path d="M0 4.599 13 2.8v12.601H0zm14.599-2L32 0v15.2H14.599zM0 16.8h13v12.601L0 27.598zm14.599 0H32V32l-17.2-2.401z" />
  </svg>
);
export default SvgWindows;
