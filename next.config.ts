import type { NextConfig } from "next";

function apiImageRemotePatterns(): NonNullable<
  NextConfig["images"]
>["remotePatterns"] {
  const patterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [];
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) return patterns;
  try {
    const url = new URL(base);
    const protocol = url.protocol.replace(":", "") as "http" | "https";
    patterns.push({
      protocol,
      hostname: url.hostname,
      pathname: "/**",
    });
  } catch {
    // ignore invalid API base URL
  }
  return patterns;
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: apiImageRemotePatterns(),
  },
};

export default nextConfig;
