"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import Header from "../components/Header"

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

function TopicAccordion({ topic, isOpen, onToggle }) {
  return (
    <div className={`rounded-xl border transition-all ${isOpen ? "border-[#D65A5A]" : "border-gray-200"}`}>
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center px-4 py-3 text-left bg-white rounded-xl"
      >
        <span className={`text-[13px] sm:text-[14px] font-medium ${isOpen ? "text-[#D65A5A]" : "text-gray-700"}`}>
          {topic.title}
        </span>
        {isOpen
          ? <ChevronUp size={16} className="text-[#D65A5A] shrink-0" />
          : <ChevronDown size={16} className="text-gray-400 shrink-0" />
        }
      </button>

      {isOpen && (
        <div className="px-4 pb-3 bg-white rounded-b-xl">
          <ul className="flex flex-col gap-1.5">
            {topic.items.map((item) => (
              <li key={item} className="flex items-center gap-2 text-[13px] text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D65A5A] shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default function TrainingPage() {
  const [openTopics, setOpenTopics] = useState({ "w1-1": true })

  const toggleTopic = (id) => {
    setOpenTopics((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleRequest = () => {
    const message = encodeURIComponent(
      "Hello, I am interested in the Advanced Skincare Training Program. Can you provide more details?"
    )
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank")
  }

  return (
    <div className="min-h-screen bg-[#D6E4D3] py-0">
      <Header />

      <div className="px-4 pb-10 max-w-4xl mx-auto ">
        <h1 className="text-[24px] sm:text-[28px] font-bold text-gray-900 text-center mb-2  xl:mt-7">
          Advanced Training Content
        </h1>
        <p className="text-[13px] text-gray-500 text-center mb-8 max-w-md mx-auto">
          A comprehensive 2-week skincare training program designed to equip you with expert knowledge and techniques.
        </p>

        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100">


          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {WEEKS.map((week) => (
              <div key={week.week} className="flex flex-col gap-3">
                <h2 className="text-[16px] sm:text-[18px] font-bold text-gray-900">
                  {week.week}
                </h2>
                {week.topics.map((topic) => (
                  <TopicAccordion
                    key={topic.id}
                    topic={topic}
                    isOpen={!!openTopics[topic.id]}
                    onToggle={() => toggleTopic(topic.id)}
                  />
                ))}
              </div>
            ))}
          </div>

          
          <div className="h-px bg-gray-100 my-6" />

         
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-[14px]"></span>
              <span className="text-[13px] text-gray-500">
                Online Class:{" "}
                <span className="font-bold text-[#D65A5A]">
                  ₦{PRICING.online.toLocaleString()}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[14px]"></span>
              <span className="text-[13px] text-gray-500">
                Physical Class:{" "}
                <span className="font-bold text-[#D65A5A]">
                  ₦{PRICING.physical.toLocaleString()}
                </span>
              </span>
            </div>
          </div>

          
          <button
            onClick={handleRequest}
            className="w-full bg-[#D65A5A] text-white font-semibold py-3 rounded-full text-[14px] hover:bg-[#c44f4f] transition-colors"
          >
            Request Training
          </button>
        </div>
      </div>
    </div>
  )
}