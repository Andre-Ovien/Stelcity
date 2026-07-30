import React from 'react'
import TrainingPage from './TrainingPage'
import BreadcrumbSchema from '../components/BreadcrumbSchema'
import StructuredData from '../components/StructuredData'

export const metadata = {
  title: 'Skincare Training in Lagos & Online',
  description: 'Join practical skincare training in Lagos or online. Learn skin concerns, routine building, treatment techniques and product formulation with Stelcity.',
  alternates: { canonical: '/training-programs' },
  openGraph: {
    title: 'Skincare Training in Lagos & Online | Stelcity',
    description: 'Build practical skincare knowledge and treatment skills through a focused two-week programme.',
    url: '/training-programs',
    images: [{ url: '/images/og-banner.jpg', width: 1200, height: 634 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Skincare Training in Lagos & Online | Stelcity',
    description: 'Build practical skincare knowledge and treatment skills in a focused two-week programme.',
    images: ['/images/og-banner.jpg'],
  },
}

const page = () => {
  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    '@id': 'https://www.stelcity.com/training-programs#course',
    name: 'Advanced Skincare Training Program',
    description:
      'A practical two-week skincare programme covering acne, hyperpigmentation, skin types, routine building, ingredients and treatment techniques.',
    url: 'https://www.stelcity.com/training-programs',
    provider: {
      '@id': 'https://www.stelcity.com/#organization',
    },
    offers: [
      {
        '@type': 'Offer',
        category: 'Online training',
        price: 300000,
        priceCurrency: 'NGN',
        url: 'https://www.stelcity.com/training-programs',
      },
      {
        '@type': 'Offer',
        category: 'In-person training',
        price: 700000,
        priceCurrency: 'NGN',
        url: 'https://www.stelcity.com/training-programs',
      },
    ],
    hasCourseInstance: [
      {
        '@type': 'CourseInstance',
        courseMode: 'Online',
      },
      {
        '@type': 'CourseInstance',
        courseMode: 'Onsite',
        location: {
          '@type': 'Place',
          name: 'Stelcity',
          address: {
            '@type': 'PostalAddress',
            streetAddress:
              'No 430 Jida Plaza, Opp Redeem Church, Agbara Bus Stop, Along Badagry Express Way',
            addressRegion: 'Lagos State',
            addressCountry: 'NG',
          },
        },
      },
    ],
  }

  return (
    <>
      <StructuredData data={courseSchema} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Skincare Training', url: '/training-programs' },
        ]}
      />
      <TrainingPage/>
    </>
  )
}

export default page
