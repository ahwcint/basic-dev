import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  // reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_BACKEND_API}/:path*`,
      },
    ];
  },
};

export default nextConfig;
