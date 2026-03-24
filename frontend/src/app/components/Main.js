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
    <div className="mx-5 sm:my-9 sm:mx-8  ">

      
      <div className="sm:flex sm:flex-row sm:items-center sm:gap-10 lg:mx-6 xl:mx-10 xl:mt-25">

        <div className="sm:flex-1">
          <h1 className="text-[32px] font-bold  xl:text-[48px]">
            Healthy{" "}
            <span className="text-[#C94F5C] font-(family-name:--font-poppins) font-bold">
              Skin 
            </span> Starts here
          </h1>

          <p className="text-[#826E70] text-[16px] font-normal mt-2  xl:text-[28px]">
            Indulge in a premium skincare experience crafted by experts, designed to transform your complexion and turn your daily routine into a moment of pure self-care.
          </p>

          <div className="mt-10">
            <button
              onClick={scrollToCollection}
              className="bg-[#D65A5A] text-white rounded-3xl mr-4 w-24 h-12 font-bold shadow-[0px_4px_15px_rgba(214,90,90,0.5)]  xl:w-37 xl:text-[23px] "
            >
              Shop now
            </button>
            <Link href="/products">
              <button className="bg-[#DAB9A8] text-[#B6454F] border-[#B6454F] rounded-3xl w-36 h-12 xl:w-44 xl:text-[20px] ">
                View Collection
              </button>
            </Link>
          </div>

          <Image
            src="/images/lady.png"
            alt="lady"
            width={400}
            height={400}
            className="mt-9 sm:hidden"
          />

          <div className="flex items-center space-between gap-1.5 border-transparent shadow-lg rounded-2xl py-2 px-1 sm:mt-4  xl:mt-10 xl:gap-3 " id='space'>
            <div className="flex items-center">
              <Image src="/images/tested.png" width={18} height={20} alt="tested " className='xl:w-[30] xl:h-[30] ' />
              <p className="text-[9.5px] lg:text-[13px] xl:text-[18px]">Dermatologist Tested</p>
            </div>
            <div className="flex items-center">
              <Image src="/images/nature.png" width={18} height={20} alt="tested" className='xl:w-[30] xl:h-[30] ' />
              <p className="text-[9.5px] lg:text-[13px] xl:text-[18px]">Natural Ingredients</p>
            </div>
            <div className="flex items-center">
              <Image src="/images/free.png" width={18} height={20} alt="tested" className='xl:w-[28] xl:h-[28] ' />
              <p className="text-[9.5px] lg:text-[13px] xl:text-[18px]">Cruelty-free</p>
            </div>
          </div>

          <h3 className="text-[#D65A5A] text-[14px] font-bold text-center mt-3 pb-3 xl:text-[19px] ">
            Trusted by 10,000+ happy customers.
          </h3>
        </div>

        <div className="hidden sm:flex sm:flex-1 justify-center items-center">
          <Image
            src="/images/lady.png"
            alt="lady"
            width={420}
            height={420}
            className=" object-contain sm:h-[450]   xl: w-[800] xl:h-[600] "
          />
        </div>

      </div>
    </div>
  )
}

export default Main