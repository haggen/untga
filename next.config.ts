import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // React strict mode helps identify potential problems during development.
  reactStrictMode: true,

  // Silence is golden.
  poweredByHeader: false,

  // experimental: {
  //   // Enable support for middleware in Node runtime.
  //   // @see https://nextjs.org/docs/app/building-your-application/routing/middleware#runtime
  //   nodeMiddleware: true,
  // },

  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
