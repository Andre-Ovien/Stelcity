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
    <>
      
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
        <div className="flex items-center justify-between max-w-full px-4 py-3">
          
          <Link href="/">
            <Image
              src="/images/logo.png"
              alt="Stelcity logo"
              width={100}
              height={80}
              className="w-24 lg:w-32 xl:w-36 2xl:w-50"
            />
          </Link>

          
          <nav className="hidden sm:flex items-center gap-4 lg:gap-6 xl:gap-8 2xl:gap-10">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`text-sm lg:text-base xl:text-lg 2xl:text-2xl transition-colors ${
                  pathname === item.href
                    ? "text-[#D65A5A] font-semibold"
                    : "text-gray-700 hover:text-[#D65A5A]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          
          <div className="flex items-center gap-4 lg:gap-6 xl:gap-8 2xl:gap-10">

            <Link href="/cart" className="relative">
              <FiShoppingCart className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D65A5A] text-white text-[10px] lg:text-xs xl:text-sm 2xl:text-base font-bold w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7 rounded-full flex items-center justify-center">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={handleProfileClick}
              className="hidden sm:block text-sm lg:text-base xl:text-lg 2xl:text-xl bg-[#D65A5A] text-white px-4 lg:px-5 xl:px-6 2xl:px-7 py-1.5 lg:py-2 xl:py-2.5 2xl:py-3 rounded-xl hover:bg-[#c44f4f] transition"
            >
              {isAuth ? "Settings" : "Login"}
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="sm:hidden"
            >
              {menuOpen
                ? <IoClose size={24} />
                : <GiHamburgerMenu size={22} />}
            </button>
          </div>
        </div>

        
        {menuOpen && (
          <div className="sm:hidden mt-2 bg-white shadow-md px-5 py-5 flex flex-col gap-4">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`text-sm ${
                  pathname === item.href
                    ? "text-[#D65A5A] font-semibold"
                    : "text-gray-700"
                }`}
              >
                {item.label}
              </Link>
            ))}

            <div className="border-t pt-3">
              <button
                onClick={handleProfileClick}
                className="text-sm text-gray-700"
              >
                {isAuth ? "Settings" : "Login / Register"}
              </button>
            </div>
          </div>
        )}
      </div>

      
      <div className="h-22.5" />
    </>
  )
}

export default Header