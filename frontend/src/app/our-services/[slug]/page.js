import ServiceClient from "./ServiceClient"
import ServiceSchema from "../../components/ServiceSchema"
import BreadcrumbSchema from "../../components/BreadcrumbSchema"
import Footer from "../../components/Footer"
import { getServices } from "../../lib/services"
import { notFound } from "next/navigation"

export async function generateMetadata({ params }) {
  const { slug } = await params
  try {
    const services = await getServices()
    const service = services.find((s) => s.slug === slug)
    if (!service) {
      return {
        title: "Service Not Found",
        robots: { index: false, follow: true },
      }
    }

    const isFacialTreatment = slug === "facial-treatment"
    const title = isFacialTreatment
      ? "Facial Treatments in Agbara near Badagry"
      : service.category
    const description = isFacialTreatment
      ? "Explore Stelcity facial treatments in Agbara, Lagos State, near Badagry. View the treatment menu, prices and WhatsApp booking options."
      : service.description || `Explore ${service.category} and request an appointment with Stelcity in Agbara, Lagos State.`

    return {
      title,
      description,
      alternates: {
        canonical: `/our-services/${slug}`,
      },
      openGraph: {
        title: `${title} | Stelcity`,
        description,
        url: `https://www.stelcity.com/our-services/${slug}`,
        images: service.image
          ? [{ url: service.image, width: 800, height: 800, alt: service.category }]
          : [{ url: "/images/og-banner.jpg", width: 1200, height: 630 }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: service.image ? [service.image] : ["/images/og-banner.jpg"],
      },
    }
  } catch {
    return {
      title: "Beauty Service",
      robots: { index: false, follow: true },
    }
  }
}

export default async function ServicePage({ params }) {
  const { slug } = await params
  const services = await getServices()
  const service = services.find((s) => s.slug === slug) || null

  if (!service) notFound()

  return (
    <>
      {service && <ServiceSchema service={service} />}
      {service && (
        <BreadcrumbSchema
          items={[
            { name: "Home", url: "/" },
            { name: "Beauty Services", url: "/our-services" },
            { name: service.category, url: `/our-services/${service.slug}` },
          ]}
        />
      )}
      <ServiceClient params={params} initialService={service} />
      <Footer />
    </>
  )
}
