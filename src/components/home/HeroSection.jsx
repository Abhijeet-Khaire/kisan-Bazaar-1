import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, Users, Truck } from "lucide-react";
import heroImage from "@/assets/hero-farm.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Agricultural fields at sunrise"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
      </div>

      {/* Content */}
      <div className="container relative z-10 py-20">
        <div className="max-w-2xl space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-2 text-sm font-medium text-primary-foreground backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-chart-2 animate-pulse" />
            Live Auctions Running Now
          </div>

          <h1 className="font-serif text-4xl font-bold leading-tight text-primary-foreground md:text-5xl lg:text-6xl">
            Get the Best Price for Your Crops,{" "}
            <span className="text-chart-2">Directly.</span>
          </h1>

          <p className="text-lg text-primary-foreground/80 md:text-xl">
            KisanBazaar connects farmers directly with buyers through transparent real-time bidding. 
            No middlemen, fair prices, integrated logistics.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link to="/farmer/dashboard">
              <Button variant="hero" size="xl" className="group">
                Start Selling
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/buyer/marketplace">
              <Button variant="heroOutline" size="xl" className="bg-background/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-foreground">
                Browse Marketplace
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 pt-8 border-t border-primary-foreground/20">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-2xl font-bold text-primary-foreground">
                <Users className="h-6 w-6 text-chart-2" />
                50,000+
              </div>
              <p className="text-sm text-primary-foreground/70">Farmers Registered</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-2xl font-bold text-primary-foreground">
                <TrendingUp className="h-6 w-6 text-chart-2" />
                ₹120 Cr+
              </div>
              <p className="text-sm text-primary-foreground/70">Trade Volume</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-2xl font-bold text-primary-foreground">
                <Truck className="h-6 w-6 text-chart-2" />
                15,000+
              </div>
              <p className="text-sm text-primary-foreground/70">Successful Deliveries</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
