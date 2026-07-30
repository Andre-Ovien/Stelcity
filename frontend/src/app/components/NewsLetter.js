"use client"

import { ArrowUpRight } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

const validateEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const Newsletter = ({ variant = "light" }) => {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const isDark = variant === "dark"

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

      const data = await res.json().catch(() => ({}))

      
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

  if (variant === "journal") {
    return (
      <div>
        <p className="max-w-[480px] text-[15px] font-black leading-6 tracking-[-0.02em] sm:text-base" style={{ color: "#1d241e" }}>
          Subscribe to our newsletter for thoughtful skincare notes.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSubscribe()
          }}
          className="mt-5 grid max-w-[520px] gap-2 sm:grid-cols-[minmax(0,1fr)_auto]"
        >
          <label
            className="flex h-12 min-w-0 items-center rounded-full border bg-[#fffdf9] px-4 text-left transition focus-within:border-[#798477] focus-within:ring-2 focus-within:ring-[#798477]/10"
            style={{ borderColor: "#cfd5cb" }}
          >
            <span className="sr-only">Email address</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              disabled={loading}
              className="w-full bg-transparent text-sm font-bold outline-none disabled:opacity-50"
              style={{ color: "#1d241e" }}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="group inline-flex h-12 items-center justify-center gap-3 rounded-full px-6 text-[10px] font-black uppercase tracking-[0.1em] transition hover:-translate-y-0.5 disabled:opacity-60"
            style={{ backgroundColor: "#1d241e", color: "#ffffff" }}
          >
            {loading ? "Joining" : "Get updates"}
            <ArrowUpRight
              className="h-4 w-4 transition group-hover:translate-x-1 group-hover:-translate-y-1"
              aria-hidden="true"
            />
          </button>
        </form>
      </div>
    )
  }

  if (isDark) {
    return (
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/45">Newsletter</p>
        <h2 className="mt-4 max-w-[520px] text-[32px] font-black leading-[0.98] tracking-[-0.055em] text-white sm:text-[44px]">
          Skin notes, without the noise.
        </h2>
        <p className="mt-4 max-w-[510px] text-sm leading-6 text-white/60 sm:text-[15px]">
          Occasional routines, ingredient know-how, and early news from Stelcity.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSubscribe()
          }}
          className="mt-7 flex max-w-[580px] flex-col gap-2 rounded-[14px] border border-white/15 bg-white/5 p-1.5 sm:flex-row sm:items-center"
        >
          <label className="flex min-h-12 flex-1 items-center px-4 text-left">
            <span className="sr-only">Email address</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              disabled={loading}
              className="w-full bg-transparent text-sm font-bold text-white outline-none placeholder:text-white/35 disabled:opacity-50"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="group inline-flex h-12 items-center justify-center gap-3 rounded-[10px] bg-[#f5f2eb] px-5 text-xs font-black text-[#111111] transition hover:bg-[#eaff51] disabled:opacity-60 sm:px-6"
          >
            {loading ? "Joining" : "Subscribe"}
            <ArrowUpRight
              className="h-4 w-4 transition group-hover:translate-x-1 group-hover:-translate-y-1"
              aria-hidden="true"
            />
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="text-center">
      <h2 className="mx-auto max-w-[760px] text-[34px] font-semibold leading-[1.05] tracking-normal text-[#241b18] sm:text-[48px] lg:text-[60px]">
        Stay Ahead with Skin
        <span className="block font-serif italic font-normal text-[#7f4f40]">
          Insights and Updates
        </span>
      </h2>

      <p className="mx-auto mt-5 max-w-[560px] text-sm leading-6 text-[#7b6257] sm:text-base">
        Subscribe for glow notes, product drops, skincare tips, and early
        access to Stelcity offers.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubscribe()
        }}
        className="mx-auto mt-8 flex max-w-[620px] flex-col gap-2 rounded-[28px] border border-[#241b18] bg-[#fffaf4] p-1.5 shadow-[10px_12px_0_rgba(36,27,24,0.07)] sm:flex-row sm:items-center sm:rounded-full"
      >
        <label className="flex min-h-12 flex-1 items-center px-4 text-left sm:px-6">
          <span className="sr-only">Email address</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            disabled={loading}
            className="w-full bg-transparent text-[17px] font-black tracking-normal text-[#241b18] outline-none placeholder:text-[#8b877f] disabled:opacity-50 sm:text-[20px]"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="group inline-flex h-12 items-center justify-center gap-3 rounded-full bg-[#0d1711] px-6 text-[16px] font-black text-white transition hover:-translate-y-0.5 hover:bg-[#0f8a64] disabled:translate-y-0 disabled:opacity-60 sm:h-[58px] sm:px-7 sm:text-[18px]"
        >
          {loading ? "Joining" : "Join the list"}
          <ArrowUpRight
            className="h-5 w-5 transition group-hover:translate-x-1 group-hover:-translate-y-1"
            aria-hidden="true"
          />
        </button>
      </form>
    </div>
  )
}

export default Newsletter
