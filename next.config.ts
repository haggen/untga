import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // React strict mode helps identify potential problems during development.
  reactStrictMode: true,

  // Silence is golden.
  poweredByHeader: false,

  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [
        {
          // Avoid displaying the 404 page for API calls.
          source: "/api/:path*",
          destination: "/api/404",
        },
      ],
    };
  },
};

export default nextConfig;
