"use client"

import { motion } from "framer-motion"
import { Quote, Sparkles } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Esther",
    role: "Formulator",
    color: "#7f9277",
    accent: "#e9f0df",
    rotate: -4,
    text: "The quality of the ingredients is top-notch. My formulations have been more stable and effective.",
  },
  {
    id: 2,
    name: "Rachel",
    role: "Skincare customer",
    color: "#d8786d",
    accent: "#fff0d4",
    rotate: 2.5,
    text: "Gentle on my skin and it actually works. I noticed visible improvements within a few weeks.",
  },
  {
    id: 3,
    name: "Mercy",
    role: "Verified buyer",
    color: "#edbdc0",
    accent: "#6f3e3b",
    rotate: -2,
    text: "Fast delivery and reliable products. My order arrived exactly as described and beautifully packaged.",
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

const ClientReviews = () => {
  return (
    <section className="bg-[#f7f0e6]">
      <div className="relative w-full overflow-hidden px-5 pb-10 pt-14 sm:px-10 sm:pb-16 sm:pt-16 lg:px-16 lg:pb-24 lg:pt-20">
        <div className="pointer-events-none absolute -left-8 top-24 h-24 w-24 rounded-full border-[18px] border-[#e7c66a]/50" />
        <Sparkles className="pointer-events-none absolute right-8 top-8 h-8 w-8 rotate-12 text-[#d8786d] sm:right-14 sm:top-12" strokeWidth={1.8} />

        <div className="relative z-10 mx-auto mb-10 max-w-3xl text-center sm:mb-14">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.34em] text-[#7f9277] sm:text-xs">
            Notes from our community
          </p>
          <h2 className="text-[34px] font-bold leading-[0.98] tracking-[-0.045em] text-[#171a16] sm:text-[48px] lg:text-[64px]">
            They tried it. Their skin
            <span className="ml-2 inline-block font-serif font-normal italic text-[#d8786d] sm:ml-3">
              said yes.
            </span>
          </h2>
          <span className="mx-auto mt-4 block h-[3px] w-28 -rotate-2 rounded-full bg-[#171a16]/70 sm:w-40" aria-hidden="true" />
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="relative z-10 mx-auto flex max-w-[1100px] flex-col items-center pb-3 pt-2 sm:pb-5 lg:flex-row lg:items-stretch lg:justify-center lg:py-8"
        >
          {testimonials.map((card, index) => (
            <motion.article
              key={card.id}
              variants={{
                hidden: { opacity: 0, y: 36, rotate: 0 },
                show: {
                  opacity: 1,
                  y: 0,
                  rotate: card.rotate,
                  transition: { type: "spring", stiffness: 120, damping: 17 },
                },
              }}
              whileHover={{ y: -10, rotate: 0, zIndex: 20 }}
              className={`relative flex min-h-[265px] w-[92%] max-w-[440px] flex-col justify-between rounded-[18px] border-2 border-[#171a16] p-6 shadow-[7px_9px_0_#171a16] sm:min-h-[290px] sm:p-7 lg:min-h-[365px] lg:w-[35%] lg:max-w-none lg:p-8 ${index ? "-mt-3 lg:-ml-[2.5%] lg:mt-0" : ""}`}
              style={{ backgroundColor: card.color, zIndex: index + 1 }}
            >
              <div>
                <div className="mb-7 flex items-start justify-between gap-4">
                  <span
                    className="inline-flex rounded-full border border-[#171a16] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#171a16]"
                    style={{ backgroundColor: card.accent }}
                  >
                    ★ ★ ★ ★ ★
                  </span>
                  <Quote className="h-9 w-9 text-[#171a16]" fill="currentColor" strokeWidth={1.5} />
                </div>

                <p className="font-serif text-[21px] font-semibold leading-[1.18] tracking-[-0.02em] text-[#171a16] sm:text-[24px] lg:text-[clamp(20px,2vw,27px)]">
                  “{card.text}”
                </p>
              </div>

              <div className="mt-8 flex items-center gap-3 border-t border-[#171a16]/65 pt-4">
                <div
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#171a16] text-sm font-black uppercase text-[#171a16]"
                  style={{ backgroundColor: card.accent }}
                >
                  {card.name[0]}
                </div>
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.08em] text-[#171a16]">{card.name}</p>
                  <p className="text-[11px] font-medium text-[#171a16]/70">{card.role}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default ClientReviews
