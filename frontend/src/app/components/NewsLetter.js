"use client"

import { useState } from "react"
import toast from "react-hot-toast"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

const validateEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const Newsletter = () => {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async () => {
    if (!BASE_URL) {
      console.error("BASE_URL not set")
      toast.error("Configuration error")
      return
    }

    if (!email.trim()) {
      toast.error("Enter your email")
      return
    }

    if (!validateEmail(email)) {
      toast.error("Enter a valid email")
      return
    }

    if (loading) return

    setLoading(true)

    try {
      const res = await fetch(
        `${BASE_URL}/api/auth/newsletter/subscribe/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      )

      const data = await res.json()

      
      if (res.status === 201) {
        toast.success("Subscribed successfully")
        setEmail("")
        return
      }

      
      if (data?.email?.[0]) {
        const message = data.email[0]

        if (message.includes("already exists")) {
          toast.success("You're already subscribed")
          setEmail("")
        } else {
          toast.error(message)
        }
        return
      }

      toast.error(data.detail || "Subscription failed")
    } catch (err) {
      console.error(err)
      toast.error("Network error. Try again")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubscribe()
  }

  return (
    <section className="py-10 px-5 text-center">
      <h2 className="text-[22px] font-bold text-gray-900">
        Want Updates?
      </h2>

      <p className="text-[13px] text-gray-500 mt-1 max-w-sm mx-auto">
        Join our community to get skincare tips, special discounts, and early access to new products.
      </p>

      <div className="flex items-center bg-white border border-gray-200 rounded-full px-3 py-1 mt-5 max-w-sm mx-auto shadow-sm">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Email Address"
          disabled={loading}
          className="flex-1 text-[13px] text-gray-700 bg-transparent outline-none px-2 py-1 disabled:opacity-50"
        />

        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="bg-[#D65A5A] text-white text-[13px] font-medium px-4 py-2 rounded-full disabled:opacity-60"
        >
          {loading ? "..." : "Subscribe"}
        </button>
      </div>
    </section>
  )
}

export default Newsletter