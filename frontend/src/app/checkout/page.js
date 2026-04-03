import React from 'react'
import CheckoutPage from './CheckoutPage'

export const metadata = {
  title: "Checkout | Stelcity",
  description: "Complete your purchase securely and get your skincare products delivered.",
  robots: {
    index: false,
    follow: false,
  },
}

const page = () => {
  return (
    <div>
      <CheckoutPage />
    </div>
  )
}

export default page