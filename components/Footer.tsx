import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-50 text-black border-t p-8 text-center">
      <div className="flex items-center justify-center gap-2">
        <div>
          Made by{' '}
          <Link
            className="link-text-no-underline"
            href="https://twitter.com/dzimiks"
            target="_blank"
          >
            dzimiks
          </Link>.
        </div>
        <div className="flex items-center justify-center">
          Powered by{' '}
          <Link href="https://tenderly.co?ref=txtrace.xyz" className="hover:opacity-80">
            <img
              className="h-10"
              src="https://storage.googleapis.com/tenderly-public-assets/tenderly-logo-black.png"
              alt="Tenderly"
            />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
