import RawMaterialClient from "./RawMaterialClient"
import ProductSchema from "../../components/ProductSchema"
import { getProductDetail } from "../../lib/productDetail"

export async function generateMetadata({ params }) {
  const { slug } = await params  
  try {
    const product = await getProductDetail(slug)  
    if (!product) return { title: "Product Not Found" }

    return {
      title: product.name,
      description: product.description,
      alternates: {
        canonical: `https://www.stelcity.com/raw-materials/${slug}`, 
      },
      openGraph: {
        title: `${product.name} | Stelcity`,
        description: product.description,
        url: `https://www.stelcity.com/raw-materials/${slug}`, 
        images: [{ url: product.image, width: 800, height: 800, alt: product.name }],
      },
      twitter: {
        card: "summary_large_image",
        title: product.name,
        description: product.description,
        images: [product.image],
      },
    }
  } catch {
    return { title: "Raw Material | Stelcity" }
  }
}

export default async function RawMaterialPage({ params }) {
  const { slug } = await params 
  let product = null
  try {
    product = await getProductDetail(slug) 
  } catch {}

  return (
    <>
      {product && <ProductSchema product={product} />}
      <RawMaterialClient params={Promise.resolve({ slug })} />  
    </>
  )
}