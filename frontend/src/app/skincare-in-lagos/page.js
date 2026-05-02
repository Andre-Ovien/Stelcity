import Link from "next/link"
import Image from "next/image"
import Header from "../components/Header"

export const metadata = {
  title: "Best Skincare in Lagos | Products, Facials & Training - Stelcity",
  description:
    "Looking for the best skincare in Lagos? Stelcity offers dermatologist tested skincare products, professional facial treatments, acne treatment and beauty training in Lagos Nigeria.",
  alternates: {
    canonical: "https://www.stelcity.com/skincare-in-lagos",
  },
  openGraph: {
    title: "Best Skincare in Lagos | Products, Facials & Training - Stelcity",
    description:
      "Looking for the best skincare in Lagos? Stelcity offers dermatologist-tested skincare products, professional facial treatments, acne treatment and beauty training in Lagos Nigeria.",
    url: "https://www.stelcity.com/skincare-in-lagos",
    images: [{ url: "/images/og-banner.jpg", width: 1200, height: 630 }],
  },
}

export default function SkincareInLagosPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: "Stelcity",
    description:
      "Premium skincare products, professional facial treatments and beauty training in Lagos Nigeria.",
    url: "https://www.stelcity.com",
    telephone: "+2348092221127",
    email: "stellaefeturi1@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "No 430 Jida Plaza, Opp Redeem Church, Agbara Bus Stop",
      addressLocality: "Lagos",
      addressRegion: "Lagos",
      addressCountry: "NG",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "6.5116",
      longitude: "3.0690",
    },
    openingHours: "Mo-Sa 09:00-19:00",
    priceRange: "₦₦",
    servesCuisine: null,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Skincare Services",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Acne Facial Treatment Lagos" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Brightening Facial Lagos" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Chemical Peel Lagos" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Microdermabrasion Lagos" } },
      ],
    },
    sameAs: [
      "https://www.facebook.com/Stelcityskincarenspa",
      "https://www.instagram.com/stelcityskincare_aesthetics",
    ],
  }

  return (
    <div className="min-h-screen bg-[#D6E4D3] ">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <Header />

      
      <section className="max-w-4xl xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 lg:py-12 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight mb-6">
          The Best Skincare in Lagos
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-gray-500 max-w-2xl mx-auto mb-4">
          Stelcity is Lagos`s most trusted destination for{" "}
          <Link href="/products" className="text-[#D65A5A] font-medium hover:underline">
            premium skincare products
          </Link>
          , professional facial treatments and expert beauty training. Based in
          Agbara, delivering across all of Lagos and Nigeria.
        </p>
        <p className="text-sm lg:text-base text-gray-500 max-w-2xl mx-auto mb-8">
          Whether you need an{" "}
          <Link href="/our-services" className="text-[#D65A5A] font-medium hover:underline">
            acne treatment in Lagos
          </Link>
          , a brightening facial or a full skincare routine, we have you covered.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/products"
            className="bg-[#D65A5A] text-white font-bold px-8 py-3 rounded-full hover:bg-[#c44f4f] transition-all active:scale-95"
          >
            Shop Skincare Products
          </Link>
          <Link
            href="/our-services"
            className="border border-[#D65A5A] text-[#D65A5A] font-bold px-8 py-3 rounded-full hover:bg-[#fff0f0] transition-all active:scale-95"
          >
            Book a Facial Treatment
          </Link>
        </div>
      </section>

      
      <section className="bg-[#D6E4D3] py-14 lg:py-20">
        <div className="max-w-4xl xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Skincare Products in Lagos You Can Trust
          </h2>
          <p className="text-gray-500 text-sm lg:text-base mb-8 max-w-2xl">
            Finding genuine, effective{" "}
            <Link href="/products" className="text-[#D65A5A] font-medium hover:underline">
              skincare products in Lagos
            </Link>{" "}
            can be difficult. At Stelcity we stock only dermatologist-tested,
            natural and cruelty-free products, formulated for Nigerian skin and
            the Lagos climate. Every product is tested before it reaches you.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "✅",
                title: "Dermatologist Tested",
                body: "Every product is tested and approved by dermatologists, safe for sensitive and acne-prone skin.",
              },
              {
                icon: "🌿",
                title: "Natural Ingredients",
                body: "Gentle, natural ingredients formulated for Nigerian skin and Lagos humidity.",
              },
              {
                icon: "🚚",
                title: "Fast Lagos Delivery",
                body: "24-hour delivery within Lagos. Nationwide shipping across Nigeria.",
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100">
                <span className="text-2xl mb-3 block">{item.icon}</span>
                <h3 className="text-[15px] lg:text-[17px] font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-[13px] lg:text-[15px] text-gray-500 leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
          <p className="text-sm lg:text-base text-gray-500 mt-8">
            Looking for effective acne solutions? Explore our{" "}
            <Link href="/products" className="text-[#D65A5A] font-medium hover:underline">
              skincare products
            </Link>{" "}
            designed for Lagos weather and skin types. Need raw materials for
            your own formulations? Browse our{" "}
            <Link href="/raw-materials" className="text-[#D65A5A] font-medium hover:underline">
              skincare raw materials
            </Link>.
          </p>
        </div>
      </section>

      
      <section className="max-w-4xl xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          Professional Facial Treatments in Lagos
        </h2>
        <p className="text-gray-500 text-sm lg:text-base mb-4 max-w-2xl">
          Our trained therapists at our Agbara Lagos location offer a full range
          of professional{" "}
          <Link href="/our-services" className="text-[#D65A5A] font-medium hover:underline">
            facial treatment services in Lagos
          </Link>
          . From acne treatment to brightening facials and chemical peels.
        </p>
        <p className="text-gray-500 text-sm lg:text-base mb-8 max-w-2xl">
          Struggling with acne? Our{" "}
          <Link href="/our-services" className="text-[#D65A5A] font-medium hover:underline">
            acne treatment in Lagos
          </Link>{" "}
          combines professional spa procedures with our dermatologist-tested
          product sets for lasting results.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {[
            "Acne Facial Treatment Lagos",
            "Brightening Facial Lagos",
            "Chemical Peel Lagos",
            "Microdermabrasion Lagos",
            "Body Polishing Lagos",
            "Hydrating Facial Lagos",
            "Stretch Mark Treatment Lagos",
            "Teeth Whitening Lagos",
          ].map((service, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-4 border border-gray-100 rounded-xl"
            >
              <span className="text-[#D65A5A] font-bold">✦</span>
              <span className="text-[14px] lg:text-[15px] text-gray-700 font-medium">
                {service}
              </span>
            </div>
          ))}
        </div>
        <Link
          href="/our-services"
          className="inline-block bg-[#D65A5A] text-white font-bold px-8 py-3 rounded-full hover:bg-[#c44f4f] transition-all"
        >
          View All Services
        </Link>
      </section>

      
      <section className="bg-[#D6E4D3] py-14 lg:py-20">
        <div className="max-w-4xl xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            The Best Skincare Brand in Lagos
          </h2>
          <p className="text-gray-500 text-sm lg:text-base mb-6 max-w-2xl">
            Stelcity has grown to become one of the most trusted skincare brands
            in Lagos — known for combining professional spa services with
            effective, affordable skincare products. Trusted by over 10,000
            happy customers across Lagos and Nigeria.
          </p>
          <p className="text-gray-500 text-sm lg:text-base mb-8 max-w-2xl">
            We also run a{" "}
            <Link href="/training-programs" className="text-[#D65A5A] font-medium hover:underline">
              skincare training academy in Lagos
            </Link>{" "}
            for aspiring beauty professionals and spa owners — teaching
            formulation, aesthetics and skincare business skills.
          </p>

        
          <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6">
            What Our Customers in Lagos Say
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                name: "Esther",
                review:
                  "The quality of the ingredients is top-notch! My formulations have been more stable and effective since I started using Stelcity.",
              },
              {
                name: "Rachel",
                review:
                  "Gentle on my skin and it actually works. I noticed visible improvements in my acne within a few weeks.",
              },
              {
                name: "Mercy",
                review:
                  "Fast delivery and reliable products. My order arrived exactly as described and well-packaged.",
              },
            ].map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="text-yellow-400 text-sm mb-3">★★★★★</div>
                <p className="text-[13px] lg:text-[14px] text-gray-600 leading-relaxed mb-4">
                  {t.review}
                </p>
                <p className="text-[13px] font-semibold text-gray-800">
                  — {t.name}, Lagos
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="max-w-4xl xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          Visit Stelcity in Lagos
        </h2>
        <h3 className="text-base lg:text-lg font-semibold text-gray-700 mb-8">
          Serving Lagos Including Agbara, Festac, Surulere, Badagry and Lekki
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="flex flex-col gap-5">
            {[
              {
                label: "Address",
                value: "No 430 Jida Plaza, Opp Redeem Church, Agbara Bus Stop, Along Badagry Express Way, Lagos State",
              },
              { label: "Phone", value: "+234 809 222 1127" },
              { label: "Email", value: "stellaefeturi1@gmail.com" },
              { label: "Hours", value: "Monday – Saturday, 9:00 AM – 7:00 PM" },
              { label: "Delivery", value: "24-hour delivery within Lagos. Nationwide shipping available." },
            ].map((item, i) => (
              <div key={i}>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                  {item.label}
                </p>
                <p className="text-[14px] lg:text-[15px] text-gray-700">
                  {item.value}
                </p>
              </div>
            ))}
            <Link
              href="https://wa.me/2348092221127"
              target="_blank"
              className="inline-block mt-2 bg-[#25D366] text-white font-bold px-6 py-3 rounded-full text-sm hover:bg-[#1ebe5d] transition-all w-fit"
            >
              Chat on WhatsApp
            </Link>
          </div>

        
          <div className="w-full rounded-2xl overflow-hidden border border-gray-100">
            <iframe
              src="https://www.google.com/maps?q=Agbara+Bus+Stop+Badagry+Expressway+Lagos&output=embed"
              className="w-full h-72 lg:h-80 border-0"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              title="Stelcity location in Agbara Lagos"
            />
          </div>
        </div>
      </section>

      
      <section className="bg-[#D6E4D3] py-14 lg:py-20">
        <div className="max-w-4xl xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-8">
            Frequently Asked Questions About Skincare in Lagos
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[
              {
                q: "Where can I buy genuine skincare products in Lagos?",
                a: "Stelcity is a trusted source for genuine, dermatologist-tested skincare products in Lagos. We offer fast 24-hour delivery across Lagos.",
              },
              {
                q: "Do you offer acne treatment in Lagos?",
                a: "Yes — we offer professional acne facial treatments at our Agbara Lagos location. We also have acne skincare product sets for home use.",
              },
              {
                q: "What facial treatments are available in Lagos at Stelcity?",
                a: "We offer acne facials, brightening facials, chemical peels, microdermabrasion, hydrating facials and more at our Agbara spa.",
              },
              {
                q: "Do you deliver skincare products across Lagos?",
                a: "Yes — we offer 24-hour delivery within Lagos and nationwide shipping across Nigeria.",
              },
              {
                q: "Are your skincare products safe for sensitive skin?",
                a: "All Stelcity products are dermatologist tested and suitable for all skin types including sensitive and acne-prone skin.",
              },
              {
                q: "Do I need to book an appointment for facial treatments?",
                a: "Yes, we recommend booking in advance. Chat with us on WhatsApp to schedule your appointment.",
              },
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100">
                <p className="text-[13px] lg:text-[14px] font-semibold text-gray-800 mb-2">
                  {faq.q}
                </p>
                <p className="text-[12px] lg:text-[13px] text-gray-500 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    
      <section className="max-w-4xl xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20 text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          Start Your Skincare Journey in Lagos Today
        </h2>
        <p className="text-gray-500 text-sm lg:text-base mb-8 max-w-xl mx-auto">
          Join over 10,000 happy customers across Lagos and Nigeria who trust
          Stelcity for healthy, glowing skin. Shop online or visit us in Agbara.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/products"
            className="inline-block bg-[#D65A5A] text-white font-bold px-10 py-4 rounded-full text-base hover:bg-[#c44f4f] transition-all active:scale-95"
          >
            Shop Skincare Products
          </Link>
          <Link
            href="/our-services"
            className="inline-block border border-[#D65A5A] text-[#D65A5A] font-bold px-10 py-4 rounded-full text-base hover:bg-[#fff0f0] transition-all active:scale-95"
          >
            Book a Facial Treatment
          </Link>
        </div>
      </section>

    </div>
  )
}