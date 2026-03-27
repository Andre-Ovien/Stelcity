"use client"

import { useState, useEffect } from "react"

export default function LoadingBoundary({ children, fallback, timeout = 10000 }) {
  const [timedOut, setTimedOut] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), timeout)
    return () => clearTimeout(timer)
  }, [timeout])

  if (timedOut) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-20">
        <span className="text-[50px] mb-4">⚠️</span>
        <h2 className="text-[18px] font-bold text-gray-800 mb-2">
          Taking longer than expected
        </h2>
        <p className="text-[13px] text-gray-500 text-center mb-6">
          The server might be waking up. This can take up to 2 minutes on the first request.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-[#D65A5A] text-white font-semibold px-6 py-2.5 rounded-full text-[13px] hover:bg-[#c44f4f] transition-colors"
        >
          Refresh Page
        </button>
      </div>
    )
  }

  return children
}