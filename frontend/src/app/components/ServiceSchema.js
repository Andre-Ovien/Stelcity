import StructuredData from "./StructuredData"

export default function ServiceSchema({ service }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `https://www.stelcity.com/our-services/${service.slug}#service`,
    name: service.category,
    ...(service.description ? { description: service.description } : {}),
    ...(service.image ? { image: service.image } : {}),
    provider: {
      "@id": "https://www.stelcity.com/#organization",
    },
    areaServed: {
      "@type": "City",
      name: "Lagos",
    },
    url: `https://www.stelcity.com/our-services/${service.slug}`,
  }

  return <StructuredData data={schema} />
}
