import { Plus, Minus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  onChange: (quantity: number) => void;
}

const QuantitySelector = ({ quantity, onChange }: QuantitySelectorProps) => {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onChange(Math.max(1, quantity - 1))}
        className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center btn-press hover:bg-border transition-colors"
      >
        <Minus className="h-4 w-4 text-foreground" />
      </button>
      <span className="font-body text-lg font-semibold text-foreground w-8 text-center">{quantity}</span>
      <button
        onClick={() => onChange(quantity + 1)}
        className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center btn-press hover:bg-border transition-colors"
      >
        <Plus className="h-4 w-4 text-foreground" />
      </button>
    </div>
  );
};

export default QuantitySelector;
