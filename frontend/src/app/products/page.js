import ProductsPage from './ProductsPage'
import { redirect } from 'next/navigation'
import BreadcrumbSchema from '../components/BreadcrumbSchema'
import { getAllProducts } from '../lib/product'
import { CATALOG_ITEMS_PER_PAGE } from '../lib/catalogPagination'

function getPageNumber(searchParams) {
  const requestedPage = Number(searchParams?.page || 1)
  return Number.isFinite(requestedPage) && requestedPage > 0
    ? Math.floor(requestedPage)
    : 1
}

export async function generateMetadata({ searchParams }) {
  const page = getPageNumber(await searchParams)
  const canonical = page === 1 ? '/products' : `/products?page=${page}`
  const title = page === 1
    ? 'Skincare Products in Nigeria'
    : `Skincare Products in Nigeria – Page ${page}`

  return {
    title,
    description: 'Shop skincare products for clearer, softer and healthier-looking skin from Stelcity, with convenient delivery across Nigeria.',
    alternates: { canonical },
    openGraph: {
      title: `${title} | Stelcity`,
      description: 'Shop skincare products for clearer, softer and healthier-looking skin, delivered across Nigeria.',
      url: canonical,
      images: [{ url: '/images/og-banner.jpg', width: 1200, height: 634 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Stelcity`,
      description: 'Shop skincare products for clearer, softer and healthier-looking skin.',
      images: ['/images/og-banner.jpg'],
    },
  }
}

export default async function ProductsServerPage({ searchParams }) {
  const initialPage = getPageNumber(await searchParams)
  let initialProducts = []
  try {
    initialProducts = await getAllProducts()
  } catch (error) {
    console.error("Failed to render the product catalogue:", error)
    initialProducts = []
  }

  const totalPages = Math.max(
    1,
    Math.ceil(initialProducts.length / CATALOG_ITEMS_PER_PAGE)
  )
  if (initialProducts.length > 0 && initialPage > totalPages) {
    redirect(totalPages === 1 ? '/products' : `/products?page=${totalPages}`)
  }

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Skincare Products", url: "/products" },
        ]}
      />
      <ProductsPage
        initialProducts={initialProducts}
        initialPage={initialPage}
      />
    </>
  )
}
