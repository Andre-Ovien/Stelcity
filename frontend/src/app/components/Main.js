import Image from 'next/head'

const Main = () => {
  return (
    <div className="mx-3">

        <h1 className="text-[32px] font-bold ">Healthy <span className="text-[#C94F5C]">Skin</span><br/> Starts here</h1>
        <p className="text-[#826E70] text-[16px] font-normal mt-2">Indulge in a premium skincare experience crafted by experts, designed to transform your complexion and turn your daily routine into a moment of pure self-care.</p>
        <div className=" mt-10">
            <button className="bg-[#D65A5A] text-white rounded-3xl mr-4 w-24 h-12 ">Shop now</button>
            <button className="bg-[#DAB9A8] text-[#B6454F] border-[#B6454F] rounded-3xl w-36 h-12">View Collection</button>
        </div>

        <Image src="/images/lady.png" alt='lady' width={400} height={400} />
    </div>
  )
}

export default Main