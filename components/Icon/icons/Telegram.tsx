import { SVGProps } from 'react';

const SvgTelegram = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 32 32"
    fill="currentColor"
    {...props}
  >
    {/* eslint-disable-next-line max-len */}
    <path d="m31.88 5.053-4.813 22.733c-.333 1.613-1.307 2-2.667 1.253l-7.333-5.427-3.547 3.427c-.4.4-.733.747-1.467.747-.96 0-.8-.36-1.12-1.267L8.4 18.266l-7.267-2.267c-1.573-.467-1.587-1.547.347-2.333L29.827 2.733c1.293-.573 2.533.32 2.053 2.32z" />
  </svg>
);
export default SvgTelegram;