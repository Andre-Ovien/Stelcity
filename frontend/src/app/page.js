import React from 'react'
import Hero from './components/Hero'

import ProductGrid from './components/ProductGrid'
import BestSellers from './components/BestSellers'
import Why from './components/Why'
import Newsletter from './components/NewsLetter'
import Footer from './components/Footer'
import ClientReviews from './components/ClientReview'


const page = () => {
  return (
    <div>
      <div>
        <Hero/>
        <ProductGrid/>
        <BestSellers/>
        <ClientReviews/>
        <Why/>
        
        <Newsletter/>
        <Footer/>
        
        
      </div>
    </div>
  )
}

export default page