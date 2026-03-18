import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import ReviewCard from "@/components/ReviewCard";
import { Product, reviews } from "@/data/products";
import { supabase } from "@/lib/supabase";
import { ArrowRight, Sparkles, Heart, Instagram, Loader2 } from "lucide-react";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [premiumBridal, setPremiumBridal] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data) {
          const formattedProducts = data.map(item => ({
            ...item,
            nailCount: item.nail_count,
            hasPrepKit: item.has_prep_kit,
            stockStatus: item.stock_status,
          }));

          const cats = (p: any) => Array.isArray(p.category) ? p.category.map((c: string) => c.toLowerCase()) : [String(p.category).toLowerCase()];

          setFeatured(formattedProducts.filter((p: any) => cats(p).includes("featured")).slice(0, 8));
          setNewArrivals(formattedProducts.filter((p: any) => cats(p).includes("new arrivals") || cats(p).includes("new")).slice(0, 4));
          setPremiumBridal(formattedProducts.filter((p: any) => cats(p).includes("premium bridal sets")).slice(0, 8));
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#FCF9F7] text-[#2D2926]">
      {/* Boutique Hero - Text Only, Centered */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 px-4 overflow-hidden flex flex-col items-center">
        <div className="container mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] uppercase tracking-[0.4em] font-body text-primary/60 mb-4 block">
              Handcrafted with love
            </span>
            <h1 className="font-display text-5xl md:text-8xl font-light mb-6 tracking-tight leading-none text-foreground">
              Nails By <br /> <span className="italic font-serif">Hamna</span>
            </h1>
            <p className="font-body text-lg md:text-xl text-foreground/80 mb-12 max-w-2xl mx-auto leading-relaxed font-light px-4">
              Luxury, reusable press-on nails for the modern aesthetic. Hand-painted to match your unique vision.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/products"
                className="bg-primary text-white px-10 py-3 rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg"
              >
                Shop the Drops
              </Link>
              <Link
                to="/products"
                className="border border-primary/20 text-primary px-10 py-3 rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-primary/5 transition-all"
              >
                View Archives
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Subtle background elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[60%] bg-primary/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-[10%] w-[30%] h-[40%] bg-secondary/5 rounded-full blur-[80px]" />
        </div>
      </section>

      {/* Curated Collection - Horizontal Scroll (2 in a row) */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-baseline justify-between mb-12">
            <h2 className="font-display text-3xl md:text-5xl font-light text-foreground">
              Curated <span className="italic">Sets</span>
            </h2>
            <Link to="/products" className="text-xs uppercase tracking-widest text-primary font-semibold flex items-center gap-2 mt-4 md:mt-0">
              Explore All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
              {featured.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="shrink-0 w-[calc(50%-8px)] md:w-[calc(25%-12px)] snap-start"
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
              {featured.length === 0 && <p className="text-gray-500 text-center w-full">No featured products yet.</p>}
            </div>
          )}
        </div>
      </section>

      {/* Premium Bridal Sets - Horizontal Scroll (2 in a row) */}
      <section className="py-20 bg-white border-t border-neutral-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-baseline justify-between mb-12">
            <h2 className="font-display text-3xl md:text-5xl font-light text-foreground">
              Premium Bridal <span className="italic">Sets</span>
            </h2>
            <Link to="/products" className="text-xs uppercase tracking-widest text-primary font-semibold flex items-center gap-2 mt-4 md:mt-0">
              Explore All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
              {premiumBridal.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="shrink-0 w-[calc(50%-8px)] md:w-[calc(25%-12px)] snap-start"
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
              {premiumBridal.length === 0 && <p className="text-gray-500 text-center w-full">No premium bridal sets yet.</p>}
            </div>
          )}
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-20 bg-[#FCF9F7]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase tracking-[0.5em] font-body text-primary/60 mb-8 block">Handcrafted in Pakistan</span>
            <h2 className="font-display text-4xl font-light">The Late <span className="italic">Drops</span></h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {newArrivals.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
              {newArrivals.length === 0 && <p className="text-gray-500 col-span-2 md:col-span-4 text-center">No new arrivals right now.</p>}
            </div>
          )}
        </div>
      </section>


      {/* Boutique Reviews */}
      <section className="py-24 bg-[#FCF9F7]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-light mb-4">Client Notes</h2>
            <div className="w-12 h-px bg-primary mx-auto opacity-30" />
          </div>
          <div className="relative overflow-hidden -mx-4 px-4 md:mx-0 md:px-0">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#FCF9F7] to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#FCF9F7] to-transparent z-10" />

            <motion.div
              className="flex gap-6 w-max"
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                duration: 40,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {[...reviews, ...reviews].map((r, i) => (
                <div key={i} className="flex-shrink-0 w-[280px] md:w-[320px]">
                  <ReviewCard review={r} />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <WhatsAppButton />
    </div>
  );
};

export default Index;
