"use client"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

const testimonials = [
  {
    id: 1,
    name: "Esther",
    color: "bg-[#b8a1f8]",
    text: "I tried their body wash and also got a massage session. Everything felt premium and relaxing. I'll definitely be coming back.",
  },
  {
    id: 2,
    name: "Rachel",
    color: "bg-[#98d67e]",
    text: "I ordered raw materials for my skincare line and the quality was exactly what I needed. My products feel better and last longer now.",
  },
  {
    id: 3,
    name: "Mercy",
    color: "bg-[#e94a86]",
    text: "I've been using the face serum and the glass skin set for a few weeks. My skin looks brighter and feels smoother.",
  },
]

const ClientReviews = () => {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

 
  const nextIdx = (current + 1) % testimonials.length
  const nextNextIdx = (current + 2) % testimonials.length

  return (
    <section className="bg-[#d5e4cc] py-16 px-6 w-full flex flex-col items-center overflow-hidden">
      <h2 className="text-[28px] sm:text-[36px] font-semibold mb-14 text-center tracking-tight">
        What Our Clients Say
      </h2>

      <div className="relative w-full max-w-[320px] sm:max-w-100">
        
      
        <div 
          className={`absolute inset-0 translate-x-4 translate-y-4 rotate-6 rounded-4xl border-2  ${testimonials[nextNextIdx].color} opacity-40`} 
          aria-hidden="true"
        />
        
        
        <div 
          className={`absolute inset-0 translate-x-2 translate-y-2 -rotate-3 rounded-4xl border-2 ${testimonials[nextIdx].color} opacity-70`} 
          aria-hidden="true"
        />

        
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`relative z-10 ${testimonials[current].color}   rounded-4xl p-6 sm:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
          >
            <div className="flex text-yellow-500 text-lg mb-3">
              ★★★★★
            </div>
            
            <p className="text-black font-medium text-sm sm:text-base leading-relaxed mb-6">
              `{testimonials[current].text} ``
            </p>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white border-2  flex items-center justify-center font-bold text-sm shrink-0">
                {testimonials[current].name[0]}
              </div>
              <span className="font-bold text-xs sm:text-sm uppercase tracking-widest">
                {testimonials[current].name}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      
      <div className="flex gap-3 mt-16">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2.5 rounded-full transition-all duration-300 border ${
              i === current ? "bg-black w-8" : "bg-black/20 w-2.5"
            }`}
          />
        ))}
      </div>
    </section>
  )
}

export default ClientReviews