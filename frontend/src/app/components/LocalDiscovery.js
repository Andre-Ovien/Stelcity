import Image from "next/image"
import Link from "next/link"
import { ArrowRight, MapPin } from "lucide-react"
import { BUSINESS } from "../lib/site"

const DISCOVERY_LINKS = [
  {
    number: "01",
    title: "Shop skincare in Lagos",
    description:
      "Browse daily skincare and targeted routines, with delivery options confirmed during checkout.",
    href: "/products",
    linkLabel: "Explore products",
  },
  {
    number: "02",
    title: "Book a facial in Agbara",
    description:
      "Find the treatment menu, understand your options, and book a visit from one clear page.",
    href: "/our-services/facial-treatment",
    linkLabel: "Explore facials",
  },
  {
    number: "03",
    title: "Source raw materials",
    description:
      "Shop botanical powders, butters, carrier oils, and formulation essentials across Nigeria.",
    href: "/raw-materials",
    linkLabel: "Browse raw materials",
  },
]

export default function LocalDiscovery() {
  return (
    <section className="bg-[#f8f7f2] px-5 py-20 text-[#1d241e] sm:px-8 sm:py-24 lg:px-14 lg:py-28">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid gap-9 border-b border-[#1d241e]/12 pb-10 lg:grid-cols-[1fr_0.52fr] lg:items-end">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#778c73]">
              Stelcity in Lagos
            </p>
            <h2 className="mt-4 max-w-[780px] text-[42px] font-black leading-[0.92] tracking-[-0.055em] sm:text-[58px] lg:text-[70px]">
              Find the right place to begin.
            </h2>
          </div>
          <div className="lg:justify-self-end">
            <div className="flex items-start gap-3 text-sm leading-6 text-[#687067]">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-[#c56f64]" aria-hidden="true" />
              <p>{BUSINESS.address}</p>
            </div>
            <Link
              href="/skincare-in-lagos"
              className="mt-5 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#1d241e] transition hover:text-[#778c73]"
            >
              Explore Stelcity in Lagos
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 scrollbar-hide lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0">
          {DISCOVERY_LINKS.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex min-h-[300px] min-w-[84vw] snap-start flex-col justify-between overflow-hidden p-6 transition hover:-translate-y-1 sm:min-w-[58vw] sm:p-8 lg:min-w-0 ${
                index === 1
                  ? "bg-[#e7d1c4]"
                  : index === 2
                    ? "bg-[#dfe6dc]"
                    : "bg-[#fffefb] ring-1 ring-[#1d241e]/10"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black tracking-[0.18em] text-[#7d8479]">
                  {item.number}
                </span>
                <span className="grid h-10 w-10 place-items-center rounded-full border border-[#1d241e]/15 transition group-hover:bg-[#1d241e] group-hover:text-white">
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </div>
              <div>
                <h3 className="max-w-[310px] text-[28px] font-black leading-[0.98] tracking-[-0.045em] sm:text-[32px]">
                  {item.title}
                </h3>
                <p className="mt-4 max-w-[330px] text-sm leading-6 text-[#636b61]">
                  {item.description}
                </p>
                <span className="mt-6 inline-flex text-[10px] font-black uppercase tracking-[0.13em] text-[#1d241e]">
                  {item.linkLabel}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="relative mt-3 min-h-[250px] overflow-hidden sm:min-h-[320px]">
          <Image
            src="/images/lagos-skincare-maker.webp"
            alt="A Nigerian skincare maker arranging botanical ingredients in a sunlit studio"
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover object-[72%_center] sm:object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(29,36,30,0.86)_0%,rgba(29,36,30,0.46)_48%,rgba(29,36,30,0.06)_100%)]" />
          <div className="relative z-10 flex min-h-[250px] max-w-[560px] flex-col justify-center p-7 text-white sm:min-h-[320px] sm:p-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/65">
              Local guide
            </p>
            <p className="mt-4 font-serif text-[29px] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[40px]">
              Products, treatments, training, and formulation supplies—connected in one place.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
