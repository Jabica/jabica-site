import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vite 8 rejects relative asset output paths such as `./_next/...`.
  // This site is deployed at the origin root, so root-relative assets are
  // correct and keep the Vinext production build compatible with Vite 8.
  assetPrefix: "",
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
