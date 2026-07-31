import Image from "next/image"
import { CircleCheck, Droplets, Leaf, Sparkles, Star } from "lucide-react"

const HERO_CHIPS = [
  "Vitamin glow",
  "Hydration",
  "Pure oils",
  "Even tone",
  "No harshness",
  "Glow masks",
  "Daily repair",
  "Soft texture",
  "Clean routine",
  "Bright finish",
  "Skin barrier",
]

const Main = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7f5ef]">
      <Image
        src="/images/skincare-hero-glow-studio.png"
        alt="Woman applying a creamy face mask in a bright skincare studio"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[72%_center] sm:object-center"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(247,245,239,0.98)_0%,rgba(247,245,239,0.9)_31%,rgba(247,245,239,0.35)_56%,rgba(247,245,239,0.04)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,245,239,0.78)_0%,rgba(247,245,239,0)_28%,rgba(247,245,239,0.5)_100%)] lg:bg-none" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1480px] flex-col px-5 pb-5 pt-28 sm:px-8 lg:px-10 lg:pt-32">
        <div className="flex flex-1 items-center">
          <div className="max-w-[660px] pb-20 lg:pb-24">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#ded8cc] bg-white/72 px-3 py-2 text-xs font-bold text-[#504b45] shadow-[0_12px_30px_rgba(31,28,24,0.06)] backdrop-blur-md">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-[#eaff51] text-[#17130f]">
                <Sparkles className="h-3 w-3" aria-hidden="true" />
              </span>
              For skin that glows
            </div>

            <h1 className="max-w-[590px] text-[42px] font-black leading-[0.95] text-[#17130f] sm:text-[60px] lg:text-[70px]">
              Skincare Products That Let Your Inner Glow Shine Through
            </h1>

            <p className="mt-5 max-w-[520px] text-sm leading-6 text-[#5f5952] sm:text-base">
              Shop skincare products and cosmetic raw materials online across
              Nigeria, book professional facial treatments at our studio in
              Agbara, and explore practical skincare training with Stelcity.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href="#collection"
                className="rounded-full bg-[#eaff51] px-6 py-3 text-sm font-black text-[#17130f] shadow-[0_14px_30px_rgba(194,218,42,0.28)] transition hover:-translate-y-0.5 hover:bg-[#f2ff68] focus:outline-none focus:ring-2 focus:ring-[#17130f]/20"
              >
                Shop Now
              </a>

              <span className="flex items-center gap-2 text-xs font-bold text-[#5f5952]">
                <CircleCheck className="h-4 w-4 text-[#8a9b42]" aria-hidden="true" />
                Made for your skin
              </span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-5 left-1/2 hidden w-[min(88vw,1240px)] -translate-x-1/2 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_7%,black_93%,transparent)] lg:block">
          <div className="flex items-center justify-center gap-3">
            {HERO_CHIPS.map((chip, index) => {
              const Icon = index % 3 === 0 ? Leaf : index % 3 === 1 ? Droplets : Star
              const isActive = index === 2

              return (
                <span
                  key={chip}
                  className={`flex h-10 min-w-max items-center gap-2 rounded-full border px-5 text-xs font-bold backdrop-blur-md transition ${
                    isActive
                      ? "border-[#cfc8bd] bg-white/82 text-[#4f4a43] shadow-[0_10px_24px_rgba(31,28,24,0.08)]"
                      : "border-[#ebe6de] bg-white/48 text-[#8a837b] shadow-[0_8px_20px_rgba(31,28,24,0.04)]"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? "text-[#6f7f35]" : "text-[#a0ad74]"}`} aria-hidden="true" />
                  {chip}
                </span>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Main
