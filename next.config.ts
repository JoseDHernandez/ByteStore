import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL(`${process.env.NEXT_PUBLIC_API_URL}/products/images/**`),
    ],
  },
};

export default nextConfig;
