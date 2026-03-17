import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import logo from "@/assets/logo.png";

const Header = () => {
  const { toggleCart, totalItems } = useCart();

  return (
    <header className="sticky top-[36px] z-40 bg-accent/80 backdrop-blur-md cherry-shadow">
      <div className="container flex items-center justify-between py-3">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="NailsByHamna" className="h-14 w-20 md:h-16 md:w-20 rounded-lg object-cover" />
        </Link>

        <div className="flex items-center gap-4 md:gap-6">
          <Link
            to="/products"
            className="bg-primary text-white px-5 py-2 rounded-full text-[9px] md:text-xs uppercase tracking-[0.2em] font-bold hover:bg-primary/90 transition-all shadow-sm"
          >
            Shop
          </Link>

          <button onClick={toggleCart} className="relative btn-press">
            <ShoppingCart className="h-5 w-5 md:h-6 md:w-6 text-foreground" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 h-3 w-3 md:h-4 md:w-4 rounded-full bg-primary text-primary-foreground text-[8px] md:text-[10px] flex items-center justify-center font-body">
                {totalItems}
              </span>
            )}
          </button>

          <Link
            to="/checkout"
            className="bg-secondary text-primary-foreground px-5 py-2 rounded-full text-[9px] md:text-xs uppercase tracking-[0.2em] font-bold hover:bg-secondary/90 transition-all shadow-sm"
          >
            Checkout
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
