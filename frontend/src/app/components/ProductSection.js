"use client"

import Image from "next/image"
import { useState } from "react"
import { FaHeart } from "react-icons/fa"
import { IoAddCircleOutline } from "react-icons/io5"
import Link from "next/link"

const ProductPageCard = ({ product, basePath = "products" }) => {
  const [wishlisted, setWishlisted] = useState(false)

  const handleAddToCart = (e) => {
    e.preventDefault()
    alert("Added to cart:", product.name)
  }

  return (
    <Link href={`/${basePath}/${product.slug}`} className="h-full">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 flex flex-col gap-2 h-full">

        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-50">
          {product.badge && (
            <span className="absolute top-2 left-2 z-10 bg-black text-white text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide">
              {product.badge}
            </span>
          )}
          <button
            onClick={(e) => { e.preventDefault(); setWishlisted((p) => !p) }}
            className="absolute top-2 right-2 z-10 bg-white rounded-full p-1.5 shadow-sm"
          >
            <FaHeart className={wishlisted ? "text-red-400" : "text-gray-300"} size={12} />
          </button>
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>

        <h3 className="text-[13px] font-semibold text-gray-800 leading-tight">
          {product.name}
        </h3>

        <p className="text-[11px] text-gray-400 leading-tight line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center gap-2">
          {product.originalPrice && (
            <span className="text-[11px] text-gray-400 line-through">
              ₦{product.originalPrice.toLocaleString()}
            </span>
          )}
          <span className="text-[12px] font-medium text-gray-900">
            {product.priceLabel || `₦${product.price.toLocaleString()}`}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-yellow-400 text-[11px]">{"★".repeat(product.rating)}</span>
          <span className="text-[11px] text-gray-400">{product.rating}.0</span>
        </div>

        <button
          onClick={handleAddToCart}
          className="flex items-center justify-center gap-1.5 bg-[#D65A5A] text-white rounded-full py-2 text-[12px] font-medium hover:bg-[#c44f4f] transition-colors w-full mt-auto"
        >
          Add to Cart
          <IoAddCircleOutline size={15} />
        </button>

      </div>
    </Link>
  )
}

export default ProductPageCard