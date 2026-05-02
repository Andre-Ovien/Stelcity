import Link from "next/link"
import Header from "../components/Header"

export const metadata = {
  title: "Skincare Blog - Tips & Guides",
  description: "Expert skincare tips, routines and guides for Nigerian skin. Learn how to get glowing healthy skin with Stelcity.",
  alternates: { canonical: "https://www.stelcity.com/blog" },
  openGraph: {
    title: "Skincare Blog | Stelcity",
    description: "Expert skincare tips, routines and guides for Nigerian skin.",
    url: "https://www.stelcity.com/blog",
    images: [{ url: "/images/og-banner.jpg", width: 1200, height: 630 }],
  },
}

const posts = [
  {
    slug: "best-skincare-routine-for-oily-skin-nigeria",
    title: "Best Skincare Routine for Oily Skin in Nigeria",
    excerpt: "If you have oily skin in Nigeria, you know the struggle. Here is a simple routine that actually works.",
    date: "April 15, 2026",
  },
  {
    slug: "where-to-buy-affordable-skincare-products-nigeria",
    title: "Where to Buy Affordable Skincare Products in Nigeria",
    excerpt: "Finding quality skincare products in Nigeria that are affordable and genuine can be challenging.",
    date: "April 15, 2026",
  },
  {
    slug: "how-to-get-glowing-skin-naturally-lagos",
    title: "How to Get Glowing Skin Naturally in Lagos",
    excerpt: "Everyone wants glowing healthy skin. The good news is you do not need expensive treatments.",
    date: "April 15, 2026",
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#D6E4D3]">
      <Header />
      <main className="max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 lg:py-7">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 text-center lg:text-left">
          Skincare Blog
        </h1>
        <p className="text-gray-500 text-sm lg:text-base mb-10 text-center lg:text-left">
          Tips, routines and guides for healthy skin in Nigeria.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group"
            >
              <div className="border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-all h-full flex flex-col">
                <p className="text-xs text-gray-400 mb-2">{post.date}</p>
                <h2 className="text-base lg:text-lg font-bold text-gray-900 group-hover:text-[#D65A5A] transition-colors mb-3 flex-1">
                  {post.title}
                </h2>
                <p className="text-sm lg:text-base text-gray-500 mb-4">
                  {post.excerpt}
                </p>
                <span className="text-sm text-[#D65A5A] font-medium">
                  Read more →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}