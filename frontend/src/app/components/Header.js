"use client"

import Image from "next/image"
import { useState } from "react"
import { Menu, Search, ShoppingBag, UserRound, X } from "lucide-react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useAuthStore } from "../store/authStore"
import { useCartStore } from "../store/cartStore"

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Product", href: "/products" },
  { label: "Raw materials", href: "/raw-materials" },
  { label: "Services", href: "/our-services" },
  { label: "Learn", href: "/training-programs" },
  { label: "Blog", href: "/blog" },
]

const MOBILE_LINKS = [
  ...NAV_LINKS,
  { label: "Favourites", href: "/My-Favourites" },
]

const Header = ({ immersive = false }) => {
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
      router.push("/auth?mode=login")
    } else {
      router.push("/profile")
    }
  }

  return (
    <>
      <header
        className="fixed left-0 top-0 z-50 w-full px-4 py-4 sm:px-6 lg:px-8"
      >
        <div className="mx-auto flex h-14 max-w-[1480px] items-center justify-between gap-3 rounded-full border border-white/80 bg-white/82 px-3 shadow-[0_18px_60px_rgba(31,28,24,0.08)] backdrop-blur-xl sm:px-4 lg:px-5">
          <Link href="/" aria-label="Stelcity home" className="flex min-w-0 items-center">
            <Image
                src="/images/logo.png"
                alt="Stelcity logo"
                width={100}
                height={80}
                priority
                className="h-auto w-24 object-contain sm:w-28"
            />
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`text-sm font-bold transition ${
                  pathname === item.href || (pathname === "/" && item.href === "/")
                    ? "text-[#17130f]"
                    : "text-[#504b45] hover:text-[#17130f]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <label className="hidden h-10 min-w-[170px] items-center gap-2 rounded-full bg-[#f7f5ef] px-4 text-[#77716a] md:flex">
              <span className="sr-only">Search</span>
              <input
                type="search"
                placeholder="Search"
                className="min-w-0 flex-1 bg-transparent text-xs font-medium text-[#17130f] outline-none placeholder:text-[#77716a]"
              />
              <Search className="h-4 w-4 text-[#17130f]" aria-hidden="true" />
            </label>

            <Link
              href="/cart"
              className="relative grid h-10 w-10 place-items-center rounded-full bg-[#eaff51] text-[#17130f] shadow-[0_10px_24px_rgba(194,218,42,0.24)] transition hover:-translate-y-0.5"
              aria-label={`Cart with ${cartCount} items`}
            >
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#17130f] px-1 text-[9px] font-black text-white">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={handleProfileClick}
              className="hidden h-10 items-center gap-2 rounded-full bg-[#17130f] px-4 text-xs font-bold text-white transition hover:-translate-y-0.5 sm:flex"
            >
              <UserRound className="h-4 w-4" aria-hidden="true" />
              {isAuth ? "Account" : "Login"}
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="grid h-10 w-10 place-items-center rounded-full bg-[#f7f5ef] text-[#17130f] transition hover:bg-white lg:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen
                ? <X className="h-5 w-5" aria-hidden="true" />
                : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="mx-auto mt-3 max-w-[1480px] rounded-[26px] border border-white/80 bg-white/92 p-4 shadow-[0_18px_50px_rgba(31,28,24,0.12)] backdrop-blur-xl lg:hidden">
            <div className="flex flex-col gap-2">
              {MOBILE_LINKS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-full px-4 py-3 text-sm font-bold ${
                    pathname === item.href
                      ? "bg-[#efe8ff] text-[#17130f]"
                      : "text-[#504b45]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              <button
                onClick={handleProfileClick}
                className="mt-2 rounded-full bg-[#17130f] px-4 py-3 text-left text-sm font-bold text-white"
              >
                {isAuth ? "Account settings" : "Login / Register"}
              </button>
            </div>
          </div>
        )}
      </header>

      {!immersive && <div className="h-[88px]" />}
    </>
  )
}

export default Header
