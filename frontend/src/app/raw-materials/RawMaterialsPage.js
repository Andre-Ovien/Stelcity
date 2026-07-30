"use client"

import CatalogPage from "../components/CatalogPage"

export default function RawMaterialsPage({ initialMaterials = [], initialPage = 1 }) {
  return (
    <CatalogPage
      catalogType="rawMaterials"
      initialItems={initialMaterials}
      initialPage={initialPage}
    />
  )
}
