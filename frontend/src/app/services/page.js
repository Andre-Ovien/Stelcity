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

  const handleToggleFav = (e) => {
    e.stopPropagation()
    toggleFav({
      id: `service-${service.id}`,
      name: service.category,
      price: service.items.length > 0 ? Math.min(...service.items.map((i) => i.price)) : 0,
      priceLabel: service.items.length > 0
        ? `From ₦${Math.min(...service.items.map((i) => i.price)).toLocaleString()}`
        : "",
      image: service.image,
      description: null,
      badge: null,
      rating: 5,
      slug: null,
      type: "service",
    })
    toast.success(isFav ? "Removed from favourites" : "Added to favourites!")
  }

  return (
    <div
      onClick={() => router.push(`/services/${service.id}`)}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col cursor-pointer active:scale-95 transition-transform"
    >
      <div className="relative w-full aspect-square bg-[#EEF5EE] flex items-center justify-center">
        {service.image ? (
          <Image
            src={service.image}
            alt={service.category}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <span className="text-[40px]">✨</span>
        )}
        <button
          onClick={handleToggleFav}
          className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-sm z-10"
        >
          <FaHeart className={isFav ? "text-red-400" : "text-gray-300"} size={12} />
        </button>
      </div>

      <div className="p-3 flex flex-col gap-1 flex-1">
        <h3 className="text-[13px] font-semibold text-gray-800 leading-tight">
          {service.category}
        </h3>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-yellow-400 text-[11px]">★★★★★</span>
          <span className="text-[11px] text-gray-400">5.0</span>
        </div>
        {service.items.length > 0 && (
          <p className="text-[11px] font-medium text-gray-900 mt-0.5">
            From ₦{Math.min(...service.items.map((i) => i.price)).toLocaleString()}
          </p>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation()
            router.push(`/services/${service.id}`)
          }}
          className="w-full bg-[#D65A5A] text-white text-[12px] font-medium py-2 rounded-full hover:bg-[#c44f4f] transition-colors mt-2"
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
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
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
    <div className="min-h-screen bg-white py-6">
      <Header />

      <div className="px-4 pb-10">
        <h1 className="text-[22px] font-bold text-gray-900 text-center mb-6">
          Our Services
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <ServiceCardSkeleton key={i} />
              ))
            : services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                />
              ))
          }
        </div>
      </div>
    </div>
  )
}