/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "links.papareact.com",
      },
      {
        protocol: "https",
        hostname: "i.imgur.com",
      },
      {
        protocol: "https",
        hostname: "i5.walmartimages.com",
      },
      {
        protocol: "https",
        hostname: "i8.walmartimages.com",
      },
      {
        protocol: "https",
        hostname: "i9.walmartimages.com",
      },
      {
        protocol: "https",
        hostname: "i7.walmartimages.com",
      }
    ],
  },
};

export default nextConfig;
