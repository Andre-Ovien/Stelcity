import React from 'react'
import CartPage from './CartPage'

export const metadata = {
  title: "Your Cart",
  description: "Review your selected skincare products and proceed to checkout.",
  robots: {
    index: false,
    follow: false,
  },
}

const Page = () => {
  return (
    <div>
      <CartPage />
    </div>
  )
}

export default Page
