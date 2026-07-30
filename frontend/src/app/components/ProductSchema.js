import StructuredData from "./StructuredData"

export default function ProductSchema({ product, basePath = "products" }) {
  const productUrl = `https://www.stelcity.com/${basePath}/${product.slug}`
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${productUrl}#product`,
    name: product.name,
    url: productUrl,
    sku: String(product.id),
    category: basePath === "raw-materials" ? "Skincare raw materials" : "Skincare products",
    brand: {
      "@type": "Brand",
      name: "Stelcity",
    },
  }

  if (product.image) schema.image = product.image
  if (product.description) schema.description = product.description

  if (Number.isFinite(Number(product.price))) {
    schema.offers = {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "NGN",
      url: productUrl,
      itemCondition: "https://schema.org/NewCondition",
      ...(product.stock !== null &&
      product.stock !== undefined &&
      Number.isFinite(Number(product.stock))
        ? {
            availability:
              Number(product.stock) > 0
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
          }
        : {}),
      seller: {
        "@id": "https://www.stelcity.com/#organization",
      },
    }
  }

  return <StructuredData data={schema} />
}
