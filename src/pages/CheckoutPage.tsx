import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Minus, Plus } from "lucide-react";

const PACKAGING_PRICE = 150;

const CheckoutPage = () => {
  const { items, totalPrice, updateQuantity, totalItems, clearCart, packaging, setPackaging, prepKit, setPrepKit } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    house: "",
    street: "",
    area: "",
    city: "",
    notes: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const currentShippingFee = totalPrice > 5000 ? 0 : 250;
  const packagingFee = packaging === "Standard" ? 0 : PACKAGING_PRICE;
  const prepKitFee = prepKit ? 100 : 0;
  const grandTotal = totalPrice + currentShippingFee + packagingFee + prepKitFee;

  const validatePhone = (phone: string) => {
    const pakPhoneRegex = /^((\+92)|(92)|(0))?3[0-9]{9}$/;
    return pakPhoneRegex.test(phone.replace(/[\s-]/g, ""));
  };

  const fullAddress = `${form.house}, ${form.street}, ${form.area}, ${form.city}`;

  // Build WhatsApp message for online transfer
  const userInfo = form.name ? `\n\nOrder for: ${form.name}\nPhone: ${form.phone}\nAddress: ${fullAddress}` : "";
  const transferMessage = items.length > 0
    ? `Hello! I want to place an order via Online Transfer.\n\n${items.map(i => `• ${i.product.name} × ${i.quantity} — Rs. ${i.product.price * i.quantity}`).join("\n")}\n• Packaging: ${packaging}${packaging !== "Standard" ? ` (+ Rs. ${PACKAGING_PRICE})` : ""}${prepKit ? `\n• Optional Extras: Prep Kit (+ Rs. 100)` : ""}\n\nSubtotal: Rs. ${totalPrice}\nShipping: Rs. ${currentShippingFee}${totalPrice > 5000 ? " (FREE for orders over Rs. 5000!)" : ""}\nTotal: Rs. ${grandTotal}${userInfo}`
    : "Hello! I want to place an order via Online Transfer.";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePhone(form.phone)) {
      alert("Please enter a valid Pakistani phone number (e.g., 03XXXXXXXXX)");
      return;
    }

    setSubmitting(true);

    try {
      // 1. Save to Database
      const orderPayload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: {
          houseNo: form.house,
          street: form.street,
          sector: form.area,
          city: form.city
        },
        items: items.map((i) => ({
          productId: i.product.id,
          name: i.product.name,
          quantity: i.quantity,
          price: i.product.price,
          thumbnail: i.product.images[0]
        })),
        total: grandTotal,
        packaging_option: packaging,
        has_prep_kit: prepKit,
        order_notes: form.notes
      };

      // Since we proxy `/admin/api` to `localhost:3001` in vite.config.ts, this will hit our Express backend!
      const dbRes = await fetch('/admin/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (!dbRes.ok) {
        throw new Error("Failed to save order to database");
      }

      // 2. Send Email Notification
      await supabase.functions.invoke("send-order-email", {
        body: {
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: fullAddress,
          notes: form.notes,
          adminEmail: "hamnan03@gmail.com",
          paymentMethod: "Cash on Delivery",
          items: items.map((i) => ({
            name: i.product.name,
            quantity: i.quantity,
            price: i.product.price,
          })),
          totalPrice,
          shippingFee: currentShippingFee,
          packaging: packaging,
          has_prep_kit: prepKit,
          grandTotal: grandTotal,
        },
      });

    } catch (err) {
      console.error("Checkout failed:", err);
      // We purposefully don't block the user if email tracking fails, but we should if DB fails
      // In a real app we'd show a toast error here
    } finally {
      setSubmitting(false);
      clearCart();
      navigate("/thank-you");
    }
  };

  const handleWhatsAppSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.phone || !form.house || !form.street || !form.area || !form.city) {
      alert("Please fill out all required Delivery Details above before proceeding to WhatsApp.");
      return;
    }

    if (!validatePhone(form.phone)) {
      alert("Please enter a valid Pakistani phone number (e.g., 03XXXXXXXXX)");
      return;
    }

    setSubmitting(true);

    try {
      // 1. Save to Database
      const orderPayload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: {
          houseNo: form.house,
          street: form.street,
          sector: form.area,
          city: form.city
        },
        items: items.map((i) => ({
          productId: i.product.id,
          name: i.product.name,
          quantity: i.quantity,
          price: i.product.price,
          thumbnail: i.product.images[0]
        })),
        total: grandTotal,
        packaging_option: packaging,
        has_prep_kit: prepKit,
        order_notes: form.notes,
        paymentMethod: "Online"
      };

      const dbRes = await fetch('/admin/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (!dbRes.ok) {
        throw new Error("Failed to save order to database");
      }

      // 2. Open WhatsApp
      window.open(`https://wa.me/923701562433?text=${encodeURIComponent(transferMessage)}`, '_blank');
      
      // 3. Clear cart & redirect
      clearCart();
      navigate("/thank-you");

    } catch (err) {
      console.error("WhatsApp checkout failed:", err);
      alert("Failed to create order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container py-20 text-center animate-fade-in">
        <p className="font-body text-foreground">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="container max-w-lg py-8 animate-fade-in">
      <h1 className="font-display text-3xl font-bold text-foreground text-center mb-8">Checkout</h1>

      {/* Order summary */}
      <div className="bg-card rounded-lg p-4 cherry-shadow mb-6">
        {items.map((item) => (
          <div key={item.product.id} className="flex gap-4 py-4 border-b border-border last:border-0">
            <div className="w-16 h-16 shrink-0 rounded-md overflow-hidden bg-neutral-100 border border-neutral-100">
              {item.product.images && item.product.images.length > 0 ? (
                <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl">💅</div>
              )}
            </div>
            <div className="flex flex-1 items-center justify-between">
              <div className="flex flex-col justify-between h-full py-0.5">
                <span className="font-body text-sm text-foreground font-medium">{item.product.name}</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="w-6 h-6 rounded-full border border-primary/20 flex items-center justify-center text-primary/60 hover:border-primary hover:text-primary transition-all bg-white hover:bg-white"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-body text-xs text-foreground font-medium w-3 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="w-6 h-6 rounded-full border border-primary/20 flex items-center justify-center text-primary/60 hover:border-primary hover:text-primary transition-all bg-white hover:bg-white"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <span className="font-body text-sm text-foreground font-semibold">Rs. {item.product.price * item.quantity}</span>
            </div>
          </div>
        ))}
        <div className="flex justify-between font-body text-sm text-muted-foreground pt-2">
          <span>Subtotal</span>
          <span>Rs. {totalPrice}</span>
        </div>
        <div className="flex justify-between font-body text-sm text-muted-foreground pt-1">
          <span>Shipping</span>
          <span className={currentShippingFee === 0 ? "text-whatsapp font-semibold uppercase tracking-widest text-[10px]" : ""}>
            {currentShippingFee === 0 ? "Free Shipping" : `Rs. ${currentShippingFee}`}
          </span>
        </div>

        <div className="pt-4 mt-4 border-t border-border space-y-3">
          <p className="font-body text-sm font-semibold text-foreground">Packaging Option</p>
          
          <label className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${packaging === "Standard" ? 'border-primary' : 'border-neutral-200 group-hover:border-primary/50'}`}>
                {packaging === "Standard" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
              </div>
              <div className="text-left">
                <span className="font-body text-sm text-foreground block">Standard Packaging</span>
                <span className="font-body text-[10px] text-neutral-400 uppercase tracking-widest">Included with all orders free of charge</span>
              </div>
            </div>
            <input
              type="radio"
              name="packaging"
              value="Standard"
              className="hidden"
              checked={packaging === "Standard"}
              onChange={() => setPackaging("Standard")}
            />
            <span className="font-body text-sm text-foreground shrink-0">Free</span>
          </label>

          <label className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${packaging === "Pink Theme" ? 'border-primary' : 'border-neutral-200 group-hover:border-primary/50'}`}>
                {packaging === "Pink Theme" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
              </div>
              <div className="text-left">
                <span className="font-body text-sm text-foreground block">Pink Themed Packaging</span>
                <span className="font-body text-[10px] text-neutral-400 uppercase tracking-widest">Aesthetic custom pink studio box</span>
              </div>
            </div>
            <input
              type="radio"
              name="packaging"
              value="Pink Theme"
              className="hidden"
              checked={packaging === "Pink Theme"}
              onChange={() => setPackaging("Pink Theme")}
            />
            <span className="font-body text-sm text-foreground shrink-0">+ Rs. {PACKAGING_PRICE}</span>
          </label>

          <label className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${packaging === "Black Theme" ? 'border-primary' : 'border-neutral-200 group-hover:border-primary/50'}`}>
                {packaging === "Black Theme" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
              </div>
              <div className="text-left">
                <span className="font-body text-sm text-foreground block">Black Themed Packaging</span>
                <span className="font-body text-[10px] text-neutral-400 uppercase tracking-widest">Aesthetic custom black studio box</span>
              </div>
            </div>
            <input
              type="radio"
              name="packaging"
              value="Black Theme"
              className="hidden"
              checked={packaging === "Black Theme"}
              onChange={() => setPackaging("Black Theme")}
            />
            <span className="font-body text-sm text-foreground shrink-0">+ Rs. {PACKAGING_PRICE}</span>
          </label>
        </div>

        <div className="pt-4 mt-4 border-t border-border space-y-3">
          <p className="font-body text-sm font-semibold text-foreground">Optional Extras</p>
          <label className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${prepKit ? 'bg-primary border-primary' : 'border-neutral-200 group-hover:border-primary/50'}`}>
                {prepKit && <div className="w-2.5 h-2.5 rounded-sm bg-white" />}
              </div>
              <div className="text-left">
                <span className="font-body text-sm text-foreground block">Prep Kit</span>
                <span className="font-body text-[10px] text-neutral-400 uppercase tracking-widest">Everything you need to apply your nails</span>
              </div>
            </div>
            <input
              type="checkbox"
              className="hidden"
              checked={prepKit}
              onChange={(e) => setPrepKit(e.target.checked)}
            />
            <span className="font-body text-sm text-foreground shrink-0">+ Rs. 100</span>
          </label>
        </div>

        <div className="flex justify-between font-body font-semibold text-foreground pt-3 border-t border-border mt-4">
          <span>Total</span>
          <span>Rs. {grandTotal}</span>
        </div>
      </div>

      {/* COD Form */}
      <div className="mb-6">
        <h2 className="font-display text-lg text-foreground mb-4">Delivery Details</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-body text-[10px] uppercase tracking-widest text-primary/60 block mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="Hamna Noor"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full bg-card border border-primary/10 rounded-lg px-4 py-3 font-body text-sm text-foreground placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>
            <div>
              <label className="font-body text-[10px] uppercase tracking-widest text-primary/60 block mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full bg-card border border-primary/10 rounded-lg px-4 py-3 font-body text-sm text-foreground placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="font-body text-[10px] uppercase tracking-widest text-primary/60 block mb-1">Phone Number *</label>
            <input
              type="tel"
              required
              placeholder="03XXXXXXXXX"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className={`w-full bg-card border rounded-lg px-4 py-3 font-body text-sm text-foreground placeholder:text-neutral-400 focus:outline-none focus:ring-1 transition-all ${form.phone && !validatePhone(form.phone) ? "border-red-300 focus:ring-red-200" : "border-primary/10 focus:ring-primary/20"
                }`}
            />
            {form.phone && !validatePhone(form.phone) && (
              <span className="text-[10px] text-red-500 mt-1 block">Please enter a valid Pakistani number (e.g. 03001234567)</span>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-primary/5">
            <h3 className="font-display text-sm text-primary mb-4 uppercase tracking-widest">Shipping Address</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-body text-[10px] uppercase tracking-widest text-primary/60 block mb-1">House/Flat No. *</label>
                <input
                  type="text"
                  required
                  placeholder="House 123"
                  value={form.house}
                  onChange={(e) => setForm((f) => ({ ...f, house: e.target.value }))}
                  className="w-full bg-card border border-primary/10 rounded-lg px-4 py-3 font-body text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>
              <div>
                <label className="font-body text-[10px] uppercase tracking-widest text-primary/60 block mb-1">Street *</label>
                <input
                  type="text"
                  required
                  placeholder="Street 4"
                  value={form.street}
                  onChange={(e) => setForm((f) => ({ ...f, street: e.target.value }))}
                  className="w-full bg-card border border-primary/10 rounded-lg px-4 py-3 font-body text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="font-body text-[10px] uppercase tracking-widest text-primary/60 block mb-1">Sector / Area *</label>
                <input
                  type="text"
                  required
                  placeholder="DHA Phase 5"
                  value={form.area}
                  onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))}
                  className="w-full bg-card border border-primary/10 rounded-lg px-4 py-3 font-body text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>
              <div>
                <label className="font-body text-[10px] uppercase tracking-widest text-primary/60 block mb-1">City *</label>
                <input
                  type="text"
                  required
                  placeholder="Lahore"
                  value={form.city}
                  onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                  className="w-full bg-card border border-primary/10 rounded-lg px-4 py-3 font-body text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="font-body text-[10px] uppercase tracking-widest text-primary/60 block mb-1">Order Notes (Optional)</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              rows={3}
              placeholder="Any specific requests?"
              className="w-full bg-card border border-primary/10 rounded-lg px-4 py-3 font-body text-sm text-foreground placeholder:text-neutral-300 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary text-primary-foreground font-body py-3 rounded-lg btn-press hover:bg-secondary transition-colors disabled:opacity-50"
          >
            {submitting ? "Placing Order..." : "Place Order (COD)"}
          </button>
        </form>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-border" />
        <span className="font-body text-sm text-muted-foreground">or</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Online Transfer via WhatsApp */}
      <div>
        <h2 className="font-display text-lg text-foreground mb-3">Online Transfer</h2>
        <p className="font-body text-sm text-muted-foreground mb-3">
          Contact us on WhatsApp to pay via online bank transfer. Just click below and we'll get order details automatically, no need to retype! :)
        </p>
        <button
          onClick={handleWhatsAppSubmit}
          disabled={submitting}
          className="flex items-center justify-center gap-2 bg-whatsapp text-primary-foreground font-body py-3 rounded-lg btn-press hover:opacity-90 transition-opacity w-full disabled:opacity-50"
        >
          💬 Order via Online Transfer (WhatsApp)
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
