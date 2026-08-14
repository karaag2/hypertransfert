/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  typescript: { ignoreBuildErrors: true },
  allowedDevOrigins: ["192.168.1.95", "192.168.1.39"],
};

export default nextConfig;
