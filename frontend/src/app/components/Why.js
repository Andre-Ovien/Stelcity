const standards = [
  {
    number: "01",
    title: "Ingredients with intention",
    content:
      "Carefully selected ingredients chosen for comfort, effectiveness, and everyday use.",
  },
  {
    number: "02",
    title: "Skin-first formulas",
    content:
      "Thoughtful products developed around skin safety and dependable care.",
  },
  {
    number: "03",
    title: "Made for real routines",
    content:
      "Straightforward skincare that fits different needs, goals, and lifestyles.",
  },
]

export default function Why() {
  return (
    <section id="why" className="bg-[#dce4d5] px-5 py-20 text-[#172016] sm:px-8 sm:py-24 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid items-end gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:gap-20">
          <div>
            <p className="mb-5 text-[10px] font-black uppercase tracking-[0.3em] text-[#6e7e69] sm:text-xs">
              Why Stelcity
            </p>
            <h2 className="max-w-[840px] text-[48px] font-black leading-[0.94] tracking-[-0.05em] sm:text-[68px] lg:text-[clamp(68px,6.4vw,96px)]">
              Good skin shouldn&apos;t feel like
              <span className="ml-2 inline-block font-serif font-normal italic text-[#cf7168] sm:ml-3">
                guesswork.
              </span>
            </h2>
          </div>

          <p className="max-w-[460px] text-sm leading-6 text-[#53604f] sm:text-base sm:leading-7 lg:pb-2">
            We keep skincare thoughtful and uncomplicated, so choosing what feels
            right for your skin becomes easier.
          </p>
        </div>

        <div className="mt-14 grid border-y border-[#172016]/25 sm:mt-18 md:grid-cols-3 lg:mt-20">
          {standards.map((standard, index) => (
            <article
              key={standard.number}
              className={`py-8 md:min-h-[240px] md:px-8 md:py-10 lg:min-h-[260px] lg:px-10 ${
                index > 0
                  ? "border-t border-[#172016]/25 md:border-l md:border-t-0"
                  : ""
              }`}
            >
              <p className="font-serif text-sm italic text-[#cf7168]">
                {standard.number}
              </p>
              <h3 className="mt-9 max-w-[280px] text-2xl font-black leading-tight tracking-[-0.025em] lg:text-[28px]">
                {standard.title}
              </h3>
              <p className="mt-4 max-w-[315px] text-sm leading-6 text-[#53604f]">
                {standard.content}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
