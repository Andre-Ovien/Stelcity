"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FaHeart } from "react-icons/fa"
import { IoAddCircleOutline } from "react-icons/io5"
import Header from "../components/Header"
import { useFavStore } from "../store/favStore"
import { useCartStore } from "../store/cartStore"
import toast from "react-hot-toast"

function FavCard({ product }) {
  const toggleFav = useFavStore((s) => s.toggleFav)
  const addItem = useCartStore((s) => s.addItem)
  const router = useRouter()

  const isRawMaterial = product.type === "raw" || product.variants?.length > 0

  const handleAddToCart = (e) => {
    e.preventDefault()
    if (isRawMaterial) {
      router.push(`/rawMaterials/${product.slug}`)
      return
    }
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      variant: null,
    })
    toast.success("Added to cart!")
  }

  const href = isRawMaterial
    ? `/rawMaterials/${product.slug}`
    : `/products/${product.slug}`

  return (
    <Link href={href} className="h-full">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 flex flex-col gap-2 h-full">

        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-50">
          {product.badge && (
            <span className="absolute top-2 left-2 z-10 bg-black text-white text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide">
              {product.badge}
            </span>
          )}
          <button
            onClick={(e) => {
              e.preventDefault()
              toggleFav(product)
            }}
            className="absolute top-2 right-2 z-10 bg-white rounded-full p-1.5 shadow-sm"
          >
            <FaHeart className="text-red-400" size={12} />
          </button>
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#EEF5EE]">
              <span className="text-[36px]">✨</span>
            </div>
          )}
        </div>

        <h3 className="text-[13px] font-semibold text-gray-800 leading-tight">
          {product.name}
        </h3>

        <p className="text-[11px] text-gray-400 leading-tight line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center gap-2">
          <span className="text-[12px] font-medium text-gray-900">
            {product.priceLabel || `₦${product.price.toLocaleString()}`}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-yellow-400 text-[11px]">★★★★★</span>
          <span className="text-[11px] text-gray-400">5.0</span>
        </div>

        <button
          onClick={handleAddToCart}
          className="flex items-center justify-center gap-1.5 bg-[#D65A5A] text-white rounded-full py-2 text-[12px] font-medium hover:bg-[#c44f4f] transition-colors w-full mt-auto"
        >
          {isRawMaterial ? "Select Weight" : "Add to Cart"}
          <IoAddCircleOutline size={15} />
        </button>

      </div>
    </Link>
  )
}

export default function FavouritesPage() {
  const items = useFavStore((s) => s.items)

  return (
    <div className="min-h-screen bg-[#D6E4D3] py-6">
      <Header />

      <div className="px-4 pb-10">
        <h1 className="text-[22px] font-bold text-gray-900 text-center mb-6">
          My Favourites
        </h1>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            
            <h2 className="text-[18px] font-bold text-gray-800">No favourites yet</h2>
            <p className="text-[13px] text-gray-500 text-center">
              Tap the heart on any product to save it here.
            </p>
            <Link
              href="/products"
              className="bg-[#D65A5A] text-white font-semibold px-8 py-3 rounded-full text-[14px] hover:bg-[#c44f4f] transition-colors"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {items.map((product) => (
              <FavCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}