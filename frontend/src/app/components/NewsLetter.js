"use client"

import { useState } from "react"

const Newsletter = () => {
  const [email, setEmail] = useState("")

  const handleSubscribe = () => {
    if (!email) return
    // 👉 replace with real API call later
    console.log("Subscribing:", email)
    setEmail("")
  }

  return (
    <section className="py-10 px-4 text-center">
      <h2 className="text-[22px] font-bold text-gray-900">Want Updates?</h2>
      <p className="text-[13px] text-gray-500 mt-1 max-w-sm mx-auto">
        Join our community and get skincare tips, special discounts, and early access to new products.
      </p>

      <div className="flex items-center bg-white border border-gray-200 rounded-full px-3 py-1 mt-5 max-w-sm mx-auto shadow-sm">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          className="flex-1 text-[13px] text-gray-700 bg-transparent outline-none px-2 py-1"
        />
        <button
          onClick={handleSubscribe}
          className="bg-[#D65A5A] text-white text-[13px] font-medium px-4 py-2 rounded-full hover:bg-[#c44f4f] transition-colors"
        >
          Subscribe
        </button>
      </div>
    </section>
  )
}

export default Newsletter