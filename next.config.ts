import type { NextConfig } from "next";

function apiImageRemotePatterns(): NonNullable<
  NextConfig["images"]
>["remotePatterns"] {
  const patterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [];

  function addPattern(urlLike: string | undefined) {
    if (!urlLike) return;
    try {
      const url = new URL(urlLike);
      const protocol = url.protocol.replace(":", "") as "http" | "https";
      patterns.push({
        protocol,
        hostname: url.hostname,
        pathname: "/**",
      });
    } catch {
      // ignore invalid URLs
    }
  }

  addPattern(process.env.NEXT_PUBLIC_API_BASE_URL);
  addPattern("https://aws-maxtronize-uploads.s3.ap-south-1.amazonaws.com");

  return patterns;
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: apiImageRemotePatterns(),
  },
};

export default nextConfig;
