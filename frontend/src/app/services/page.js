"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import Header from "../components/Header"
import { getServices } from "../lib/services"

const WHATSAPP_NUMBER = "2348144316917"

function ServiceAccordion({ service }) {
  const [open, setOpen] = useState(false)

  const handleRequest = () => {
    const message = encodeURIComponent(
      `Hello, I am interested in the ${service.category} service.`
    )
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank")
  }

  return (
    <div className={`rounded-2xl overflow-hidden border transition-all ${
      open ? "border-[#D65A5A]" : "border-gray-200"
    }`}>

      
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full flex justify-between items-center px-5 py-4 text-left transition-colors ${
          open ? "bg-white" : "bg-white"
        }`}
      >
        <span className={`text-[15px] font-medium ${open ? "text-[#D65A5A]" : "text-gray-700"}`}>
          {service.category}
        </span>
        {open
          ? <ChevronUp size={18} className="text-[#D65A5A]" />
          : <ChevronDown size={18} className="text-gray-400" />
        }
      </button>

      
      {open && (
        <div className="bg-white border-t border-gray-100 px-5 pt-3 pb-4">
          
          
          <ul className="flex flex-col gap-2 mb-4">
            {service.items.map((item) => (
              <li key={item.id} className="text-[14px] text-gray-600">
                {item.name}
              </li>
            ))}
          </ul>

         
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

function ServiceSkeleton() {
  return (
    <div className="border border-gray-200 rounded-2xl h-14 animate-pulse bg-gray-100" />
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
    <div className="min-h-screen bg-[#D6E4D3] py-6">
      <Header />

      <div className="px-4 pb-10">
        <h1 className="text-[22px] font-bold text-gray-900 text-center mb-6">
          Our Services
        </h1>

        <div className="flex flex-col gap-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <ServiceSkeleton key={i} />
              ))
            : services.map((service) => (
                <ServiceAccordion key={service.id} service={service} />
              ))
          }
        </div>
      </div>
    </div>
  )
}