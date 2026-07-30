"use client"

export const dynamic = "force-dynamic"

import { useCallback, useEffect, useState, useSyncExternalStore, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  Clock3,
  Heart,
  LockKeyhole,
  MapPin,
  Package,
  Truck,
  UserRound,
  XCircle,
} from "lucide-react"
import Header from "../../../../components/Header"
import { useAuthStore } from "../../../../store/authStore"
import { handleSessionExpiry } from "../../../../lib/handleSessionExpiry"
import { authenticatedFetch } from "../../../../lib/authenticatedFetch"
import toast from "react-hot-toast"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL
const getServerMediaSnapshot = () => false

const ACCOUNT_NAVIGATION = [
  { label: "User info", href: "/profile", Icon: UserRound },
  { label: "Favourites", href: "/My-Favourites", Icon: Heart },
  { label: "Orders", href: "/profile/orders", Icon: Package, active: true },
  { label: "Delivery address", href: "/profile/shipping", Icon: MapPin },
  { label: "Password & security", href: "/profile/change-password", Icon: LockKeyhole },
]

const STATUS_CONFIG = {
  pending: {
    label: "Order placed",
    icon: Clock3,
    surface: "#f6edd5",
    accent: "#816229",
    line: "#e1cf9f",
  },
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle2,
    surface: "#e2eee0",
    accent: "#496643",
    line: "#bfd4bb",
  },
  processing: {
    label: "Processing",
    icon: Package,
    surface: "#eee6f5",
    accent: "#675177",
    line: "#d2c1df",
  },
  out_for_delivery: {
    label: "Out for delivery",
    icon: Truck,
    surface: "#faead8",
    accent: "#9a6233",
    line: "#eac9a6",
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle2,
    surface: "#e2eee0",
    accent: "#496643",
    line: "#bfd4bb",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    surface: "#fae2df",
    accent: "#a24640",
    line: "#efc3be",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    surface: "#fae2df",
    accent: "#a24640",
    line: "#efc3be",
  },
}

function useMediaQuery(query) {
  const subscribe = useCallback((callback) => {
    const media = window.matchMedia(query)
    media.addEventListener("change", callback)
    return () => media.removeEventListener("change", callback)
  }, [query])

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query])

  return useSyncExternalStore(subscribe, getSnapshot, getServerMediaSnapshot)
}

function AccountNavItem({ label, href, Icon, active = false }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`group flex items-center gap-3 border-l-2 px-3 py-3 text-sm font-bold transition ${
        active
          ? "border-[#d65a5a] bg-[#fff4ef] text-[#1d241e]"
          : "border-transparent text-[#6d776b] hover:border-[#e5d3cb] hover:bg-[#f7f7f3] hover:text-[#1d241e]"
      }`}
    >
      <Icon className={`h-4 w-4 shrink-0 ${active ? "text-[#d65a5a]" : "text-[#849080]"}`} aria-hidden="true" />
      {label}
    </Link>
  )
}

