import createNextIntlPlugin from 'next-intl/plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['ask-gov.s3.ap-southeast-2.amazonaws.com'],
  },
  experimental: {
    instrumentationHook: true,
  },
};

const withNextIntl = createNextIntlPlugin('./lib/i18n.ts');

export default withNextIntl(nextConfig);
