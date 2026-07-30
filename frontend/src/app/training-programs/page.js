import React from 'react'
import TrainingPage from './TrainingPage'
import BreadcrumbSchema from '../components/BreadcrumbSchema'
import StructuredData from '../components/StructuredData'
import { BUSINESS, SITE_URL } from '../lib/site'

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
    '@id': `${SITE_URL}/training-programs#course`,
    name: 'Advanced Skincare Training Program',
    description:
      'A practical two-week skincare programme covering acne, hyperpigmentation, skin types, routine building, ingredients and treatment techniques.',
    url: `${SITE_URL}/training-programs`,
    provider: {
      '@id': `${SITE_URL}/#organization`,
    },
    offers: [
      {
        '@type': 'Offer',
        category: 'Online training',
        price: 300000,
        priceCurrency: 'NGN',
        url: `${SITE_URL}/training-programs`,
      },
      {
        '@type': 'Offer',
        category: 'In-person training',
        price: 700000,
        priceCurrency: 'NGN',
        url: `${SITE_URL}/training-programs`,
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
            streetAddress: BUSINESS.streetAddress,
            addressLocality: BUSINESS.locality,
            addressRegion: BUSINESS.region,
            addressCountry: BUSINESS.country,
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
