"use client"

import Image from "next/image"
import { useState } from "react"
import { GiHamburgerMenu } from "react-icons/gi"
import { IoClose } from "react-icons/io5"
import { FiShoppingCart } from "react-icons/fi"
import Link from "next/link"

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="w-full px-5 relative">

      
      <div className="bg-white w-full mb-6 px-4 py-3 rounded-2xl flex justify-between items-center shadow-2xl">

        
        <Link href="/">
          <Image src="/images/logo.png" alt="Stelcity logo" width={100} height={80} />
        </Link>

        
        <div className="flex items-center gap-4">
          <Link href="/cart">
            <FiShoppingCart size={22} className="text-gray-700" />
          </Link>

          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen
              ? <IoClose size={26} className="text-gray-700" />
              : <GiHamburgerMenu size={24} className="text-gray-700" />
            }
          </button>
        </div>

      </div>

      
      {menuOpen && (
        <div className="bg-white rounded-2xl px-6 py-6 flex flex-col gap-5 shadow-lg absolute top-21.5 left-3 right-3 z-50">

          {[
            { label: "Home", href: "/" },
            { label: "Products", href: "/products" },
            { label: "Raw Materials", href: "/rawMaterials" },
            { label: "Services", href: "/services" },
            { label: "Favourites", href: "/fav" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="text-[15px] font-medium text-gray-700 hover:text-[#D65A5A] transition-colors"
            >
              {item.label}
            </Link>
          ))}

          <div className="border-t border-gray-100 pt-4 flex flex-col gap-4">
            <Link
              href="/account"
              onClick={() => setMenuOpen(false)}
              className="text-[15px] font-medium text-gray-700 hover:text-[#D65A5A] transition-colors"
            >
              Account
            </Link>
          </div>

        </div>
      )}

    </div>
  )
}

export default Header