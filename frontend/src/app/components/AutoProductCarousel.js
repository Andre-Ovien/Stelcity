"use client"

import { Children, useEffect, useRef } from "react"

export default function AutoProductCarousel({ children, label }) {
  const trackRef = useRef(null)
  const pausedRef = useRef(false)
  const childCount = Children.count(children)

  useEffect(() => {
    const track = trackRef.current
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")

    if (!track || childCount < 2 || prefersReducedMotion.matches) return undefined

    const advance = () => {
      if (pausedRef.current) return

      const firstCard = track.firstElementChild
      if (!firstCard) return

      const styles = window.getComputedStyle(track)
      const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0
      const step = firstCard.getBoundingClientRect().width + gap
      const reachedEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - step / 2

      track.scrollTo({
        left: reachedEnd ? 0 : track.scrollLeft + step,
        behavior: "smooth",
      })
    }

    const interval = window.setInterval(advance, 4200)
    return () => window.clearInterval(interval)
  }, [childCount])

  return (
    <div
      ref={trackRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onPointerEnter={() => { pausedRef.current = true }}
      onPointerLeave={() => { pausedRef.current = false }}
      onFocusCapture={() => { pausedRef.current = true }}
      onBlurCapture={() => { pausedRef.current = false }}
      onTouchStart={() => { pausedRef.current = true }}
      onTouchEnd={() => { pausedRef.current = false }}
      className="grid snap-x snap-mandatory auto-cols-[78%] grid-flow-col gap-4 overflow-x-auto scroll-smooth pb-4 scrollbar-hide sm:auto-cols-[44%] lg:auto-cols-[31%] xl:auto-cols-[23.5%]"
    >
      {Children.map(children, (child) => (
        <div className="min-w-0 snap-start">{child}</div>
      ))}
    </div>
  )
}
