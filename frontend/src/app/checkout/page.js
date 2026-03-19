"use client"

import Header from "../components/Header"

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[#D6E4D3] py-6">
      <Header />

      <div className="px-4 pb-10">
        <h1 className="text-[22px] font-bold text-gray-900 text-center mb-6">
          Checkout
        </h1>

        <div className="flex flex-col gap-4">

          <div className="bg-white rounded-2xl px-5 py-4">
            <h2 className="text-[15px] font-semibold text-gray-800">
              Shipping Info
            </h2>
            <p className="text-[13px] text-gray-400 mt-1">Coming soon</p>
          </div>

          <div className="bg-white rounded-2xl px-5 py-4">
            <h2 className="text-[15px] font-semibold text-gray-800">
              Order Summary
            </h2>
            <p className="text-[13px] text-gray-400 mt-1">Coming soon</p>
          </div>

          <div className="bg-white rounded-2xl px-5 py-4">
            <h2 className="text-[15px] font-semibold text-gray-800">
              Payment Options
            </h2>
            <p className="text-[13px] text-gray-400 mt-1">Coming soon</p>
          </div>

        </div>
      </div>
    </div>
  )
}