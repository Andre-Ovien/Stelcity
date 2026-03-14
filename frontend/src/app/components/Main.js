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
    <div className="mx-5">
      <h1 className="text-[32px] font-bold">Healthy <span className="text-[#C94F5C]">Skin</span><br/> Starts here</h1>
      <p className="text-[#826E70] text-[16px] font-normal mt-2">Indulge in a premium skincare experience crafted by experts, designed to transform your complexion and turn your daily routine into a moment of pure self-care.</p>

      <div className="mt-10">
        
        <button
          onClick={scrollToCollection}
          className="bg-[#D65A5A] text-white rounded-3xl mr-4 w-24 h-12"
        >
          Shop now
        </button>
        <Link href= "/products ">
        <button className="bg-[#DAB9A8] text-[#B6454F] border-[#B6454F] rounded-3xl w-36 h-12">
          View Collection
        </button>
        </Link>
      </div>

      <Image src="/images/lady.png" alt='lady' width={400} height={400} className='mt-9' />

      <div className='flex items-center space-between gap-1.5 border-transparent shadow-lg rounded-2xl py-2 px-1'>
        <div className='flex items-center'>
          <Image src="/images/tested.png" width={18} height={20} alt='tested' />
          <p className='text-[9.5px]'>Dermatologist Tested</p>
        </div>
        <div className='flex items-center'>
          <Image src="/images/nature.png" width={18} height={20} alt='tested' />
          <p className='text-[9.5px]'>Natural Ingredients</p>
        </div>
        <div className='flex items-center'>
          <Image src="/images/free.png" width={18} height={20} alt='tested' />
          <p className='text-[9.5px]'>Cruelty-free</p>
        </div>
      </div>

      <h3 className='text-[#D65A5A] text-[14px] font-bold text-center mt-3 pb-3'>Trusted by 10,000+ happy customers.</h3>
    </div>
  )
}

export default Main