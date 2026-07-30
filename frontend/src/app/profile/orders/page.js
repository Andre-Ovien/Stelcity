"use client"

export const dynamic = "force-dynamic"

import { useCallback, useEffect, useState, useSyncExternalStore } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Heart, LockKeyhole, MapPin, Package, UserRound } from "lucide-react"
import toast from "react-hot-toast"
import Header from "../../components/Header"
import { useAuthStore } from "../../store/authStore"
import { getOrders } from "../../lib/profile"
import { handleSessionExpiry } from "../../lib/handleSessionExpiry"

const STATUS_FILTERS = ["All", "Pending", "Confirmed", "Failed"]
const getServerMediaSnapshot = () => false

const ACCOUNT_NAVIGATION = [
  { label: "User info", href: "/profile", Icon: UserRound },
  { label: "Favourites", href: "/My-Favourites", Icon: Heart },
  { label: "Orders", href: "/profile/orders", Icon: Package, active: true },
  { label: "Delivery address", href: "/profile/shipping", Icon: MapPin },
  { label: "Password & security", href: "/profile/change-password", Icon: LockKeyhole },
]

const STATUS_STYLES = {
  Pending: { backgroundColor: "#f6edd5", color: "#816229" },
  Confirmed: { backgroundColor: "#e2eee0", color: "#496643" },
  Failed: { backgroundColor: "#fae2df", color: "#a24640" },
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

function formatDate(dateString) {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return "Date unavailable"

  return date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function formatOrderId(orderId) {
  const value = String(orderId || "")
  return value ? `#${value.slice(0, 8).toUpperCase()}` : "Order reference unavailable"
}

function OrderRow({ order, isDesktop }) {
  const router = useRouter()
  const status = order.status || "Pending"
  const statusStyle = STATUS_STYLES[status] || { backgroundColor: "#edf0eb", color: "#596456" }
  const canTrack = status === "Confirmed"

  return (
    <article className="border-t py-6 sm:py-7" style={{ borderColor: "#d9ddd6" }}>
      <div
        className="items-center gap-x-7 gap-y-5"
        style={{
          display: "grid",
          gridTemplateColumns: isDesktop ? "minmax(170px, 1.2fr) minmax(120px, 0.8fr) minmax(110px, 0.6fr) minmax(130px, 0.7fr)" : "minmax(0, 1fr)",
        }}
      >
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7c8778]">Order</p>
          <p className="mt-2 text-[15px] font-black tracking-[-0.02em] text-[#1d241e]">{formatOrderId(order.order_id)}</p>
          <p className="mt-1 text-xs text-[#748071]">{formatDate(order.created_at)}</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.1em]" style={statusStyle}>
            {status}
          </span>
          {!isDesktop && <span className="text-xs text-[#748071]">Status</span>}
        </div>

        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7c8778]">Total</p>
          <p className="mt-2 text-[15px] font-black text-[#1d241e]">₦{Number(order.total_price || 0).toLocaleString()}</p>
        </div>

        <div className={isDesktop ? "justify-self-end" : ""}>
          {canTrack ? (
            <button
              type="button"
              onClick={() => router.push(`/profile/orders/${order.order_id}/tracking`)}
              className="inline-flex h-10 items-center gap-2 border border-[#1d241e] px-4 text-[10px] font-black uppercase tracking-[0.1em] text-[#1d241e] transition hover:bg-[#1d241e] hover:text-white"
            >
              Track order
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          ) : (
            <span className="text-xs text-[#83907f]">Tracking available after confirmation.</span>
          )}
        </div>
      </div>
    </article>
  )
}

function OrderSkeleton({ isDesktop }) {
  return (
    <div className="border-t py-6 sm:py-7" style={{ borderColor: "#d9ddd6" }}>
      <div
        className="animate-pulse gap-x-7 gap-y-5"
        style={{
          display: "grid",
          gridTemplateColumns: isDesktop ? "minmax(170px, 1.2fr) minmax(120px, 0.8fr) minmax(110px, 0.6fr) minmax(130px, 0.7fr)" : "minmax(0, 1fr)",
        }}
      >
        <div><div className="h-3 w-12 bg-[#e8ebe5]" /><div className="mt-3 h-4 w-28 bg-[#eef0ec]" /></div>
        <div className="h-7 w-24 rounded-full bg-[#edf0eb]" />
        <div><div className="h-3 w-10 bg-[#e8ebe5]" /><div className="mt-3 h-4 w-20 bg-[#eef0ec]" /></div>
        <div className="h-10 w-28 bg-[#edf0eb]" />
      </div>
    </div>
  )
}

