"use client"

import Image from "next/image"
import { useState } from "react"
import { GiHamburgerMenu } from "react-icons/gi"
import { IoClose } from "react-icons/io5"
import { FiShoppingCart } from "react-icons/fi"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useAuthStore } from "../store/authStore"
import { useCartStore } from "../store/cartStore"

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Raw Materials", href: "/rawMaterials" },
  { label: "Services", href: "/services" },
  { label: "Training", href: "/training" },
  { label: "Favourites", href: "/fav" },
]

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const isAuth = useAuthStore((s) => s.isAuth)
  const cartItems = useCartStore((s) => s.items)
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const router = useRouter()
  const pathname = usePathname()

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
    <div className="w-full px-5 relative 2xl:pt-8 ">
      <div className="bg-white w-full mb-6 px-4 py-3 rounded-2xl flex justify-between items-center shadow-2xl xl:rounded-4xl xl:py-4.5 2xl:py-7 2xl:px-10
       ">

        <Link href="/">
          <Image src="/images/logo.png" alt="Stelcity logo" width={100} height={80} className="xl:w-40  2xl:w-55" />
        </Link>

        <nav className="hidden sm:flex items-center gap-3 xl:gap-10">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`text-[14px] font-medium transition-colors xl:text-[25px] 2xl:text-[40px] ${
                pathname === item.href
                  ? "text-[#D65A5A] font-semibold"
                  : "text-gray-700 hover:text-[#D65A5A]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-6 xl:gap-10">
          <Link href="/cart" className="relative">
            <FiShoppingCart className="text-gray-700 w-5.5 h-5.5 xl:w-7.5 xl:h-7.5  2xl:w-20 2xl:h-17" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#D65A5A] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center xl:text-[12px] xl:w-5 xl:h-5 2xl:text-[25px] 2xl:w-10 2xl:h-10">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>

          <button
            onClick={handleProfileClick}
            className="hidden sm:block text-[14px] font-medium hover:text-[#D65A5A] transition-colors xl:text-[25px] bg-[#D65A5A] text-white rounded-2xl w-17 h-7  xl:w-30 xl:h-10 xl:rounded-3xl 2xl:w-43 2xl:h-15 2xl:rounded-4xl 2xl:text-[35px] "
          >
            {isAuth ? "Settings" : "Login" }
          </button>

          <button onClick={() => setMenuOpen(!menuOpen)} className="sm:hidden">
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
              className={`text-[15px] font-medium transition-colors ${
                pathname === item.href
                  ? "text-[#D65A5A] font-semibold"
                  : "text-gray-700 hover:text-[#D65A5A]"
              }`}
            >
              {item.label}
            </Link>
          ))}

          <div className="border-t border-gray-100 pt-4">
            <button
              onClick={handleProfileClick}
              className="text-[15px] font-medium text-gray-700 hover:text-[#D65A5A] transition-colors text-left"
            >
              {isAuth ? "Settings" : "Login / Register"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Header