import { useState, useMemo, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/data/products";
import { supabase } from "@/lib/supabase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { SlidersHorizontal, Loader2 } from "lucide-react";

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("featured");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        if (data) {
          // Map DB snake_case to Product interface camelCase where necessary
          const formattedProducts = data.map(item => ({
             ...item,
             nailCount: item.nail_count,
             hasPrepKit: item.has_prep_kit,
             stockStatus: item.stock_status,
          }));
          setProducts(formattedProducts);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const sortedProducts = useMemo(() => {
    let result = [...products];

    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "featured") {
      result = result.sort((a, b) => (a.category === "featured" ? -1 : 1));
    }

    return result;
  }, [sortBy, products]);

  return (
    <div className="container py-8 animate-fade-in min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 border-b border-neutral-100 pb-8">
        <div>
          <h1 className="font-display text-4xl md:text-5xl font-light text-foreground mb-2">The Collection</h1>
          <p className="text-primary/60 text-sm uppercase tracking-widest font-medium">Hand-painted artisan nails</p>
        </div>

        <div className="flex items-center justify-end w-full md:w-auto">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-auto h-auto border-0 bg-transparent p-0 focus:ring-0 text-primary hover:opacity-70 transition-opacity flex items-center justify-end [&>svg:last-child]:hidden">
              <SlidersHorizontal className="w-5 h-5 shrink-0" />
              <div className="hidden"><SelectValue /></div>
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="featured" className="uppercase tracking-widest text-[10px] font-semibold">Featured</SelectItem>
              <SelectItem value="price-low" className="uppercase tracking-widest text-[10px] font-semibold">Price: Low to High</SelectItem>
              <SelectItem value="price-high" className="uppercase tracking-widest text-[10px] font-semibold">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
           No products available right now.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12">
          {sortedProducts.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </div>
      )}
      
    </div>
  );
};

export default ProductsPage;
