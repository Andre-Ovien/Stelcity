"use client"

import { useEffect } from "react"
import Link from "next/link"
import Header from "../../components/Header"
import { useCartStore } from "../../store/cartStore"

export default function CheckoutSuccessPage() {
  const clearCart = useCartStore((s) => s.clearCart)

  useEffect(() => {
    clearCart()
  }, [])

  return (
    <div className="min-h-screen bg-[#D6E4D3]">
      <Header />

      <div className="flex flex-col items-center justify-center px-6 py-20 gap-5">

        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
          <span className="text-[40px]">✅</span>
        </div>

        <div className="text-center">
          <h1 className="text-[22px] font-bold text-gray-900 mb-2">
            Order Placed!
          </h1>
          <p className="text-[13px] text-gray-500 leading-relaxed">
            Your payment was successful and your order has been placed. You can track your order in your profile.
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-sm mt-4">
          <Link
            href="/profile/orders"
            className="w-full bg-[#D65A5A] text-white font-semibold py-3 rounded-full text-[14px] hover:bg-[#c44f4f] transition-colors text-center"
          >
            View My Orders
          </Link>
          <Link
            href="/products"
            className="w-full border border-gray-300 text-gray-700 font-medium py-3 rounded-full text-[14px] hover:bg-white transition-colors text-center"
          >
            Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  )
}