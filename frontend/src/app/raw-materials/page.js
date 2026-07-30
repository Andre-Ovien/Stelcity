import React from 'react'
import RawMaterialsPage from './RawMaterialsPage'
import { redirect } from 'next/navigation'
import BreadcrumbSchema from '../components/BreadcrumbSchema'
import { getAllRawMaterials } from '../lib/rawMaterials'
import { CATALOG_ITEMS_PER_PAGE } from '../lib/catalogPagination'

function getPageNumber(searchParams) {
  const requestedPage = Number(searchParams?.page || 1)
  return Number.isFinite(requestedPage) && requestedPage > 0
    ? Math.floor(requestedPage)
    : 1
}

export async function generateMetadata({ searchParams }) {
  const page = getPageNumber(await searchParams)
  const canonical = page === 1
    ? '/raw-materials'
    : `/raw-materials?page=${page}`
  const title = page === 1
    ? 'Skincare Raw Materials in Nigeria'
    : `Skincare Raw Materials in Nigeria – Page ${page}`

  return {
    title,
    description: 'Buy skincare raw materials in Nigeria, including botanical powders, butters, carrier oils and formulation ingredients for your next blend.',
    alternates: { canonical },
    openGraph: {
      title: `${title} | Stelcity`,
      description: 'Source botanical powders, butters, carrier oils and skincare formulation ingredients.',
      url: canonical,
      images: [{ url: '/images/og-banner.jpg', width: 1200, height: 634 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Stelcity`,
      description: 'Source botanical powders, butters, oils and formulation ingredients.',
      images: ['/images/og-banner.jpg'],
    },
  }
}

const page = async ({ searchParams }) => {
  const initialPage = getPageNumber(await searchParams)
  let initialMaterials = []
  try {
    initialMaterials = await getAllRawMaterials()
  } catch (error) {
    console.error("Failed to render the raw-material catalogue:", error)
    initialMaterials = []
  }

  const totalPages = Math.max(
    1,
    Math.ceil(initialMaterials.length / CATALOG_ITEMS_PER_PAGE)
  )
  if (initialMaterials.length > 0 && initialPage > totalPages) {
    redirect(
      totalPages === 1
        ? '/raw-materials'
        : `/raw-materials?page=${totalPages}`
    )
  }

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Raw Materials", url: "/raw-materials" },
        ]}
      />
      <RawMaterialsPage
        initialMaterials={initialMaterials}
        initialPage={initialPage}
      />
    </>
  )
}

export default page
