"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import Image from "next/image"
import Header from "../../components/Header"
import { getServices } from "../../lib/services"

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2348144316917"

function ServiceDetailSkeleton() {
  return (
    <div className="animate-pulse px-4 pb-10">
      <div className="w-full aspect-video rounded-2xl bg-gray-200 mb-4" />
      <div className="h-6 bg-gray-200 rounded w-1/2 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-full mb-1" />
      <div className="h-3 bg-gray-200 rounded w-3/4 mb-6" />
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex justify-between items-center py-3 border-b border-gray-100">
          <div className="flex flex-col gap-1">
            <div className="h-4 bg-gray-200 rounded w-32" />
            <div className="h-3 bg-gray-200 rounded w-20" />
          </div>
          <div className="h-8 bg-gray-200 rounded-full w-24" />
        </div>
      ))}
    </div>
  )
}

export default function ServiceDetailPage({ params }) {
  const { id } = use(params)
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    getServices().then((data) => {
      const found = data.find((s) => s.id === parseInt(id))
      setService(found || null)
      setLoading(false)
    })
  }, [id])

  const handleRequest = (itemName) => {
    const message = encodeURIComponent(
      `Hello, I am interested in the ${itemName} service under ${service.category}.`
    )
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank")
  }

  if (loading) return (
    <div className="min-h-screen bg-[#D6E4D3] py-6">
      <Header />
      <ServiceDetailSkeleton />
    </div>
  )

  if (!service) return (
    <div className="min-h-screen bg-[#D6E4D3] py-6">
      <Header />
      <div className="text-center py-20 text-gray-500">Service not found</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#D6E4D3] py-6">
      <Header />

      <div className="px-4 pb-10">

        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-gray-600 text-[13px] mb-4 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft size={16} />
          Back to Services
        </button>

        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-[#EEF5EE] flex items-center justify-center mb-4">
          {service.image ? (
            <Image
              src={service.image}
              alt={service.category}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          ) : (
            <span className="text-[60px]">✨</span>
          )}
        </div>

        <h1 className="text-[20px] font-bold text-gray-900 mb-6">
          {service.category}
        </h1>

        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="text-[14px] font-semibold text-gray-800">
              Available Services
            </h2>
          </div>

          <div className="divide-y divide-gray-50">
            {service.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-start px-4 py-3 gap-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-gray-800">
                    {item.name}
                  </p>
                  {item.description && (
                    <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                  <p className="text-[12px] font-semibold text-[#D65A5A] mt-0.5">
                    ₦{item.price.toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleRequest(item.name)}
                  className="bg-[#D65A5A] text-white text-[11px] font-medium px-3 py-1.5 rounded-full hover:bg-[#c44f4f] transition-colors shrink-0"
                >
                  Request Service
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}