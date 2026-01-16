import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  transpilePackages: ['three'], 
  reactStrictMode: false,
};

export default nextConfig;
