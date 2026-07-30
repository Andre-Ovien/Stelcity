import Link from "next/link"
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa"
import { MdEmail, MdLocationOn } from "react-icons/md"
import Newsletter from "./NewsLetter"

const WHATSAPP_NUMBER = "2348092221127"

const shopLinks = [
  { label: "Products", href: "/products" },
  { label: "Raw Materials", href: "/raw-materials" },
  { label: "Services", href: "/our-services" },
  { label: "Training", href: "/training-programs" },
]

const exploreLinks = [
  { label: "Skincare in Lagos", href: "/skincare-in-lagos" },
  { label: "Skincare Blog", href: "/blog" },
  {
    label: "Oily Skin Tips",
    href: "/blog/best-skincare-routine-for-oily-skin-nigeria",
  },
  {
    label: "Glowing Skin Guide",
    href: "/blog/how-to-get-glowing-skin-naturally-lagos",
  },
]

const Footer = () => {
  const helpMessage = encodeURIComponent(
    "Hi, I need help with my order/product."
  )

  return (
    <footer className="bg-[#f6dfd3] px-5 pb-8 pt-28 text-[#241b18] sm:px-8 lg:px-14 lg:pt-32">
      <div className="mx-auto max-w-[1280px]">
        <Newsletter />

        <div className="mt-16 border-t border-[#241b18]/12 pt-12">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_1.8fr] lg:gap-16">
            <div>
              <Link
                href="/"
                className="font-serif text-[42px] font-semibold leading-none tracking-normal text-[#241b18]"
              >
                Stelcity
              </Link>

              <p className="mt-4 max-w-[330px] text-sm leading-6 text-[#6f5b51]">
                Clean skincare, thoughtful treatments, and glow-focused routines
                made for skin that keeps getting better.
              </p>

              <div className="mt-6 flex items-start gap-2 text-xs leading-5 text-[#7b6257]">
                <MdLocationOn className="mt-0.5 h-4 w-4 shrink-0 text-[#0f8a64]" />
                <span>
                  No 430 Jida Plaza, Opp Redeem Church, Agbara Bus Stop, Along
                  Badagry Express Way, Lagos State
                </span>
              </div>

              <div className="mt-7 flex gap-3">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat with Stelcity on WhatsApp"
                  className="grid h-10 w-10 place-items-center rounded-full border border-[#241b18]/12 bg-[#fff8ef]/70 text-[#241b18] transition hover:border-[#0f8a64] hover:bg-[#0f8a64] hover:text-white"
                >
                  <FaWhatsapp className="h-4 w-4" />
                </a>
                <a
                  href="https://www.instagram.com/stelcityskincare_aesthetics"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow Stelcity on Instagram"
                  className="grid h-10 w-10 place-items-center rounded-full border border-[#241b18]/12 bg-[#fff8ef]/70 text-[#241b18] transition hover:border-[#0f8a64] hover:bg-[#0f8a64] hover:text-white"
                >
                  <FaInstagram className="h-4 w-4" />
                </a>
                <a
                  href="https://www.facebook.com/Stelcityskincarenspa"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow Stelcity on Facebook"
                  className="grid h-10 w-10 place-items-center rounded-full border border-[#241b18]/12 bg-[#fff8ef]/70 text-[#241b18] transition hover:border-[#0f8a64] hover:bg-[#0f8a64] hover:text-white"
                >
                  <FaFacebook className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
              <div>
                <h4 className="text-sm font-black text-[#241b18]">Shop</h4>
                <div className="mt-4 flex flex-col gap-3">
                  {shopLinks.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="text-sm text-[#6f5b51] transition hover:text-[#241b18]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-black text-[#241b18]">Explore</h4>
                <div className="mt-4 flex flex-col gap-3">
                  {exploreLinks.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="text-sm text-[#6f5b51] transition hover:text-[#241b18]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-black text-[#241b18]">Support</h4>
                <div className="mt-4 flex flex-col gap-3">
                  <Link
                    href="/profile/orders"
                    className="text-sm text-[#6f5b51] transition hover:text-[#241b18]"
                  >
                    Order Status
                  </Link>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${helpMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#6f5b51] transition hover:text-[#241b18]"
                  >
                    Help
                  </a>
                  <Link
                    href="/auth?mode=login"
                    className="text-sm text-[#6f5b51] transition hover:text-[#241b18]"
                  >
                    Account
                  </Link>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-black text-[#241b18]">Contact</h4>
                <div className="mt-4 flex flex-col gap-3">
                  <a
                    href="mailto:stellaefeturi1@gmail.com"
                    className="flex items-start gap-2 text-sm text-[#6f5b51] transition hover:text-[#241b18]"
                  >
                    <MdEmail className="mt-0.5 h-4 w-4 shrink-0 text-[#8f7669]" />
                    <span className="break-all">stellaefeturi1@gmail.com</span>
                  </a>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-[#6f5b51] transition hover:text-[#241b18]"
                  >
                    <FaWhatsapp className="h-4 w-4 shrink-0 text-[#8f7669]" />
                    <span>+234 809 222 1127</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-3 border-t border-[#241b18]/12 pt-7 text-xs text-[#7b6257] sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Stelcity. All rights reserved.</p>
            <p>Skincare, spa, raw materials, and training in Lagos.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
