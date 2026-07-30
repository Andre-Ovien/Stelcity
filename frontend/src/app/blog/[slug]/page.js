import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import BreadcrumbSchema from "../../components/BreadcrumbSchema"
import StructuredData from "../../components/StructuredData"
import { getBlogPost, getRelatedBlogPosts } from "../../lib/blogPosts"

function StoryMeta({ post }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[9px] font-black uppercase tracking-[0.16em] text-[#747a72]">
      <span>{post.category}</span>
      <span aria-hidden="true" className="h-1 w-1 rounded-full bg-current opacity-60" />
      <span>{post.date}</span>
      <span aria-hidden="true" className="h-1 w-1 rounded-full bg-current opacity-60" />
      <span>{post.readTime}</span>
    </div>
  )
}

function SidebarPost({ post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex gap-3 py-3 transition hover:opacity-70"
    >
      <div className="relative h-14 w-16 shrink-0 overflow-hidden rounded-[5px] bg-[#e9ede7]">
        <Image
          src={post.image}
          alt={post.imageAlt}
          fill
          sizes="64px"
          className={`object-cover transition duration-500 group-hover:scale-105 ${post.imagePosition}`}
        />
      </div>
      <div className="min-w-0">
        <p className="text-[8px] font-black uppercase tracking-[0.14em] text-[#858b82]">
          {post.category}
        </p>
        <p className="mt-1 text-xs font-black leading-[1.2] tracking-[-0.025em] text-[#1d241e]">
          {post.title}
        </p>
      </div>
    </Link>
  )
}

function ArticleSidebar({ relatedPosts }) {
  return (
    <aside className="min-w-0" aria-label="More journal notes">
      <div className="border-t pt-5" style={{ borderColor: "#d9ddd6" }}>
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#747a72]">
          Read next
        </p>
        <div className="mt-2 divide-y" style={{ borderColor: "#d9ddd6" }}>
          {relatedPosts.map((relatedPost) => (
            <SidebarPost key={relatedPost.slug} post={relatedPost} />
          ))}
        </div>
      </div>

      <div className="mt-8 border-t pt-5" style={{ borderColor: "#d9ddd6" }}>
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#747a72]">
          Explore Stelcity
        </p>
        <div className="mt-3 flex flex-col divide-y" style={{ borderColor: "#d9ddd6" }}>
          <Link
            href="/products"
            className="flex items-center justify-between py-2.5 text-xs font-bold text-[#1d241e] transition hover:text-[#778c73]"
          >
            Skincare products
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
          <Link
            href="/raw-materials"
            className="flex items-center justify-between py-2.5 text-xs font-bold text-[#1d241e] transition hover:text-[#778c73]"
          >
            Raw materials
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
          <Link
            href="/our-services"
            className="flex items-center justify-between py-2.5 text-xs font-bold text-[#1d241e] transition hover:text-[#778c73]"
          >
            Beauty services
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
          <Link
            href="/skincare-in-lagos"
            className="flex items-center justify-between py-2.5 text-xs font-bold text-[#1d241e] transition hover:text-[#778c73]"
          >
            Skincare in Lagos
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
          <Link
            href="/training-programs"
            className="flex items-center justify-between py-2.5 text-xs font-bold text-[#1d241e] transition hover:text-[#778c73]"
          >
            Skincare training
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="mt-8 border-t pt-5" style={{ borderColor: "#d9ddd6" }}>
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#747a72]">
          Keep in touch
        </p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
          <a
            href="https://www.instagram.com/stelcityskincare_aesthetics"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.1em] text-[#1d241e] transition hover:text-[#778c73]"
          >
            Instagram
            <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
          </a>
          <a
            href="https://www.facebook.com/Stelcityskincarenspa"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.1em] text-[#1d241e] transition hover:text-[#778c73]"
          >
            Facebook
            <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
          </a>
        </div>
      </div>
    </aside>
  )
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = getBlogPost(slug)

  if (!post) return { title: "Post Not Found" }

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `https://www.stelcity.com/blog/${post.slug}`,
    },
    openGraph: {
      title: `${post.title} | Stelcity`,
      description: post.description,
      url: `https://www.stelcity.com/blog/${post.slug}`,
      images: [{ url: post.image, width: 1200, height: 630, alt: post.imageAlt }],
      type: "article",
      publishedTime: post.publishedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.image],
    },
  }
}

