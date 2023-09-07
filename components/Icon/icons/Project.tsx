import { SVGProps } from 'react';

const Project = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 32 32"
    fill="currentColor"
    {...props}
  >
    {/* eslint-disable-next-line max-len */}
    <path d="M30.435 24V8L16 0 1.565 8v16L16 32l14.435-8zM7.763 11.435 16 6.87l8.237 4.565v9.131L16 25.131l-8.237-4.565v-9.131zm13.873 7.688v-6.247L16 9.752l-5.636 3.124v6.247L16 22.247z" />
  </svg>
);

export default Project;
