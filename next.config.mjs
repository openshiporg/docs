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
      { source: '/docs/openfront/analytics/what-is-analytics', destination: '/docs/openfront/analytics', permanent: true },
      { source: '/docs/openfront/cannabis/what-is-cannabis', destination: '/docs/openfront/cannabis', permanent: true },
      { source: '/docs/openfront/collectibles/what-is-collectibles', destination: '/docs/openfront/collectibles', permanent: true },
      { source: '/docs/openfront/ecommerce/what-is-openfront', destination: '/docs/openfront/ecommerce', permanent: true },
      { source: '/docs/openfront/financial/what-is-financial', destination: '/docs/openfront/financial', permanent: true },
      { source: '/docs/openfront/grocery/what-is-grocery', destination: '/docs/openfront/grocery', permanent: true },
      { source: '/docs/openfront/hospital/what-is-hospital', destination: '/docs/openfront/hospital', permanent: true },
      { source: '/docs/openfront/hotel/what-is-hotel', destination: '/docs/openfront/hotel', permanent: true },
      { source: '/docs/openfront/law-firm/what-is-law-firm', destination: '/docs/openfront/law-firm', permanent: true },
      { source: '/docs/openfront/marketplace/what-is-marketplace', destination: '/docs/openfront/marketplace', permanent: true },
      { source: '/docs/openfront/medspa/what-is-medspa', destination: '/docs/openfront/medspa', permanent: true },
      { source: '/docs/openfront/real-estate/what-is-real-estate', destination: '/docs/openfront/real-estate', permanent: true },
      { source: '/docs/openfront/rental/what-is-rental', destination: '/docs/openfront/rental', permanent: true },
      { source: '/docs/openfront/salon/what-is-salon', destination: '/docs/openfront/salon', permanent: true },
      { source: '/docs/openfront/uikit/what-is-uikit', destination: '/docs/openfront/uikit', permanent: true },
      { source: '/docs/openship/ecommerce/what-is-openship', destination: '/docs/openship/ecommerce', permanent: true },
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
