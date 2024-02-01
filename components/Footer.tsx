const Footer = () => {
  return (
    <footer className="bg-gray-100 text-black p-8 text-center">
      <div className="flex flex-col items-center justify-center gap-2">
        <div>
          Made by{' '}
          <a
            className="text-purple-700 hover:underline"
            href="https://twitter.com/dzimiks"
            target="_blank"
          >
            dzimiks
          </a>
        </div>
        <div className="flex items-center justify-center">
          Powered by{' '}
          <a href="https://tenderly.co?ref=txtrace.xyz">
            <img
              className="h-8"
              src="https://storage.googleapis.com/tenderly-public-assets/tenderly-logo-black.png"
              alt="Tenderly"
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
