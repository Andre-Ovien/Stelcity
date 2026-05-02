import { notFound } from "next/navigation"
import Link from "next/link"
import Header from "../../components/Header"

const posts = {
  "best-skincare-routine-for-oily-skin-nigeria": {
    title: "Best Skincare Routine for Oily Skin in Nigeria",
    date: "May 2, 2026",
    description: "If you have oily skin in Nigeria, you know the struggle, the heat and humidity make it worse. Here is a simple routine that actually works.",
    content: [
      { heading: null, body: "If you have oily skin in Nigeria, you know the struggle, the heat and humidity make it worse. Here is a simple skincare routine that actually works." },
      { heading: "Morning Routine", body: null },
      { heading: "Step 1: Cleanser", body: "Use a gentle foaming cleanser to remove excess oil without stripping your skin. Look for ingredients like salicylic acid or niacinamide." },
      { heading: "Step 2: Toner", body: "A lightweight toner helps balance your skin's pH and minimise pores. Avoid alcohol-based toners as they dry out the skin and cause more oil production." },
      { heading: "Step 3: Moisturiser", body: "Yes, oily skin still needs moisture. Use a lightweight, oil free moisturiser. Skipping this step makes your skin produce more oil." },
      { heading: "Step 4: Sunscreen", body: "This is non negotiable. Use SPF 30 or higher every morning, even on cloudy days." },
      { heading: "Evening Routine", body: null },
      { heading: "Step 1: Double Cleanse", body: "Remove makeup and sunscreen with a cleansing oil first, then follow with your foaming cleanser." },
      { heading: "Step 2: Treatment", body: "Use a niacinamide or retinol serum to reduce oil production and improve skin texture over time." },
      { heading: "Step 3: Moisturiser", body: "A lightweight gel moisturiser works best at night for oily skin." },
      { heading: "Final Tips", body: "Wash your pillowcase every week. Never sleep with makeup on. Drink at least 2 litres of water daily. Avoid touching your face throughout the day. Consistency is key, stick to this routine for at least 4 weeks before judging the results." },
    ],
  },
  "where-to-buy-affordable-skincare-products-nigeria": {
    title: "Where to Buy Affordable Skincare Products in Nigeria",
    date: "April 30, 2026",
    description: "Finding quality skincare products in Nigeria that are affordable and genuine can be challenging. Here is what you need to know.",
    content: [
      { heading: null, body: "Finding quality skincare products in Nigeria that are affordable and genuine can be challenging. Here is what you need to know before buying." },
      { heading: "The Problem With Buying Skincare in Nigeria", body: "Many skincare products sold in local markets and on social media are counterfeit. Using fake products can damage your skin permanently. Always buy from a trusted source." },
      { heading: "What to Look For When Buying Skincare Online", body: null },
      { heading: "1. Clear ingredient list", body: "Any legitimate skincare product will display its full ingredient list. Avoid products with no ingredient information." },
      { heading: "2. Dermatologist tested", body: "Look for products that have been tested and approved by dermatologists. This ensures they are safe for your skin type." },
      { heading: "3. Return policy", body: "A trustworthy skincare store will have a clear return or exchange policy." },
      { heading: "4. Customer reviews", body: "Real reviews from verified customers give you confidence in the product before buying." },
      { heading: "Why Stelcity", body: "Stelcity is a Nigerian skincare brand based in Lagos offering premium, dermatologist-tested skincare products, raw materials and professional beauty services. All products are cruelty-free and made with natural ingredients. We offer fast delivery across Nigeria and our products are trusted by over 10,000 happy customers." },
      { heading: "Tips for Saving Money on Skincare", body: "Buy in bundles - it is almost always cheaper per item. Follow Stelcity on Instagram for discount announcements. Subscribe to our newsletter for early access to sales. Buy raw materials and make your own products,we stock everything you need." },
    ],
  },
  "how-to-get-glowing-skin-naturally-lagos": {
    title: "How to Get Glowing Skin Naturally in Lagos",
    date: "April 27, 2026",
    description: "Everyone wants glowing healthy skin. The good news is you do not need expensive treatments to achieve it.",
    content: [
      { heading: null, body: "Everyone wants glowing, healthy skin. The good news is you do not need expensive treatments to achieve it. Here is how." },
      { heading: "Why Lagos Skin Needs Extra Care", body: "Lagos weather,the heat, humidity, dust and pollution takes a toll on your skin. A proper skincare routine is not a luxury, it is necessary." },
      { heading: "5 Things That Give You Glowing Skin", body: null },
      { heading: "1. Hydration", body: "Drink at least 2 litres of water daily. No skincare product can replace what water does for your skin from the inside." },
      { heading: "2. Vitamin C Serum", body: "Vitamin C brightens the skin, fades dark spots and protects against environmental damage. Apply every morning before your moisturiser." },
      { heading: "3. Exfoliation", body: "Exfoliate 2–3 times per week to remove dead skin cells that make skin look dull. Use a gentle chemical exfoliant, avoid harsh physical scrubs." },
      { heading: "4. Sunscreen", body: "This is the single most effective anti-ageing and brightening product available. UV damage is the number one cause of dull, uneven skin tone. Use SPF 30 or higher every single day." },
      { heading: "5. Sleep", body: "Your skin repairs itself while you sleep. Getting 7–8 hours consistently makes a visible difference within weeks." },
      { heading: "What to Avoid", body: "Bleaching creams damage the skin barrier permanently. Harsh soaps with high pH, they strip natural oils. Skipping moisturiser even oily skin needs hydration. Inconsistency, skincare only works when done daily." },
      {heading: "Products We Recommend", body: "Stelcity stocks everything you need for a glowing skin routine. Browse our skincare products in Lagos at stelcity.com/products or learn more about skincare in Lagos at stelcity.com/skincare-in-lagos"},
    ],
  },
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params
  const post = posts[resolvedParams.slug]
  if (!post) return { title: "Post Not Found" }
  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `https://www.stelcity.com/blog/${resolvedParams.slug}`,
    },
    openGraph: {
      title: `${post.title} | Stelcity`,
      description: post.description,
      url: `https://www.stelcity.com/blog/${resolvedParams.slug}`,
      images: [{ url: "/images/og-banner.jpg", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: ["/images/og-banner.jpg"],
    },
  }
}

