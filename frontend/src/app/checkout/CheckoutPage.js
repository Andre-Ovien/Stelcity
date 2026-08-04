"use client"

export const dynamic = "force-dynamic"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  CreditCard,
  LockKeyhole,
  MapPin,
  PackageCheck,
  Pencil,
  ShieldCheck,
  ShoppingBag,
  Store,
  Truck,
} from "lucide-react"
import Header from "../components/Header"
import { useCartStore } from "../store/cartStore"
import { useAuthStore } from "../store/authStore"
import { createCheckout } from "../lib/checkout"
import { getShippingAddress } from "../lib/profile"
import toast from "react-hot-toast"
import { handleSessionExpiry } from "../lib/handleSessionExpiry"
import { BUSINESS } from "../lib/site"
import {
  rememberPendingPurchase,
  trackInitiateCheckout,
} from "../lib/tiktok"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL
const SHOP_ADDRESS = BUSINESS.address

function formatNaira(value) {
  const amount = Number(value)
  return `₦${(Number.isFinite(amount) ? amount : 0).toLocaleString()}`
}

function CheckoutItemImage({ item }) {
  const [imageError, setImageError] = useState(false)

  if (!item.image || imageError) {
    return (
      <div className="grid h-full w-full place-items-center bg-[#ece9e2]">
        <ShoppingBag className="h-5 w-5 text-[#817a72]" aria-hidden="true" />
      </div>
    )
  }

  return (
    <Image
      src={item.image}
      alt={item.name}
      fill
      sizes="72px"
      onError={() => setImageError(true)}
      className="object-cover"
    />
  )
}

function SectionHeading({ number, title, description, action }) {
  return (
    <div className="flex items-start justify-between gap-5 border-b border-[#e4e0d8] px-5 py-5 sm:px-7 sm:py-6">
      <div className="flex min-w-0 items-start gap-4">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#17130f] text-[10px] font-black text-white">
          {number}
        </span>
        <div>
          <h2 className="text-lg font-black tracking-[-0.025em] text-[#17130f] sm:text-xl">{title}</h2>
          {description && <p className="mt-1.5 text-xs leading-5 text-[#746e66] sm:text-sm">{description}</p>}
        </div>
      </div>
      {action}
    </div>
  )
}

function DeliveryOption({ active, description, Icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`group relative flex min-h-[146px] flex-col items-start justify-between overflow-hidden rounded-[22px] border p-5 text-left transition duration-200 ${
        active
          ? "border-[#17130f] bg-[#17130f] text-white shadow-[0_16px_35px_rgba(23,19,15,0.12)]"
          : "border-[#d9d4cb] bg-[#fffefb] text-[#17130f] hover:-translate-y-0.5 hover:border-[#8d877f]"
      }`}
    >
      <div className="flex w-full items-start justify-between gap-4">
        <span className={`grid h-10 w-10 place-items-center rounded-full ${active ? "bg-[#eaff51] text-[#17130f]" : "bg-[#f0eee9] text-[#68625b]"}`}>
          <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
        </span>
        <span className={`grid h-6 w-6 place-items-center rounded-full border ${active ? "border-[#eaff51] bg-[#eaff51] text-[#17130f]" : "border-[#c9c4bc] text-transparent"}`}>
          <Check className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </div>
      <div className="mt-6">
        <span className="block text-[15px] font-black">{label}</span>
        <span className={`mt-1.5 block text-xs leading-5 ${active ? "text-white/65" : "text-[#7d776f]"}`}>{description}</span>
      </div>
    </button>
  )
}

function AddressSkeleton() {
  return (
    <div className="animate-pulse p-5 sm:p-7">
      <div className="h-4 w-40 rounded-full bg-[#e8e5df]" />
      <div className="mt-4 h-3 w-3/4 rounded-full bg-[#eeece7]" />
      <div className="mt-2 h-3 w-1/2 rounded-full bg-[#eeece7]" />
    </div>
  )
}

function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#17130f]">
      <Header />
      <main className="px-4 pb-24 pt-8 sm:px-7 sm:pt-12 lg:px-10">
        <div className="mx-auto max-w-[1480px] animate-pulse">
          <div className="h-12 w-64 rounded-full bg-[#e8e5df]" />
          <div className="mt-5 h-4 w-80 max-w-full rounded-full bg-[#eeece7]" />
          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
            <div className="h-[560px] rounded-[28px] border border-[#dedbd4] bg-white" />
            <div className="h-[430px] rounded-[28px] bg-[#17130f]" />
          </div>
        </div>
      </main>
    </div>
  )
}

