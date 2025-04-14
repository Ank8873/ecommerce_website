import { Mail, Phone, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const user = useSelector((state) => state.auth.user);
  const userName = user ? (user.name || user.userName || "Guest") : "Guest";
  
  const whatsappText = encodeURIComponent(
    `Hello! I'm ${userName} and I'm interested in your clothing collection. Can you help me with your products?`
  );
  const whatsappLink = `https://wa.me/916206695157/?text=${whatsappText}`;

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-secondary mt-8"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Our Store</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shop/about" className="hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/shop/about#size-charts" className="hover:text-primary">
                  Size Charts
                </Link>
              </li>
              <li>
                <Link to="/shop/about#faq" className="hover:text-primary">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shop/about#shipping" className="hover:text-primary">
                  Shipping Information
                </Link>
              </li>
              <li>
                <Link to="/shop/about#returns" className="hover:text-primary">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link to="/shop/about#payment" className="hover:text-primary">
                  Payment Methods
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="flex flex-col space-y-3">
              <Button
                variant="outline"
                className="justify-center hover:bg-primary hover:text-primary-foreground transition-colors h-9 text-sm  w-full"
                asChild
              >
                <a href="mailto:ankitvastraa@gmail.com" target="_blank" rel="noopener noreferrer">
                  <Mail className="h-4 w-4 mr-2" />
                  ankitvastraa@gmail.com
                </a>
              </Button>
              
              <Button
                variant="outline"
                className="justify-center hover:bg-primary hover:text-primary-foreground transition-colors h-9 text-sm  w-full"
                asChild
              >
                <a href="tel:+916206695157">
                  <Phone className="h-4 w-4 mr-2" />
                  +91 6206695157
                </a>
              </Button>
              
              <Button
                variant="outline"
                className="justify-center hover:bg-primary hover:text-primary-foreground transition-colors h-9 text-sm  w-full"
                asChild
              >
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp Support
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="border-t border-border mt-8 pt-8 text-center text-muted-foreground"
        >
          <p>
            {currentYear} Ankit Vastraa. All rights reserved.
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
