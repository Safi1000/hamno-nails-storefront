import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Product } from "@/data/products";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";
import QuantitySelector from "@/components/QuantitySelector";
import WhatsAppButton from "@/components/WhatsAppButton";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id) return;
      setIsLoading(true);
      
      try {
        // Fetch current product
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
          
        if (productError) throw productError;
        
        if (productData) {
          const formattedProduct = {
             ...productData,
             nailCount: productData.nail_count,
             hasPrepKit: productData.has_prep_kit,
             stockStatus: productData.stock_status,
          } as Product;
          
          setProduct(formattedProduct);
          
          // Fetch related products
          const { data: relatedData } = await supabase
            .from('products')
            .select('*')
            .eq('category', formattedProduct.category)
            .neq('id', formattedProduct.id)
            .limit(4);
            
          if (relatedData) {
            setRelatedProducts(relatedData.map(item => ({
              ...item,
              nailCount: item.nail_count,
              hasPrepKit: item.has_prep_kit,
              stockStatus: item.stock_status,
            } as Product)));
          }
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container py-32 flex justify-center items-center h-screen">
        <div className="animate-pulse text-primary font-body">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-20 text-center">
        <p className="font-body text-foreground">Product not found.</p>
        <Link to="/" className="text-secondary underline font-body mt-4 inline-block">Go back</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  return (
    <div className="container py-6 animate-fade-in min-h-screen">
      <Link to="/" className="inline-flex items-center gap-1 text-secondary font-body text-sm mb-6 btn-press">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        {/* ... (rest of the existing top grid) */}
        {/* Images */}
        <div className="relative">
          {product.stockStatus === "Out of Stock" && (
            <div className="absolute top-4 left-4 z-10 bg-black/70 text-white text-sm font-bold px-3 py-1.5 rounded">
              Out of Stock
            </div>
          )}
          {product.stockStatus === "Made to Order" && (
            <div className="absolute top-4 left-4 z-10 bg-yellow-500/90 text-white text-sm font-bold px-3 py-1.5 rounded">
              Made to Order
            </div>
          )}
          <motion.div
            key={selectedImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="aspect-square rounded-lg overflow-hidden cherry-shadow mb-4"
          >
            <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
          </motion.div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`aspect-square rounded-md overflow-hidden btn-press border-2 transition-colors ${
                  selectedImage === i ? "border-primary" : "border-transparent"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">{product.name}</h1>
          <p className="font-body text-2xl text-secondary font-semibold mb-4">Rs. {product.price}</p>
          <p className="font-body text-muted-foreground mb-6">{product.description}</p>

          <div className="mb-6 space-y-4">
            <div className="flex items-center gap-3 text-neutral-500 font-body text-xs uppercase tracking-widest border-y border-neutral-100 py-3">
              <span className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-primary" />
                24 Artisan-painted Nails
              </span>
              <span className="opacity-20">|</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-primary" />
                Prep Kit Included
              </span>
            </div>
            
            <div>
              <p className="font-body text-sm text-foreground mb-2">Quantity</p>
              <QuantitySelector quantity={quantity} onChange={setQuantity} />
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleAddToCart}
              disabled={product.stockStatus === "Out of Stock"}
              className={`w-full font-body py-3 rounded-lg transition-colors ${
                product.stockStatus === "Out of Stock"
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-primary text-primary-foreground btn-press hover:bg-secondary"
              }`}
            >
              {product.stockStatus === "Out of Stock" ? "Out of Stock" : "Add to Cart"}
            </button>
            {product.stockStatus === "Out of Stock" ? (
              <div
                className="block w-full border-2 border-gray-300 bg-gray-100 text-gray-400 font-body py-3 rounded-lg text-center cursor-not-allowed"
              >
                Out of Stock
              </div>
            ) : (
              <Link
                to="/checkout"
                onClick={handleAddToCart}
                className="block w-full border-2 border-primary text-foreground font-body py-3 rounded-lg text-center btn-press hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Buy Now
              </Link>
            )}
            <WhatsAppButton productName={product.name} outOfStock={product.stockStatus === "Out of Stock"} />
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-20 border-t border-neutral-100 pt-16 animate-fade-in">
          <h2 className="font-display text-3xl font-light text-foreground mb-10 text-center md:text-left">
            You may also <span className="italic">like</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
