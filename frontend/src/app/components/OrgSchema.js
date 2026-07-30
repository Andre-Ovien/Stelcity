import StructuredData from "./StructuredData"

export default function OrgSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://www.stelcity.com/#organization",
        name: "Stelcity",
        url: "https://www.stelcity.com",
        logo: {
          "@type": "ImageObject",
          url: "https://www.stelcity.com/images/logo.png",
          width: 386,
          height: 125,
        },
        image: "https://www.stelcity.com/images/og-banner.jpg",
        description:
          "Skincare products, formulation ingredients, beauty services, and practical skincare training in Nigeria.",
        telephone: "+2348092221127",
        email: "stellaefeturi1@gmail.com",
        address: {
          "@type": "PostalAddress",
          streetAddress:
            "No 430 Jida Plaza, Opp Redeem Church, Agbara Bus Stop, Along Badagry Express Way",
          addressRegion: "Lagos State",
          addressCountry: "NG",
        },
        sameAs: [
          "https://www.facebook.com/Stelcityskincarenspa",
          "https://www.instagram.com/stelcityskincare_aesthetics",
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://www.stelcity.com/#website",
        url: "https://www.stelcity.com",
        name: "Stelcity",
        inLanguage: "en-NG",
        publisher: {
          "@id": "https://www.stelcity.com/#organization",
        },
      },
    ],
  }

  return <StructuredData data={schema} />
}
