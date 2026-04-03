"use client"
export const dynamic = 'force-dynamic'
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Pencil } from "lucide-react"
import Header from "../components/Header"
import { useCartStore } from "../store/cartStore"
import { useAuthStore } from "../store/authStore"
import { createCheckout } from "../lib/checkout"
import { getShippingAddress } from "../lib/profile"
import toast from "react-hot-toast"
import { handleSessionExpiry } from "../lib/handleSessionExpiry"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items)
  const token = useAuthStore((s) => s.token)
  const softLogout = useAuthStore((s) => s.softLogout)
  const isAuth = useAuthStore((s) => s.isAuth)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [address, setAddress] = useState(null)
  const [addressLoading, setAddressLoading] = useState(true)
  const [deliveryFee, setDeliveryFee] = useState(null)
  const [deliveryLoading, setDeliveryLoading] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  const addressFetched = useRef(false)

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = subtotal + (deliveryFee || 0)

  const hasValidAddress = address &&
    address.street_address?.trim() &&
    address.city?.trim() &&
    address.state?.trim()

  useEffect(() => {
    const timer = setTimeout(() => setHydrated(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!token || addressFetched.current) return
    addressFetched.current = true
    getShippingAddress(token)
      .then((data) => {
        setAddress(data)
        setAddressLoading(false)
      })
      .catch((err) => {
        if (err.message === "SESSION_EXPIRED") {
          toast.error("Your session has expired. Please log in again.")
          handleSessionExpiry(router, softLogout, "/checkout")
        }
        setAddressLoading(false)
      })
  }, [token,router, softLogout])

  useEffect(() => {
    if (!address?.state?.trim() || !address?.city?.trim()) {
      setDeliveryFee(null)
      return
    }
    const stateKey = address.state.toLowerCase().trim()
    const cityKey = address.city.toLowerCase().trim()
    const cacheKey = `delivery_fee_${stateKey}_${cityKey}`
    const cached = sessionStorage.getItem(cacheKey)
    if (cached !== null) {
      setDeliveryFee(Number(cached))
      return
    }
    setDeliveryLoading(true)
    fetch(`${BASE_URL}/api/products/delivery-fee/?state=${encodeURIComponent(stateKey)}&city=${encodeURIComponent(cityKey)}`)
      .then((res) => res.json())
      .then((data) => {
        const fee = typeof data.delivery_fee === "number" ? data.delivery_fee : 0
        setDeliveryFee(fee)
        sessionStorage.setItem(cacheKey, String(fee))
        setDeliveryLoading(false)
      })
      .catch(() => {
        setDeliveryFee(0)
        setDeliveryLoading(false)
      })
  }, [address?.state, address?.city])

  const handlePay = async () => {
    if (!token || !isAuth) {
      toast.error("Your session has expired. Please log in again.")
      handleSessionExpiry(router, softLogout, "/checkout")
      return
    }
    if (items.length === 0) {
      toast.error("Your cart is empty")
      router.push("/products")
      return
    }
    if (!hasValidAddress) {
      toast.error("Please add a shipping address first")
      router.push("/profile/shipping?redirect=/checkout")
      return
    }
    setLoading(true)
    try {
      const orderItems = items.map((item) => {
        const obj = {
          product_id: typeof item.id === "string" && item.id.includes("-")
            ? parseInt(item.id.split("-")[0])
            : parseInt(item.id),
          quantity: item.quantity,
        }
        if (item.variantId) obj.variant_id = item.variantId
        return obj
      })
      const data = await createCheckout(orderItems, token, address.state, address.city)
      if (!data.authorization_url) throw new Error("Payment initialization failed")
      window.location.href = data.authorization_url
    } catch (err) {
      if (err.message === "SESSION_EXPIRED") {
        toast.error("Your session has expired. Please log in again.")
        handleSessionExpiry(router, softLogout, "/checkout")
        return
      }
      toast.error(err.message || "Something went wrong, please try again")
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#D6E4D3]">
        <Header />
        <div className="flex flex-col items-center justify-center py-24 px-6 gap-4">
          <span className="text-[60px]">🛒</span>
          <h2 className="text-[18px] font-bold text-gray-800">Your cart is empty</h2>
          <p className="text-[13px] text-gray-500 text-center">
            Add items to your cart before checking out.
          </p>
          <button
            onClick={() => router.push("/products")}
            className="bg-[#D65A5A] text-white font-semibold px-8 py-3 rounded-full text-[14px] hover:bg-[#c44f4f] transition-colors"
          >
            Shop Now
          </button>
        </div>
      </div>
    )
  }

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-[#D6E4D3]">
        <Header />
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 rounded-full border-2 border-[#D65A5A] border-t-transparent animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#D6E4D3] py-0">
      <Header />

  
      <div className="px-4 md:px-8 lg:px-16 pb-36 md:pb-10">
        <h1 className="text-[22px] font-bold text-gray-900 text-center mb-6">
          Checkout
        </h1>

        <div className="flex flex-col md:flex-row md:gap-6 md:items-start max-w-5xl mx-auto">

         
          <div className="flex-1 flex flex-col gap-4">

            
            <div className="bg-white rounded-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-[14px] font-semibold text-gray-800">Shipping Info</h2>
                <button
                  onClick={() => router.push("/profile/shipping?redirect=/checkout")}
                  className="text-gray-400 hover:text-[#D65A5A] transition-colors"
                >
                  <Pencil size={15} />
                </button>
              </div>

              {addressLoading ? (
                <div className="px-4 py-4 animate-pulse flex flex-col gap-2">
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              ) : hasValidAddress ? (
                <div className="px-4 py-4 flex flex-col gap-1.5">
                  <div className="flex gap-2">
                    <span className="text-[12px] text-gray-400 w-24 shrink-0">Address</span>
                    <span className="text-[12px] text-gray-700">{address.street_address}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-[12px] text-gray-400 w-24 shrink-0">City</span>
                    <span className="text-[12px] text-gray-700">{address.city}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-[12px] text-gray-400 w-24 shrink-0">State</span>
                    <span className="text-[12px] text-gray-700">{address.state}</span>
                  </div>
                  {address.postal_code && (
                    <div className="flex gap-2">
                      <span className="text-[12px] text-gray-400 w-24 shrink-0">Postal Code</span>
                      <span className="text-[12px] text-gray-700">{address.postal_code}</span>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => router.push("/profile/shipping?redirect=/checkout")}
                  className="w-full px-4 py-4 flex items-center text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-[13px] text-[#D65A5A] font-medium">
                    + Add shipping address
                  </span>
                </button>
              )}
            </div>

          
            <div className="bg-white rounded-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <h2 className="text-[14px] font-semibold text-gray-800">Order Summary</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#EEF5EE]">
                          <span className="text-[18px]">✨</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-gray-800 truncate">{item.name}</p>
                      {item.variant && <p className="text-[11px] text-gray-400">{item.variant}</p>}
                      <p className="text-[11px] text-gray-500">x{item.quantity}</p>
                    </div>
                    <p className="text-[13px] font-semibold text-gray-800 shrink-0">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          
          <div className="md:w-[320px] lg:w-90 flex flex-col gap-4">

            
            <div className="bg-white rounded-2xl px-5 py-4 flex flex-col gap-2 mt-5 md:mt-0">
              <div className="flex justify-between items-center">
                <span className="text-[13px] text-gray-500">Subtotal</span>
                <span className="text-[13px] text-gray-700 font-medium">₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[13px] text-gray-500">Delivery</span>
                {deliveryLoading ? (
                  <div className="h-3 bg-gray-200 rounded w-16 animate-pulse" />
                ) : (
                  <span className="text-[13px] text-gray-700 font-medium">
                    {deliveryFee !== null ? `₦${deliveryFee.toLocaleString()}` : "—"}
                  </span>
                )}
              </div>
              <div className="h-px bg-gray-100 my-1" />
              <div className="flex justify-between items-center">
                <span className="text-[15px] font-bold text-gray-900">Total</span>
                {deliveryLoading ? (
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                ) : (
                  <span className="text-[15px] font-bold text-[#D65A5A]">₦{total.toLocaleString()}</span>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl px-5 py-4">
              <p className="text-[13px] text-gray-500 text-center leading-relaxed">
                You will be redirected to Squad to complete your payment securely.
              </p>
            </div>

            
            <div className=" hidden sm:block bg-gray-50 text-gray-600 text-[12px] text-center py-3 px-4 rounded-2xl border border-gray-200">
              Estimated Delivery: Lagos – within 24 hours.<br />Outside Lagos – 2 – 3 business days.
            </div>

            
            <button
              onClick={handlePay}
              disabled={loading || deliveryLoading}
              className="hidden md:block w-full bg-[#D65A5A] text-white font-semibold py-3 rounded-full text-[14px] hover:bg-[#c44f4f] transition-colors disabled:opacity-60"
            >
              {loading ? "Processing..." : `Pay ₦${total.toLocaleString()}`}
            </button>

          </div>
        </div>
      </div>

      
      <div className="md:hidden fixed bottom-16 left-0 right-0 bg-gray-50 text-gray-600 text-[12px] text-center py-2 px-4 border-t border-b border-gray-200 z-50">
        Estimated Delivery: Lagos- within 24 hours. Outside Lagos- 2-3 business days.
      </div>

      
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 z-50">
        <button
          onClick={handlePay}
          disabled={loading || deliveryLoading}
          className="w-full bg-[#D65A5A] text-white font-semibold py-3 rounded-full text-[14px] hover:bg-[#c44f4f] transition-colors disabled:opacity-60"
        >
          {loading ? "Processing..." : `Pay ₦${total.toLocaleString()}`}
        </button>
      </div>
    </div>
  )
}