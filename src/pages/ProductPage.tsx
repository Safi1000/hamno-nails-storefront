import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Product } from "@/data/products";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";
import QuantitySelector from "@/components/QuantitySelector";
import WhatsAppButton from "@/components/WhatsAppButton";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { addToCart, packaging, setPackaging, prepKit, setPrepKit } = useCart();
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
            className="aspect-square rounded-lg overflow-hidden cherry-shadow mb-4 relative group"
          >
            <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
            
            {product.images.length > 1 && (
              <>
                <button 
                  onClick={(e) => { e.preventDefault(); setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1)); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-md z-20 btn-press"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={(e) => { e.preventDefault(); setSelectedImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1)); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-md z-20 btn-press"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </>
            )}
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
            
            {/* Global Add-ons */}
            <div className="space-y-4 py-4 border-y border-neutral-100">
              <div className="space-y-3">
                <p className="font-body text-sm font-semibold text-foreground">Packaging Theme</p>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${packaging === "Standard" ? 'border-primary' : 'border-neutral-400 group-hover:border-primary/50'}`}>
                      {packaging === "Standard" && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                    <span className="font-body text-sm text-foreground flex-1">Standard Packaging</span>
                    <input type="radio" value="Standard" checked={packaging === "Standard"} onChange={() => setPackaging("Standard")} className="hidden" />
                    <span className="font-body text-sm text-muted-foreground">Free</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${packaging === "Pink Theme" ? 'border-primary' : 'border-neutral-400 group-hover:border-primary/50'}`}>
                      {packaging === "Pink Theme" && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                    <span className="font-body text-sm text-foreground flex-1">Pink Themed Packaging</span>
                    <input type="radio" value="Pink Theme" checked={packaging === "Pink Theme"} onChange={() => setPackaging("Pink Theme")} className="hidden" />
                    <span className="font-body text-sm text-muted-foreground">+ Rs. 150</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${packaging === "Black Theme" ? 'border-primary' : 'border-neutral-400 group-hover:border-primary/50'}`}>
                      {packaging === "Black Theme" && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                    <span className="font-body text-sm text-foreground flex-1">Black Themed Packaging</span>
                    <input type="radio" value="Black Theme" checked={packaging === "Black Theme"} onChange={() => setPackaging("Black Theme")} className="hidden" />
                    <span className="font-body text-sm text-muted-foreground">+ Rs. 150</span>
                  </label>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-neutral-100/50">
                <p className="font-body text-sm font-semibold text-foreground">Optional Extras</p>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${prepKit ? 'bg-primary border-primary' : 'border-neutral-400 group-hover:border-primary/50'}`}>
                    {prepKit && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <span className="font-body text-sm text-foreground flex-1">Add Prep Kit</span>
                  <input type="checkbox" checked={prepKit} onChange={(e) => setPrepKit(e.target.checked)} className="hidden" />
                  <span className="font-body text-sm text-muted-foreground">+ Rs. 100</span>
                </label>
              </div>
            </div>

            <div>
              <p className="font-body text-sm text-foreground mb-2">Quantity</p>
              <QuantitySelector quantity={quantity} onChange={setQuantity} />
            </div>
          </div>

          <div className="space-y-3">
            {product.stockStatus === "Out of Stock" ? (
              <div className="block w-full border-2 border-gray-300 bg-gray-100 text-gray-400 font-body py-3 rounded-lg text-center cursor-not-allowed">
                Out of Stock
              </div>
            ) : product.stockStatus === "Made to Order" ? (
              <Link
                to="/checkout"
                onClick={handleAddToCart}
                className="block w-full border-2 border-primary bg-primary text-primary-foreground font-body py-3 rounded-lg text-center btn-press hover:bg-secondary transition-colors"
              >
                Order Now
              </Link>
            ) : (
              <>
                <button
                  onClick={handleAddToCart}
                  className="w-full font-body py-3 rounded-lg transition-colors bg-primary text-primary-foreground btn-press hover:bg-secondary"
                >
                  Add to Cart
                </button>
                <Link
                  to="/checkout"
                  onClick={handleAddToCart}
                  className="block w-full border-2 border-primary text-foreground font-body py-3 rounded-lg text-center btn-press hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  Buy Now
                </Link>
              </>
            )}
            <WhatsAppButton productName={product.name} outOfStock={product.stockStatus === "Out of Stock"} />
          </div>

          <div className="mt-12 bg-neutral-50 rounded-xl p-6">
            <h3 className="font-display text-lg text-foreground mb-4">What's Included</h3>
            <ul className="space-y-3">
              <li className="flex gap-3 text-sm font-body text-neutral-600">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                Sets of 24 artisan-painted press-on nails (no sizing required)
              </li>
              <li className="flex gap-3 text-sm font-body text-neutral-600">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                Professional nail glue (lasts up to 2-3 weeks)
              </li>
              <li className="flex gap-3 text-sm font-body text-neutral-600">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                Adhesive sticky tabs (for temporary wear 1-3 days)
              </li>
              <li className="flex gap-3 text-sm font-body text-neutral-600">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                Cuticle pusher & double-sided nail file
              </li>
              <li className="flex gap-3 text-sm font-body text-neutral-600">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                Alcohol prep pads
              </li>
            </ul>
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
