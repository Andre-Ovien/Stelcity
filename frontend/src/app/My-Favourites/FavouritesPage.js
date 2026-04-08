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
import { useState } from "react"

const ITEMS_PER_PAGE = 10

function FavCard({ product }) {
  const toggleFav = useFavStore((s) => s.toggleFav)
  const isFav = useFavStore((s) => s.isFav(product.slug))
  const addItem = useCartStore((s) => s.addItem)
  const router = useRouter()

  const isService = product.type === "service"
  const isRawMaterial = product.type === "raw"

  const href = isService
    ? `/our-services/${product.slug}`
    : isRawMaterial
    ? `/raw-materials/${product.slug}`
    : `/products/${product.slug}`

  const handleAddToCart = (e) => {
    e.preventDefault()
    if (isService) {
      router.push(`/services/${product.slug}`)
      return
    }
    if (isRawMaterial) {
      router.push(`/rawMaterials/${product.slug}`)
      return
    }
    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      variant: null,
      variantId: null,
    })
    toast.success("Added to cart!")
  }

  const buttonLabel = isService
    ? "View Service"
    : isRawMaterial
    ? "Select Weight"
    : "Add to Cart"

  return (
    <Link href={href} className="h-full">
      <div className="
        bg-white rounded-2xl border border-gray-100 shadow-sm p-3
        flex flex-col gap-2 h-full
        transition-all duration-200
        hover:-translate-y-1 hover:shadow-md
        active:scale-95
      ">
        
        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-50 shrink-0">
          {product.badge && (
            <span className="absolute top-2 left-2 z-10 bg-black text-white text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide">
              {product.badge}
            </span>
          )}
          <button
            onClick={(e) => {
              e.preventDefault()
              toggleFav(product)
              toast.success(isFav ? "Removed from favourites" : "Added to favourites!")
            }}
            className="
              absolute top-2 right-2 z-10
              bg-white rounded-full p-1.5 shadow-sm
              transition-all duration-150
              hover:scale-110 hover:shadow-md
              active:scale-90
            "
          >
            <FaHeart className={isFav ? "text-red-400" : "text-gray-300"} size={12} />
          </button>
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#EEF5EE]">
              <span className="text-[36px]">✨</span>
            </div>
          )}
        </div>

      
        <h3 className="text-[13px] sm:text-[14px] font-semibold text-gray-800 leading-tight line-clamp-2 min-h-10">
          {product.name}
        </h3>
        <p className="text-[11px] text-gray-400 leading-tight line-clamp-2 min-h-8">
          {product.description}
        </p>

        <div className="mt-auto flex flex-col gap-1.5">
          <span className="text-[12px] font-medium text-gray-900">
            {product.priceLabel || `₦${product.price?.toLocaleString()}`}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-yellow-400 text-[11px]">★★★★★</span>
            <span className="text-[11px] text-gray-400">5.0</span>
          </div>
          <button
            onClick={handleAddToCart}
            className="
              flex items-center justify-center gap-1.5
              bg-[#D65A5A] text-white rounded-full
              py-2 text-[12px] font-medium w-full
              transition-all duration-200
              hover:bg-[#c44f4f] hover:shadow-md hover:-translate-y-0.5
              active:scale-95 active:bg-[#b84444]
            "
          >
            {buttonLabel}
            <IoAddCircleOutline size={15} />
          </button>
        </div>
      </div>
    </Link>
  )
}

export default function FavouritesPage() {
  const items = useFavStore((s) => s.items)
  const [page, setPage] = useState(1)

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE)
  const paginated = items.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  return (
    <div className="min-h-screen bg-[#D6E4D3]">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <h1 className="text-xl sm:text-2xl xl:text-4xl font-bold text-gray-900 text-center my-6 xl:my-10 tracking-tight">
          My Favourites
        </h1>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <span className="text-[60px]">🤍</span>
            <h2 className="text-[18px] font-bold text-gray-800">No favourites yet</h2>
            <p className="text-[13px] text-gray-500 text-center">
              Tap the heart on any product to save it here.
            </p>
            <Link
              href="/products"
              className="
                bg-[#D65A5A] text-white font-semibold px-8 py-3
                rounded-full text-[14px]
                transition-all duration-200
                hover:bg-[#c44f4f] hover:-translate-y-0.5 hover:shadow-md
                active:scale-95
              "
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
              {paginated.map((product) => (
                <FavCard key={product.slug} product={product} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-full text-[13px] font-medium bg-white border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors active:scale-95"
                >
                  ← Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-full text-[13px] font-semibold transition-all active:scale-95 ${
                      p === page
                        ? "bg-[#D65A5A] text-white"
                        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-full text-[13px] font-medium bg-white border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors active:scale-95"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}