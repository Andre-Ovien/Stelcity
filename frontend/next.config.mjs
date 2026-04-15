/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  async redirects() {
    return [
      {
        source: "/index",
        destination: "/",
        permanent: true,
      },
      {
        source: "/services",
        destination: "/our-services",
        permanent: true, 
      },
      
      {
        source: "/rawMaterials",
        destination: "/raw-materials",
        permanent: true,
      },
      {
        source: "/training",
        destination: "/training-programs",
        permanent: true,
      },
    ]
  },

  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
}

export default nextConfig