function EmptyCheckout() {
  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#17130f]">
      <Header />
      <main className="px-4 pb-24 pt-10 sm:px-7 lg:px-10">
        <section className="mx-auto grid min-h-[58vh] max-w-[1480px] place-items-center border-y border-[#dedbd4] text-center">
          <div className="max-w-md px-6">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#eaff51]">
              <ShoppingBag className="h-6 w-6" aria-hidden="true" />
            </span>
            <p className="mt-7 text-[10px] font-black uppercase tracking-[0.28em] text-[#8a837a]">Checkout</p>
            <h1 className="mt-4 font-serif text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">Your bag needs a little glow.</h1>
            <p className="mt-4 text-sm leading-6 text-[#746e66]">Add your favourites before continuing to checkout.</p>
            <Link href="/products" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#17130f] px-6 py-3.5 text-xs font-black text-white transition hover:bg-[#322c26]">
              Shop the collection
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items)
  const token = useAuthStore((state) => state.token)
  const softLogout = useAuthStore((state) => state.softLogout)
  const isAuth = useAuthStore((state) => state.isAuth)
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [address, setAddress] = useState(null)
  const [addressLoading, setAddressLoading] = useState(true)
  const [deliveryFee, setDeliveryFee] = useState(null)
  const [deliveryLoading, setDeliveryLoading] = useState(false)
  const [deliveryError, setDeliveryError] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [deliveryMethod, setDeliveryMethod] = useState("delivery")
  const addressFetched = useRef(false)
  const checkoutTracked = useRef(false)

  const subtotal = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const total = subtotal + (deliveryMethod === "delivery" ? (deliveryFee || 0) : 0)
  const hasValidAddress = Boolean(
    address?.street_address?.trim() &&
    address?.city?.trim() &&
    address?.state?.trim()
  )

  useEffect(() => {
    const timer = setTimeout(() => setHydrated(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!hydrated || items.length === 0 || checkoutTracked.current) return

    trackInitiateCheckout(items)
    checkoutTracked.current = true
  }, [hydrated, items])

  useEffect(() => {
    if (!token || addressFetched.current) return
    addressFetched.current = true

    getShippingAddress(token)
      .then((data) => {
        setAddress(data)
        setAddressLoading(false)
      })
      .catch((error) => {
        if (error.message === "SESSION_EXPIRED") {
          toast.error("Your session has expired. Please log in again.")
          handleSessionExpiry(router, softLogout, "/checkout")
        }
        setAddressLoading(false)
      })
  }, [router, softLogout, token])

  useEffect(() => {
    if (deliveryMethod === "pickup") {
      setDeliveryFee(null)
      setDeliveryError(false)
      setDeliveryLoading(false)
      return
    }

    if (!address?.state?.trim() || !address?.city?.trim()) {
      setDeliveryFee(null)
      setDeliveryError(false)
      setDeliveryLoading(false)
      return
    }

    const stateKey = address.state.toLowerCase().trim()
    const cityKey = address.city.toLowerCase().trim()
    const cacheKey = `delivery_fee_${stateKey}_${cityKey}`
    const cached = sessionStorage.getItem(cacheKey)

    if (cached !== null) {
      setDeliveryFee(Number(cached))
      setDeliveryError(false)
      setDeliveryLoading(false)
      return
    }

    const controller = new AbortController()
    let active = true

    setDeliveryLoading(true)
    setDeliveryError(false)
    fetch(
      `${BASE_URL}/api/products/delivery-fee/?state=${encodeURIComponent(stateKey)}&city=${encodeURIComponent(cityKey)}`,
      { signal: controller.signal }
    )
      .then(async (response) => {
        const data = await response.json().catch(() => ({}))
        if (!response.ok) throw new Error(data.detail || "Delivery fee request failed")
        return data
      })
      .then((data) => {
        const fee = Number(data.delivery_fee)
        if (!Number.isFinite(fee) || fee < 0) throw new Error("Invalid delivery fee")
        if (!active) return
        setDeliveryFee(fee)
        sessionStorage.setItem(cacheKey, String(fee))
        setDeliveryLoading(false)
      })
      .catch((error) => {
        if (!active || error.name === "AbortError") return
        setDeliveryFee(null)
        setDeliveryError(true)
        setDeliveryLoading(false)
      })

    return () => {
      active = false
      controller.abort()
    }
  }, [address?.city, address?.state, deliveryMethod])

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

    if (deliveryMethod === "delivery" && !hasValidAddress) {
      toast.error("Please add a shipping address first")
      router.push("/profile/shipping?redirect=/checkout")
      return
    }

    setLoading(true)
    try {
      const orderItems = items.map((item) => {
        const orderItem = {
          product_id: typeof item.id === "string" && item.id.includes("-")
            ? parseInt(item.id.split("-")[0])
            : parseInt(item.id),
          quantity: item.quantity,
        }
        if (item.variantId) orderItem.variant_id = item.variantId
        return orderItem
      })

      const data = await createCheckout(
        orderItems,
        token,
        deliveryMethod,
        deliveryMethod === "delivery" ? address.state : null,
        deliveryMethod === "delivery" ? address.city : null,
      )

      if (!data.authorization_url) throw new Error("Payment initialization failed")
      rememberPendingPurchase({
        reference: data.reference,
        orderId: data.order_id,
        amount: data.amount,
        items,
      })
      window.location.href = data.authorization_url
    } catch (error) {
      if (error.message === "SESSION_EXPIRED") {
        toast.error("Your session has expired. Please log in again.")
        handleSessionExpiry(router, softLogout, "/checkout")
        return
      }
      toast.error(error.message || "Something went wrong, please try again")
    } finally {
      setLoading(false)
    }
  }

  if (!hydrated) return <CheckoutLoading />
  if (items.length === 0) return <EmptyCheckout />

  const paymentDisabled = loading || (
    deliveryMethod === "delivery" && (deliveryLoading || deliveryError)
  )
  const paymentLabel = loading
    ? "Preparing payment..."
    : deliveryLoading && deliveryMethod === "delivery"
      ? "Calculating delivery..."
      : deliveryError && deliveryMethod === "delivery"
        ? "Delivery unavailable"
      : deliveryMethod === "delivery" && !hasValidAddress && !addressLoading
        ? "Add delivery address"
        : `Pay ${formatNaira(total)}`

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#17130f]">
      <Header />

      <main className="px-4 pb-32 pt-8 sm:px-7 sm:pt-12 lg:px-10 lg:pb-28">
        <div className="mx-auto max-w-[1480px]">
          <div className="flex flex-col gap-6 border-b border-[#dedbd4] pb-8 sm:flex-row sm:items-end sm:justify-between sm:pb-10">
            <div>
              <Link href="/cart" className="mb-5 inline-flex items-center gap-2 text-xs font-black text-[#68625b] transition hover:text-[#17130f]">
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                Back to your bag
              </Link>
              <h1 className="text-[42px] font-black leading-[0.9] tracking-[-0.055em] sm:text-[58px]">Checkout.</h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-[#746e66]">Choose how you’d like to receive your order, confirm the details, and complete payment securely.</p>
            </div>
            <div className="flex w-fit items-center gap-2 rounded-full border border-[#d8d4cc] bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#5e685a]">
              <LockKeyhole className="h-3.5 w-3.5 text-[#ba5f58]" aria-hidden="true" />
              Secure checkout
            </div>
          </div>

          <div className="mt-8 grid min-w-0 gap-8 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10 xl:gap-14">
            <div className="min-w-0 space-y-6">
              <section className="overflow-hidden rounded-[28px] border border-[#dedbd4] bg-white">
                <SectionHeading
                  number="01"
                  title="How should we get it to you?"
                  description="Select delivery to your address or collect from our Lagos store."
                />
                <div className="grid gap-3 p-4 sm:grid-cols-2 sm:gap-4 sm:p-6">
                  <DeliveryOption
                    active={deliveryMethod === "delivery"}
                    description="Delivered directly to your saved address"
                    Icon={Truck}
                    label="Home delivery"
                    onClick={() => setDeliveryMethod("delivery")}
                  />
                  <DeliveryOption
                    active={deliveryMethod === "pickup"}
                    description="Collect from our store after payment"
                    Icon={Store}
                    label="Store pickup"
                    onClick={() => setDeliveryMethod("pickup")}
                  />
                </div>
              </section>

              <section className="overflow-hidden rounded-[28px] border border-[#dedbd4] bg-white">
                <SectionHeading
                  number="02"
                  title={deliveryMethod === "delivery" ? "Delivery details" : "Pickup details"}
                  description={deliveryMethod === "delivery" ? "We’ll use this address for your order." : "Your order will be prepared at this location."}
                  action={deliveryMethod === "delivery" && !addressLoading ? (
                    <button
                      type="button"
                      onClick={() => router.push("/profile/shipping?redirect=/checkout")}
                      className="inline-flex h-9 shrink-0 items-center gap-2 rounded-full border border-[#d5d0c8] px-3 text-[10px] font-black text-[#17130f] transition hover:border-[#17130f]"
                    >
                      <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                      <span className="hidden sm:inline">{hasValidAddress ? "Edit" : "Add"} address</span>
                    </button>
                  ) : null}
                />

                {deliveryMethod === "delivery" ? (
                  addressLoading ? (
                    <AddressSkeleton />
                  ) : hasValidAddress ? (
                    <div className="p-5 sm:p-7">
                      <div className="flex items-start gap-4">
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#f3ded4] text-[#a24e48]">
                          <MapPin className="h-[18px] w-[18px]" aria-hidden="true" />
                        </span>
                        <address className="min-w-0 not-italic">
                          <p className="text-[15px] font-black text-[#17130f]">{address.full_name || "Delivery address"}</p>
                          <p className="mt-2 max-w-xl text-sm leading-6 text-[#6f6962]">
                            {address.street_address}, {address.city}, {address.state}
                            {address.postal_code ? ` ${address.postal_code}` : ""}
                          </p>
                          {address.phone_number && <p className="mt-2 text-xs font-bold text-[#7e776f]">{address.phone_number}</p>}
                        </address>
                      </div>
                      <div className="mt-6 flex items-center gap-2 border-t border-[#ece9e3] pt-5 text-xs text-[#657061]">
                        <Clock3 className="h-4 w-4 text-[#a24e48]" aria-hidden="true" />
                        Lagos orders typically arrive within 24 hours; other locations take 2–3 business days.
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => router.push("/profile/shipping?redirect=/checkout")}
                      className="group flex w-full items-center justify-between gap-5 p-5 text-left transition hover:bg-[#fffaf6] sm:p-7"
                    >
                      <span className="flex items-center gap-4">
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#f3ded4] text-[#a24e48]">
                          <MapPin className="h-[18px] w-[18px]" aria-hidden="true" />
                        </span>
                        <span>
                          <span className="block text-sm font-black text-[#17130f]">Add a delivery address</span>
                          <span className="mt-1 block text-xs leading-5 text-[#746e66]">We need this to calculate delivery and complete your order.</span>
                        </span>
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-[#8b847c] transition group-hover:translate-x-1" aria-hidden="true" />
                    </button>
                  )
                ) : (
                  <div className="p-5 sm:p-7">
                    <div className="flex items-start gap-4">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#eaff51] text-[#17130f]">
                        <Store className="h-[18px] w-[18px]" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-[15px] font-black">Stelcity Store</p>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-[#6f6962]">{SHOP_ADDRESS}</p>
                        <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#edf3e9] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-[#53614f]">
                          <PackageCheck className="h-3.5 w-3.5" aria-hidden="true" />
                          Ready after payment
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </section>

              <section className="overflow-hidden rounded-[28px] border border-[#dedbd4] bg-white">
                <SectionHeading
                  number="03"
                  title="Review your order"
                  description={`${itemCount} ${itemCount === 1 ? "item" : "items"} in your bag`}
                  action={(
                    <Link href="/cart" className="shrink-0 text-[10px] font-black uppercase tracking-[0.12em] text-[#8a4d48] transition hover:text-[#17130f]">
                      Edit bag
                    </Link>
                  )}
                />
                <div>
                  {items.map((item) => (
                    <article key={item.id} className="flex items-center gap-4 border-b border-[#ece9e3] p-5 last:border-b-0 sm:px-7">
                      <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-[18px] bg-[#f0eee9]">
                        <CheckoutItemImage item={item} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="line-clamp-2 text-sm font-black leading-5">{item.name}</h3>
                        {item.variant && <p className="mt-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#8a837a]">{item.variant}</p>}
                        <p className="mt-2 text-xs text-[#746e66]">Qty {item.quantity} · {formatNaira(item.price)} each</p>
                      </div>
                      <p className="shrink-0 text-sm font-black tracking-[-0.02em]">{formatNaira(Number(item.price) * item.quantity)}</p>
                    </article>
                  ))}
                </div>
              </section>
            </div>

            <aside className="min-w-0">
              <div className="lg:sticky lg:top-[6.75rem]">
                <section className="overflow-hidden rounded-[28px] bg-[#17130f] text-white shadow-[0_24px_60px_rgba(23,19,15,0.14)]">
                  <div className="flex items-start justify-between gap-5 px-6 pb-7 pt-7">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/45">Order total</p>
                      <h2 className="mt-3 text-2xl font-black tracking-[-0.04em]">Ready when you are.</h2>
                    </div>
                    <span className="grid h-9 min-w-9 place-items-center rounded-full bg-[#eaff51] px-2 text-[10px] font-black text-[#17130f]">{itemCount}</span>
                  </div>

                  <div className="border-y border-white/12 px-6 py-6">
                    <div className="space-y-4 text-sm">
                      <div className="flex items-center justify-between gap-4 text-white/60">
                        <span>Subtotal</span>
                        <span className="font-bold text-white">{formatNaira(subtotal)}</span>
                      </div>
                      <div className="flex items-center justify-between gap-4 text-white/60">
                        <span>{deliveryMethod === "pickup" ? "Store pickup" : "Delivery"}</span>
                        {deliveryMethod === "pickup" ? (
                          <span className="font-black text-[#eaff51]">Free</span>
                        ) : deliveryLoading ? (
                          <span className="h-3 w-16 animate-pulse rounded-full bg-white/15" />
                        ) : deliveryError ? (
                          <span className="font-bold text-[#ffb4aa]">Unavailable</span>
                        ) : (
                          <span className="font-bold text-white">{deliveryFee !== null ? formatNaira(deliveryFee) : "—"}</span>
                        )}
                      </div>
                    </div>
                    <div className="mt-6 flex items-end justify-between gap-5 border-t border-white/12 pt-6">
                      <span className="text-sm font-black">Total</span>
                      {deliveryLoading && deliveryMethod === "delivery" ? (
                        <span className="h-7 w-28 animate-pulse rounded-full bg-white/15" />
                      ) : deliveryError && deliveryMethod === "delivery" ? (
                        <span className="text-lg font-black text-[#ffb4aa]">Unavailable</span>
                      ) : (
                        <span className="text-[28px] font-black leading-none tracking-[-0.045em]">{formatNaira(total)}</span>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    <button
                      type="button"
                      onClick={handlePay}
                      disabled={paymentDisabled}
                      aria-busy={loading}
                      className="hidden h-14 w-full items-center justify-center gap-2 rounded-full bg-[#eaff51] px-5 text-sm font-black text-[#17130f] transition hover:-translate-y-0.5 hover:bg-[#f0ff78] disabled:cursor-not-allowed disabled:opacity-50 lg:flex"
                    >
                      {paymentLabel}
                      {!loading && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
                    </button>
                    <div className="flex items-start gap-3 text-xs leading-5 text-white/50">
                      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#eaff51]" aria-hidden="true" />
                      <p>Payment is completed securely through Squad. Stelcity does not store your card details.</p>
                    </div>
                  </div>
                </section>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="flex items-start gap-3 rounded-[22px] border border-[#dedbd4] bg-white p-4">
                    <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-[#a24e48]" aria-hidden="true" />
                    <div>
                      <p className="text-xs font-black">{deliveryMethod === "pickup" ? "Pickup timing" : "Estimated delivery"}</p>
                      <p className="mt-1 text-xs leading-5 text-[#746e66]">
                        {deliveryMethod === "pickup" ? "Your order will be ready after payment is confirmed." : "Lagos within 24 hours; outside Lagos in 2–3 business days."}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-[22px] border border-[#dedbd4] bg-white p-4">
                    <CreditCard className="mt-0.5 h-4 w-4 shrink-0 text-[#53614f]" aria-hidden="true" />
                    <div>
                      <p className="text-xs font-black">Secure payment</p>
                      <p className="mt-1 text-xs leading-5 text-[#746e66]">You’ll be redirected to Squad to complete your purchase.</p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#d8d4cc] bg-[#faf9f6]/96 px-4 py-3 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#8a837a]">Total</p>
            <p className="mt-1 text-lg font-black tracking-[-0.035em]">
              {deliveryLoading && deliveryMethod === "delivery"
                ? "Calculating…"
                : deliveryError && deliveryMethod === "delivery"
                  ? "Unavailable"
                  : formatNaira(total)}
            </p>
          </div>
          <button
            type="button"
            onClick={handlePay}
            disabled={paymentDisabled}
            aria-busy={loading}
            className="flex h-12 max-w-[68%] shrink-0 items-center justify-center gap-2 rounded-full bg-[#17130f] px-5 text-xs font-black text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="truncate">{paymentLabel}</span>
            {!loading && <ArrowRight className="h-4 w-4 shrink-0 text-[#eaff51]" aria-hidden="true" />}
          </button>
        </div>
      </div>
    </div>
  )
}
