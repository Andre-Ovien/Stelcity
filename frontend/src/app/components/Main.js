"use client"

import Image from 'next/image'
import Link from 'next/link'

const Main = () => {

  const scrollToCollection = () => {
    const section = document.getElementById("collection")
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="w-full px-5 sm:px-8 lg:px-10 xl:px-16 2xl:px-24 sm:py-30">

      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-10 lg:gap-16 xl:gap-20">

       
        <div className="flex-1">

          
          <h1 className="text-[32px] leading-tight font-black sm:text-[36px] md:text-[40px] lg:text-[44px] xl:text-[52px] 2xl:text-[58px]">
            Healthy{" "}
            <span className="text-[#C94F5C] play ">
              Skin{" "}
              <br className="sm:hidden" />
            </span>
            Starts Here
          </h1>

          
          <p className="text-[#826E70] text-[15px] font-normal mt-3 leading-relaxed sm:text-[16px] lg:text-[18px] xl:text-[22px] 2xl:text-[26px] max-w-xl">
            Indulge in a premium skincare experience crafted by experts, designed to transform your complexion and turn your daily routine into a moment of pure self-care.
          </p>

          
          <div className="mt-8 xl:mt-10 flex items-center gap-3 flex-wrap">
            <button
              onClick={scrollToCollection}
              className="
                bg-[#D65A5A] text-white font-bold rounded-3xl
                w-28 h-11 xl:w-36 xl:h-13 xl:text-[20px]
                shadow-[0px_4px_15px_rgba(214,90,90,0.45)]
                transition-all duration-200
                hover:bg-[#C44F4F] hover:shadow-[0px_6px_20px_rgba(214,90,90,0.55)] hover:-translate-y-0.5
                active:scale-95 active:shadow-none
              "
            >
              Shop Now
            </button>

            <Link href="/products">
              <button className="
                bg-[#DAB9A8] text-[#B6454F] font-bold border border-[#B6454F] rounded-3xl
                w-36 h-11 xl:w-44 xl:h-13 xl:text-[18px]
                transition-all duration-200
                hover:bg-[#e9b8a1] hover:-translate-y-0.5 hover:shadow-md
                active:scale-95 active:bg-[#d9a98e]
              ">
                View Collection
              </button>
            </Link>
          </div>

         
          <div className="mt-8 sm:hidden">
            <Image
              src="/images/lady.png"
              alt="Stelcity skincare model with glowing healthy skin"
              width={400}
              height={400}
              priority
              className="w-full h-auto object-contain"
            />
          </div>

          
          <div className="flex items-center gap-3 sm:gap-4 xl:gap-6 mt-6 xl:mt-10 flex-wrap justify-center sm:justify-start">
            <div className="flex items-center gap-1 -ml-2">
              <Image src="/images/tested.png" width={18} height={20} alt="Dermatologist tested badge" className="xl:w-7 xl:h-7 shrink-0" />
              <p className="text-[#494848] text-[10px] sm:text-[11px] lg:text-[13px] xl:text-[16px] whitespace-nowrap">Dermatologist Tested</p>
            </div>
            <div className="flex items-center gap-1">
              <Image src="/images/nature.png" width={18} height={20} alt="Natural Ingredients badge" className="xl:w-7 xl:h-7 shrink-0" />
              <p className="text-[#494848] text-[10px] sm:text-[11px] lg:text-[13px] xl:text-[16px] whitespace-nowrap">Natural Ingredients</p>
            </div>
            <div className="flex items-center gap-1">
              <Image src="/images/free.png" width={18} height={20} alt="Cruelty Free badge" className="xl:w-7 xl:h-7 shrink-0" />
              <p className="text-[#494848] text-[10px] sm:text-[11px] lg:text-[13px] xl:text-[16px] whitespace-nowrap">Cruelty-free</p>
            </div>
          </div>

          
          <p className="text-[#D65A5A] text-[13px] xl:text-[17px] font-bold mt-4 mb-4 sm:mb-0  text-center  sm:text-left">
            Trusted by 10,000+ happy customers.
          </p>

        </div>

        
        <div className="hidden sm:flex flex-1 justify-center items-center">
          <Image
            src="/images/lady.png"
            alt="Stelcity skincare model with glowing healthy skin"
            width={600}
            height={600}
            priority
            className="object-contain w-full max-w-sm lg:max-w-md xl:max-w-lg h-auto"
          />
        </div>

      </div>
    </div>
  )
}

export default Main