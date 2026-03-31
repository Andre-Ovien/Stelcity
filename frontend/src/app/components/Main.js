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
    <div className="mx-5 sm:mt-7 sm:mx-8 2xl:mt-19">

      <div className="sm:flex sm:flex-row sm:items-center sm:gap-10 lg:mx-6 xl:mx-10 xl:mt-4">

        <div className="sm:flex-1">
          <h1 className="text-[32px]  font-black  xl:text-[48px]  2xl:text-[50px]">
            Healthy{" "}
            <span className="text-[#C94F5C]  play">
              Skin 
            </span> Starts Here
          </h1>

          <p className="text-[#826E70] text-[16px] font-normal mt-2  xl:text-[28px]  2xl:text-[36px]">
            Indulge in a premium skincare experience crafted by experts, designed to transform your complexion and turn your daily routine into a moment of pure self-care.
          </p>

          <div className="mt-10">
            <button
              onClick={scrollToCollection}
              className=" hover:bg-[#C44F4F] bg-[#D65A5A] text-white rounded-3xl mr-4 w-24 h-12 font-bold shadow-[0px_4px_15px_rgba(214,90,90,0.5)]  xl:w-37 xl:text-[23px]"
            >
              Shop now
            </button>
            <Link href="/products">
              <button className=" hover:bg-[#e9b8a1] bg-[#DAB9A8] text-[#B6454F] font-bold border-[#B6454F] rounded-3xl w-36 h-12 xl:w-44 xl:text-[20px]">
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

          <div className="flex items-center space-between gap-1.5   py-2 px-1 sm:mt-4  xl:mt-10 xl:gap-3" id='space'>
            <div className="flex items-center">
              <Image src="/images/tested.png" width={18} height={20} alt="tested" className='xl:w-[30] xl:h-[30]' />
              <p className=" text-[#494848] text-[9px] lg:text-[12px] xl:text-[16px]">Dermatologist Tested</p>
            </div>
            <div className="flex items-center">
              <Image src="/images/nature.png" width={18} height={20} alt="tested" className='xl:w-[30] xl:h-[30]' />
              <p className=" text-[#494848] text-[9px] lg:text-[12px] xl:text-[16px]">Natural Ingredients</p>
            </div>
            <div className="flex items-center">
              <Image src="/images/free.png" width={18} height={20} alt="tested" className='xl:w-[28] xl:h-[28]' />
              <p className=" text-[#494848] text-[9px] lg:text-[12px] xl:text-[16px]">Cruelty-free</p>
            </div>
          </div>

          <h3 className="text-[#D65A5A] text-[13px] font-bold text-center mt-3 pb-3 xl:text-[1p7x]">
            Trusted by 10,000+ happy customers.
          </h3>
        </div>

        <div className="hidden sm:flex sm:flex-1 justify-center items-center">
          <Image
            src="/images/lady.png"
            alt="lady"
            width={400}
            height={400}
            className="object-contain w-full max-w-full h-auto"
          />
        </div>

      </div>
    </div>
  )
}

export default Main