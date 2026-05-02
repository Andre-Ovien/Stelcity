import ServiceClient from "./ServiceClient"
import ServiceSchema from "../../components/ServiceSchema"
import { getServices } from "../../lib/services"

export async function generateMetadata({ params }) {
  const { slug } = await params
  try {
    const services = await getServices()
    const service = services.find((s) => s.slug === slug)
    if (!service) return { title: "Service Not Found" }

    return {
      title: service.category,
      description: service.description || `Book ${service.category} at Stelcity Lagos`,
      alternates: {
        canonical: `https://www.stelcity.com/our-services/${slug}`,
      },
      openGraph: {
        title: `${service.category} | Stelcity`,
        description: service.description || `Book ${service.category} at Stelcity Lagos`,
        url: `https://www.stelcity.com/our-services/${slug}`,
        images: service.image
          ? [{ url: service.image, width: 800, height: 800, alt: service.category }]
          : [{ url: "/images/og-banner.jpg", width: 1200, height: 630 }],
      },
      twitter: {
        card: "summary_large_image",
        title: service.category,
        description: service.description || `Book ${service.category} at Stelcity Lagos`,
        images: service.image ? [service.image] : ["/images/og-banner.jpg"],
      },
    }
  } catch {
    return { title: "Service | Stelcity" }
  }
}

export default async function ServicePage({ params }) {
  const { slug } = await params
  let service = null
  try {
    const services = await getServices()
    service = services.find((s) => s.slug === slug) || null
  } catch {}

  return (
    <>
      {service && <ServiceSchema service={service} />}
      <ServiceClient params={params} />
    </>
  )
}