import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "talkapi.dsrt321.online",
      },
      {
        protocol: "https",
        hostname: "talkapi.sobhoy.com",
      },
    ],
  },
};

export default nextConfig;
