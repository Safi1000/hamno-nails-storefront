import { Link } from "react-router-dom";
import { Instagram, MapPin, Mail, Phone, ArrowUpRight } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#1A1818] text-[#FCF9F7] pt-20 pb-10 border-t border-neutral-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 mb-16">
          
          {/* Brand Section */}
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <h2 className="font-display text-3xl font-light tracking-tight text-white mb-2">
                Nails By <span className="italic font-serif">Hamna</span>
              </h2>
            </Link>
            <p className="font-body text-sm text-neutral-400 leading-relaxed max-w-xs">
              Luxury, reusable press-on nails handcrafted for the modern aesthetic. Elevate your everyday style with artisan designs.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a 
                href="https://instagram.com/hamnanails" 
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 rounded-full border border-neutral-700 flex items-center justify-center text-neutral-300 hover:bg-white hover:text-black transition-all hover:border-white"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-white mb-6">Explore</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/products" className="font-body text-sm text-neutral-400 hover:text-white transition-colors flex items-center gap-1 group">
                  The Collection <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity translate-y-1 group-hover:translate-y-0" />
                </Link>
              </li>
              <li>
                <Link to="/" className="font-body text-sm text-neutral-400 hover:text-white transition-colors flex items-center gap-1 group">
                  Curated Sets <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity translate-y-1 group-hover:translate-y-0" />
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="font-body text-sm text-neutral-400 hover:text-white transition-colors flex items-center gap-1 group">
                  My Favorites <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity translate-y-1 group-hover:translate-y-0" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-white mb-6">Support</h3>
            <ul className="space-y-4">
              <li>
                <a href="https://wa.me/923701562433" target="_blank" rel="noreferrer" className="font-body text-sm text-neutral-400 hover:text-white transition-colors flex items-center gap-1 group">
                  Track Order <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity translate-y-1 group-hover:translate-y-0" />
                </a>
              </li>
              <li>
                <span className="font-body text-sm text-neutral-400 cursor-pointer hover:text-white transition-colors flex items-center gap-1 group">
                  Shipping Policy
                </span>
              </li>
              <li>
                <span className="font-body text-sm text-neutral-400 cursor-pointer hover:text-white transition-colors flex items-center gap-1 group">
                  Refund & Exchanges
                </span>
              </li>
              <li>
                <span className="font-body text-sm text-neutral-400 cursor-pointer hover:text-white transition-colors flex items-center gap-1 group">
                  Sizing Guide
                </span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-white mb-6">Contact Us</h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-neutral-500 shrink-0 mt-0.5" />
                <span className="font-body text-sm text-neutral-400 leading-relaxed">
                  Lahore, Pakistan<br />
                  <span className="text-xs text-neutral-500 block mt-1">Available for nationwide delivery</span>
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-neutral-500 shrink-0" />
                <a href="https://wa.me/923701562433" target="_blank" rel="noreferrer" className="font-body text-sm text-neutral-400 hover:text-white transition-colors">
                  +92 370 1562433
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-neutral-500 shrink-0" />
                <a href="mailto:hamnan03@gmail.com" className="font-body text-sm text-neutral-400 hover:text-white transition-colors">
                  hamnan03@gmail.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-neutral-500 text-center md:text-left">
            &copy; {new Date().getFullYear()} Nails By Hamna. All rights reserved.
          </p>
          <div className="flex gap-4">
            <span className="font-body text-xs text-neutral-500 cursor-pointer hover:text-white transition-colors">Privacy Policy</span>
            <span className="font-body text-xs text-neutral-500 cursor-pointer hover:text-white transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
