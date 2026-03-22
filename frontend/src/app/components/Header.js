"use client"

import Image from "next/image"
import { useState } from "react"
import { GiHamburgerMenu } from "react-icons/gi"
import { IoClose } from "react-icons/io5"
import { FiShoppingCart } from "react-icons/fi"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuthStore } from "../store/authStore"
import { useCartStore } from "../store/cartStore"

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Raw Materials", href: "/rawMaterials" },
  { label: "Services", href: "/services" },
  { label: "Favourites", href: "/fav" },
]

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const isAuth = useAuthStore((s) => s.isAuth)
  const cartItems = useCartStore((s) => s.items)
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const router = useRouter()

  const handleProfileClick = () => {
    setMenuOpen(false)
    if (!isAuth) {
      sessionStorage.setItem("redirectAfter", "/profile")
      router.push("/auth")
    } else {
      router.push("/profile")
    }
  }

  return (
    <div className="w-full px-5 relative">

      <div className="bg-white w-full mb-6 px-4 py-3 rounded-2xl flex justify-between items-center shadow-2xl">

        <Link href="/">
          <Image src="/images/logo.png" alt="Stelcity logo" width={100} height={80} />
        </Link>

      
        <nav className="hidden sm:flex items-center gap-6">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-[14px] font-medium text-gray-700 hover:text-[#D65A5A] transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        
        <div className="flex items-center gap-4">

        
          <Link href="/cart" className="relative">
            <FiShoppingCart size={22} className="text-gray-700" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#D65A5A] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>

         
          <button
            onClick={handleProfileClick}
            className="hidden sm:block text-[14px] font-medium text-gray-700 hover:text-[#D65A5A] transition-colors"
          >
            {isAuth ? "Profile" : "Login"}
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden"
          >
            {menuOpen
              ? <IoClose size={26} className="text-gray-700" />
              : <GiHamburgerMenu size={24} className="text-gray-700" />
            }
          </button>

        </div>
      </div>

      
      {menuOpen && (
        <div className="sm:hidden bg-white rounded-2xl px-6 py-6 flex flex-col gap-5 shadow-lg absolute top-18 left-3 right-3 z-50">

          {NAV_LINKS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="text-[15px] font-medium text-gray-700 hover:text-[#D65A5A] transition-colors"
            >
              {item.label}
            </Link>
          ))}

          <div className="border-t border-gray-100 pt-4">
            <button
              onClick={handleProfileClick}
              className="text-[15px] font-medium text-gray-700 hover:text-[#D65A5A] transition-colors text-left"
            >
              {isAuth ? "Profile" : "Login / Register"}
            </button>
          </div>

        </div>
      )}

    </div>
  )
}

export default Header