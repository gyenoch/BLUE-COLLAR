/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable SWC on Windows to avoid binary issue
  swcMinify: false,
  // Use Babel for transpilation instead
  experimental: {
    esmExternals: true,
  },
};

module.exports = nextConfig;
