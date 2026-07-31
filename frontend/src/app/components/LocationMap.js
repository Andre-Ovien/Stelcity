"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowUpRight } from "lucide-react"
import { BUSINESS, getGoogleMapsDirectionsUrl } from "../lib/site"

export default function LocationMap() {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    let isActive = true
    let observer

    const initialiseMap = async () => {
      if (!isActive || !containerRef.current || mapRef.current) return

      const leafletModule = await import("leaflet")
      const L = leafletModule.default ?? leafletModule

      if (!isActive || !containerRef.current || mapRef.current) return

      const { latitude, longitude } = BUSINESS.mapCoordinates
      const map = L.map(containerRef.current, {
        scrollWheelZoom: false,
        zoomControl: false,
        attributionControl: true,
      }).setView([latitude, longitude], 17)

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map)

      L.control.zoom({ position: "bottomright" }).addTo(map)

      const markerIcon = L.divIcon({
        className: "stelcity-location-marker",
        html: `
          <span class="stelcity-marker-wrap" aria-hidden="true">
            <span class="stelcity-marker-pin"><span></span></span>
            <span class="stelcity-marker-label">Stelcity Agbara</span>
          </span>
        `,
        iconSize: [38, 48],
        iconAnchor: [19, 46],
        popupAnchor: [0, -42],
      })

      const popup = document.createElement("div")
      const name = document.createElement("strong")
      const address = document.createElement("span")
      name.textContent = `${BUSINESS.name} Agbara studio`
      address.textContent = BUSINESS.address
      popup.className = "stelcity-map-popup"
      popup.append(name, address)

      L.marker([latitude, longitude], {
        icon: markerIcon,
        title: `${BUSINESS.name} Agbara studio`,
        alt: `${BUSINESS.name} Agbara studio`,
      })
        .addTo(map)
        .bindPopup(popup, { closeButton: false, offset: [0, -2] })

      mapRef.current = map
      map.whenReady(() => {
        if (!isActive) return
        setIsReady(true)
        window.requestAnimationFrame(() => map.invalidateSize())
      })
    }

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return
          observer?.disconnect()
          initialiseMap()
        },
        { rootMargin: "300px" },
      )
      observer.observe(containerRef.current)
    } else {
      initialiseMap()
    }

    return () => {
      isActive = false
      observer?.disconnect()
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [])

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#e3e9e1]">
      <div
        ref={containerRef}
        className="stelcity-location-map h-full w-full"
        aria-label={`Interactive map showing the ${BUSINESS.name} Agbara studio`}
      />

      {!isReady && (
        <div className="absolute inset-0 animate-pulse bg-[linear-gradient(135deg,#e5e8df,#f3ede4,#dde5db)]" />
      )}

      <a
        href={getGoogleMapsDirectionsUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-8 left-4 z-[500] inline-flex items-center gap-2 rounded-full border border-[#1d241e]/12 bg-[#fffaf3]/95 px-4 py-3 text-[10px] font-black uppercase tracking-[0.12em] text-[#1d241e] shadow-[0_12px_32px_rgba(29,36,30,0.16)] backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
      >
        Directions to Agbara studio
        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
      </a>
    </div>
  )
}
