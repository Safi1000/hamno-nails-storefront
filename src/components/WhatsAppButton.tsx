import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  productName?: string;
  className?: string;
  outOfStock?: boolean;
}

const WhatsAppButton = ({ productName, className = "", outOfStock = false }: WhatsAppButtonProps) => {
  const message = productName
    ? `Hello! I want to order the ${productName}.`
    : "Hello! I want to place an order.";
  const url = `https://wa.me/923105826211?text=${encodeURIComponent(message)}`;

  if (outOfStock) {
    return (
      <button
        disabled
        className={`flex items-center justify-center gap-2 bg-whatsapp text-primary-foreground font-body py-3 rounded-none btn-press opacity-50 cursor-not-allowed w-full ${className}`}
      >
        <MessageCircle className="h-5 w-5" />
        Quick Order on WhatsApp
      </button>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center justify-center gap-2 bg-whatsapp text-primary-foreground font-body py-3 rounded-none btn-press hover:opacity-90 transition-opacity w-full ${className}`}
    >
      <MessageCircle className="h-5 w-5" />
      Quick Order on WhatsApp
    </a>
  );
};

export default WhatsAppButton;
