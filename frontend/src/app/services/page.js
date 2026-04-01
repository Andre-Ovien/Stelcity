"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { FaHeart } from "react-icons/fa"
import { useRouter } from "next/navigation"
import Header from "../components/Header"
import { getServices } from "../lib/services"
import { useFavStore } from "../store/favStore"
import toast from "react-hot-toast"

function ServiceCard({ service }) {
  const toggleFav = useFavStore((s) => s.toggleFav)
  const isFav = useFavStore((s) => s.isFav(`service-${service.id}`))
  const router = useRouter()

  const minPrice = service.items.length > 0
    ? Math.min(...service.items.map((i) => i.price))
    : null

  const handleToggleFav = (e) => {
    e.stopPropagation()
    toggleFav({
      id: `service-${service.id}`,
      name: service.category,
      price: minPrice ?? 0,
      priceLabel: minPrice ? `From ₦${minPrice.toLocaleString()}` : "",
      image: service.image,
      description: null,
      badge: null,
      rating: 5,
      slug: null,
      type: "service",
    })
    toast.success(isFav ? "Removed from favourites" : "Added to favourites!")
  }

  const handleNavigate = () => router.push(`/services/${service.id}`)

  return (
    <div
      onClick={handleNavigate}
      className="
        bg-white rounded-2xl border border-gray-100 shadow-sm
        overflow-hidden flex flex-col cursor-pointer
        transition-all duration-200
        hover:-translate-y-1 hover:shadow-md
        active:scale-95
      "
    >
      {/* Image */}
      <div className="relative w-full aspect-square bg-[#EEF5EE] flex items-center justify-center shrink-0">
        {service.image ? (
          <Image
            src={service.image}
            alt={service.category}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <span className="text-[40px]">✨</span>
        )}

        {/* Fav Button */}
        <button
          onClick={handleToggleFav}
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
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col gap-1 flex-1">
        <h3 className="text-[13px] sm:text-[14px] xl:text-base font-semibold text-gray-800 leading-tight line-clamp-2 min-h-[2.5rem]">
          {service.category}
        </h3>

        <div className="flex items-center gap-1 mt-1">
          <span className="text-yellow-400 text-[11px] sm:text-[12px]">★★★★★</span>
          <span className="text-[11px] sm:text-[12px] text-gray-400">5.0</span>
        </div>

        {minPrice && (
          <p className="text-[11px] sm:text-[12px] xl:text-sm font-medium text-gray-900 mt-0.5">
            From ₦{minPrice.toLocaleString()}
          </p>
        )}

        {/* View Services Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleNavigate()
          }}
          className="
            w-full mt-auto pt-2
            bg-[#D65A5A] text-white
            text-[12px] sm:text-[13px] xl:text-sm
            font-medium py-2 rounded-full
            transition-all duration-200
            hover:bg-[#c44f4f] hover:shadow-md hover:-translate-y-0.5
            active:scale-95 active:bg-[#b84444] active:shadow-none
          "
        >
          View Services
        </button>
      </div>
    </div>
  )
}

function ServiceCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-3 flex flex-col gap-2 animate-pulse">
      <div className="w-full aspect-square rounded-xl bg-gray-200" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mt-1" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="h-3 bg-gray-200 rounded w-1/3" />
      <div className="h-8 bg-gray-200 rounded-full w-full mt-2" />
    </div>
  )
}

export default function ServicesPage() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    getServices().then((data) => {
      if (mounted) {
        setServices(data)
        setLoading(false)
      }
    })
    return () => { mounted = false }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 xl:pb-14">
        <h1 className="text-xl sm:text-2xl xl:text-4xl font-bold text-gray-900 text-center my-6 xl:my-10 tracking-tight">
          Our Services
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <ServiceCardSkeleton key={i} />
              ))
            : services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))
          }
        </div>

        {!loading && services.length === 0 && (
          <div className="text-center py-20 text-gray-400 text-sm xl:text-base">
            No services available right now.
          </div>
        )}
      </div>
    </div>
  )
}