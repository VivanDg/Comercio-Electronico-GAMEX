/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '**.mercadolibre.com' },
    ],
  },
  output: 'standalone',
};

module.exports = nextConfig;
