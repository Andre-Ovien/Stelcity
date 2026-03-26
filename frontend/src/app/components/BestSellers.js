"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { IoAddCircleOutline } from "react-icons/io5"
import { FaHeart } from "react-icons/fa"
import { getBestSellers } from "../lib/bestSellers"
import { useCartStore } from "../store/cartStore"
import { useFavStore } from "../store/favStore"
import toast from "react-hot-toast"

function BestSellerCard({ product }) {
  const addItem = useCartStore((s) => s.addItem)
  const toggleFav = useFavStore((s) => s.toggleFav)
  const isFav = useFavStore((s) => s.isFav(product.id))

  const handleAddToCart = (e) => {
    e.preventDefault()
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

  const handleToggleFav = (e) => {
    e.preventDefault()
    toggleFav({
      id: product.id,
      name: product.name,
      price: product.price,
      priceLabel: `₦${product.price.toLocaleString()}`,
      image: product.image,
      description: product.description,
      badge: null,
      rating: product.rating,
      slug: product.slug,
      variants: product.variants || [],
      type: "product",
    })
    toast.success(isFav ? "Removed from favourites" : "Added to favourites!")
  }

  return (
    <Link href={`/products/${product.slug}`}>
      <div className="min-w-40 sm:min-w-50 lg:min-w-55 bg-white rounded-2xl p-3 flex flex-col gap-2 border border-gray-100 shadow-sm h-full">
        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-50 shrink-0">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="220px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#EEF5EE]">
              <span className="text-[36px]">✨</span>
            </div>
          )}
          <button
            onClick={handleToggleFav}
            className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-sm z-10"
          >
            <FaHeart className={isFav ? "text-red-400" : "text-gray-300"} size={12} />
          </button>
        </div>

        <div className="flex-1 flex flex-col gap-2">
          <div className="flex-1">
            <h3 className="text-[13px] font-semibold text-gray-800 leading-tight xl:text-xl line-clamp-2">
              {product.name}
            </h3>
            <p className="text-[11px] text-gray-400 mt-0.5 leading-tight line-clamp-2 xl:text-lg">
              {product.description}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-[12px] font-semibold text-gray-900 xl:text-lg">
              ₦{product.price.toLocaleString()}
            </p>

            <div className="flex text-yellow-400 text-[11px] gap-0.5 xl:text-lg">
              {"★".repeat(product.rating)}
            </div>

            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-1.5 border border-gray-300 rounded-full px-3 py-1.5 text-[12px] text-gray-700 font-medium hover:bg-gray-50 transition-colors w-full xl:text-xl"
            >
              Add to Cart
              <IoAddCircleOutline size={15} />
            </button>
          </div>
        </div>
      </div>

    </Link>
  )
}

function BestSellerSkeleton() {
  return (
    <div className="min-w-40 sm:min-w-50 bg-white rounded-2xl p-3 flex flex-col gap-2 border border-gray-100 animate-pulse">
      <div className="w-full aspect-square rounded-xl bg-gray-200" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-full" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="h-7 bg-gray-200 rounded-full w-28" />
    </div>
  )
}

const BestSellers = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef(null)
  const isHovered = useRef(false)
  const direction = useRef(1)

  useEffect(() => {
    getBestSellers().then((data) => {
      setProducts(data)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    const container = scrollRef.current
    if (!container || products.length === 0) return

    const scroll = () => {
      if (isHovered.current) return
      const atEnd = container.scrollLeft + container.offsetWidth >= container.scrollWidth - 10
      const atStart = container.scrollLeft <= 0
      if (atEnd) direction.current = -1
      if (atStart) direction.current = 1
      container.scrollBy({ left: direction.current, behavior: "instant" })
    }

    const interval = setInterval(scroll, 20)
    return () => clearInterval(interval)
  }, [products])

  return (
    <section className="py-8">
      <h2 className="text-[22px] font-bold text-gray-900 text-center mb-5  xl:text-3xl">
        Our Bestsellers
      </h2>

      <div
        ref={scrollRef}
        onMouseEnter={() => (isHovered.current = true)}
        onMouseLeave={() => (isHovered.current = false)}
        onTouchStart={() => (isHovered.current = true)}
        onTouchEnd={() => (isHovered.current = false)}
        className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-2"
      >
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <BestSellerSkeleton key={i} />)
          : products.map((product) => (
              <BestSellerCard key={product.id} product={product} />
            ))
        }
      </div>
    </section>
  )
}

export default BestSellers