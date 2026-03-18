import nails1 from "@/assets/nails-1.jpg";
import nails2 from "@/assets/nails-2.jpg";
import nails3 from "@/assets/nails-3.jpg";
import nails4 from "@/assets/nails-4.jpg";
import nails5 from "@/assets/nails-5.jpg";
import nails6 from "@/assets/nails-6.jpg";

export interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string[];
  description: string;
  stockStatus?: string;
}

export const products: Product[] = [
  {
    id: "pink-glitter-set",
    name: "Pink Glitter Dream",
    price: 1500,
    images: [nails1, nails3, nails5, nails6],
    category: ["featured"],
    description: "Stunning pink glitter press-on nails that sparkle with every move. Handcrafted with love.",
  },
  {
    id: "french-elegance",
    name: "French Elegance",
    price: 1200,
    images: [nails2, nails1, nails4, nails6],
    category: ["featured"],
    description: "Classic French tip press-on nails for a timeless, sophisticated look.",
  },
  {
    id: "cherry-gold",
    name: "Cherry & Gold",
    price: 1800,
    images: [nails3, nails1, nails5, nails2],
    category: ["featured"],
    description: "Deep cherry red nails with luxurious gold flake accents. Perfect for special occasions.",
  },
  {
    id: "floral-pastel",
    name: "Floral Pastel",
    price: 1400,
    images: [nails4, nails2, nails6, nails5],
    category: ["featured"],
    description: "Delicate pastel press-on nails with hand-painted floral designs.",
  },
  {
    id: "ombre-sparkle",
    name: "Ombré Sparkle",
    price: 1600,
    images: [nails5, nails1, nails3, nails4],
    category: ["new"],
    description: "Beautiful ombré gradient from nude to sparkly pink. A showstopper!",
  },
  {
    id: "sweetheart-pink",
    name: "Sweetheart Pink",
    price: 1100,
    images: [nails6, nails2, nails4, nails1],
    category: ["new"],
    description: "Cute baby pink nails with an adorable heart accent nail.",
  },
  {
    id: "rose-quartz",
    name: "Rose Quartz",
    price: 1700,
    images: [nails2, nails5, nails3, nails6],
    category: ["new"],
    description: "Inspired by the healing crystal, these nails feature a soft rosy translucent finish.",
  },
  {
    id: "midnight-cherry",
    name: "Midnight Cherry",
    price: 1900,
    images: [nails3, nails5, nails1, nails4],
    category: ["new"],
    description: "Deep, dramatic cherry nails with subtle shimmer for evening glamour.",
  },
];

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Review {
  stars: number;
  text: string;
  author: string;
}

export const reviews: Review[] = [
  { stars: 5, text: "So pretty and long lasting!", author: "Ayesha" },
  { stars: 5, text: "Best press-on nails I've ever worn! 💅", author: "Fatima" },
  { stars: 5, text: "Absolutely gorgeous, everyone asks about them!", author: "Sana" },
];
