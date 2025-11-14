import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    domains: ["upload.wikimedia.org","res.cloudinary.com"], // ✅ এখানে তোমার ডোমেইন যুক্ত হলো
  },
};

export default nextConfig;
