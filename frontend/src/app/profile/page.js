"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { FiUser } from "react-icons/fi"
import { FaRegUser } from "react-icons/fa"
import { IoNotificationsOutline, IoLocationOutline, IoLockClosedOutline } from "react-icons/io5"
import { useAuthStore } from "../store/authStore"
import Header from "../components/Header"

const menuItems = [
  { label: "Edit Profile", href: "/profile/edit", icon: <FaRegUser size={16} className="text-white" />, bg: "bg-[#D65A5A]" },
  { label: "Notifications", href: "/profile/notifications", icon: <IoNotificationsOutline size={16} className="text-white" />, bg: "bg-orange-400" },
  { label: "Shipping Address", href: "/profile/shipping", icon: <IoLocationOutline size={16} className="text-white" />, bg: "bg-green-500" },
  { label: "Change Password", href: "/profile/change-password", icon: <IoLockClosedOutline size={16} className="text-white" />, bg: "bg-gray-500" },
]

const orderItems = [
  { label: "Current Order(s)", href: "/profile/orders/current" },
  { label: "Past Orders", href: "/profile/orders/past" },
]

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-white mt-4">
      <Header />

      <div className="px-4 pb-10">

        <h1 className="text-[22px] font-bold text-[#D65A5A] text-center mb-6">
          Account
        </h1>

        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full border-2 border-gray-200 flex items-center justify-center bg-gray-50">
            <FiUser size={40} className="text-gray-400" />
          </div>
          <p className="text-[16px] font-semibold text-[#D65A5A] mt-3">
            {user?.name || user?.email || "User"}
          </p>
        </div>

        <div className="flex flex-col divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden mb-6">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center justify-between px-4 py-4 bg-white hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full ${item.bg} flex items-center justify-center`}>
                  {item.icon}
                </div>
                <span className="text-[14px] font-medium text-gray-700">{item.label}</span>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </Link>
          ))}
        </div>

        <p className="text-[13px] font-semibold text-[#D65A5A] text-center mb-3">
          — My Orders —
        </p>

        <div className="flex flex-col divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden mb-8">
          {orderItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center justify-between px-4 py-4 bg-white hover:bg-gray-50 transition-colors"
            >
              <span className="text-[14px] font-medium text-gray-700">{item.label}</span>
              <ChevronRight size={18} className="text-gray-400" />
            </Link>
          ))}
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-[#D65A5A] text-white font-semibold py-3 rounded-full text-[14px] hover:bg-[#c44f4f] transition-colors"
        >
          Log Out
        </button>

      </div>
    </div>
  )
}