export default function OrdersPage() {
  const token = useAuthStore((state) => state.token)
  const softLogout = useAuthStore((state) => state.softLogout)
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("All")
  const isDesktop = useMediaQuery("(min-width: 960px)")

  useEffect(() => {
    if (!token) return undefined

    let isCurrent = true

    getOrders(token)
      .then((data) => {
        if (isCurrent) setOrders(data || [])
      })
      .catch((error) => {
        if (!isCurrent) return

        if (error.message === "SESSION_EXPIRED") {
          toast.error("Your session has expired. Please log in again.")
          handleSessionExpiry(router, softLogout, "/profile/orders")
        }
      })
      .finally(() => {
        if (isCurrent) setLoading(false)
      })

    return () => {
      isCurrent = false
    }
  }, [router, softLogout, token])

  const filteredOrders = filter === "All" ? orders : orders.filter((order) => order.status === filter)

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
                <h1 className="mt-3 text-[28px] font-black leading-none tracking-[-0.045em] text-[#1d241e]">Your orders</h1>
              </div>

              <nav aria-label="Account navigation" className="mt-8 flex flex-col gap-1">
                {ACCOUNT_NAVIGATION.map((item) => <AccountNavItem key={item.href} {...item} />)}
              </nav>

              <Link href="/profile" className="mt-8 inline-flex items-center gap-2 self-start text-xs font-black text-[#52604f] transition hover:text-[#1d241e] lg:mt-auto">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back to account
              </Link>
            </aside>

            <section className="min-w-0 p-6 sm:p-8 lg:p-12">
              <header className="border-b pb-8" style={{ borderColor: "#e4e5df" }}>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8a837a]">Purchase history</p>
                <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <h2 className="text-[36px] font-black leading-[0.95] tracking-[-0.055em] text-[#1d241e] sm:text-[46px]">Orders.</h2>
                  <p className="max-w-[320px] text-sm leading-6 text-[#6d776b]">Track confirmed orders and keep an eye on every purchase.</p>
                </div>
              </header>

              <div className="mt-7 flex gap-2 overflow-x-auto pb-1 scrollbar-hide" role="tablist" aria-label="Order status filters">
                {STATUS_FILTERS.map((status) => (
                  <button
                    key={status}
                    type="button"
                    role="tab"
                    aria-selected={filter === status}
                    onClick={() => setFilter(status)}
                    className={`shrink-0 border px-4 py-2 text-[10px] font-black uppercase tracking-[0.12em] transition ${
                      filter === status
                        ? "border-[#1d241e] bg-[#1d241e] text-white"
                        : "border-[#d9ddd6] bg-[#fffefb] text-[#6d776b] hover:border-[#1d241e] hover:text-[#1d241e]"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <section className="mt-8" aria-label="Orders list">
                {!loading && filteredOrders.length > 0 && isDesktop && (
                  <div className="grid border-b pb-3 text-[10px] font-black uppercase tracking-[0.14em] text-[#7c8778]" style={{ gridTemplateColumns: "minmax(170px, 1.2fr) minmax(120px, 0.8fr) minmax(110px, 0.6fr) minmax(130px, 0.7fr)", borderColor: "#d9ddd6", columnGap: "1.75rem" }}>
                    <span>Order</span>
                    <span>Status</span>
                    <span>Total</span>
                    <span className="text-right">Actions</span>
                  </div>
                )}

                {loading ? (
                  <div>{["one", "two", "three"].map((item) => <OrderSkeleton key={item} isDesktop={isDesktop} />)}</div>
                ) : filteredOrders.length === 0 ? (
                  <div className="border-t py-20 text-center" style={{ borderColor: "#d9ddd6" }}>
                    <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#f6dfd3] text-[#b54e47]">
                      <Package className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-5 text-[28px] font-black leading-none tracking-[-0.045em] text-[#1d241e]">
                      {filter === "All" ? "No orders yet." : `No ${filter.toLowerCase()} orders.`}
                    </h3>
                    <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#717a6e]">
                      {filter === "All" ? "Your purchase history will appear here after your first order." : "Try another order status to see more purchases."}
                    </p>
                    {filter === "All" && <Link href="/products" className="mt-7 inline-flex h-11 items-center justify-center rounded-full bg-[#1d241e] px-6 text-xs font-black text-white transition hover:-translate-y-0.5 hover:bg-[#354033]">Browse products</Link>}
                  </div>
                ) : (
                  <div>{filteredOrders.map((order) => <OrderRow key={order.order_id} order={order} isDesktop={isDesktop} />)}</div>
                )}
              </section>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
