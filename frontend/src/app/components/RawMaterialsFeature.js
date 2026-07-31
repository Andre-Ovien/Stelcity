import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const RawMaterialsFeature = () => {
  return (
    <section className="relative -mt-16 min-h-[720px] overflow-hidden bg-[#d7ad8f] text-[#21150e] lg:-mt-20">
      <Image
        src="/images/raw-materials-minimal-hero.png"
        alt="Natural skincare raw materials with shea butter, botanical powder, carrier oil, and fruit"
        fill
        sizes="100vw"
        className="object-cover object-[64%_center]"
      />
      <div className="absolute inset-x-0 top-0 z-[1] h-32 bg-[linear-gradient(180deg,rgba(216,184,162,0.92)_0%,rgba(216,184,162,0.45)_46%,rgba(216,184,162,0)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(239,227,213,0.94)_0%,rgba(239,227,213,0.78)_32%,rgba(239,227,213,0.24)_58%,rgba(239,227,213,0)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,246,228,0.16)_0%,rgba(255,246,228,0)_36%,rgba(69,39,21,0.12)_100%)]" />

      <div className="relative z-10 mx-auto flex min-h-[720px] max-w-[1280px] items-center px-5 py-20 sm:px-8 lg:px-14">
        <div className="max-w-[560px]">
          <h2 className="max-w-[540px] text-[46px] font-black leading-[0.9] tracking-normal sm:text-[64px] lg:text-[78px]">
            Raw materials for radiant blends
          </h2>

          <p className="mt-6 max-w-[430px] text-sm leading-6 text-[#5f4938] sm:text-base">
            Buy cosmetic and skincare raw materials in Nigeria, including
            botanical powders, rich butters, carrier oils, and formulation
            actives for your next blend.
          </p>

          <Link
            href="/raw-materials"
            className="mt-8 inline-flex h-12 items-center gap-3 rounded-full bg-[#21150e] px-7 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#3a271b]"
          >
            Browse raw materials
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default RawMaterialsFeature
