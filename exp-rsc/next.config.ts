import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.bing.com",
        pathname: "/th",
      },
    ],
  },
};

export default nextConfig;
