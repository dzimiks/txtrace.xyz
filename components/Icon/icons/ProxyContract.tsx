import { SVGProps } from 'react';

const ProxyContract = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 32 32"
    fill="currentColor"
    {...props}
  >
    {/* eslint-disable-next-line max-len */}
    <path d="M16 1.917c.79 0 1.43.64 1.43 1.43v7.702h4.181a4.29 4.29 0 0 1 4.29 4.22l.001.071v3.705a5.61 5.61 0 1 1-2.86 0V15.34a1.43 1.43 0 0 0-1.397-1.43H10.388a1.43 1.43 0 0 0-1.43 1.397v3.739a5.61 5.61 0 1 1-2.86 0v-3.705a4.29 4.29 0 0 1 4.22-4.29l.071-.001h4.181V3.348c0-.79.64-1.43 1.43-1.43zM7.528 21.721a2.75 2.75 0 1 0 0 5.502 2.75 2.75 0 0 0 0-5.502zm16.944 0a2.75 2.75 0 1 0 0 5.502 2.75 2.75 0 0 0 0-5.502z" />
  </svg>
);

export default ProxyContract;
