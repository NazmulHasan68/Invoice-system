/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**', // allow all paths
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        pathname: '/**', // previously added
      },
    ],
  },
}

module.exports = nextConfig;
