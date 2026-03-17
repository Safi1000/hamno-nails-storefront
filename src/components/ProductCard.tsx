import { Link } from "react-router-dom";
import { Product } from "@/data/products";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card rounded-lg overflow-hidden cherry-shadow card-hover"
    >
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden aspect-square">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover image-zoom"
        />
        {product.stockStatus === "Out of Stock" && (
          <div className="absolute top-2 left-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">
            Out of Stock
          </div>
        )}
        {product.stockStatus === "Made to Order" && (
          <div className="absolute top-2 left-2 bg-yellow-500/90 text-white text-xs font-bold px-2 py-1 rounded">
            Made to Order
          </div>
        )}
      </Link>

      <div className="p-3">
        <div className="mb-1">
          <Link to={`/product/${product.id}`}>
            <h3 className="font-display text-sm font-semibold text-foreground leading-tight">{product.name}</h3>
          </Link>
        </div>

        <p className="font-body text-secondary text-sm font-semibold mb-2">Rs. {product.price}</p>
      </div>
    </motion.div>
  );
};

export default ProductCard;
