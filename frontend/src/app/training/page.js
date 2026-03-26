"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import Header from "../components/Header"

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2348144316917"

const TRAINING_DATA = [
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
    onlinePrice: 300000,
    physicalPrice: 700000,
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
    onlinePrice: 300000,
    physicalPrice: 700000,
  },
]

function TopicAccordion({ topic, isOpen, onToggle }) {
  return (
    <div className={`rounded-xl border transition-all ${isOpen ? "border-[#D65A5A]" : "border-gray-200"}`}>
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center px-4 py-3 text-left bg-white rounded-xl"
      >
        <span className={`text-[14px] font-medium ${isOpen ? "text-[#D65A5A]" : "text-gray-700"}`}>
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

function WeekCard({ data }) {
  const [openTopic, setOpenTopic] = useState(data.topics[0].id)

  const handleRequestTraining = () => {
    const message = encodeURIComponent(
      `Hello, I am interested in the ${data.week} training program. Can you provide more details?`
    )
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank")
  }

  return (
    <div className="bg-white rounded-3xl p-5 flex flex-col gap-4 shadow-sm border border-gray-100">
      <h2 className="text-[18px] font-bold text-gray-900">{data.week}</h2>

      <div className="flex flex-col gap-3">
        {data.topics.map((topic) => (
          <TopicAccordion
            key={topic.id}
            topic={topic}
            isOpen={openTopic === topic.id}
            onToggle={() => setOpenTopic(openTopic === topic.id ? null : topic.id)}
          />
        ))}
      </div>

      <div className="flex items-center gap-4 mt-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px]"></span>
          <span className="text-[12px] text-gray-500">
            Online Class:{" "}
            <span className="font-semibold text-[#D65A5A]">
              ₦{data.onlinePrice.toLocaleString()}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px]"></span>
          <span className="text-[12px] text-gray-500">
            Physical Class:{" "}
            <span className="font-semibold text-[#D65A5A]">
              ₦{data.physicalPrice.toLocaleString()}
            </span>
          </span>
        </div>
      </div>

      <button
        onClick={handleRequestTraining}
        className="w-full bg-[#D65A5A] text-white font-semibold py-3 rounded-full text-[14px] hover:bg-[#c44f4f] transition-colors"
      >
        Request Training
      </button>
    </div>
  )
}

export default function TrainingPage() {
  return (
    <div className="min-h-screen bg-[#D6E4D3] py-6">
      <Header />

      <div className="px-4 pb-10 pt-6">
        <h1 className="text-[26px] font-bold text-gray-900 text-center mb-2">
          Advanced Training Content
        </h1>
        <p className="text-[13px] text-gray-500 text-center mb-8 max-w-md mx-auto">
          Professional skincare training designed to equip you with expert knowledge and techniques.
        </p>

        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {TRAINING_DATA.map((week) => (
            <WeekCard key={week.week} data={week} />
          ))}
        </div>
      </div>
    </div>
  )
}