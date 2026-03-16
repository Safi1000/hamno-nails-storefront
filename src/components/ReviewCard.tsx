import { Review } from "@/data/products";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

const ReviewCard = ({ review }: { review: Review }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="bg-accent rounded-lg p-5 cherry-shadow min-w-[260px]"
    >
      <div className="flex gap-0.5 mb-2">
        {Array.from({ length: review.stars }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-primary text-primary" />
        ))}
      </div>
      <p className="font-body text-sm text-foreground italic mb-3">"{review.text}"</p>
      <p className="font-body text-xs text-secondary font-semibold">– {review.author}</p>
    </motion.div>
  );
};

export default ReviewCard;
