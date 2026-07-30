"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState, use } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowDown, ArrowLeft, ArrowUpRight, MessageCircle, Sparkles } from "lucide-react"
import Header from "../../components/Header"
import { getServices } from "../../lib/services"

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2348092221127"

function formatPrice(price) {
  return `₦${Number(price || 0).toLocaleString()}`
}

function ServiceDetailSkeleton() {
  return (
    <div className="min-h-screen animate-pulse bg-[#fff8ef]">
      <Header immersive />
      <section className="bg-[#ead8c8] px-5 pb-20 pt-32 sm:px-8 lg:px-14 lg:pt-36">
        <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-2">
          <div>
            <div className="h-3 w-28 bg-[#8a776b]/20" />
            <div className="mt-6 h-20 w-4/5 bg-[#8a776b]/18" />
            <div className="mt-7 h-4 w-full max-w-lg bg-[#8a776b]/14" />
            <div className="mt-3 h-4 w-3/4 bg-[#8a776b]/14" />
          </div>
          <div className="min-h-[440px] rounded-[28px] bg-[#d4c2b4]" />
        </div>
      </section>
      <section className="px-5 py-20 sm:px-8 lg:px-14">
        <div className="mx-auto max-w-[1280px]">
          {["one", "two", "three"].map((item) => (
            <div key={item} className="grid gap-4 border-t border-[#806b5f]/12 py-8 lg:grid-cols-[70px_1fr_150px_180px]">
              <div className="h-4 w-8 bg-[#8a776b]/15" />
              <div><div className="h-6 w-1/2 bg-[#8a776b]/18" /><div className="mt-3 h-4 w-3/4 bg-[#8a776b]/12" /></div>
              <div className="h-5 w-24 bg-[#8a776b]/15" />
              <div className="h-11 w-36 bg-[#8a776b]/18" />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default function ServiceClient({ params, initialService = null }) {
  const { slug } = use(params)
  const hasMatchingInitialService = initialService?.slug === slug
  const [service, setService] = useState(
    hasMatchingInitialService ? initialService : null
  )
  const [loading, setLoading] = useState(!hasMatchingInitialService)

  useEffect(() => {
    if (hasMatchingInitialService) return undefined

    let isCurrent = true

    getServices()
      .then((data) => {
        if (!isCurrent) return
        const found = data.find((item) => item.slug === slug)
        setService(found || null)
      })
      .finally(() => {
        if (isCurrent) setLoading(false)
      })

    return () => {
      isCurrent = false
    }
  }, [hasMatchingInitialService, slug])

  const handleRequest = (itemName) => {
    const message = encodeURIComponent(
      `Hello, I would like to book the *${itemName}* service under *${service.category}*. Please let me know the availability.`
    )
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank", "noopener,noreferrer")
  }

  const handleGeneralRequest = () => {
    const message = encodeURIComponent(
      `Hello, I would like help choosing a service under *${service.category}*.`
    )
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank", "noopener,noreferrer")
  }

  if (loading) return <ServiceDetailSkeleton />

  if (!service) {
    return (
      <div className="min-h-screen bg-[#fff8ef] text-[#241b18]">
        <Header />
        <main className="flex min-h-[620px] flex-col items-center justify-center px-5 py-24 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-[#f6dfd3] text-[#c56f64]">
            <Sparkles className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
          </span>
          <h1 className="mt-6 text-[36px] font-black leading-none tracking-[-0.05em]">Service not found.</h1>
          <p className="mt-3 text-sm text-[#756258]">This treatment category may have moved or is no longer available.</p>
          <Link href="/our-services" className="mt-7 inline-flex h-11 items-center gap-2 rounded-full bg-[#241b18] px-6 text-xs font-black text-white">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to services
          </Link>
        </main>
      </div>
    )
  }

  const items = Array.isArray(service.items) ? service.items : []
  const prices = items.map((item) => Number(item.price)).filter(Number.isFinite)
  const startingPrice = prices.length > 0 ? Math.min(...prices) : null

  return (
    <div className="min-h-screen bg-[#fff8ef] text-[#241b18]">
      <Header immersive />

      <main>
        <section className="relative overflow-hidden bg-[#ead8c8] px-5 pb-20 pt-28 sm:px-8 sm:pb-24 sm:pt-32 lg:px-14 lg:pb-28 lg:pt-36">
          <div className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-[#f6dfd3]/80 blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-20 h-96 w-96 rounded-full bg-[#b8c1ae]/30 blur-3xl" />

          <div className="relative mx-auto max-w-[1280px]">
            <Link href="/our-services" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#6f5b51] transition hover:text-[#241b18]">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              All services
            </Link>

            <div className="mt-8 grid gap-12 lg:min-h-[610px] lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div className="relative z-10 max-w-[620px]">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#7f9277]">Stelcity appointment</p>
                <h1 className="mt-5 text-[52px] font-black leading-[0.88] tracking-[-0.06em] sm:text-[72px] lg:text-[88px]">
                  {service.category}
                </h1>

                {service.description && (
                  <p className="mt-7 max-w-[540px] text-sm leading-6 text-[#69564b] sm:text-base sm:leading-7">
                    {service.description}
                  </p>
                )}

                <dl className="mt-9 grid max-w-lg grid-cols-2 gap-4 border-y border-[#241b18]/12 py-5">
                  <div>
                    <dt className="text-[9px] font-black uppercase tracking-[0.15em] text-[#806c61]">Available care</dt>
                    <dd className="mt-2 text-lg font-black">{items.length} {items.length === 1 ? "service" : "services"}</dd>
                  </div>
                  <div>
                    <dt className="text-[9px] font-black uppercase tracking-[0.15em] text-[#806c61]">Starting from</dt>
                    <dd className="mt-2 text-lg font-black">{startingPrice !== null ? formatPrice(startingPrice) : "Enquire"}</dd>
                  </div>
                </dl>

                <a href="#treatment-menu" className="mt-8 inline-flex h-12 items-center gap-3 rounded-full bg-[#241b18] px-6 text-xs font-black text-white transition hover:-translate-y-0.5 hover:bg-[#3d302a]">
                  Explore treatments
                  <ArrowDown className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>

              <div className="relative min-h-[460px] overflow-hidden rounded-[30px] bg-[#cdb9a9] shadow-[0_30px_90px_rgba(71,47,34,0.16)] sm:min-h-[580px]">
                {service.image ? (
                  <Image
                    src={service.image}
                    alt={service.category}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,#879486,#c89e88)]">
                    <Sparkles className="absolute right-12 top-12 h-20 w-20 text-white/35" strokeWidth={1.2} aria-hidden="true" />
                  </div>
                )}
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(29,24,21,0.32)_100%)]" />
                <span className="absolute bottom-6 left-6 rounded-full border border-white/45 bg-[#fff8ef]/88 px-4 py-2 text-[9px] font-black uppercase tracking-[0.13em] text-[#3b302a] backdrop-blur-md sm:bottom-8 sm:left-8">
                  Professional care · Lagos
                </span>
              </div>
            </div>
          </div>
        </section>

        <section id="treatment-menu" className="bg-[#fff8ef] px-5 py-20 sm:px-8 sm:py-24 lg:px-14 lg:py-28">
          <div className="mx-auto max-w-[1280px]">
            <header className="grid gap-6 border-b border-[#241b18]/12 pb-10 lg:grid-cols-[1fr_0.45fr] lg:items-end">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#7f9277]">Treatment menu</p>
                <h2 className="mt-4 text-[42px] font-black leading-[0.92] tracking-[-0.055em] sm:text-[58px] lg:text-[70px]">
                  Choose your appointment.
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-6 text-[#6f5b51] lg:justify-self-end">
                Request a service and we’ll continue with availability and booking details on WhatsApp.
              </p>
            </header>

            {items.length === 0 ? (
              <div className="border-b border-[#241b18]/12 py-20 text-center">
                <Sparkles className="mx-auto h-8 w-8 text-[#c56f64]" strokeWidth={1.5} aria-hidden="true" />
                <h3 className="mt-5 text-2xl font-black tracking-[-0.035em]">No treatments are listed yet.</h3>
                <p className="mt-3 text-sm text-[#756258]">Please check back shortly.</p>
              </div>
            ) : (
              <ol>
                {items.map((item, index) => (
                  <li
                    key={item.id}
                    className="grid gap-x-8 gap-y-5 border-b border-[#241b18]/12 py-8 sm:py-10 lg:grid-cols-[70px_minmax(0,1fr)_160px_190px] lg:items-center"
                  >
                    <span className="text-[11px] font-black tracking-[0.14em] text-[#a38e81]">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div>
                      <h3 className="text-[24px] font-black leading-none tracking-[-0.035em] sm:text-[28px]">{item.name}</h3>
                      {item.description && item.description.trim() !== "" && (
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#746157]">{item.description}</p>
                      )}
                    </div>

                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#958176]">Treatment price</p>
                      <p className="mt-2 text-lg font-black text-[#c45f58]">{formatPrice(item.price)}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRequest(item.name)}
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#241b18] px-5 text-xs font-black text-white transition hover:-translate-y-0.5 hover:bg-[#3d302a] lg:justify-self-end"
                    >
                      Request service
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ol>
            )}

            <div className="mt-12 flex flex-col gap-6 rounded-[24px] bg-[#dfe5db] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#71806d]">A little unsure?</p>
                <h3 className="mt-2 text-[26px] font-black leading-none tracking-[-0.04em]">We’ll help you choose the right service.</h3>
              </div>
              <button
                type="button"
                onClick={handleGeneralRequest}
                className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full border border-[#40503e]/20 bg-[#fff8ef] px-6 text-xs font-black text-[#2f3b2e] transition hover:-translate-y-0.5 hover:bg-white"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Ask on WhatsApp
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