export default async function BlogPost({ params }) {
  const { slug } = await params
  const post = getBlogPost(slug)

  if (!post) notFound()

  const relatedPosts = getRelatedBlogPosts(post.slug)
  const articleSections = post.content.slice(1)
  const imageUrl = post.image.startsWith("http")
    ? post.image
    : `https://www.stelcity.com${post.image}`
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `https://www.stelcity.com/blog/${post.slug}#article`,
    headline: post.title,
    description: post.description,
    image: imageUrl,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    inLanguage: "en-NG",
    mainEntityOfPage: `https://www.stelcity.com/blog/${post.slug}`,
    author: {
      "@id": "https://www.stelcity.com/#organization",
    },
    publisher: {
      "@id": "https://www.stelcity.com/#organization",
    },
  }

  return (
    <div className="min-h-screen bg-[#f8f7f2] text-[#1d241e]">
      <StructuredData data={articleSchema} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Skincare Journal", url: "/blog" },
          { name: post.title, url: `/blog/${post.slug}` },
        ]}
      />
      <Header />

      <main className="px-5 pb-16 pt-6 sm:px-8 sm:pb-20 sm:pt-8 lg:px-12 lg:pb-24">
        <div className="mx-auto max-w-[1040px]">
          <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3 border-b pb-5" style={{ borderColor: "#d9ddd6" }}>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#637060] transition hover:text-[#1d241e]"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Back to journal
            </Link>
            <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#858b82]">
              Stelcity journal
            </p>
          </div>

          <div className="journal-article-grid mt-9 sm:mt-12">
            <article className="min-w-0">
              <div className="relative aspect-[1.56] overflow-hidden rounded-[8px] bg-[#e9ede7]">
                <Image
                  src={post.image}
                  alt={post.imageAlt}
                  fill
                  priority
                  sizes="(max-width: 859px) calc(100vw - 40px), 700px"
                  className={`object-cover ${post.imagePosition}`}
                />
              </div>

              <div className="mt-7 border-b pb-7 sm:mt-8 sm:pb-8" style={{ borderColor: "#d9ddd6" }}>
                <StoryMeta post={post} />
                <h1 className="mt-4 max-w-[720px] text-[36px] font-black leading-[0.98] tracking-[-0.055em] text-[#1d241e] sm:text-[48px] lg:text-[56px]">
                  {post.title}
                </h1>
                <p className="mt-5 max-w-[650px] font-serif text-[21px] leading-[1.4] tracking-[-0.025em] text-[#4d594d] sm:text-[25px]">
                  {post.description}
                </p>
              </div>

              <div className="mt-8 space-y-8 sm:mt-10 sm:space-y-10">
                {articleSections.map((section, index) => (
                  <section key={`${section.heading ?? "section"}-${index}`}>
                    {section.heading && !section.body && (
                      <h2 className="border-y py-3 text-[10px] font-black uppercase tracking-[0.18em] text-[#667364]" style={{ borderColor: "#d9ddd6" }}>
                        {section.heading}
                      </h2>
                    )}
                    {section.heading && section.body && (
                      <h2 className="text-[23px] font-black leading-[1.08] tracking-[-0.035em] text-[#1d241e] sm:text-[27px]">
                        {section.heading}
                      </h2>
                    )}
                    {section.body && (
                      <p className="mt-3 text-[15px] leading-7 text-[#586257] sm:mt-4 sm:text-[16px] sm:leading-8">
                        {section.body}
                      </p>
                    )}
                    {section.links && (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {section.links.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="inline-flex items-center gap-2 rounded-full border border-[#aeb8ab] px-4 py-2 text-[10px] font-black uppercase tracking-[0.1em] text-[#1d241e] transition hover:border-[#1d241e] hover:bg-[#1d241e] hover:text-white"
                          >
                            {link.label}
                            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                          </Link>
                        ))}
                      </div>
                    )}
                  </section>
                ))}
              </div>

              <section className="mt-12 border p-6 sm:mt-14 sm:p-7" style={{ borderColor: "#ccd5ca", backgroundColor: "#e3e9e1" }}>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#64735f]">Bring it to your routine</p>
                <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
                  <p className="max-w-[420px] font-serif text-[22px] font-semibold leading-[1.2] tracking-[-0.025em] text-[#1d241e] sm:text-[26px]">
                    Find skincare that suits the way your skin actually feels.
                  </p>
                  <Link
                    href="/products"
                    className="inline-flex w-fit items-center gap-2 text-[10px] font-black uppercase tracking-[0.12em] text-[#1d241e] transition hover:text-[#6e8069]"
                  >
                    Shop products
                    <span className="grid h-8 w-8 place-items-center rounded-full border border-[#8d9b8b]">
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  </Link>
                </div>
              </section>
            </article>

            <ArticleSidebar relatedPosts={relatedPosts} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