function normaliseStatus(status) {
  return String(status || "pending").trim().toLowerCase().replace(/\s+/g, "_")
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return "Date unavailable"

  return date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatOrderId(orderId) {
  const value = String(orderId || "")
  return value ? `#${value.slice(0, 8).toUpperCase()}` : "Order reference unavailable"
}

function TrackingSkeleton({ isDesktop }) {
  return (
    <div className="animate-pulse">
      <div className="border-b pb-8" style={{ borderColor: "#e4e5df" }}>
        <div className="h-3 w-24 bg-[#e8ebe5]" />
        <div className="mt-4 h-11 w-64 max-w-full bg-[#eef0ec]" />
        <div className="mt-5 h-4 w-80 max-w-full bg-[#f0f2ee]" />
      </div>
      <div
        className="mt-10 gap-10"
        style={{ display: "grid", gridTemplateColumns: isDesktop ? "minmax(0, 0.84fr) minmax(0, 1.16fr)" : "minmax(0, 1fr)" }}
      >
        {["items", "updates"].map((section) => (
          <section key={section} className="border-t pt-5" style={{ borderColor: "#d9ddd6" }}>
            <div className="h-3 w-28 bg-[#e8ebe5]" />
            {["one", "two", "three"].map((item) => (
              <div key={item} className="border-t py-5" style={{ borderColor: "#eef0ec" }}>
                <div className="h-4 w-3/4 bg-[#eef0ec]" />
                <div className="mt-3 h-3 w-1/3 bg-[#f0f2ee]" />
              </div>
            ))}
          </section>
        ))}
      </div>
    </div>
  )
}

export default function OrderTrackingPage({ params }) {
  const { id } = use(params)
  const token = useAuthStore((state) => state.token)
  const softLogout = useAuthStore((state) => state.softLogout)
  const router = useRouter()
  const isDesktop = useMediaQuery("(min-width: 960px)")

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!token) return undefined

    let isCurrent = true

    authenticatedFetch(
      `${BASE_URL}/api/products/orders/${id}/tracking/`,
      {},
      token
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load order")
        return res.json()
      })
      .then((data) => {
        if (!isCurrent) return
        setOrder(data)
        setLoading(false)
      })
      .catch((err) => {
        if (!isCurrent) return

        if (err.message === "SESSION_EXPIRED") {
          toast.error("Your session has expired. Please log in again.")
          handleSessionExpiry(router, softLogout, `/profile/orders/${id}/tracking`)
          return
        }

        setError(err.message || "Failed to load order")
        setLoading(false)
      })

    return () => {
      isCurrent = false
    }
  }, [id, router, softLogout, token])

  const trackingUpdates = Array.isArray(order?.tracking_updates) ? order.tracking_updates : []
  const latestUpdate = trackingUpdates.length > 0 ? trackingUpdates[trackingUpdates.length - 1] : null
  const latestStatus = normaliseStatus(latestUpdate?.status || order?.status)
  const currentConfig = STATUS_CONFIG[latestStatus] || STATUS_CONFIG.pending
  const CurrentIcon = currentConfig.icon
  const orderedItems = Array.isArray(order?.items) ? order.items : []

  return (
    <div className="min-h-screen bg-[#fffefb] text-[#1d241e]">
      <Header />

      <main className="pb-0 pt-5 sm:pt-8">
        <div className="w-full">
          <div
            className="account-workspace-grid min-h-[650px]"
            style={{
              display: "grid",
              gridTemplateColumns: isDesktop ? "250px minmax(0, 1fr)" : "minmax(0, 1fr)",
            }}
          >
            <aside
              className="flex flex-col p-6 sm:p-8"
              style={{
                borderColor: "#d9ddd6",
                borderBottomWidth: isDesktop ? 0 : 1,
                borderRightWidth: isDesktop ? 1 : 0,
              }}
            >
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#748071]">Stelcity account</p>
                <h1 className="mt-3 text-[28px] font-black leading-none tracking-[-0.045em] text-[#1d241e]">Order tracking</h1>
              </div>

              <nav aria-label="Account navigation" className="mt-8 flex flex-col gap-1">
                {ACCOUNT_NAVIGATION.map((item) => <AccountNavItem key={item.href} {...item} />)}
              </nav>

              <Link href="/profile/orders" className="mt-8 inline-flex items-center gap-2 self-start text-xs font-black text-[#52604f] transition hover:text-[#1d241e] lg:mt-auto">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back to orders
              </Link>
            </aside>

            <section className="min-w-0 p-6 sm:p-8 lg:p-12">
              <Link href="/profile/orders" className="inline-flex items-center gap-1 text-xs font-black text-[#657061] transition hover:text-[#1d241e]">
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                All orders
              </Link>

              {loading ? (
                <div className="mt-7"><TrackingSkeleton isDesktop={isDesktop} /></div>
              ) : error ? (
                <div className="mt-7 border-y py-20 text-center" style={{ borderColor: "#d9ddd6" }}>
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#f6dfd3] text-[#b54e47]">
                    <Package className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h2 className="mt-5 text-[30px] font-black leading-none tracking-[-0.045em] text-[#1d241e]">Order unavailable.</h2>
                  <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#717a6e]">{error}</p>
                  <Link href="/profile/orders" className="mt-7 inline-flex h-11 items-center justify-center border border-[#1d241e] px-5 text-[10px] font-black uppercase tracking-[0.1em] text-[#1d241e] transition hover:bg-[#1d241e] hover:text-white">
                    View your orders
                  </Link>
                </div>
              ) : order ? (
                <>
                  <header className="mt-7 border-b pb-8" style={{ borderColor: "#e4e5df" }}>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8a837a]">Delivery progress</p>
                    <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                      <div>
                        <h2 className="text-[36px] font-black leading-[0.95] tracking-[-0.055em] text-[#1d241e] sm:text-[46px]">
                          Order {formatOrderId(order.order_id)}
                        </h2>
                        <p className="mt-4 max-w-xl text-sm leading-6 text-[#6d776b]">Follow each update as your order moves from confirmation to your door.</p>
                      </div>
                      <div className="inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[0.1em]" style={{ backgroundColor: currentConfig.surface, color: currentConfig.accent }}>
                        <CurrentIcon className="h-4 w-4" aria-hidden="true" />
                        {currentConfig.label}
                      </div>
                    </div>

                    <dl
                      className="mt-8 gap-y-5 border-t pt-5"
                      style={{
                        display: "grid",
                        gridTemplateColumns: isDesktop ? "repeat(3, minmax(0, 1fr))" : "minmax(0, 1fr)",
                        borderColor: "#e4e5df",
                      }}
                    >
                      <div>
                        <dt className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7c8778]">Order placed</dt>
                        <dd className="mt-2 text-sm font-bold text-[#1d241e]">{formatDate(order.created_at)}</dd>
                      </div>
                      <div>
                        <dt className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7c8778]">Items</dt>
                        <dd className="mt-2 text-sm font-bold text-[#1d241e]">{orderedItems.length} {orderedItems.length === 1 ? "item" : "items"}</dd>
                      </div>
                      <div>
                        <dt className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7c8778]">Order total</dt>
                        <dd className="mt-2 text-sm font-black text-[#1d241e]">₦{Number(order.total_price || 0).toLocaleString()}</dd>
                      </div>
                    </dl>
                  </header>

                  <div
                    className="mt-10 gap-10"
                    style={{
                      display: "grid",
                      gridTemplateColumns: isDesktop ? "minmax(0, 0.84fr) minmax(0, 1.16fr)" : "minmax(0, 1fr)",
                    }}
                  >
                    <section className="border-t pt-5" style={{ borderColor: "#d9ddd6" }} aria-labelledby="order-items-heading">
                      <div className="flex items-center justify-between gap-4">
                        <h3 id="order-items-heading" className="text-[11px] font-black uppercase tracking-[0.16em] text-[#53614f]">Items ordered</h3>
                        <span className="text-xs text-[#788274]">{orderedItems.length} {orderedItems.length === 1 ? "item" : "items"}</span>
                      </div>

                      {orderedItems.length === 0 ? (
                        <p className="border-t py-7 text-sm text-[#717a6e]" style={{ borderColor: "#eef0ec" }}>Item details are unavailable for this order.</p>
                      ) : (
                        <div className="mt-4">
                          {orderedItems.map((item, index) => (
                            <article key={item.id || `${item.product_name}-${index}`} className="flex items-start justify-between gap-5 border-t py-5" style={{ borderColor: "#eef0ec" }}>
                              <div className="min-w-0">
                                <h4 className="text-sm font-black leading-5 text-[#1d241e]">{item.product_name || "Product"}</h4>
                                <p className="mt-1 text-xs leading-5 text-[#748071]">
                                  Qty {item.quantity || 0}{item.variant ? ` · Variant #${item.variant}` : ""}
                                </p>
                              </div>
                              <p className="shrink-0 text-sm font-black text-[#1d241e]">₦{Number(item.item_subtotal || 0).toLocaleString()}</p>
                            </article>
                          ))}
                        </div>
                      )}
                    </section>

                    <section className="border-t pt-5" style={{ borderColor: "#d9ddd6" }} aria-labelledby="tracking-updates-heading">
                      <div className="flex flex-wrap items-end justify-between gap-3">
                        <div>
                          <h3 id="tracking-updates-heading" className="text-[11px] font-black uppercase tracking-[0.16em] text-[#53614f]">Tracking updates</h3>
                          <p className="mt-2 text-sm text-[#717a6e]">The latest update is shown first.</p>
                        </div>
                        <span className="inline-flex items-center gap-2 text-xs font-bold" style={{ color: currentConfig.accent }}>
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: currentConfig.accent }} />
                          {currentConfig.label}
                        </span>
                      </div>

                      {trackingUpdates.length === 0 ? (
                        <div className="mt-6 border-t py-8" style={{ borderColor: "#eef0ec" }}>
                          <p className="text-sm font-bold text-[#1d241e]">Your order is being prepared.</p>
                          <p className="mt-2 max-w-md text-sm leading-6 text-[#717a6e]">We’ll add delivery updates here as soon as there is movement on your order.</p>
                        </div>
                      ) : (
                        <ol className="mt-6 border-t pt-6" style={{ borderColor: "#eef0ec" }}>
                          {[...trackingUpdates].reverse().map((update, index) => {
                            const config = STATUS_CONFIG[normaliseStatus(update.status)] || STATUS_CONFIG.pending
                            const Icon = config.icon
                            const isLatest = index === 0

                            return (
                              <li key={update.id || `${update.updated_at || "update"}-${index}`} className="relative flex gap-4 pb-7 last:pb-0">
                                {index < trackingUpdates.length - 1 && <span className="absolute bottom-0 left-[17px] top-9 w-px" style={{ backgroundColor: config.line }} aria-hidden="true" />}
                                <span className="relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full" style={{ backgroundColor: isLatest ? config.surface : "#f1f3ef", color: isLatest ? config.accent : "#7c8778" }}>
                                  <Icon className="h-4 w-4" aria-hidden="true" />
                                </span>
                                <div className="min-w-0 pt-1">
                                  <p className={`text-sm ${isLatest ? "font-black text-[#1d241e]" : "font-bold text-[#586253]"}`}>{config.label}</p>
                                  {update.note && <p className="mt-1 text-sm leading-6 text-[#717a6e]">{update.note}</p>}
                                  <time className="mt-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#879180]">{formatDate(update.updated_at)}</time>
                                </div>
                              </li>
                            )
                          })}
                        </ol>
                      )}
                    </section>
                  </div>
                </>
              ) : null}
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
