export default async function sitemap() {
  const [products, services] = await Promise.all([
    fetch('https://api.stelcity.com/products').then(r => r.json()).catch(() => []),
    fetch('https://api.stelcity.com/our-services').then(r => r.json()).catch(() => []),
  ])

  return [
    { url: 'https://www.stelcity.com', lastModified: new Date() },
    { url: 'https://www.stelcity.com/products', lastModified: new Date() },
    { url: 'https://www.stelcity.com/raw-materials', lastModified: new Date() },
    { url: 'https://www.stelcity.com/our-services', lastModified: new Date() },
    { url: 'https://www.stelcity.com/training-programs', lastModified: new Date() },
    ...products.map(p => ({
      url: `https://www.stelcity.com/products/${p.slug}`,
      lastModified: p.updated_at,
    })),
    ...services.map(s => ({
      url: `https://www.stelcity.com/our-services/${s.slug}`,
      lastModified: s.updated_at,
    })),
  ]
}