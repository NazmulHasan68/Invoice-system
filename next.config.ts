// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
//   reactCompiler: true,
//   images: {
//     domains: ["upload.wikimedia.org","res.cloudinary.com",], // ✅ এখানে তোমার ডোমেইন যুক্ত হলো
//   },
// };

// export default nextConfig;


// next.config.ts
import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**', // allow all paths
      },
      {
        protocol: 'https',
        hostname: 'example.com',
        pathname: '/images/**', // allow only /images path
      },
    ],
  },
};

export default nextConfig;
