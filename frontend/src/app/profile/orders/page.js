"use client"
export const dynamic = 'force-dynamic'
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import Header from "../../components/Header"
import { useAuthStore } from "../../store/authStore"
import { getOrders } from "../../lib/profile"
import { handleSessionExpiry } from "../../lib/handleSessionExpiry"
import toast from "react-hot-toast"

const STATUS_FILTERS = ["All", "Pending", "Confirmed", "Failed"]

const statusColors = {
  Pending:   { bg: "bg-yellow-100", text: "text-yellow-700" },
  Confirmed: { bg: "bg-green-100",  text: "text-green-700" },
  Failed:    { bg: "bg-red-100",    text: "text-red-500" },
}

function OrderCard({ order }) {
  const date = new Date(order.created_at).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  const colors = statusColors[order.status] || { bg: "bg-gray-100", text: "text-gray-600" }

  return (
    <div className="bg-white rounded-2xl px-4 py-4 flex flex-col gap-2 border border-gray-100">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[12px] text-gray-400">Order ID</p>
          <p className="text-[12px] font-medium text-gray-700 mt-0.5">
            #{order.order_id.slice(0, 8).toUpperCase()}
          </p>
        </div>
        <span className={`text-[11px] font-semibold px-3 py-1 rounded-full ${colors.bg} ${colors.text}`}>
          {order.status}
        </span>
      </div>

      <div className="h-px bg-gray-100" />

      <div className="flex justify-between items-center">
        <div>
          <p className="text-[12px] text-gray-400">Date</p>
          <p className="text-[13px] font-medium text-gray-700 mt-0.5">{date}</p>
        </div>
        <div className="text-right">
          <p className="text-[12px] text-gray-400">Total</p>
          <p className="text-[14px] font-bold text-[#D65A5A] mt-0.5">
            ₦{order.total_price.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}

function OrderSkeleton() {
  return (
    <div className="bg-white rounded-2xl px-4 py-4 flex flex-col gap-3 border border-gray-100 animate-pulse">
      <div className="flex justify-between">
        <div className="flex flex-col gap-1">
          <div className="h-3 bg-gray-200 rounded w-16" />
          <div className="h-4 bg-gray-200 rounded w-24" />
        </div>
        <div className="h-6 bg-gray-200 rounded-full w-20" />
      </div>
      <div className="h-px bg-gray-100" />
      <div className="flex justify-between">
        <div className="flex flex-col gap-1">
          <div className="h-3 bg-gray-200 rounded w-10" />
          <div className="h-4 bg-gray-200 rounded w-20" />
        </div>
        <div className="flex flex-col gap-1 items-end">
          <div className="h-3 bg-gray-200 rounded w-10" />
          <div className="h-4 bg-gray-200 rounded w-24" />
        </div>
      </div>
    </div>
  )
}

export default function OrdersPage() {
  const token = useAuthStore((s) => s.token)
  const softLogout = useAuthStore((s) => s.softLogout)
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("All")

  useEffect(() => {
    if (!token) return
    getOrders(token)
      .then((data) => {
        setOrders(data || [])
        setLoading(false)
      })
      .catch((err) => {
        if (err.message === "SESSION_EXPIRED") {
          toast.error("Your session has expired. Please log in again.")
          handleSessionExpiry(router, softLogout, "/profile/orders")
        }
        setLoading(false)
      })
  }, [token])

  const filtered = filter === "All"
    ? (Array.isArray(orders) ? orders : [])
    : (Array.isArray(orders) ? orders : []).filter((o) => o.status === filter)

  return (
    <div className="min-h-screen bg-white my-6">
      <Header />

      <div className="px-4 pb-10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-gray-600 text-[13px] mb-4 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft size={16} />
          Back
        </button>

        <h1 className="text-[22px] font-bold text-[#D65A5A] text-center mb-5">
          My Orders
        </h1>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 mb-5">
          {STATUS_FILTERS.map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`shrink-0 px-4 py-1.5 rounded-full border text-[12px] font-medium transition-all ${
                filter === status
                  ? "bg-[#D65A5A] text-white border-[#D65A5A]"
                  : "bg-white text-gray-600 border-gray-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => <OrderSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <span className="text-[50px]">📦</span>
            <p className="text-[15px] font-semibold text-gray-700">
              {filter === "All" ? "No orders yet" : `No ${filter} orders`}
            </p>
            <p className="text-[13px] text-gray-400 text-center">
              {filter === "All"
                ? "Your orders will appear here once you make a purchase."
                : `You have no orders with status "${filter}".`
              }
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((order) => (
              <OrderCard key={order.order_id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}