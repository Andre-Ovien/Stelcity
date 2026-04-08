import React from 'react'
import TrainingPage from './TrainingPage'

export const metadata = {
  title: 'Beauty & Skincare Training',
  description: 'Learn skincare formulation and beauty techniques with Stelcity expert-led training programs in Nigeria.',
  alternates: { canonical: 'https://www.stelcity.com/training-programs' },
  openGraph: {
    title: 'Beauty & Skincare Training | Stelcity',
    url: 'https://www.stelcity.com/training-programs',
    images: [{ url: '/images/og-banner.jpeg', width: 1200, height: 630 }],
  },
}

const page = () => {
  return (
    <TrainingPage/> 
  )
}

export default page