import React from 'react'
import ServicesPage from './ServicesPage'
import Footer from '../components/Footer'
import BreadcrumbSchema from '../components/BreadcrumbSchema'
import { getServices } from '../lib/services'


export const metadata = {
  title: 'Facial Treatments & Beauty Services in Lagos',
  description: 'Explore professional facial treatments, skincare consultations, body care and spa services from Stelcity in Lagos, Nigeria.',
  alternates: { canonical: '/our-services' },
  openGraph: {
    title: 'Facial Treatments & Beauty Services in Lagos | Stelcity',
    description: 'Explore professional facials, skincare consultations, body care and spa services.',
    url: '/our-services',
    images: [{ url: '/images/og-banner.jpg', width: 1200, height: 634 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Facial Treatments & Beauty Services in Lagos | Stelcity',
    description: 'Explore professional facials, skincare consultations, body care and spa services.',
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
