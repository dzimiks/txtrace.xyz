import { SVGProps } from 'react';

const SingleProject = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 32 32"
    fill="currentColor"
    {...props}
  >
    {/* eslint-disable-next-line max-len */}
    <path d="M1.565 8v16L16 32l14.435-8V8L16 0 1.565 8zm20.071 11.123L16 22.246l-5.636-3.123v-6.247L16 9.753l5.636 3.123v6.247z" />
  </svg>
);

export default SingleProject;
