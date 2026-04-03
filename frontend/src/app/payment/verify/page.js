import React from 'react'

import VerifyPage from './Verify'


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
    <VerifyPage />
  )
}

export default page