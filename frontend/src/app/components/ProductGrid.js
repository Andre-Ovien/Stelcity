"use client"

import { useState } from "react"
import { products } from "../lib/products"
import ProductCard from "./ProductCard"
import Link from "next/link"

const TABS = [
  { label: "All", value: "all" },
  { label: "Products", value: "products" },
  { label: "Raw Materials", value: "raw" },
]

const showMore = {
  all:      { label: "Show more products",      href: "/products" },
  products: { label: "Show more products",      href: "/products" },
  raw:      { label: "Show more raw materials", href: "/rawMaterials" },
}

const ProductGrid = () => {
  const [category, setCategory] = useState("all")

  const filtered =
    category === "all"
      ? products
      : products.filter((p) => p.category === category)

  return (
    <section className="px-5 py-10 bg-[#F7F6F6] rounded-t-[40px]" id="collection">

      <h2 className="font-bold text-[22px] text-gray-900">
        Browse Our Collection
      </h2>
      <p className="text-[13px] text-gray-500 mt-1">
        Explore our skincare categories to find what works best for your skin.
      </p>

    
      <div className="flex gap-2 mt-5 mb-6 overflow-x-auto scrollbar-hide pb-1">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setCategory(tab.value)}
            className={`shrink-0 px-4 py-1.5 rounded-full border text-[13px] font-medium transition-all
              ${category === tab.value
                ? "bg-[#D65A5A] text-white border-[#D65A5A]"
                : "bg-white text-gray-600 border-gray-200"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

    
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {filtered.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>


      <div className="text-center mt-8">
        <Link
          href={showMore[category].href}
          className="text-[13px] text-gray-500 underline underline-offset-2 hover:text-gray-800 transition-colors"
        >
          {showMore[category].label}
        </Link>
      </div>

    </section>
  )
}

export default ProductGrid