import ProductsPage from './ProductsPage'
import { getAllProducts } from '../lib/product'

export const metadata = {
  title: 'Shop Skincare Products',
  description: 'Browse premium skincare products, raw materials and beauty services. Fast delivery across Nigeria.',
  alternates: { canonical: 'https://www.stelcity.com/products' },
  openGraph: {
    title: 'Shop Skincare Products | Stelcity',
    description: 'Browse premium skincare products delivered across Nigeria.',
    url: 'https://www.stelcity.com/products',
    images: [{ url: '/images/og-banner.jpg', width: 1200, height: 630 }],
  },
}

export default async function ProductsServerPage() {
  let initialProducts = []
  try {
    initialProducts = await getAllProducts()
  } catch {
    initialProducts = []
  }

  return <ProductsPage initialProducts={initialProducts} />
}