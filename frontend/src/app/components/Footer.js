import Image from "next/image"
import Link from "next/link"
import { FaWhatsapp, FaFacebook, FaInstagram } from "react-icons/fa"
import { MdLocationOn, MdEmail } from "react-icons/md"

const WHATSAPP_NUMBER = "2348092221127"

const Footer = () => {
  return (
    <footer className="bg-[#E8F0E8] px-5 py-8 mt-4">
      <div className="mb-6">
        <Image src="/images/logo.png" alt="Stelcity" width={90} height={50}  className=" block -ml-1"/>
        <p className="text-[12px] text-gray-500 mt-1 max-w-xs">
          Bringing you clean, gentle and effective skincare for every skin type.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-[13px]">
        
       
        <div className="flex flex-col gap-2">
          <h4 className="font-semibold text-gray-800 mb-1">Contact</h4>
          <span className="flex items-start gap-1.5 text-gray-500 text-[12px]">
            <MdLocationOn size={14} className="shrink-0 mt-0.5 text-gray-600" />
            <span>No 430 Jida Plaza, Opp Redeem Church, Agbara Bus Stop, Along Badagry Express Way, Lagos State</span>
          </span>

          <a
            href="mailto:stellaefeturi1@gmail.com"
            className="flex items-center gap-1.5 text-gray-500 text-[12px] hover:text-gray-800 transition-colors break-all"
          >
            <MdEmail size={14} className="shrink-0 text-gray-600" /> stellaefeturi1@gmail.com
          </a>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-gray-500 text-[12px] hover:text-gray-800 transition-colors"
          >
            <FaWhatsapp size={14} className="shrink-0 text-gray-600" /> +234 809 222 1127
          </a>

          <a
            href="https://www.facebook.com/Stelcityskincarenspa"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-gray-500 text-[12px] hover:text-gray-800 transition-colors"
          >
            <FaFacebook size={14} className="shrink-0 text-gray-600" /> Stelcityskincarenspa
          </a>

          <a
            href="https://www.instagram.com/stelcityskincare_aesthetics"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-gray-500 text-[12px] hover:text-gray-800 transition-colors"
          >
            <FaInstagram size={14} className="shrink-0 text-gray-600" /> @stelcityskincare_aesthetics
          </a>
        </div>

        <div className="flex flex-col gap-1.5">
          <h4 className="font-semibold text-gray-800 mb-1">Shop</h4>
          {[
            { label: "Products", href: "/products" },
            { label: "Raw Materials", href: "/raw-materials" },
            { label: "Services", href: "/our-services" },
            { label: "Training", href: "/training-programs" },
          ].map((item) => (
            <Link key={item.label} href={item.href} className="text-gray-500 hover:text-gray-800 transition-colors">
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-1.5">
          <h4 className="font-semibold text-gray-800 mb-1">Explore</h4>
          {[
            { label: "Skincare in Lagos", href: "/skincare-in-lagos" },
            { label: "Skincare Blog", href: "/blog" },
            { label: "Skincare Tips Nigeria", href: "/blog/best-skincare-routine-for-oily-skin-nigeria" },
            { label: "Glowing Skin Lagos", href: "/blog/how-to-get-glowing-skin-naturally-lagos" },
            { label: "Buy Skincare Nigeria", href: "/blog/where-to-buy-affordable-skincare-products-nigeria" },
          ].map((item) => (
            <Link key={item.label} href={item.href} className="text-gray-500 hover:text-gray-800 transition-colors">
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex flex-col gap-1.5">
          <h4 className="font-semibold text-gray-800 mb-1">Support</h4>
          <Link href="/profile/orders" className="text-gray-500 hover:text-gray-800 transition-colors">
            Order Status
          </Link>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi, I need help with my order/product.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-800 transition-colors"
          >
            Help
          </a>
        </div>

        
        
      </div>

      <div className="h-px bg-gray-200 mt-8 mb-4" />

      <p className="text-center text-[11px] text-gray-400">
        © {new Date().getFullYear()} Stelcity. All rights reserved.
      </p>
    </footer>
  )
}

export default Footer