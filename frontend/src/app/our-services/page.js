import React from 'react'
import ServicesPage from './ServicesPage'


export const metadata = {
  title: 'Skincare Services',
  description: 'Professional facial treatments, skincare consultations and spa services in Lagos Nigeria.',
  alternates: { canonical: 'https://www.stelcity.com/our-services' },
  openGraph: {
    title: 'Skincare Services | Stelcity',
    url: 'https://www.stelcity.com/our-services',
    images: [{ url: '/images/og-banner.png', width: 1200, height: 630 }],
  },
}
const page = () => {
  return (
    <ServicesPage />
  )
}

export default page