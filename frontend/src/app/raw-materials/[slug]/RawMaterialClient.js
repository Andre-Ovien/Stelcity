"use client"

import ProductDetailPage from "../../components/ProductDetailPage"

export default function RawMaterialClient({ params, initialProduct = null }) {
  return (
    <ProductDetailPage
      params={params}
      expectedCategory="raw_material"
      initialProduct={initialProduct}
    />
  )
}
