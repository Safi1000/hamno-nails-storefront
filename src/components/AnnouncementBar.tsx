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
      <div className="w-full relative flex whitespace-nowrap overflow-hidden">
        <div className="animate-marquee inline-block relative py-1">
          <span 
            className="text-sm font-body font-medium px-8"
            style={{ color: config.textColor }}
          >
            {config.text}
          </span>
          <span 
            className="text-sm font-body font-medium px-8"
            style={{ color: config.textColor }}
          >
            {config.text}
          </span>
          <span 
            className="text-sm font-body font-medium px-8"
            style={{ color: config.textColor }}
          >
            {config.text}
          </span>
          <span 
            className="text-sm font-body font-medium px-8"
            style={{ color: config.textColor }}
          >
            {config.text}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
