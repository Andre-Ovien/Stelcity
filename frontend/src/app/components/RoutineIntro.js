import Image from "next/image"
import Link from "next/link"
import { Caveat } from "next/font/google"

const handwriting = Caveat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-handwriting",
  display: "swap",
})

const RoutineIntro = () => {
  return (
    <section className={`${handwriting.variable} bg-[#fff6e4] px-3 pb-16 pt-14 sm:px-5 sm:pt-16 lg:pb-24 lg:pt-20`}>
      <div className="relative z-10 mx-auto mb-9 flex max-w-[1280px] justify-center px-2 text-center sm:mb-11 lg:mb-12">
        <div className="routine-handwriting-wrap">
          <p
            className="routine-handwriting-text"
            style={{
              color: "#748071",
              fontFamily: "var(--font-handwriting), Bradley Hand, Segoe Print, cursive",
              fontSize: "clamp(2.8rem, 7vw, 6.25rem)",
              fontWeight: 700,
              lineHeight: 0.86,
            }}
          >
            <span className="block">Skin that keeps</span>
            <span className="block">getting better.</span>
          </p>
          <span className="routine-handwriting-stroke" aria-hidden="true" />
        </div>
      </div>

      <div className="mx-auto grid max-w-[1280px] gap-1 border border-white/80 bg-white/80 p-1 shadow-[0_24px_70px_rgba(42,30,18,0.08)] lg:grid-cols-2">
        <div className="flex min-h-[360px] items-center justify-center bg-[#748071] px-8 py-14 text-center text-[#f8f3ea] sm:min-h-[430px] lg:min-h-[500px]">
          <div className="max-w-[520px]">
            <p className="font-serif text-[31px] leading-[1.14] tracking-normal sm:text-[42px] lg:text-[46px]">
              Starting a skincare routine can feel overwhelming. We are here to
              simplify it and make your skin glow.
            </p>

            <Link
              href="/our-services"
              className="mt-9 inline-flex h-7 items-center justify-center border border-[#f8f3ea]/45 px-7 text-[11px] font-semibold text-[#f8f3ea] transition hover:border-[#f8f3ea] hover:bg-[#f8f3ea] hover:text-[#748071]"
            >
              Book an appointment
            </Link>
          </div>
        </div>

        <div className="relative min-h-[360px] overflow-hidden sm:min-h-[430px] lg:min-h-[500px]">
          <Image
            src="/images/skincare-routine-mirror.png"
            alt="Woman applying a face mask while looking into a round bathroom mirror"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center"
          />
        </div>
      </div>
    </section>
  )
}

export default RoutineIntro
