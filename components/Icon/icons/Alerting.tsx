import { SVGProps } from 'react';

const Alerting = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 32 32"
    fill="currentColor"
    {...props}
  >
    {/* eslint-disable-next-line max-len */}
    <path d="M16 0C7.163 0 0 7.163 0 16s7.163 16 16 16 16-7.163 16-16S24.837 0 16 0zm0 26.137L6.546 9.799h18.907l-9.454 16.338zm0-6.434 3.93-6.792h-7.86z" />
  </svg>
);

export default Alerting;
