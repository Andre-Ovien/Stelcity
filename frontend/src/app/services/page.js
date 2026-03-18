"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { ChevronDown, ChevronUp } from "lucide-react"
import { FaHeart } from "react-icons/fa"
import Header from "../components/Header"
import { getServices } from "../lib/services"

const WHATSAPP_NUMBER = "2348144316917"

function ServiceCard({ service, onViewServices }) {
  const [wishlisted, setWishlisted] = useState(false)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
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
          onClick={() => setWishlisted((p) => !p)}
          className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-sm z-10"
        >
          <FaHeart className={wishlisted ? "text-red-400" : "text-gray-300"} size={12} />
        </button>
      </div>

      <div className="p-3 flex flex-col gap-2 flex-1">
        <h3 className="text-[13px] font-semibold text-gray-800 leading-tight">
          {service.category}
        </h3>
        <p className="text-[11px] text-gray-400 leading-tight line-clamp-3 flex-1">
          {service.description}
        </p>
        <div className="flex items-center gap-1">
          <span className="text-yellow-400 text-[11px]">★★★★★</span>
          <span className="text-[11px] text-gray-400">5.0</span>
        </div>
        <button
          onClick={() => onViewServices(service.id)}
          className="w-full bg-[#D65A5A] text-white text-[12px] font-medium py-2 rounded-full hover:bg-[#c44f4f] transition-colors mt-auto"
        >
          View Services
        </button>
      </div>
    </div>
  )
}

function ServiceAccordion({ service, isOpen, onToggle }) {
  const handleRequest = () => {
    const message = encodeURIComponent(
      `Hello, I am interested in the ${service.category} service.`
    )
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank")
  }

  return (
    <div className={`rounded-2xl overflow-hidden border transition-all ${isOpen ? "border-[#D65A5A]" : "border-gray-200"}`}>
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center px-5 py-4 text-left bg-white"
      >
        <span className={`text-[15px] font-medium ${isOpen ? "text-[#D65A5A]" : "text-gray-700"}`}>
          {service.category}
        </span>
        {isOpen
          ? <ChevronUp size={18} className="text-[#D65A5A]" />
          : <ChevronDown size={18} className="text-gray-400" />
        }
      </button>

      {isOpen && (
        <div className="bg-white border-t border-gray-100 px-5 pt-3 pb-4">
          <div className="flex flex-col gap-2 mb-4">
            {service.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-1">
                <span className="text-[14px] text-gray-600">{item.name}</span>
                <span className="text-[13px] font-semibold text-[#D65A5A]">
                  ₦{item.price.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={handleRequest}
            className="bg-[#D65A5A] text-white text-[13px] font-medium px-5 py-2 rounded-full hover:bg-[#c44f4f] transition-colors"
          >
            Request Service
          </button>
        </div>
      )}
    </div>
  )
}

function ServiceCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-3 flex flex-col gap-2 animate-pulse">
      <div className="w-full aspect-square rounded-xl bg-gray-200" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-full" />
      <div className="h-8 bg-gray-200 rounded-full w-full mt-2" />
    </div>
  )
}

function ServiceAccordionSkeleton() {
  return (
    <div className="border border-gray-200 rounded-2xl h-14 animate-pulse bg-gray-100" />
  )
}

export default function ServicesPage() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [openId, setOpenId] = useState(null)
  const accordionRef = useRef(null)

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

  const handleViewServices = (id) => {
    setOpenId(id)
    setTimeout(() => {
      accordionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 100)
  }

  const handleToggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="min-h-screen  my-6">
      <Header />

      <div className="px-4 pb-10">

        <h1 className="text-[22px] font-bold text-gray-900 text-center mb-6">
          Our Services
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <ServiceCardSkeleton key={i} />)
            : services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onViewServices={handleViewServices}
                />
              ))
          }
        </div>

        {/* <div ref={accordionRef} className="flex flex-col gap-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <ServiceAccordionSkeleton key={i} />)
            : services.map((service) => (
                <ServiceAccordion
                  key={service.id}
                  service={service}
                  isOpen={openId === service.id}
                  onToggle={() => handleToggle(service.id)}
                />
              ))
          }
        </div> */}

      </div>
    </div>
  )
}