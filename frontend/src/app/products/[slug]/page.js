import ProductClient from "./ProductClient"
import ProductSchema from "../../components/ProductSchema"
import { getProductDetail } from "../../lib/productDetail"

export async function generateMetadata({ params }) {
  try {
    const product = await getProductDetail(params.slug)
    if (!product) return { title: "Product Not Found" }

    return {
      title: product.name,
      description: product.description,
      alternates: {
        canonical: `https://www.stelcity.com/products/${params.slug}`,
      },
      openGraph: {
        title: `${product.name} | Stelcity`,
        description: product.description,
        url: `https://www.stelcity.com/products/${params.slug}`,
        images: [{ url: product.image, width: 800, height: 800, alt: product.name }],
      },
      twitter: {
        card: "summary_large_image",
        title: product.name,
        description: product.description,
        images: [product.image],
      },
    }F
  } catch {
    return { title: "Product | Stelcity" }
  }
}

export default async function ProductPage({ params }) {
  let product = null
  try {
    product = await getProductDetail(params.slug)
  } catch {
    
  }

  return (
    <>
      {product && <ProductSchema product={product} />}
      <ProductClient params={params} />
    </>
  )
}