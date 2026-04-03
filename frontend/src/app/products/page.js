import React from 'react'
import ProductsPage from './ProductsPage'

export const metadata = {
  title: "Shop Skincare Products in Nigeria | Stelcity",
  description:
    "Browse and shop premium skincare products in Nigeria. Discover cleansers, serums, body care, and more for healthy, glowing skin.",
  
  alternates: {
    canonical: "https://stelcity.com/products",
  },

  openGraph: {
    title: "Shop Skincare Products | Stelcity",
    description:
      "Explore a wide range of skincare products designed for healthy, glowing skin.",
    url: "https://stelcity.com/products",
    images: ["/images/og-banner.png"],
  },

  twitter: {
    card: "summary_large_image",
    title: "Shop Skincare Products | Stelcity",
    description:
      "Browse premium skincare products for all skin types.",
    images: ["/images/og-banner.png"],
  },
}

const Page = () => {
  return <ProductsPage />
}

export default Page