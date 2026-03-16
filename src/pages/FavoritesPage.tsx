import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { Heart } from "lucide-react";

const FavoritesPage = () => {
  const { favorites } = useCart();
  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  return (
    <div className="container py-8 animate-fade-in">
      <h1 className="font-display text-3xl font-bold text-foreground text-center mb-8">Your Favorites</h1>
      {favoriteProducts.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="font-body text-muted-foreground">No favorites yet. Start browsing!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {favoriteProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
