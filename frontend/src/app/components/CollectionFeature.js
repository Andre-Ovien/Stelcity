import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const CollectionFeature = () => {
  return (
    <section id="collection" className="relative overflow-hidden bg-[#d8b8a2] px-3 pb-24 pt-16 sm:px-5 lg:pb-32 lg:pt-24">
      <Image
        src="/images/earthy-collection-background.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-85"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(216,184,162,0.46),rgba(255,246,228,0.2))]" />

      <div className="relative z-10 mx-auto grid max-w-[1280px] overflow-hidden border border-white/70 bg-white/80 shadow-[0_24px_70px_rgba(42,30,18,0.12)] backdrop-blur-sm lg:min-h-[560px] lg:grid-cols-2">
        <div className="relative min-h-[360px] overflow-hidden bg-[#f3e7d9] sm:min-h-[460px] lg:min-h-full">
          <Image
            src="/images/skincare-confidence-closeup.png"
            alt="Two women with confident glowing skin in a skincare campaign close-up"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-[62%_center]"
          />
          <div className="absolute inset-x-0 bottom-0 flex items-center gap-4 overflow-hidden bg-[#17130f]/18 px-4 py-3 text-[12px] font-black uppercase tracking-[0.08em] text-white backdrop-blur-[2px] sm:text-sm">
            <span className="shrink-0">Clearer skin</span>
            <span className="shrink-0">Smoother glow</span>
            <span className="shrink-0">Healthy confidence</span>
          </div>
        </div>

        <div className="flex min-h-[430px] items-center bg-[#fff8f2]/92 px-7 py-12 text-[#17130f] sm:px-10 lg:px-14">
          <div className="max-w-[560px]">
            <p className="mb-5 inline-flex rounded-full border border-[#ded7cd] px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.08em] text-[#746b61]">
              Skin confidence
            </p>

            <h2 className="max-w-[560px] text-[48px] font-black leading-[0.9] tracking-normal sm:text-[66px] lg:text-[76px]">
              Glow like your skin knows it&apos;s cared for.
            </h2>

            <p className="mt-6 max-w-[430px] text-sm leading-6 text-[#60584f] sm:text-base">
              From daily essentials to targeted treatments, Stelcity helps you build a
              routine that supports clearer, softer, more confident-looking skin.
            </p>

            <Link
              href="/products"
              className="mt-8 inline-flex h-12 items-center gap-3 bg-[#17130f] px-7 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#2a241f]"
            >
              Browse our collection
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CollectionFeature
