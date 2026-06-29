/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  transpilePackages: ["@yourcompany/global-backend-next"],
  allowedDevOrigins: ["192.168.29.15", "192.168.29.15:3000", "192.168.29.15:3001"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
