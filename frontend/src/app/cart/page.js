"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Header from "../components/Header"
import { useCartStore } from "../store/cartStore"
import { useAuthStore } from "../store/authStore"
import toast from "react-hot-toast"

const DELIVERY_FEE = 5000

function CartItem({ item, onRemove, onUpdateQuantity }) {
  return (
    <div className="bg-white rounded-2xl px-4 py-3 flex items-center gap-3">
      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-50 shrink-0">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            sizes="64px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#EEF5EE]">
            <span className="text-[24px]">✨</span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-[13px] font-semibold text-gray-800 leading-tight truncate">
            {item.name}
          </h3>
          <button
            onClick={onRemove}
            className="shrink-0 text-gray-300 hover:text-red-400 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-[13px] font-bold text-[#D65A5A] mt-0.5">
          ₦{(item.price * item.quantity).toLocaleString()}
        </p>

        {item.variant && (
          <p className="text-[11px] text-gray-400 mt-0.5">
            {item.variant} × {item.quantity}
          </p>
        )}

        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => {
              if (item.quantity === 1) {
                onRemove()
              } else {
                onUpdateQuantity(item.quantity - 1)
              }
            }}
            className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 text-[14px] font-medium hover:bg-gray-50"
          >
            −
          </button>
          <span className="text-[13px] font-semibold w-4 text-center">
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(item.quantity + 1)}
            className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 text-[16px] font-medium hover:bg-gray-50"
          >
            +
          </button>
          {!item.variant && (
            <span className="text-[11px] text-gray-400 ml-1">qty</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CartPage() {
  const items = useCartStore((s) => s.items)
  const removeItem = useCartStore((s) => s.removeItem)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const isAuth = useAuthStore((s) => s.isAuth)
  const router = useRouter()

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = subtotal + (items.length > 0 ? DELIVERY_FEE : 0)

  const handleCheckout = () => {
    if (!isAuth) {
      toast.error("Please sign in to proceed to checkout", {
        duration: 2000,
      })
      setTimeout(() => {
        sessionStorage.setItem("redirectAfter", "/checkout")
        router.push("/auth")
      }, 1500)
      return
    }
    router.push("/checkout")
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#D6E4D3]">
        <Header />
        <div className="flex flex-col items-center justify-center py-24 px-6 gap-4">
          <span className="text-[60px]">🛒</span>
          <h2 className="text-[18px] font-bold text-gray-800">Your cart is empty</h2>
          <p className="text-[13px] text-gray-500 text-center">
            You haven`t added anything yet. Start shopping!
          </p>
          <Link
            href="/products"
            className="bg-[#D65A5A] text-white font-semibold px-8 py-3 rounded-full text-[14px] hover:bg-[#c44f4f] transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#D6E4D3]">
      <Header />

      <div className="px-4 pb-36">
        <h1 className="text-[22px] font-bold text-gray-900 text-center mb-6">
          My Cart
        </h1>

        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onRemove={() => removeItem(item.id)}
              onUpdateQuantity={(qty) => updateQuantity(item.id, qty)}
            />
          ))}
        </div>

        <div className="bg-white rounded-2xl px-5 py-4 mt-5 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-[13px] text-gray-500">Delivery</span>
            <span className="text-[13px] text-gray-700 font-medium">
              ₦{DELIVERY_FEE.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[13px] text-gray-500">Subtotal</span>
            <span className="text-[13px] text-gray-700 font-medium">
              ₦{subtotal.toLocaleString()}
            </span>
          </div>
          <div className="h-px bg-gray-100 my-1" />
          <div className="flex justify-between items-center">
            <span className="text-[15px] font-bold text-gray-900">Total</span>
            <span className="text-[15px] font-bold text-[#D65A5A]">
              ₦{total.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-2 z-50">
        <button
          onClick={handleCheckout}
          className="w-full bg-[#D65A5A] text-white font-semibold py-3 rounded-full text-[14px] hover:bg-[#c44f4f] transition-colors"
        >
          Proceed to Checkout
        </button>
        <Link
          href="/products"
          className="text-[13px] text-gray-500 text-center hover:text-gray-800 transition-colors"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  )
}