/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "media.licdn.com",
      },
      {
        protocol: "https",
        hostname: "example.com",
      },
      {
        protocol: "https",
        hostname: "testcompany.com"
      },
      {
        protocol: "http",
        hostname: "sha8alny.uaenorth.cloudapp.azure.com"
      }
    ],
  },
};

export default nextConfig;
