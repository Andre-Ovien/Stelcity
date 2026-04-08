export default function ServiceSchema({ service }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.category,
    description: service.description,
    image: service.image,
    provider: {
      "@type": "Organization",
      name: "Stelcity",
      url: "https://www.stelcity.com",
    },
    areaServed: {
      "@type": "City",
      name: "Lagos",
    },
    url: `https://www.stelcity.com/our-services/${service.slug}`,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}