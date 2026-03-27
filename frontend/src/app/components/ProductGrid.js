"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { FaHeart } from "react-icons/fa"
import { IoAddCircleOutline } from "react-icons/io5"
import { getCollectionPreview } from "../lib/homeCollection"
import { useFavStore } from "../store/favStore"
import { useCartStore } from "../store/cartStore"
import toast from "react-hot-toast"

const TABS = [
  { label: "All", value: "all" },
  { label: "Products", value: "products" },
  { label: "Raw Materials", value: "raw" },
  { label: "Services", value: "services" },
]

const showMore = {
  all:      { label: "Show more", href: "/products" },
  products: { label: "Show more products", href: "/products" },
  raw:      { label: "Show more raw materials", href: "/rawMaterials" },
  services: { label: "View all services", href: "/services" },
}

function ProductCard({ product }) {
  const toggleFav = useFavStore((s) => s.toggleFav)
  const isFav = useFavStore((s) => s.isFav(product.id))
  const addItem = useCartStore((s) => s.addItem)

  const href =
    product.type === "service"
      ? "/services"
      : product.type === "raw"
      ? `/rawMaterials/${product.slug}`
      : `/products/${product.slug}`

  const handleToggleFav = (e) => {
    e.preventDefault()
    toggleFav({
      id: product.id,
      name: product.name,
      price: product.price,
      priceLabel: product.priceLabel,
      image: product.image,
      description: product.description,
      badge: product.badge,
      rating: product.rating,
      slug: product.slug,
      variants: product.variants || [],
      type: product.type,
    })
    toast.success(isFav ? "Removed from favourites" : "Added to favourites!")
  }

  const handleAddToCart = (e) => {
    e.preventDefault()

    if (product.type === "service") {
      toast.error("Services cannot be added to cart")
      return
    }

    if (product.type === "raw") {
      window.location.href = `/rawMaterials/${product.slug}`
      return
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      variant: null,
      variantId: null,
    })
    toast.success("Added to cart!")
  }

  return (
    <Link href={href} className="h-full">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 relative flex flex-col h-full">

        {product.badge && (
          <span className="absolute top-3 left-3 z-10 bg-black text-white text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase">
            {product.badge}
          </span>
        )}

        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#EEF5EE] flex items-center justify-center shrink-0">
          <button
            onClick={handleToggleFav}
            className="absolute top-2 right-2 z-10 bg-white rounded-full p-1.5 shadow-sm"
          >
            <FaHeart
              className={isFav ? "text-red-400" : "text-gray-300"}
              size={12}
            />
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
            <span className="text-[36px]">✨</span>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-between mt-2.5">
          <div>
            <h3 className="text-[13px] font-semibold text-gray-800 xl:text-xl line-clamp-2">
              {product.name}
            </h3>

            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] font-medium text-gray-900 xl:text-lg">
                {product.priceLabel}
              </span>
            </div>

            <div className="flex text-yellow-400 text-[12px] mt-1 gap-0.5 xl:text-lg">
              ★★★★★
            </div>
          </div>

          {product.type !== "service" && (
            <button
              onClick={handleAddToCart}
              className="bg-[#D65A5A] flex items-center justify-center gap-1 border border-gray-300 rounded-full px-2 py-1.5 text-[11px] text-white font-medium hover:bg-[#c44f4f] transition-colors w-full mt-2 xl:text-base"
            >
              {product.type === "raw" ? "Select Weight" : "Add to Cart"}
              <IoAddCircleOutline size={14} className="xl:w-5 xl:h-5" />
            </button>
          )}
        </div>

      </div>
    </Link>
  )
}

function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-3 flex flex-col gap-2 animate-pulse">
      <div className="w-full aspect-square rounded-xl bg-gray-200" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="h-3 bg-gray-200 rounded w-1/4" />
      <div className="h-8 bg-gray-200 rounded-full w-full mt-2" />
    </div>
  )
}

const ProductGrid = () => {
  const [category, setCategory] = useState("all")
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [count, setCount] = useState(6)

  useEffect(() => {
    const updateCount = () => {
      if (window.innerWidth >= 1024) {
        setCount(12)
      } else if (window.innerWidth >= 768) {
        setCount(8)
      } else {
        setCount(6)
      }
    }

    updateCount()
    window.addEventListener("resize", updateCount)

    return () => window.removeEventListener("resize", updateCount)
  }, [])

  useEffect(() => {
    let mounted = true
    setLoading(true)

    getCollectionPreview(category).then((data) => {
      if (mounted) {
        setItems(data || [])
        setLoading(false)
      }
    })

    return () => { mounted = false }
  }, [category])

  return (
    <section className="px-5 py-10 bg-[#F7F6F6] rounded-t-[40px] xl:px-9" id="collection">

      <h2 className="font-bold text-[22px] text-gray-900 xl:text-3xl">
        Browse Our Collection
      </h2>

      <p className="text-[13px] text-gray-500 mt-1 xl:text-2xl">
        Explore our skincare categories to find what works best for your skin.
      </p>

      <div className="flex gap-2 mt-5 mb-6 overflow-x-auto scrollbar-hide pb-1">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setCategory(tab.value)}
            className={`shrink-0 px-4 py-1.5 rounded-full border text-[13px] font-medium xl:text-2xl
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
        {loading
          ? Array.from({ length: count }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))
          : items.slice(0, count).map((item) => (
              <ProductCard key={item.id} product={item} />
            ))
        }
      </div>

      {!loading && items.length === 0 && (
        <div className="text-center py-10 text-gray-400 text-[13px]">
          Nothing to show right now.
        </div>
      )}

      <div className="text-center mt-8">
        <Link
          href={showMore[category].href}
          className="text-[13px] text-gray-500 underline underline-offset-2 hover:text-gray-800 xl:text-xl"
        >
          {showMore[category].label}
        </Link>
      </div>

    </section>
  )
}

export default ProductGrid