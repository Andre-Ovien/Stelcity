import React from 'react'
import ProductsPage from './ProductsPage'


export const metadata = {
  title: 'Shop Skincare Products',
  description: 'Browse premium skincare products, raw materials and beauty services. Fast delivery across Nigeria.',
  alternates: { canonical: 'https://www.stelcity.com/products' },
  openGraph: {
    title: 'Shop Skincare Products | Stelcity',
    description: 'Browse premium skincare products delivered across Nigeria.',
    url: 'https://www.stelcity.com/products',
    images: [{ url: '/images/og-banner.jpeg', width: 1200, height: 630 }],
  },
}
const page = () => {
  return (
    <ProductsPage/>
  )
}

export default page