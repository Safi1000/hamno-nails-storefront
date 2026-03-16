import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import illustration from "@/assets/thankyou-illustration.png";

const ThankYouPage = () => {
  return (
    <div className="container max-w-lg py-16 text-center animate-fade-in">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 15 }}
      >
        <img src={illustration} alt="Thank you" className="w-48 h-48 mx-auto mb-8 object-contain" />
        <h1 className="font-display text-3xl font-bold text-foreground mb-4">
          Thank you for your order 💗
        </h1>
        <p className="font-body text-muted-foreground mb-8">
          Our team will contact you via email or phone number for confirmation.
        </p>
        <Link
          to="/"
          className="inline-block bg-primary text-primary-foreground font-body px-8 py-3 rounded-lg btn-press hover:bg-secondary transition-colors"
        >
          Continue Shopping
        </Link>
      </motion.div>
    </div>
  );
};

export default ThankYouPage;
