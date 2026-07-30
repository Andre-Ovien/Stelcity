"use client"

import ProductDetailPage from "../../components/ProductDetailPage"

export default function ProductClient({ params, initialProduct = null }) {
  return (
    <ProductDetailPage
      params={params}
      expectedCategory="product"
      initialProduct={initialProduct}
    />
  )
}
