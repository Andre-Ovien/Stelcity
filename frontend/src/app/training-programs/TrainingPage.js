"use client"

import Image from "next/image"
import { useState } from "react"
import { ArrowRight, Check, ChevronDown, ChevronUp } from "lucide-react"
import Header from "../components/Header"
import Footer from "../components/Footer"

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2348092221127"

const WEEKS = [
  {
    week: "Week 1",
    topics: [
      {
        id: "w1-1",
        title: "Face: Treatment on Acne",
        items: ["Acne Cream", "Acne Serum", "Acne Face Wash"],
      },
      {
        id: "w1-2",
        title: "Hyperpigmentation",
        items: ["Vitamin C Serum", "Kojic Acid Cream", "SPF Moisturizer"],
      },
      {
        id: "w1-3",
        title: "Skincare Topics",
        items: ["Skin Types", "Routine Building", "Ingredient Knowledge"],
      },
    ],
  },
  {
    week: "Week 2",
    topics: [
      {
        id: "w2-1",
        title: "Stretch Marks Treatment",
        items: ["Body Butter", "Retinol Cream", "Massage Techniques"],
      },
      {
        id: "w2-2",
        title: "Extras",
        items: ["Hair Care", "Body Scrubs", "Packaging Tips"],
      },
    ],
  },
]

const PRICING = {
  online: 300000,
  physical: 700000,
}

const formatPrice = (price) => `₦${price.toLocaleString()}`

