import Image from "next/image"
import Link from "next/link"
import { FaWhatsapp, FaFacebook, FaInstagram } from "react-icons/fa"
import { MdLocationOn, MdEmail } from "react-icons/md"

const Footer = () => {
  return (
    <footer className="bg-[#E8F0E8] px-5 py-8 mt-4">

  
      <div className="mb-6">
        <Image src="/images/logo.png" alt="Stelcity" width={90} height={50} />
        <p className="text-[12px] text-gray-500 mt-1 max-w-xs">
          Bringing you clean, gentle and effective skincare for every skin type.
        </p>
      </div>

      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-[13px]">

        
        <div className="flex flex-col gap-1">
          <h4 className="font-semibold text-gray-800 mb-1">Company</h4>
          {[
            { label: "About Us", href: "#" },
            { label: "Services", href: "/services" },
            { label: "Training", href: "/training" },
            { label: "Careers", href: "#" },
          ].map((item) => (
            <Link key={item.label} href={item.href} className="text-gray-500 hover:text-gray-800 transition-colors">
              {item.label}
            </Link>
          ))}
        </div>

        
        <div className="flex flex-col gap-1">
          <h4 className="font-semibold text-gray-800 mb-1">Support</h4>
          {["Order Status", "Amount Guide", "Help Centre", "Contact Us"].map((item) => (
            <Link key={item} href="#" className="text-gray-500 hover:text-gray-800 transition-colors">
              {item}
            </Link>
          ))}
        </div>

        
        <div className="flex flex-col gap-1.5">
          <h4 className="font-semibold text-gray-800 mb-1">Contact</h4>
          <span className="flex items-center gap-1.5 text-gray-500 text-[12px]">
            <MdLocationOn size={13} className="shrink-0" /> Stelcity, Nigeria
          </span>
          <span className="flex items-center gap-1.5 text-gray-500 text-[12px]">
            <MdEmail size={13} className="shrink-0" /> stelcity@gmail.com
          </span>
          <span className="flex items-center gap-1.5 text-gray-500 text-[12px]">
            <FaWhatsapp size={13} className="shrink-0" /> 08144316917
          </span>
          <span className="flex items-center gap-1.5 text-gray-500 text-[12px]">
            <FaFacebook size={13} className="shrink-0" /> @stelcity
          </span>
          <span className="flex items-center gap-1.5 text-gray-500 text-[12px]">
            <FaInstagram size={13} className="shrink-0" /> @stelcity
          </span>
        </div>

        
        <div className="flex flex-col gap-1">
          <h4 className="font-semibold text-gray-800 mb-1">Shop</h4>
          {[
            { label: "Products", href: "/products" },
            { label: "Raw Materials", href: "/rawMaterials" },
            { label: "Services", href: "/services" },
            { label: "Training", href: "/training" },
          ].map((item) => (
            <Link key={item.label} href={item.href} className="text-gray-500 hover:text-gray-800 transition-colors">
              {item.label}
            </Link>
          ))}
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