import { Leaf, ListPlus, Gavel, Truck, Wallet } from "lucide-react";

const steps = [
  {
    icon: ListPlus,
    step: "01",
    title: "List Your Crop",
    description: "Enter crop details, quality grade, quantity, and set your minimum expected price.",
  },
  {
    icon: Gavel,
    step: "02",
    title: "Buyers Bid",
    description: "Registered buyers compete in real-time auctions. Watch bids come in live.",
  },
  {
    icon: Leaf,
    step: "03",
    title: "Accept Best Offer",
    description: "Review bids, compare with mandi rates, and accept the offer that works for you.",
  },
  {
    icon: Truck,
    step: "04",
    title: "Arrange Logistics",
    description: "Choose storage or direct dispatch. We assign verified transport partners.",
  },
  {
    icon: Wallet,
    step: "05",
    title: "Get Paid Securely",
    description: "Receive payment to your bank account once pickup is confirmed. Fast and secure.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
            Simple Steps to Better Prices
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From listing to payment, the entire process is designed to be fast and farmer-friendly.
          </p>
        </div>

        <div className="relative">
          {/* Connection Line */}
          <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-border hidden lg:block" />
          
          <div className="space-y-12 lg:space-y-0">
            {steps.map((step, index) => (
              <div
                key={step.step}
                className={`relative flex flex-col lg:flex-row items-center gap-8 ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                {/* Content */}
                <div className={`flex-1 ${index % 2 === 0 ? "lg:text-right" : "lg:text-left"}`}>
                  <div className={`inline-flex flex-col ${index % 2 === 0 ? "lg:items-end" : "lg:items-start"}`}>
                    <span className="text-sm font-bold text-primary">Step {step.step}</span>
                    <h3 className="mt-2 font-serif text-2xl font-bold text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-md text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Icon */}
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-4 ring-background">
                  <step.icon className="h-8 w-8" />
                </div>

                {/* Spacer */}
                <div className="flex-1 hidden lg:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
