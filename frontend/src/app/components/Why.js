const features = [
  { icon: "🌿", label: "Natural Ingredients" },
  { icon: "✅", label: "Dermatologist Tested" },
  { icon: "🌍", label: "For All Skin Types" },
]

const Why = () => {
  return (
    <section className=" my-6 bg-[#EEF5EE]  px-4 py-8">
      <h2 className="text-[22px] font-bold text-gray-900 mb-6">
        Why Stelcity?
      </h2>

      <div className="flex gap-3 items-stretch">

        
        <div className="flex flex-col justify-between gap-3 flex-1">
          {features.map((f) => (
            <div
              key={f.label}
              className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-3 py-3"
            >
              <span className="text-[14px]">{f.icon}</span>
              <span className="text-[13px] font-medium text-gray-700">
                {f.label}
              </span>
            </div>
          ))}
        </div>

        
        <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-center">
          <p className="text-[#D65A5A] text-[15px] font-semibold italic leading-snug text-center">
            Formulas designed with skin safety and effectiveness in mind.
          </p>
        </div>

      </div>
    </section>
  )
}

export default Why