"use client"

import { motion } from "framer-motion"

const testimonials = [
  {
    id: 1,
    name: "Esther",
    color: "bg-[#b8a1f8]",
    rotate: -6,
    text: "The quality of the ingredients is top-notch! My formulations have never been more stable and effective.",
  },
  {
    id: 2,
    name: "Rachel",
    color: "bg-[#98d67e]",
    rotate: 6,
    text: "The quality of the ingredients is top-notch! My formulations have never been more stable and effective.",
  },
  {
    id: 3,
    name: "Mercy",
    color: "bg-[#e94a86]",
    rotate: -6,
    text: "The quality of the ingredients is top-notch! My formulations have never been more stable and effective.",
  },
]

const ClientReviews= () => {
  return (
    <section className="bg-[#d5e4cc] py-10 px-4 flex flex-col items-center w-full overflow-hidden">
      <h2 className="text-[26px] sm:text-[32px] md:text-[40px] font-black mb-10 text-center">
        What Our Clients Say
      </h2>

      <div className="flex flex-col items-center w-full max-w-[320px] sm:max-w-95 md:max-w-110">
        {testimonials.map((card) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0, rotate: card.rotate }}
            viewport={{ once: true }}
            className={`${card.color} border border-black rounded-3xl p-5 w-full relative`}
            style={{ marginTop: card.id === 1 ? 0 : "15px" }}
          >
            <div className="flex text-yellow-400 text-[18px] mb-2">★★★★★</div>

            <p className="text-black font-semibold text-[13px] sm:text-[14px] leading-snug">
              {card.text}
            </p>

            <div className="mt-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white border border-black flex items-center justify-center font-bold text-[12px] shrink-0">
                {card.name[0]}
              </div>
              <span className="font-bold text-[13px]">{card.name}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default ClientReviews