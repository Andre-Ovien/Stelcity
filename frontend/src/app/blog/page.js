import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import Newsletter from "../components/NewsLetter"
import BreadcrumbSchema from "../components/BreadcrumbSchema"
import { blogPosts } from "../lib/blogPosts"

export const metadata = {
  title: "Skincare Tips & Guides for Nigerian Skin",
  description:
    "Read practical skincare tips, routines, ingredient advice and buying guides created for healthy-looking skin in Nigeria.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Skincare Tips & Guides for Nigerian Skin | Stelcity",
    description:
      "Practical skincare tips, routines, ingredient advice and buying guides for healthy-looking skin in Nigeria.",
    url: "/blog",
    images: [{ url: "/images/og-banner.jpg", width: 1200, height: 634 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Skincare Tips & Guides for Nigerian Skin | Stelcity",
    description: "Practical skincare routines, ingredient advice and buying guides for Nigerian skin.",
    images: ["/images/og-banner.jpg"],
  },
}

function StoryMeta({ post, color = "#747a72" }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[9px] font-black uppercase tracking-[0.15em]" style={{ color }}>
      <span>{post.category}</span>
      <span aria-hidden="true" className="h-1 w-1 rounded-full bg-current opacity-60" />
      <span>{post.date}</span>
    </div>
  )
}

function JournalCard({ post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex min-w-0 flex-col overflow-hidden rounded-[8px] border transition duration-300 hover:-translate-y-1"
      style={{ backgroundColor: "#fffefb", borderColor: "#d9ddd6" }}
    >
      <div className="relative aspect-[1.38] overflow-hidden" style={{ backgroundColor: "#e9ede7" }}>
        <Image
          src={post.image}
          alt={post.imageAlt}
          fill
          sizes="(max-width: 719px) calc(100vw - 40px), (max-width: 959px) calc(50vw - 30px), 300px"
          className={`object-cover transition duration-700 group-hover:scale-[1.045] ${post.imagePosition}`}
        />
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <StoryMeta post={post} />
        <h2 className="mt-3 text-[18px] font-black leading-[1.08] tracking-[-0.04em]" style={{ color: "#1d241e" }}>
          {post.title}
        </h2>
        <p className="mt-3 line-clamp-3 text-xs leading-5" style={{ color: "#657064" }}>
          {post.description}
        </p>
        <span className="mt-5 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.12em]" style={{ color: "#1d241e" }}>
          Read article
          <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  )
}

export default function BlogPage() {
  const featuredPost = blogPosts.find((post) => post.featured) || blogPosts[0]

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8f7f2", color: "#1d241e" }}>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Skincare Journal", url: "/blog" },
        ]}
      />
      <Header />

      <main className="px-5 pb-16 pt-2 sm:px-8 sm:pb-20 lg:px-12">
        <div className="mx-auto max-w-[980px]">
          <section className="relative isolate flex min-h-[225px] items-center justify-center overflow-hidden text-center sm:min-h-[285px]" style={{ borderBottom: "1px solid #d9ddd6" }}>
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-full border sm:h-[330px] sm:w-[330px]" style={{ borderColor: "#dce1da" }} />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[150px] w-[150px] -translate-x-1/2 -translate-y-1/2 rounded-full border sm:h-[220px] sm:w-[220px]" style={{ borderColor: "#dce1da" }} />
            <div className="relative z-10 max-w-[430px] px-4">
              <h1 className="text-[40px] font-black leading-[0.95] tracking-[-0.06em] sm:text-[52px]" style={{ color: "#1d241e" }}>Stelcity Journal</h1>
              <p className="mx-auto mt-3 max-w-[310px] text-xs leading-5 sm:text-[13px]" style={{ color: "#687067" }}>Practical notes for more thoughtful everyday skincare.</p>
            </div>
          </section>

          {featuredPost && (
            <section className="pt-8 sm:pt-10" aria-labelledby="featured-story-title">
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="journal-feature-grid group overflow-hidden rounded-[8px] border transition hover:-translate-y-0.5"
                style={{ backgroundColor: "#e3e9e1", borderColor: "#ccd5ca" }}
              >
                <div className="flex min-h-[235px] flex-col justify-between p-5 sm:min-h-[280px] sm:p-6">
                  <div>
                    <StoryMeta post={featuredPost} color="#627062" />
                    <h2 id="featured-story-title" className="mt-4 max-w-[290px] text-[22px] font-black leading-[1.06] tracking-[-0.045em] sm:text-[26px]" style={{ color: "#1d241e" }}>
                      {featuredPost.title}
                    </h2>
                    <p className="mt-3 max-w-[285px] text-xs leading-5" style={{ color: "#5b665c" }}>
                      {featuredPost.description}
                    </p>
                  </div>
                  <span className="mt-6 inline-flex w-fit items-center gap-2 text-[10px] font-black uppercase tracking-[0.12em]" style={{ color: "#1d241e" }}>
                    Read the story
                    <span className="grid h-7 w-7 place-items-center rounded-full border transition group-hover:translate-x-1" style={{ borderColor: "#8e9a8e" }}>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  </span>
                </div>

                <div className="relative min-h-[235px] overflow-hidden sm:min-h-[280px]" style={{ backgroundColor: "#d1d9cf" }}>
                  <Image
                    src={featuredPost.image}
                    alt={featuredPost.imageAlt}
                    fill
                    priority
                    sizes="(max-width: 719px) calc(100vw - 40px), 600px"
                    className={`object-cover transition duration-700 group-hover:scale-[1.04] ${featuredPost.imagePosition}`}
                  />
                </div>
              </Link>
            </section>
          )}

          <section className="journal-update-grid mt-10 gap-7 py-8 sm:mt-11 sm:gap-8 sm:py-9" style={{ borderTop: "1px solid #d9ddd6", borderBottom: "1px solid #d9ddd6" }}>
            <Newsletter variant="journal" />
            <div className="border-t pt-6 sm:border-l sm:border-t-0 sm:pl-7 sm:pt-0" style={{ borderColor: "#d9ddd6" }}>
              <p className="text-[10px] font-black uppercase tracking-[0.16em]" style={{ color: "#7b8174" }}>Follow us</p>
              <p className="mt-3 max-w-[190px] text-xs leading-5" style={{ color: "#687067" }}>More skin notes and product moments on our social pages.</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a href="https://www.instagram.com/stelcityskincare_aesthetics" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.1em] transition hover:opacity-60" style={{ color: "#1d241e" }}>
                  Instagram <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                </a>
                <a href="https://www.facebook.com/Stelcityskincarenspa" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.1em] transition hover:opacity-60" style={{ color: "#1d241e" }}>
                  Facebook <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                </a>
              </div>
            </div>
          </section>

          <section className="pt-8 sm:pt-10" aria-label="Latest articles">
            <div className="journal-card-grid gap-4 sm:gap-5">
              {blogPosts.map((post) => (
                <JournalCard key={post.slug} post={post} />
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
