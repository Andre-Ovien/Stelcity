import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  GraduationCap,
  MapPin,
  PackageCheck,
  ShoppingBag,
  Sparkles,
} from "lucide-react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import BreadcrumbSchema from "../components/BreadcrumbSchema"
import StructuredData from "../components/StructuredData"
import LocationMap from "../components/LocationMap"
import {
  BUSINESS,
  SITE_URL,
  SOCIAL_LINKS,
  getGoogleMapsUrl,
} from "../lib/site"

export const metadata = {
  title: "Skincare in Lagos: Products, Facials & Training",
  description:
    "Explore skincare products with Lagos delivery, facial treatments in Agbara, raw materials and practical skincare training from Stelcity.",
  alternates: {
    canonical: "/skincare-in-lagos",
  },
  openGraph: {
    title: "Skincare in Lagos: Products, Facials & Training | Stelcity",
    description:
      "Shop skincare, explore facial treatments in Agbara, source raw materials and discover practical training with Stelcity.",
    url: "/skincare-in-lagos",
    images: [
      {
        url: "/images/lagos-skincare-consultation.webp",
        width: 1672,
        height: 941,
        alt: "Two Nigerian women discussing skincare in a warm studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Skincare in Lagos: Products, Facials & Training | Stelcity",
    description:
      "A clearer way to shop skincare, book treatments and learn with Stelcity in Agbara, Lagos.",
    images: ["/images/lagos-skincare-consultation.webp"],
  },
}

const PATHWAYS = [
  {
    number: "01",
    icon: ShoppingBag,
    eyebrow: "Shop",
    title: "Skincare products in Lagos",
    description:
      "Browse everyday care and targeted routines online, then confirm the delivery option for your address during checkout.",
    href: "/products",
    linkLabel: "Shop in Lagos",
    tone: "bg-[#f4dfd4]",
  },
  {
    number: "02",
    icon: Sparkles,
    eyebrow: "Visit",
    title: "Facial treatments in Agbara",
    description:
      "Explore the treatment menu and plan an in-person visit to the Stelcity studio near Badagry.",
    href: "/our-services/facial-treatment",
    linkLabel: "Plan a treatment",
    tone: "bg-[#dfe6dc]",
  },
  {
    number: "03",
    icon: PackageCheck,
    eyebrow: "Formulate",
    title: "Raw materials across Nigeria",
    description:
      "Source botanical powders, butters, carrier oils and formulation essentials from the online catalogue.",
    href: "/raw-materials",
    linkLabel: "Browse raw materials",
    tone: "bg-[#f5efe5]",
  },
  {
    number: "04",
    icon: GraduationCap,
    eyebrow: "Learn",
    title: "Skincare training in Lagos or online",
    description:
      "Review the practical two-week programme, curriculum and available online or physical learning formats.",
    href: "/training-programs",
    linkLabel: "Explore training",
    tone: "bg-[#e8ddd5]",
  },
]

const JOURNAL_LINKS = [
  {
    category: "Routine notes",
    title: "Best skincare routine for oily skin in Nigeria",
    description:
      "Build a simple morning and evening routine for oily-feeling skin in Nigeria’s heat and humidity.",
    href: "/blog/best-skincare-routine-for-oily-skin-nigeria",
    image: "/images/blog-oily-skin-routine-nigeria.webp",
    imageAlt:
      "A Nigerian woman applying lightweight skincare while looking in a bathroom mirror",
    imagePosition: "object-center",
    readTime: "5 min read",
    linkLabel: "Build your routine",
  },
  {
    category: "Skin confidence",
    title: "How to get glowing skin naturally in Lagos",
    description:
      "Five practical habits for skin navigating Lagos heat, humidity, dust, and daily exposure.",
    href: "/blog/how-to-get-glowing-skin-naturally-lagos",
    image: "/images/blog-glowing-skin-lagos.webp",
    imageAlt:
      "A Nigerian woman applying sunscreen beside a bright window in Lagos",
    imagePosition: "object-[64%_center]",
    readTime: "5 min read",
    linkLabel: "Read the glow guide",
  },
  {
    category: "Buying guide",
    title: "Where to buy affordable skincare products in Nigeria",
    description:
      "A clearer checklist for comparing skincare products and sellers before you place an order.",
    href: "/blog/where-to-buy-affordable-skincare-products-nigeria",
    image: "/images/blog-skincare-buying-guide-nigeria.webp",
    imageAlt:
      "A Nigerian woman comparing two unbranded skincare products before buying",
    imagePosition: "object-[52%_center]",
    readTime: "4 min read",
    linkLabel: "Shop more carefully",
  },
]

const FAQS = [
  {
    question: "Where is Stelcity located?",
    answer: `Stelcity is located at ${BUSINESS.address}.`,
  },
  {
    question: "Can I order skincare products for delivery in Lagos?",
    answer:
      "Yes. Browse the online skincare catalogue, add your preferred products to your bag and confirm the available delivery option for your address during checkout.",
  },
  {
    question: "How do I book a facial treatment in Agbara?",
    answer:
      "Open the facial treatments guide or the full service menu, choose the treatment category that interests you and contact Stelcity on WhatsApp to arrange your visit.",
  },
  {
    question: "Does Stelcity sell skincare raw materials?",
    answer:
      "Yes. The raw-material catalogue includes botanical powders, nourishing butters, carrier oils and other formulation essentials available to order in Nigeria.",
  },
  {
    question: "Is skincare training available online?",
    answer:
      "The Stelcity training programme offers online and physical learning formats. The training page contains the curriculum, pricing and enquiry route.",
  },
]

export default function SkincareInLagosPage() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    "@id": `${SITE_URL}/skincare-in-lagos#agbara-studio`,
    name: `${BUSINESS.name} Agbara Studio`,
    description:
      "Skincare products, facial treatments, formulation raw materials and practical skincare training in Agbara, Lagos State.",
    url: `${SITE_URL}/skincare-in-lagos`,
    image: `${SITE_URL}/images/lagos-skincare-consultation.webp`,
    telephone: BUSINESS.phoneInternational,
    email: BUSINESS.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.streetAddress,
      addressLocality: BUSINESS.locality,
      addressRegion: BUSINESS.region,
      addressCountry: BUSINESS.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: BUSINESS.mapCoordinates.latitude,
      longitude: BUSINESS.mapCoordinates.longitude,
    },
    hasMap: getGoogleMapsUrl(),
    priceRange: "₦₦",
    currenciesAccepted: "NGN",
    parentOrganization: {
      "@id": `${SITE_URL}/#organization`,
    },
    sameAs: [SOCIAL_LINKS.facebook, SOCIAL_LINKS.instagram],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Stelcity products, treatments and training",
      itemListElement: [
        {
          "@type": "OfferCatalog",
          name: "Skincare products",
          url: `${SITE_URL}/products`,
        },
        {
          "@type": "OfferCatalog",
          name: "Facial treatments",
          url: `${SITE_URL}/our-services/facial-treatment`,
        },
        {
          "@type": "OfferCatalog",
          name: "Skincare raw materials",
          url: `${SITE_URL}/raw-materials`,
        },
      ],
    },
  }
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }

  return (
    <div className="min-h-screen bg-[#f8f7f2] text-[#1d241e]">
      <StructuredData data={localBusinessSchema} />
      <StructuredData data={faqSchema} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Skincare in Lagos", url: "/skincare-in-lagos" },
        ]}
      />

      <Header immersive />

      <main>
        <section className="relative overflow-hidden bg-[#ead8c8] px-5 pb-16 pt-28 sm:px-8 sm:pb-20 sm:pt-32 lg:px-14 lg:pb-24 lg:pt-36">
          <div className="pointer-events-none absolute -left-28 top-28 h-80 w-80 rounded-full bg-[#f6dfd3]/75 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-[18%] h-72 w-72 rounded-full bg-[#b7c0ad]/40 blur-3xl" />

          <div className="relative mx-auto grid max-w-[1280px] gap-12 lg:min-h-[640px] lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
            <div className="relative z-10 max-w-[610px]">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#766256]/16 bg-[#fff8ef]/60 px-3 py-2 text-[9px] font-black uppercase tracking-[0.17em] text-[#6b5a50]">
                <MapPin className="h-3.5 w-3.5 text-[#c56f64]" aria-hidden="true" />
                Stelcity · Agbara, Lagos
              </div>
              <h1 className="mt-6 text-[50px] font-black leading-[0.88] tracking-[-0.065em] sm:text-[70px] lg:text-[84px]">
                Skincare in Lagos,
                <span className="block font-serif text-[0.77em] font-normal italic tracking-[-0.045em] text-[#ba685f]">
                  made easier to navigate.
                </span>
              </h1>
              <p className="mt-7 max-w-[520px] text-[15px] leading-7 text-[#66564d] sm:text-base">
                Shop skincare and formulation supplies, explore facial treatments
                or begin practical training with Stelcity in Agbara. Start with
                exactly what you came looking for.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/products"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#1d241e] px-6 text-xs font-black text-white transition hover:-translate-y-0.5 hover:bg-[#354033]"
                >
                  Shop skincare
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/our-services/facial-treatment"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#1d241e]/22 bg-[#fff8ef]/35 px-6 text-xs font-black text-[#1d241e] transition hover:bg-[#fff8ef]"
                >
                  Explore treatments
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="relative min-h-[430px] sm:min-h-[560px] lg:min-h-full">
              <div className="absolute inset-0 overflow-hidden rounded-[30px] border border-[#1d241e]/10 bg-[#d8c8bc] shadow-[0_30px_90px_rgba(73,49,35,0.16)]">
                <LocationMap />
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 sm:py-24 lg:px-14 lg:py-28">
          <div className="mx-auto max-w-[1280px]">
            <header className="grid gap-7 border-b border-[#1d241e]/12 pb-10 lg:grid-cols-[1fr_0.48fr] lg:items-end">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#778c73]">
                  Choose your route
                </p>
                <h2 className="mt-4 max-w-[780px] text-[42px] font-black leading-[0.92] tracking-[-0.055em] sm:text-[58px] lg:text-[70px]">
                  One address. Four ways to begin.
                </h2>
              </div>
              <p className="max-w-[430px] text-sm leading-6 text-[#697268] lg:justify-self-end">
                Each guide answers a different search, so you can move directly
                from what you need to the right catalogue, booking page, or
                programme.
              </p>
            </header>

            <div className="mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 scrollbar-hide md:grid md:grid-cols-2 md:overflow-visible md:pb-0">
              {PATHWAYS.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex min-h-[320px] min-w-[84vw] snap-start flex-col justify-between overflow-hidden p-6 transition hover:-translate-y-1 sm:p-8 md:min-w-0 ${item.tone}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black tracking-[0.18em] text-[#7d8479]">
                        {item.number}
                      </span>
                      <span className="grid h-11 w-11 place-items-center rounded-full border border-[#1d241e]/14 transition group-hover:bg-[#1d241e] group-hover:text-white">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#788276]">
                        {item.eyebrow}
                      </p>
                      <h3 className="mt-3 max-w-[490px] text-[31px] font-black leading-[0.98] tracking-[-0.045em] sm:text-[38px]">
                        {item.title}
                      </h3>
                      <p className="mt-4 max-w-[500px] text-sm leading-6 text-[#626b60]">
                        {item.description}
                      </p>
                      <span className="mt-6 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.13em]">
                        {item.linkLabel}
                        <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#edf1ea] px-5 py-20 sm:px-8 sm:py-24 lg:px-14 lg:py-28">
          <div className="mx-auto max-w-[1280px]">
            <div className="grid gap-7 border-b border-[#1d241e]/10 pb-10 lg:grid-cols-[1fr_0.48fr] lg:items-end">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#73836f]">
                  Stelcity journal
                </p>
                <h2 className="mt-4 max-w-[760px] text-[39px] font-black leading-[0.94] tracking-[-0.055em] sm:text-[56px] lg:text-[64px]">
                  A little clarity before your next step.
                </h2>
              </div>
              <div className="lg:justify-self-end">
                <p className="max-w-[410px] text-sm leading-6 text-[#667164]">
                  Practical routines, local skin guidance, and buying notes to
                  help you choose with more confidence.
                </p>
                <Link
                  href="/blog"
                  className="mt-5 inline-flex w-fit items-center gap-2 text-[10px] font-black uppercase tracking-[0.13em]"
                >
                  Browse every journal note
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-[1.12fr_0.88fr]">
              <Link
                href={JOURNAL_LINKS[0].href}
                className="group overflow-hidden rounded-[30px] border border-[#1d241e]/8 bg-[#f2dfd6] transition hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(71,54,43,0.12)]"
              >
                <div className="relative min-h-[300px] overflow-hidden sm:min-h-[360px]">
                  <Image
                    src={JOURNAL_LINKS[0].image}
                    alt={JOURNAL_LINKS[0].imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 56vw"
                    className={`object-cover transition duration-700 group-hover:scale-[1.025] ${JOURNAL_LINKS[0].imagePosition}`}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,rgba(29,36,30,0.16)_100%)]" />
                </div>
                <div className="p-6 sm:p-8">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-[9px] font-black uppercase tracking-[0.17em] text-[#7f716b]">
                      {JOURNAL_LINKS[0].category}
                    </p>
                    <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#7f716b]">
                      {JOURNAL_LINKS[0].readTime}
                    </span>
                  </div>
                  <h3 className="mt-4 max-w-[650px] text-[30px] font-black leading-[0.98] tracking-[-0.045em] sm:text-[39px]">
                    {JOURNAL_LINKS[0].title}
                  </h3>
                  <p className="mt-4 max-w-[600px] text-sm leading-6 text-[#675b56]">
                    {JOURNAL_LINKS[0].description}
                  </p>
                  <span className="mt-7 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.13em]">
                    {JOURNAL_LINKS[0].linkLabel}
                    <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </div>
              </Link>

              <div className="grid gap-4">
                {JOURNAL_LINKS.slice(1).map((article) => (
                <Link
                  key={article.href}
                  href={article.href}
                    className="group grid min-h-[270px] overflow-hidden rounded-[28px] border border-[#1d241e]/8 bg-[#fffaf3] transition hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(53,66,52,0.1)] sm:grid-cols-[0.42fr_0.58fr]"
                >
                    <div className="relative min-h-[210px] overflow-hidden sm:min-h-full">
                      <Image
                        src={article.image}
                        alt={article.imageAlt}
                        fill
                        sizes="(max-width: 640px) 100vw, 22vw"
                        className={`object-cover transition duration-700 group-hover:scale-[1.035] ${article.imagePosition}`}
                      />
                    </div>
                    <div className="flex flex-col justify-between p-6">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#7c8779]">
                          {article.category}
                        </p>
                        <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#8a9187]">
                          {article.readTime}
                        </span>
                      </div>
                      <div className="mt-8">
                        <h3 className="text-[24px] font-black leading-[1] tracking-[-0.04em]">
                          {article.title}
                        </h3>
                        <p className="mt-4 text-xs leading-5 text-[#657064]">
                          {article.description}
                        </p>
                        <span className="mt-6 inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.12em]">
                          {article.linkLabel}
                          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" aria-hidden="true" />
                        </span>
                      </div>
                  </div>
                </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 sm:py-24 lg:px-14 lg:py-28">
          <div className="mx-auto max-w-[1040px]">
            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#778c73]">
                Local questions
              </p>
              <h2 className="mx-auto mt-4 max-w-[760px] text-[39px] font-black leading-[0.94] tracking-[-0.055em] sm:text-[56px]">
                What people ask before they begin.
              </h2>
            </div>

            <div className="mt-12 divide-y divide-[#1d241e]/12 border-y border-[#1d241e]/12">
              {FAQS.map((faq, index) => (
                <details key={faq.question} className="group py-1">
                  <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 py-4 text-left marker:hidden">
                    <span className="flex items-start gap-4">
                      <span className="mt-1 text-[9px] font-black tracking-[0.15em] text-[#899086]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[16px] font-black leading-6 tracking-[-0.025em] sm:text-[17px]">
                        {faq.question}
                      </span>
                    </span>
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#1d241e]/15 text-lg font-normal group-open:bg-[#1d241e] group-open:text-white">
                      +
                    </span>
                  </summary>
                  <p className="pb-6 pl-9 pr-10 text-sm leading-7 text-[#657064] sm:pl-12">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
