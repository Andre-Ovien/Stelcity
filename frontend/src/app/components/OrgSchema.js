import StructuredData from "./StructuredData"
import { BUSINESS, SITE_URL, SOCIAL_LINKS } from "../lib/site"

export default function OrgSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: BUSINESS.name,
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/images/logo.png`,
          width: 386,
          height: 125,
        },
        image: `${SITE_URL}/images/og-banner.jpg`,
        description:
          "Skincare products, formulation ingredients, beauty services, and practical skincare training in Nigeria.",
        telephone: BUSINESS.phoneInternational,
        email: BUSINESS.email,
        address: {
          "@type": "PostalAddress",
          streetAddress: BUSINESS.streetAddress,
          addressLocality: BUSINESS.locality,
          addressRegion: BUSINESS.region,
          addressCountry: BUSINESS.country,
        },
        sameAs: [SOCIAL_LINKS.facebook, SOCIAL_LINKS.instagram],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: BUSINESS.name,
        inLanguage: "en-NG",
        publisher: {
          "@id": `${SITE_URL}/#organization`,
        },
      },
    ],
  }

  return <StructuredData data={schema} />
}
