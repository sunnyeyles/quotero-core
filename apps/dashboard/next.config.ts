import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Externalize Prisma Client to prevent bundling issues
  serverExternalPackages: ["@prisma/client", "@workspace/database"],
};

export default nextConfig;