function TopicAccordion({ topic, isOpen, onToggle }) {
  const contentId = `${topic.id}-details`

  return (
    <div className="border-b" style={{ borderColor: "#d9ddd6" }}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={contentId}
        className="flex w-full items-center justify-between gap-5 py-4 text-left"
      >
        <span className={`text-[15px] font-black leading-tight tracking-[-0.02em] transition ${isOpen ? "text-[#1d241e]" : "text-[#566055]"}`}>
          {topic.title}
        </span>
        <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border transition ${isOpen ? "border-[#1d241e] bg-[#1d241e] text-white" : "border-[#b8c2b5] text-[#657062]"}`}>
          {isOpen
            ? <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
            : <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />}
        </span>
      </button>

      {isOpen && (
        <ul id={contentId} className="grid gap-2 pb-5 sm:grid-cols-2">
          {topic.items.map((item) => (
            <li key={item} className="flex items-center gap-2 text-[13px] leading-5 text-[#667064]">
              <Check className="h-3.5 w-3.5 shrink-0 text-[#748b70]" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function EnrolmentCard({ onRequest }) {
  return (
    <aside className="border p-5 sm:p-6 lg:sticky lg:top-28" style={{ borderColor: "#ccd5ca", backgroundColor: "#e3e9e1" }}>
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#64735f]">Training format</p>
      <h2 className="mt-3 text-[25px] font-black leading-[1] tracking-[-0.045em] text-[#1d241e]">
        Choose how you learn.
      </h2>

      <dl className="mt-6 divide-y border-y" style={{ borderColor: "#bdc9bb" }}>
        <div className="flex items-baseline justify-between gap-3 py-4">
          <dt className="text-sm font-bold text-[#52604f]">Online class</dt>
          <dd className="text-sm font-black text-[#1d241e]">{formatPrice(PRICING.online)}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-3 py-4">
          <dt className="text-sm font-bold text-[#52604f]">Physical class</dt>
          <dd className="text-sm font-black text-[#1d241e]">{formatPrice(PRICING.physical)}</dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={onRequest}
        className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#1d241e] px-5 text-xs font-black text-white transition hover:-translate-y-0.5 hover:bg-[#354033]"
      >
        Request training
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>
      <p className="mt-3 text-center text-[11px] leading-4 text-[#687566]">Ask for the full details on WhatsApp.</p>
    </aside>
  )
}

export default function TrainingPage() {
  const [openTopics, setOpenTopics] = useState({ "w1-1": true })

  const toggleTopic = (id) => {
    setOpenTopics((previous) => ({ ...previous, [id]: !previous[id] }))
  }

  const handleRequest = () => {
    const message = encodeURIComponent(
      "Hello, I am interested in the Advanced Skincare Training Program. Can you provide more details?"
    )
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank")
  }

  return (
    <div className="min-h-screen bg-[#f8f7f2] text-[#1d241e]">
      <Header />

      <main className="px-5 pb-16 pt-5 sm:px-8 sm:pb-20 sm:pt-8 lg:px-12 lg:pb-24">
        <div className="mx-auto max-w-[1240px]">
          <section className="learn-hero-grid overflow-hidden border" style={{ borderColor: "#d9ddd6", backgroundColor: "#fffefb" }}>
            <div className="flex flex-col justify-between p-6 sm:p-10 lg:p-12">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#748071]">Stelcity Learn</p>
                <h1 className="mt-5 max-w-[510px] text-[44px] font-black leading-[0.91] tracking-[-0.065em] text-[#1d241e] sm:text-[60px] lg:text-[clamp(54px,4.3vw,76px)]">
                  Advanced skincare training, made practical.
                </h1>
                <p className="mt-6 max-w-[470px] text-[16px] leading-7 text-[#61705f] sm:text-[17px]">
                  A comprehensive two-week programme designed to build the skincare knowledge and treatment techniques you can put into practice.
                </p>
              </div>

              <div className="mt-9 flex flex-col gap-5 sm:mt-12 sm:flex-row sm:items-center sm:gap-7">
                <button
                  type="button"
                  onClick={handleRequest}
                  className="inline-flex h-12 w-fit items-center justify-center gap-2 rounded-full bg-[#1d241e] px-6 text-xs font-black text-white transition hover:-translate-y-0.5 hover:bg-[#354033]"
                >
                  Request training
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
                <a href="#curriculum" className="inline-flex w-fit items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#5f6c5d] transition hover:text-[#1d241e]">
                  See the curriculum
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="relative min-h-[330px] overflow-hidden bg-[#d8dfd5] sm:min-h-[430px]">
              <Image
                src="/images/service-facial-treatment.png"
                alt="A practitioner applying a facial treatment in a calm studio"
                fill
                priority
                sizes="(max-width: 959px) calc(100vw - 40px), 650px"
                className="object-cover object-[55%_50%]"
              />
              <div className="absolute inset-x-0 bottom-0 flex flex-wrap gap-x-6 gap-y-2 bg-[#1d241e]/82 px-5 py-4 text-white backdrop-blur-sm sm:px-6">
                <span className="text-[10px] font-black uppercase tracking-[0.16em]">2 weeks</span>
                <span className="text-[10px] font-black uppercase tracking-[0.16em]">Online or physical</span>
              </div>
            </div>
          </section>

          <section id="curriculum" className="learn-curriculum-grid mt-16 gap-10 scroll-mt-28 sm:mt-20 lg:gap-16">
            <div>
              <div className="max-w-[660px] border-b pb-7 sm:pb-8" style={{ borderColor: "#d9ddd6" }}>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#748071]">The curriculum</p>
                <h2 className="mt-4 text-[36px] font-black leading-[0.95] tracking-[-0.055em] text-[#1d241e] sm:text-[48px]">
                  Learn the why, not just the steps.
                </h2>
                <p className="mt-5 max-w-[560px] text-[15px] leading-7 text-[#667064] sm:text-[16px]">
                  Work through the skin concerns, product choices, and practical topics that shape a thoughtful skincare practice.
                </p>
              </div>

              <div className="learn-week-grid mt-8 gap-x-10 gap-y-10 sm:mt-10">
                {WEEKS.map((week, index) => (
                  <section key={week.week}>
                    <div className="flex items-end justify-between border-b pb-4" style={{ borderColor: "#bfc9bc" }}>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#748071]">Module 0{index + 1}</p>
                        <h3 className="mt-2 text-[26px] font-black tracking-[-0.04em] text-[#1d241e]">{week.week}</h3>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#7d877a]">{week.topics.length} topics</span>
                    </div>
                    <div>
                      {week.topics.map((topic) => (
                        <TopicAccordion
                          key={topic.id}
                          topic={topic}
                          isOpen={!!openTopics[topic.id]}
                          onToggle={() => toggleTopic(topic.id)}
                        />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>

            <EnrolmentCard onRequest={handleRequest} />
          </section>

          <section className="mt-16 border px-6 py-9 sm:mt-20 sm:px-10 sm:py-11" style={{ borderColor: "#e2cfc4", backgroundColor: "#f6dfd3" }}>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#856c60]">Start with a conversation</p>
                <h2 className="mt-3 max-w-[560px] font-serif text-[29px] font-semibold leading-[1.13] tracking-[-0.03em] text-[#2a221e] sm:text-[36px]">
                  Want to know if this training is right for you?
                </h2>
              </div>
              <button
                type="button"
                onClick={handleRequest}
                className="inline-flex h-12 w-fit shrink-0 items-center justify-center gap-2 rounded-full bg-[#1d241e] px-6 text-xs font-black text-white transition hover:-translate-y-0.5 hover:bg-[#354033]"
              >
                Ask about the programme
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
