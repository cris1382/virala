import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "**.fal.run" },
      { protocol: "https", hostname: "**.fal.media" },
      { protocol: "https", hostname: "v3.fal.media" },
      { protocol: "https", hostname: "**.runway.io" },
      { protocol: "https", hostname: "runway.com" },
    ],
  },
};

export default nextConfig;
