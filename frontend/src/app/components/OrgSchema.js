export default function OrgSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',  
    name: 'Stelcity',
    url: 'https://www.stelcity.com',
    logo: 'https://www.stelcity.com/images/logo.png',  
    image: 'https://www.stelcity.com/images/og-banner.jpeg',
    description: 'Premium skincare products, raw materials, and beauty services in Nigeria.',
    telephone: '+234-809-222-1127',
    email: 'stellaefeturi1@gmail.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lagos',
      addressRegion: 'Lagos',
      addressCountry: 'NG',
    },
    sameAs: [
      'https://www.facebook.com/Stelcityskincarenspa',
      'https://www.instagram.com/stelcityskincare_aesthetics',
    ],
    openingHours: 'Mo-Su 08:00-20:00',  
    priceRange: '',  
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}