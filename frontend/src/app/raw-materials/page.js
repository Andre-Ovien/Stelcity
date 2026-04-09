import React from 'react'
import RawMaterialsPage from './RawMaterialsPage'

export const metadata = {
  title: 'Skincare Raw Materials',
  description: 'Source high quality skincare raw materials in Nigeria. Trusted by formulators and beauty brands.',
  alternates: { canonical: 'https://www.stelcity.com/raw-materials' },
  openGraph: {
    title: 'Skincare Raw Materials | Stelcity',
    url: 'https://www.stelcity.com/raw-materials',
    images: [{ url: '/images/og-banner.png', width: 1200, height: 630 }],
  },
}
const page = () => {
  return (
    <RawMaterialsPage/>
  )
}

export default page