import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  serverExternalPackages: ['@takumi-rs/image-response'],
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vercel.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/docs/openship/ecommerce/products',
        destination: '/docs/openfront/ecommerce/products',
        permanent: true,
      },
      {
        source: '/docs/openship/ecommerce/how-to-guides/create-payment-integration',
        destination: '/docs/openfront/ecommerce/how-to-guides/create-payment-integration',
        permanent: true,
      },
      {
        source: '/docs/openship/ecommerce/how-to-guides/create-shipping-integration',
        destination: '/docs/openfront/ecommerce/how-to-guides/create-shipping-integration',
        permanent: true,
      },
      {
        source: '/docs/openship/ecommerce/how-to-guides/custom-payment-provider',
        destination: '/docs/openfront/ecommerce/how-to-guides/custom-payment-provider',
        permanent: true,
      },
      {
        source: '/docs/openship/ecommerce/how-to-guides/custom-shipping-provider',
        destination: '/docs/openfront/ecommerce/how-to-guides/custom-shipping-provider',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/docs/:path*.mdx',
        destination: '/llms.mdx/docs/:path*',
      },
    ];
  },
};

export default withMDX(config);
