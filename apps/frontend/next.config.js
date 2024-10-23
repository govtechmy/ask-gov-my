const createNextIntlPlugin = require("next-intl/plugin");
const path = require("path");

const remotePatterns = [
  { hostname: "ask-gov.s3.ap-southeast-2.amazonaws.com" },
];

if (process.env.STORAGE_BASE_URL) {
  remotePatterns.push({
    hostname: new URL(process.env.STORAGE_BASE_URL).hostname,
  });
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns,
  },
  reactStrictMode: true,
  output: "standalone",
  transpilePackages: ["@askgovmy/ui", "@askgovmy/utils"],
  compiler: {
    removeConsole: process.env.APP_ENV === "production",
  },
  experimental: {
    outputFileTracingRoot: path.join(__dirname, "../../"),
    instrumentationHook: true,
  },
};

const withNextIntl = createNextIntlPlugin("./lib/i18n.ts");

module.exports = withNextIntl(nextConfig);
