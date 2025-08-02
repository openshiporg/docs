import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vercel.com',
      },
      {
        protocol: 'https',
        hostname: 'railway.app',
      },
      {
        protocol: 'https',
        hostname: 'render.com',
      },
      {
        protocol: 'https',
        hostname: 'www.netlify.com',
      },
    ],
  },
};

export default withMDX(config);
