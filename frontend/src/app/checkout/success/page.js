import React from 'react'

import CheckoutSuccessPage from './CheckoutSuccessPAge'
export const metadata = {
  title: "Order Successful | Stelcity",
  description: "Your order has been placed successfully. Thank you for shopping with Stelcity.",
  robots: {
    index: false,
    follow: false,
  },
}
const page = () => {
  return (
    <CheckoutSuccessPage />
  )
}

export default page