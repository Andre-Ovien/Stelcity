import React from 'react'
import ServicesPage from './ServicesPage'
import Footer from '../components/Footer'
import BreadcrumbSchema from '../components/BreadcrumbSchema'
import { getServices } from '../lib/services'


export const metadata = {
  title: 'Beauty Services & Treatment Menu in Lagos',
  description: 'Browse the Stelcity beauty-service menu, treatment categories and pricing, with appointment requests available for the Agbara studio.',
  alternates: { canonical: '/our-services' },
  openGraph: {
    title: 'Beauty Services & Treatment Menu in Lagos | Stelcity',
    description: 'Browse treatment categories, pricing and appointment options for the Stelcity studio in Agbara.',
    url: '/our-services',
    images: [{ url: '/images/og-banner.jpg', width: 1200, height: 634 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Beauty Services & Treatment Menu in Lagos | Stelcity',
    description: 'Browse treatment categories, pricing and appointment options for the Stelcity studio in Agbara.',
    images: ['/images/og-banner.jpg'],
  },
}
const page = async () => {
  const initialServices = await getServices()

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Beauty Services", url: "/our-services" },
        ]}
      />
      <ServicesPage initialServices={initialServices} />
      <Footer />
    </>
  )
}

export default page
