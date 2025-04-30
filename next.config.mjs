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
        hostname: "sha8alny.uaenorth.cloudapp.azure.com",
      },
      {
        protocol: "http",
        hostname: "sha8alny.uaenorth.cloudapp.azure.com",
      },
      {
        protocol: "https",
        hostname: "sha8alny.uaenorth.cloudapp.azure.com",
      },
      {
        protocol: "https",
        hostname: "www.google.com",
      },
      {
        protocol: "https",
        hostname: "d2zp5xs5cp8zlg.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "sha8alny.online"
      }
    ],
  },
};

export default nextConfig;
