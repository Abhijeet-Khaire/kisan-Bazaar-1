import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <img 
                src="/logo-icon.png" 
                alt="Kisan Bazaar Logo" 
                className="h-10 w-10 object-contain drop-shadow-sm transition-transform duration-200 group-hover:scale-105" 
              />
              <span className="font-serif text-xl font-bold">Kisan<span className="text-primary">Bazaar</span></span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Empowering farmers with transparent pricing, seamless logistics, and direct market access.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/buyer/marketplace" className="hover:text-primary transition-colors">Marketplace</Link></li>
              <li><Link to="/advisory" className="hover:text-primary transition-colors">Agro Advisory & Weather</Link></li>
              <li><Link to="/schemes" className="hover:text-primary transition-colors">Govt Schemes & Subsidies</Link></li>
              <li><Link to="/logistics" className="hover:text-primary transition-colors">Logistics Network</Link></li>
              <li><Link to="/storage" className="hover:text-primary transition-colors">Cold Storage</Link></li>
              <li><Link to="/pricing" className="hover:text-primary transition-colors">Pricing & Plans</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link to="/faq" className="hover:text-primary transition-colors">FAQs</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link to="/training" className="hover:text-primary transition-colors">Training</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                +91 8432484017
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                support@kisanbazaar.in
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span>Krishi Bhawan, Paranda, India - 413502</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2025 KisanBazaar. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