export default async function BlogPost({ params }) {
  const resolvedParams = await params
  const post = posts[resolvedParams.slug]
  if (!post) notFound()

  return (
    <div className="min-h-screen bg-[#D6E4D3]">
      <Header />
      <main className="max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-2 lg:py-7">

        <Link
          href="/blog"
          className="text-sm text-gray-400 hover:text-[#D65A5A] mb-8 inline-block transition-colors"
        >
          ← Back to Blog
        </Link>

        <p className="text-xs text-gray-400 mb-3">{post.date}</p>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-8 leading-tight">
          {post.title}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10 lg:gap-16 items-start">

          
          <div className="flex flex-col gap-6">
            {post.content.map((section, i) => (
              <div key={i}>
                {section.heading && (
                  <h2 className="text-[15px] sm:text-[16px] lg:text-[18px] xl:text-[20px] font-bold text-gray-900 mb-2">
                    {section.heading}
                  </h2>
                )}
                {section.body && (
                  <p className="text-[14px] sm:text-[15px] lg:text-[16px] xl:text-[17px] text-gray-600 leading-relaxed">
                    {section.body}
                  </p>
                )}
              </div>
            ))}
          </div>

          
          <aside className="hidden lg:flex flex-col gap-6 sticky top-6">
            <div className="p-6 bg-[#F7F6F6] rounded-2xl text-center">
              <p className="text-sm font-semibold text-gray-800 mb-4">
                Ready to start your skincare journey?
              </p>
              <Link
                href="/products"
                className="inline-block bg-[#D65A5A] text-white font-semibold px-6 py-3 rounded-full text-sm hover:bg-[#c44f4f] transition-all active:scale-95 w-full text-center"
              >
                Shop Products
              </Link>
            </div>

            <div className="p-6 border border-gray-100 rounded-2xl">
              <p className="text-sm font-bold text-gray-800 mb-4">More Posts</p>
              <div className="flex flex-col gap-3">
                {Object.entries(posts)
                  .filter(([slug]) => slug !== resolvedParams.slug)
                  .map(([slug, p]) => (
                    <Link
                      key={slug}
                      href={`/blog/${slug}`}
                      className="text-sm text-gray-600 hover:text-[#D65A5A] transition-colors leading-snug"
                    >
                      {p.title}
                    </Link>
                  ))}
              </div>
            </div>
          </aside>

        </div>

    
        <div className="mt-14 p-6 bg-[#F7F6F6] rounded-2xl text-center lg:hidden">
          <p className="text-sm font-semibold text-gray-800 mb-4">
            Ready to start your skincare journey?
          </p>
          <Link
            href="/products"
            className="inline-block bg-[#D65A5A] text-white font-semibold px-8 py-3 rounded-full text-sm hover:bg-[#c44f4f] transition-all active:scale-95"
          >
            Shop Stelcity Products
          </Link>
        </div>

      </main>
    </div>
  )
}