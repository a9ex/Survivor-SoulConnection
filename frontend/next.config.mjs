/** @type {import('next').NextConfig} */
const config = {
  output: 'standalone',
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '**/*',
      }
    ],
  },
};

export default config;
