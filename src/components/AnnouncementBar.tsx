import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface BannerConfig {
  text: string;
  backgroundColor: string;
  textColor: string;
  isActive: boolean;
}

const AnnouncementBar = () => {
  const [config, setConfig] = useState<BannerConfig | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('/admin/api/public/settings/banner');
        if (res.ok) {
          const data = await res.json();
          if (data) setConfig(data);
        }
      } catch (err) {
        console.error("Failed to load banner config:", err);
      }
    };
    fetchConfig();
  }, []);

  if (!config || !config.isActive) return null;

  return (
    <div 
      className="overflow-hidden py-2 sticky top-0 z-50 transition-colors duration-300"
      style={{ backgroundColor: config.backgroundColor }}
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full text-center px-4"
      >
        <span 
          className="text-sm font-body font-medium"
          style={{ color: config.textColor }}
        >
          {config.text}
        </span>
      </motion.div>
    </div>
  );
};

export default AnnouncementBar;
