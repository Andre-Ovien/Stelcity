import React from 'react'
import Hero from './components/Hero'

import RoutineIntro from './components/RoutineIntro'
import CollectionFeature from './components/CollectionFeature'
import RawMaterialsFeature from './components/RawMaterialsFeature'
import Footer from './components/Footer'
import ClientReviews from './components/ClientReview'

export const metadata = {
  title: {
    absolute: "Skincare Products & Beauty Services in Nigeria | Stelcity",
  },
  description:
    "Shop skincare products and raw materials, book professional beauty treatments in Lagos, and explore practical skincare training with Stelcity.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Skincare Products & Beauty Services in Nigeria | Stelcity",
    description:
      "Shop skincare products and raw materials, book professional beauty treatments, and explore skincare training with Stelcity.",
    url: "/",
  },
}

const page = () => {
  return (
    <div>
      <div>
        <Hero/>
        <RoutineIntro/>
        <CollectionFeature/>
        <RawMaterialsFeature/>
        <ClientReviews/>
        
        <Footer/>
        
        
      </div>
    </div>
  )
}

export default page
