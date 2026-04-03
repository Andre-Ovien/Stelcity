"use client"
export const dynamic = 'force-dynamic'
import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import Header from "../../components/Header"
import { useCartStore } from "../../store/cartStore"
import { useAuthStore } from "../../store/authStore"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

function CheckoutSuccessContent() {
  const clearCart = useCartStore((s) => s.clearCart)
  const token = useAuthStore((s) => s.token)
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState("verifying")
  const [orderId, setOrderId] = useState(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setHydrated(true), 800) // give store time to rehydrate
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!hydrated) return

    // Read token directly from localStorage — avoids stale closure issue
    const rawToken = JSON.parse(localStorage.getItem("auth-storage"))?.state?.token

    const reference = searchParams.get("reference") || searchParams.get("transaction_ref")

    if (!reference || !rawToken) {
      setStatus("failed")
      return
    }

    let attempts = 0
    const maxAttempts = 8
    let timeoutId

    const check = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/products/payment/verify/${reference}/`, {
          headers: { Authorization: `Bearer ${rawToken}` },
        })
        const data = await res.json()

        console.log("Verify response:", data)

        const isSuccess =
          data.status === "success" ||
          data.order_status === "confirmed" ||
          data.payment_status === "success"

        if (isSuccess) {
          clearCart()
          setOrderId(data.order_id || null)
          setStatus("success")
        } else if (attempts < maxAttempts) {
          attempts++
          timeoutId = setTimeout(check, 2000)
        } else {
          setStatus("failed")
        }
      } catch {
        setStatus("failed")
      }
    }

    check()
    return () => clearTimeout(timeoutId)
  }, [hydrated, searchParams, clearCart])

  if (status === "verifying") return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-8 h-8 rounded-full border-2 border-[#D65A5A] border-t-transparent animate-spin" />
      <p className="text-[14px] text-gray-500">Verifying your payment...</p>
    </div>
  )

  if (status === "failed") return (
    <div className="flex flex-col items-center justify-center px-6 py-20 gap-5">
      <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
        <span className="text-[40px]">❌</span>
      </div>
      <div className="text-center">
        <h1 className="text-[22px] font-bold text-gray-900 mb-2">Payment Failed</h1>
        <p className="text-[13px] text-gray-500 leading-relaxed">
          We could not verify your payment. If you were charged, please contact support.
        </p>
      </div>
      <div className="flex flex-col gap-3 w-full max-w-sm mt-4">
        <button
          onClick={() => router.push("/checkout")}
          className="w-full bg-[#D65A5A] text-white font-semibold py-3 rounded-full text-[14px] hover:bg-[#c44f4f] transition-colors text-center"
        >
          Try Again
        </button>
        <Link href="/products" className="w-full border border-gray-300 text-gray-700 font-medium py-3 rounded-full text-[14px] hover:bg-white transition-colors text-center">
          Continue Shopping
        </Link>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 gap-5">
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
        <span className="text-[40px]">✅</span>
      </div>
      <div className="text-center">
        <h1 className="text-[22px] font-bold text-gray-900 mb-2">Order Placed!</h1>
        <p className="text-[13px] text-gray-500 leading-relaxed">
          Your payment was successful and your order has been placed.
        </p>
      </div>
      <div className="flex flex-col gap-3 w-full max-w-sm mt-4">
        {orderId && (
          <Link href={`/profile/orders/${orderId}/tracking`} className="w-full bg-[#D65A5A] text-white font-semibold py-3 rounded-full text-[14px] hover:bg-[#c44f4f] transition-colors text-center">
            Track My Order
          </Link>
        )}
        <Link
          href="/profile/orders"
          className={`w-full font-semibold py-3 rounded-full text-[14px] transition-colors text-center ${
            orderId ? "border border-gray-300 text-gray-700 hover:bg-white" : "bg-[#D65A5A] text-white hover:bg-[#c44f4f]"
          }`}
        >
          View My Orders
        </Link>
        <Link href="/products" className="w-full border border-gray-300 text-gray-700 font-medium py-3 rounded-full text-[14px] hover:bg-white transition-colors text-center">
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-[#D6E4D3]">
      <Header />
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-[#D65A5A] border-t-transparent animate-spin" />
          <p className="text-[14px] text-gray-500">Loading...</p>
        </div>
      }>
        <CheckoutSuccessContent />
      </Suspense>
    </div>
  )
}