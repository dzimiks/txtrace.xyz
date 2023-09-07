import { SVGProps } from 'react';

const Organization = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 32 32"
    fill="currentColor"
    {...props}
  >
    {/* eslint-disable-next-line max-len */}
    <path d="m0 12.164 7.005 4.024 7.005-4.024V4.117L7.005.093 0 4.117zm17.99-8.047v8.047l7.005 4.024L32 12.164V4.117L24.995.093zM9.009 19.836v8.047l7.005 4.024 7.005-4.024v-8.047l-7.005-4.024z" />
  </svg>
);

export default Organization;
