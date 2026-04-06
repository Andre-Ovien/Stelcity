"use client"
export const dynamic = 'force-dynamic'

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Package, Truck, CheckCircle, Clock, XCircle } from "lucide-react"
import Header from "../../../../components/Header"
import { useAuthStore } from "../../../../store/authStore"
import { handleSessionExpiry } from "../../../../lib/handleSessionExpiry"
import toast from "react-hot-toast"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

const STATUS_CONFIG = {
  pending:          { label: "Order Placed",    icon: Clock,       color: "text-yellow-500", bg: "bg-yellow-100" },
  confirmed:        { label: "Confirmed",        icon: CheckCircle, color: "text-blue-500",   bg: "bg-blue-100" },
  processing:       { label: "Processing",       icon: Package,     color: "text-purple-500", bg: "bg-purple-100" },
  out_for_delivery: { label: "Out for Delivery", icon: Truck,       color: "text-orange-500", bg: "bg-orange-100" },
  delivered:        { label: "Delivered",        icon: CheckCircle, color: "text-green-500",  bg: "bg-green-100" },
  cancelled:        { label: "Cancelled",        icon: XCircle,     color: "text-red-500",    bg: "bg-red-100" },
  failed:           { label: "Failed",           icon: XCircle,     color: "text-red-500",    bg: "bg-red-100" },
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function TrackingSkeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-4">
      <div className="h-6 bg-gray-200 rounded w-1/2" />
      <div className="bg-white rounded-2xl p-4">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
        <div className="h-3 bg-gray-200 rounded w-full mb-2" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function OrderTrackingPage({ params }) {
  const { id } = use(params)
  const token = useAuthStore((s) => s.token)
  const softLogout = useAuthStore((s) => s.softLogout)
  const router = useRouter()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!token) return
    fetch(`${BASE_URL}/api/products/orders/${id}/tracking/`, {
      headers: { "Authorization": `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401) throw new Error("SESSION_EXPIRED")
        if (!res.ok) throw new Error("Failed to load order")
        return res.json()
      })
      .then((data) => {
        setOrder(data)
        setLoading(false)
      })
      .catch((err) => {
        if (err.message === "SESSION_EXPIRED") {
          toast.error("Your session has expired. Please log in again.")
          handleSessionExpiry(router, softLogout, `/profile/orders/${id}/tracking`)
          return
        }
        setError(err.message || "Failed to load order")
        setLoading(false)
      })
  }, [token, id])

  const latestStatus = order?.tracking_updates?.length > 0
    ? order.tracking_updates[order.tracking_updates.length - 1].status
    : order?.status?.toLowerCase()

  const currentConfig = STATUS_CONFIG[latestStatus] || STATUS_CONFIG.pending
  const CurrentIcon = currentConfig.icon

  return (
    <div className="min-h-screen bg-[#D6E4D3]">
      <Header />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-0 pb-10">

        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-gray-600 text-[13px] mb-4 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft size={16} />
          Back to Orders
        </button>

        {loading ? (
          <TrackingSkeleton />
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <span className="text-[50px]">📦</span>
            <p className="text-[15px] font-semibold text-gray-700">Order not found</p>
            <p className="text-[13px] text-gray-400">{error}</p>
          </div>
        ) : order ? (
          <>
           
            <div className="bg-white rounded-2xl px-4 py-4 mb-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-[12px] text-gray-400">Order ID</p>
                  <p className="text-[13px] font-semibold text-gray-800 mt-0.5">
                    #{order.order_id.slice(0, 8).toUpperCase()}
                  </p>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${currentConfig.bg}`}>
                  <CurrentIcon size={13} className={currentConfig.color} />
                  <span className={`text-[11px] font-semibold ${currentConfig.color}`}>
                    {currentConfig.label}
                  </span>
                </div>
              </div>

              <div className="h-px bg-gray-100 my-3" />

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[12px] text-gray-400">Order Date</p>
                  <p className="text-[13px] font-medium text-gray-700 mt-0.5">
                    {formatDate(order.created_at)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[12px] text-gray-400">Total</p>
                  <p className="text-[14px] font-bold text-[#D65A5A] mt-0.5">
                    ₦{order.total_price.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

              {/* Items Ordered */}
              <div className="bg-white rounded-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <h2 className="text-[14px] font-semibold text-gray-800">Items Ordered</h2>
                </div>
                <div className="divide-y divide-gray-50">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center px-4 py-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-gray-800 truncate">
                          {item.product_name}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          x{item.quantity}
                          {item.variant ? ` • Variant #${item.variant}` : ""}
                        </p>
                      </div>
                      <p className="text-[13px] font-semibold text-gray-800 shrink-0 ml-3">
                        ₦{item.item_subtotal.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            
              <div className="bg-white rounded-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <h2 className="text-[14px] font-semibold text-gray-800">Tracking Updates</h2>
                </div>

                {order.tracking_updates.length === 0 ? (
                  <div className="px-4 py-6 text-center">
                    <p className="text-[13px] text-gray-400">No tracking updates yet</p>
                  </div>
                ) : (
                  <div className="px-4 py-4">
                    {[...order.tracking_updates].reverse().map((update, index) => {
                      const config = STATUS_CONFIG[update.status] || STATUS_CONFIG.pending
                      const Icon = config.icon
                      const isLatest = index === 0

                      return (
                        <div key={index} className="flex gap-3 relative">
                          {index < order.tracking_updates.length - 1 && (
                            <div className="absolute left-5 top-10 bottom-0 w-px bg-gray-100" />
                          )}
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isLatest ? config.bg : "bg-gray-100"}`}>
                            <Icon size={16} className={isLatest ? config.color : "text-gray-400"} />
                          </div>
                          <div className="flex-1 pb-5">
                            <p className={`text-[13px] font-semibold ${isLatest ? "text-gray-900" : "text-gray-500"}`}>
                              {config.label}
                            </p>
                            {update.note && (
                              <p className="text-[12px] text-gray-400 mt-0.5">{update.note}</p>
                            )}
                            <p className="text-[11px] text-gray-400 mt-0.5">
                              {formatDate(update.updated_at)}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

            </div>
          </>
        ) : null}

      </div>
    </div>
  )
}