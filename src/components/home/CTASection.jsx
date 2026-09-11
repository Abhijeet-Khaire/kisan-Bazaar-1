import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 bg-primary">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/20 px-4 py-2 text-sm font-medium text-primary-foreground">
            <Sparkles className="h-4 w-4" />
            Join 50,000+ Farmers Today
          </div>

          <h2 className="font-serif text-3xl font-bold text-primary-foreground md:text-4xl lg:text-5xl">
            Ready to Get Fair Prices for Your Produce?
          </h2>

          <p className="text-lg text-primary-foreground/80">
            Registration is free. Start listing your crops and connect with verified buyers across India.
            No middlemen, no hidden fees.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link to="/register?role=farmer">
              <Button
                size="xl"
                className="group bg-background text-foreground hover:bg-background/90"
              >
                Register as Farmer
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/register?role=buyer">
              <Button
                size="xl"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary bg-transparent"
              >
                Register as Buyer
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
