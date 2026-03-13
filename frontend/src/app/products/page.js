import { products } from "../lib/products"
import ProductCard from "../components/ProductCard"

export default function ProductsPage() {

  return (

    <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">

      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}

    </div>

  )
}