export default async function sitemap() {
  const products = await fetch('https://api.stelcity.com/products')
    .then(r => r.json())
    .catch(() => [])

  return [
    { url: 'https://www.stelcity.com', lastModified: new Date() },
    { url: 'https://www.stelcity.com/products', lastModified: new Date() },
    { url: 'https://www.stelcity.com/rawMaterials', lastModified: new Date() },
    { url: 'https://www.stelcity.com/services', lastModified: new Date() },
    { url: 'https://www.stelcity.com/training', lastModified: new Date() },
    ...products.map(p => ({
      url: `https://www.stelcity.com/products/${p.slug}`,
      lastModified: p.updated_at,
    })),
  ]
}