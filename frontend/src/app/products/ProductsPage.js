"use client"

import CatalogPage from "../components/CatalogPage"

export default function ProductsPage({ initialProducts = [], initialPage = 1 }) {
  return (
    <CatalogPage
      catalogType="products"
      initialItems={initialProducts}
      initialPage={initialPage}
    />
  )
}
