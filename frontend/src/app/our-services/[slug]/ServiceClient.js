"use client"
export const dynamic = "force-dynamic"
import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import Image from "next/image"
import Header from "../../components/Header"       
import { getServices } from "../../lib/services"   

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2348092221127"

function ServiceDetailSkeleton() {
  return (
    <div className="animate-pulse px-4 pb-10 max-w-4xl mx-auto">
      <div className="md:flex md:gap-8">
        <div className="w-full md:w-2/5 aspect-video md:aspect-square rounded-2xl bg-gray-200 mb-4 md:mb-0" />
        <div className="md:flex-1 flex flex-col gap-3">
          <div className="h-6 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
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
      </div>
    </div>
  )
}

export default function ServiceClient({ params }) {
  const { slug } = use(params)
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    
    getServices().then((data) => {
      
      const found = data.find((s) => s.slug === slug)
      setService(found || null)
      setLoading(false)
    })
  }, [slug])

  const handleRequest = (itemName) => {
    const message = encodeURIComponent(
      `Hello, I would like to book the *${itemName}* service under *${service.category}*. Please let me know the availability.`
    )
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank")
  }

  if (loading) return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="mt-6">
        <ServiceDetailSkeleton />
      </div>
    </div>
  )

  if (!service) return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <span className="text-[50px]">✨</span>
        <p className="text-[15px] font-semibold text-gray-700">Service not found</p>
        <button
          onClick={() => router.push("/our-services")}
          className="bg-[#D65A5A] text-white px-6 py-2.5 rounded-full text-[13px] font-medium hover:bg-[#c44f4f] transition-colors"
        >
          Back to Services
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="px-4 md:px-8 lg:px-16 pb-10 max-w-4xl mx-auto xl:mt-7">

        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-gray-600 text-[13px] mb-4 hover:text-[#D65A5A] active:scale-95 transition-all"
        >
          <ChevronLeft size={16} />
          Back to Services
        </button>

        <div className="md:flex md:gap-8 md:items-start">

          
          <div className="relative w-full md:w-2/5 aspect-video rounded-2xl overflow-hidden bg-[#EEF5EE] flex items-center justify-center mb-4 md:mb-0 md:sticky md:top-4">
            {service.image ? (
              <Image
                src={service.image}
                alt={service.category}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
                priority
              />
            ) : (
              <span className="text-[60px]">✨</span>
            )}
          </div>

          
          <div className="md:flex-1">
            <h1 className="text-[20px] md:text-[24px] font-bold text-gray-900 mb-2">
              {service.category}
            </h1>

            {service.description && (
              <p className="text-[13px] sm:text-[14px] text-gray-500 leading-relaxed mb-4">
                {service.description}
              </p>
            )}

            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
              <div className="px-4 py-3 border-b border-gray-100">
                <h2 className="text-[14px] font-semibold text-gray-800">Available Services</h2>
              </div>

              <div className="divide-y divide-gray-50">
                {service.items.length === 0 ? (
                  <div className="px-4 py-6 text-center text-[13px] text-gray-400">
                    No services listed yet.
                  </div>
                ) : (
                  service.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-start px-4 py-3 gap-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-gray-800">{item.name}</p>
                        {item.description && item.description.trim() !== "" && (
                          <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                        <p className="text-[12px] font-semibold text-[#D65A5A] mt-1">
                          ₦{item.price.toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRequest(item.name)}
                        className="
                          bg-[#D65A5A] text-white text-[11px] font-medium
                          px-3 py-1.5 rounded-full shrink-0
                          transition-all duration-200
                          hover:bg-[#c44f4f] hover:-translate-y-0.5 hover:shadow-md
                          active:scale-95 active:bg-[#b83e3e]
                        "
                      >
                        Request Service
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* <button
              onClick={() => {
                const message = encodeURIComponent(
                  `Hello, I would like to enquire about your *${service.category}* services.`
                )
                window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank")
              }}
              className="
                w-full mt-4 py-3 rounded-full
                border-2 border-[#D65A5A] text-[#D65A5A]
                text-[13px] font-semibold
                transition-all duration-200
                hover:bg-[#D65A5A] hover:text-white hover:shadow-md
                active:scale-95
              "
            >
              General Enquiry via WhatsApp
            </button> */}
          </div>
        </div>
      </div>
    </div>
  )
}