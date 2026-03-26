"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const features = [
  {
    icon: "🌿",
    label: "Natural Ingredients",
    content: "We use only the finest natural ingredients sourced from nature and it's free from harmful chemicals and toxins.",
  },
  {
    icon: "✅",
    label: "Dermatologist Tested",
    content: "Formulas designed with skin safety and effectiveness in mind.",
  },
  {
    icon: "🌍",
    label: "For All Skin Types",
    content: "Our formulas are carefully crafted to work beautifully on all skin types.",
  },
]

export default function Why() {
  const [activeIndex, setActiveIndex] = useState(1)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % features.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="my-6 bg-[#EEF5EE] px-5 py-8">
      <h2 className="text-[22px] sm:text-[26px] lg:text-[30px] font-bold text-gray-900 mb-6">
        Why Stelcity?
      </h2>

      
      <div className="flex gap-3 sm:gap-5 items-stretch">

        
        <div className="flex flex-col gap-3 flex-1">
          {features.map((f, i) => (
            <motion.div
              key={f.label}
              onClick={() => setActiveIndex(i)}
              animate={{
                scale: activeIndex === i ? 1.05 : 0.95,
                borderColor: activeIndex === i ? "#D65A5A" : "#e5e7eb",
              }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 bg-white border-2 rounded-2xl px-3 py-3 cursor-pointer"
            >
              <span className="text-[14px] sm:text-[16px] shrink-0">{f.icon}</span>
              <span className={`text-[12px] sm:text-[13px] lg:text-[14px] font-medium transition-colors leading-tight ${
                activeIndex === i ? "text-[#D65A5A]" : "text-gray-500"
              }`}>
                {f.label}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="flex-1 bg-white border-2 border-gray-200 rounded-3xl p-4 sm:p-5 flex items-center justify-center min-h-40 sm:min-h-45">
          <AnimatePresence mode="wait">
            <motion.p
              key={activeIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="text-[#D65A5A] text-[13px] sm:text-[14px] lg:text-[15px] font-semibold italic leading-snug text-center"
            >
              {features[activeIndex].content}
            </motion.p>
          </AnimatePresence>
        </div>

      </div>
    </section>
  )
}