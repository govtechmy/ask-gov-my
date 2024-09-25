const createNextIntlPlugin = require("next-intl/plugin");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "ask-gov.s3.ap-southeast-2.amazonaws.com",
      },
    ],
  },
  reactStrictMode: true,
  transpilePackages: ["@askgovmy/ui", "@askgovmy/utils"],
  experimental: {
    instrumentationHook: true,
  },
};

const withNextIntl = createNextIntlPlugin("./lib/i18n.ts");

module.exports = withNextIntl(nextConfig);
