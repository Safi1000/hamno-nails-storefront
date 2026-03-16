import { X, Plus, Minus, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const CartDrawer = () => {
  const { items, isOpen, closeCart, updateQuantity, removeFromCart, totalPrice } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground z-50"
            onClick={closeCart}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-accent z-50 flex flex-col cherry-shadow"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-foreground" />
                <h2 className="font-display text-lg text-foreground">Your Cart</h2>
              </div>
              <button onClick={closeCart} className="btn-press">
                <X className="h-6 w-6 text-foreground" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="font-body text-muted-foreground">Your cart is empty</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.product.id} className="flex gap-3 bg-card rounded-lg p-3 cherry-shadow">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-20 h-20 rounded-md object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-body text-sm font-semibold text-foreground">{item.product.name}</h3>
                        <button onClick={() => removeFromCart(item.product.id)} className="btn-press">
                          <X className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </div>
                      <p className="font-body text-sm text-secondary">Rs. {item.product.price}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="h-7 w-7 rounded-md bg-muted flex items-center justify-center btn-press"
                        >
                          <Minus className="h-3 w-3 text-foreground" />
                        </button>
                        <span className="font-body text-sm text-foreground w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="h-7 w-7 rounded-md bg-muted flex items-center justify-center btn-press"
                        >
                          <Plus className="h-3 w-3 text-foreground" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-4 border-t border-border space-y-3">
                <div className="flex justify-between font-body text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span>Rs. {totalPrice}</span>
                </div>
                <div className="flex justify-between font-body text-sm text-muted-foreground">
                  <span>Shipping</span>
                  <span className={totalPrice > 5000 ? "text-whatsapp font-semibold uppercase tracking-widest text-[10px]" : ""}>
                    {totalPrice > 5000 ? "Free Shipping" : "Rs. 250"}
                  </span>
                </div>
                <div className="flex justify-between font-body font-semibold text-foreground pt-2 border-t border-border">
                  <span>Total</span>
                  <span>Rs. {totalPrice + (totalPrice > 5000 ? 0 : 250)}</span>
                </div>
                <Link
                  to="/checkout"
                  onClick={closeCart}
                  className="block w-full bg-primary text-primary-foreground font-body text-center py-3 rounded-lg btn-press hover:bg-secondary transition-colors"
                >
                  Checkout
                </Link>
                <button
                  onClick={closeCart}
                  className="w-full border border-border text-foreground font-body py-3 rounded-lg btn-press hover:bg-muted transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
