import { SVGProps } from 'react';

const SvgGoogle = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 32 32"
    fill="currentColor"
    {...props}
  >
    {/* eslint-disable-next-line max-len */}
    <path d="M16.32 13.713V19.2h9.075c-.367 2.353-2.741 6.899-9.075 6.899-5.46 0-9.919-4.519-9.919-10.099s4.46-10.099 9.919-10.099c3.107 0 5.188 1.319 6.38 2.465l4.339-4.184c-2.787-2.601-6.4-4.183-10.719-4.183-8.847 0-16 7.153-16 16s7.153 16 16 16c9.235 0 15.36-6.492 15.36-15.635 0-1.051-.113-1.853-.252-2.652z" />
  </svg>
);
export default SvgGoogle;
