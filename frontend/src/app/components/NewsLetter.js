"use client"

import { useState } from "react"
import toast from "react-hot-toast"

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const Newsletter = () => {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async () => {
    if (!email.trim()) {
      toast.error("Please enter your email address")
      return
    }

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address")
      return
    }

    setLoading(true)
    try {
      // TODO: replace with real API call when backend is ready
      // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/newsletter/subscribe/`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email }),
      // })
      // if (!res.ok) throw new Error("Failed to subscribe")

      await new Promise((r) => setTimeout(r, 800)) // remove this when API is ready
      toast.success("You're subscribed")
      setEmail("")
    } catch (err) {
      toast.error("Something went wrong, please try again")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubscribe()
  }

  return (
    <section className="py-10 px-5 text-center">
      <h2 className="text-[22px] 2xl:text-[28px] font-bold text-gray-900">
        Want Updates?
      </h2>
      <p className="text-[13px] 2xl:text-[16px] text-gray-500 mt-1 max-w-sm mx-auto 2xl:max-w-lg">
        Join our community and get skincare tips, special discounts, and early access to new products.
      </p>

      <div className="flex items-center bg-white border border-gray-200 rounded-full px-3 py-1 mt-5 max-w-sm mx-auto shadow-sm 2xl:max-w-lg">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Email Address"
          disabled={loading}
          className="flex-1 text-[13px] 2xl:text-[16px] text-gray-700 bg-transparent outline-none px-2 py-1 disabled:opacity-50"
        />
        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="bg-[#D65A5A] text-white text-[13px] 2xl:text-[16px] font-medium px-4 py-2 rounded-full hover:bg-[#c44f4f] transition-colors disabled:opacity-60"
        >
          {loading ? "..." : "Subscribe"}
        </button>
      </div>
    </section>
  )
}

export default Newsletter