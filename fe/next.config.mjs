/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:3700/api/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: 'http://127.0.0.1:3700/uploads/:path*',
      },
    ];
  },
};

export default nextConfig;

