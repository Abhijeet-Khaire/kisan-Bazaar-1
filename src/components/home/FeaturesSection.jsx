import { 
  TrendingUp, 
  Shield, 
  Truck, 
  Warehouse, 
  Smartphone, 
  IndianRupee,
  Zap,
  BarChart3
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: TrendingUp,
    title: "Real-Time Bidding",
    description: "Live auctions where buyers compete for your produce, ensuring you get the best market price.",
  },
  {
    icon: Shield,
    title: "Secure Escrow Payments",
    description: "Your money is protected. Funds are released only after successful pickup confirmation.",
  },
  {
    icon: Truck,
    title: "Integrated Logistics",
    description: "Smart allocation of transport based on distance, cost, and crop type. Track your shipment in real-time.",
  },
  {
    icon: Warehouse,
    title: "Cold & Dry Storage",
    description: "Access to verified storage facilities near you. Preserve your produce quality and sell at the right time.",
  },
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    description: "Works on low-bandwidth connections with offline support. Available in multiple regional languages.",
  },
  {
    icon: IndianRupee,
    title: "Instant Payouts",
    description: "Receive payments directly to your bank account or UPI. Fast, secure, and transparent.",
  },
  {
    icon: Zap,
    title: "AI Price Prediction",
    description: "Get intelligent recommendations on when to sell based on market trends and demand forecasting.",
  },
  {
    icon: BarChart3,
    title: "Mandi Price Comparison",
    description: "Compare your bids against government mandi rates to ensure you're getting fair value.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-accent/30">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
            Everything You Need to Sell Better
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A complete ecosystem designed to maximize your profits and simplify your selling journey.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              className="group border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300"
            >
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-accent-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg font-semibold mt-4">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
