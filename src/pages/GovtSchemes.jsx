import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Landmark,
  Shield,
  Sun,
  Tractor,
  Wheat,
  FileCheck,
  ExternalLink,
  Calculator,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Filter,
  IndianRupee
} from "lucide-react";
import { toast } from "sonner";

const SCHEMES_DATA = [
  {
    id: "pm-kisan",
    name: "PM-Kisan Samman Nidhi",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    category: "Financial Support",
    benefit: "₹6,000 / year in 3 equal installments",
    eligibility: "All landholding farmer families with cultivable land up to state ceiling limits.",
    documents: ["Aadhaar Card", "Land Ownership Proof (7/12 or Khasra)", "Bank Account linked to Aadhaar (DBT)"],
    status: "Active 2024-25",
    link: "https://pmkisan.gov.in/",
    icon: Landmark,
    accent: "bg-blue-50 text-blue-700 border-blue-200",
    tags: ["Direct Income", "DBT", "Central Govt"]
  },
  {
    id: "pmfby",
    name: "PM Fasal Bima Yojana (PMFBY)",
    ministry: "Department of Agriculture",
    category: "Insurance",
    benefit: "Comprehensive crop loss protection against drought, flood, pests at nominal 1.5% - 2% premium",
    eligibility: "All farmers growing notified crops in notified areas (both loanee and non-loanee).",
    documents: ["Land Possession Certificate", "Sowing Certificate / Declaration", "Aadhaar Card & Bank Passbook"],
    status: "Enrollment Open",
    link: "https://pmfby.gov.in/",
    icon: Shield,
    accent: "bg-emerald-50 text-emerald-700 border-emerald-200",
    tags: ["Crop Insurance", "Drought Relief", "Nominal Premium"]
  },
  {
    id: "pm-kusum",
    name: "PM KUSUM Solar Pump Scheme",
    ministry: "Ministry of New & Renewable Energy",
    category: "Solar & Energy",
    benefit: "Up to 60% Central + 30% State subsidy on standalone Solar Irrigation Pumps (3 HP - 10 HP)",
    eligibility: "Farmers with agricultural land lacking reliable grid power or seeking diesel pump replacement.",
    documents: ["Aadhaar", "Land Records (Khatauni)", "Bank Statement", "Groundwater NOC (if applicable)"],
    status: "Subsidy Available",
    link: "https://pmkusum.mnre.gov.in/",
    icon: Sun,
    accent: "bg-amber-50 text-amber-700 border-amber-200",
    tags: ["Solar Energy", "Zero Electricity Bill", "90% Subsidy"]
  },
  {
    id: "smam",
    name: "Sub-Mission on Agricultural Mechanization (SMAM)",
    ministry: "Department of Agriculture & Cooperation",
    category: "Machinery",
    benefit: "40% - 50% capital subsidy on Tractors, Rotavators, Power Tillers, and Laser Levelers",
    eligibility: "Small, marginal, SC/ST, and women farmers given priority for custom hiring centers and machines.",
    documents: ["Aadhaar Card", "Land Holding Certificate", "Quotation from authorized implement dealer"],
    status: "Applications Active",
    link: "https://agrimachinery.nic.in/",
    icon: Tractor,
    accent: "bg-purple-50 text-purple-700 border-purple-200",
    tags: ["Farm Machinery", "Tractor Subsidy", "Mechanization"]
  },
  {
    id: "pkvy",
    name: "Paramparagat Krishi Vikas Yojana (PKVY)",
    ministry: "National Mission on Sustainable Agriculture",
    category: "Organic",
    benefit: "₹50,000 per hectare financial assistance for cluster organic farming, certification, and direct marketing",
    eligibility: "Groups of farmers willing to adopt zero-budget natural farming or PGS-India organic standards.",
    documents: ["Cluster formation resolution", "Farmer ID", "Bank Details"],
    status: "Active Clusters",
    link: "https://pgsindia-ncof.gov.in/",
    icon: Wheat,
    accent: "bg-green-50 text-green-700 border-green-200",
    tags: ["Organic Farming", "Certification", "Cluster Subsidy"]
  },
  {
    id: "kcc",
    name: "Kisan Credit Card (KCC) Scheme",
    ministry: "Reserve Bank of India & NABARD",
    category: "Financial Support",
    benefit: "Low-interest working capital credit up to ₹3,00,000 at effective 4% interest (with prompt repayment incentive)",
    eligibility: "All individual farmers, joint borrowers, tenant farmers, and sharecroppers.",
    documents: ["Duly filled KCC application", "Land Record Extract", "Identity & Address Proof"],
    status: "Instant Bank Sanction",
    link: "https://www.nabard.org/",
    icon: IndianRupee,
    accent: "bg-teal-50 text-teal-700 border-teal-200",
    tags: ["4% Interest Loan", "Working Capital", "No Collateral up to 1.6L"]
  }
];

export default function GovtSchemes() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [calculatorState, setCalculatorState] = useState({
    landSize: "5",
    farmerType: "small", // marginal (<2.5 acres), small (2.5-5 acres), medium (>5 acres)
    cropType: "Grain / Paddy & Wheat",
    solarInterest: true,
  });

  const [calculationResult, setCalculationResult] = useState(null);

  const filteredSchemes = SCHEMES_DATA.filter((s) => {
    if (selectedCategory === "All") return true;
    return s.category === selectedCategory;
  });

  const handleCalculateSubsidy = (e) => {
    e.preventDefault();
    const acres = parseFloat(calculatorState.landSize) || 5;

    let pmKisanAmount = 6000;
    let pmfbyInsuranceCover = Math.round(acres * 38000);
    let solarSubsidy = calculatorState.solarInterest ? 165000 : 0;
    let machinerySubsidy = acres <= 5 ? 75000 : 45000;
    let totalPotentialValue = pmKisanAmount + solarSubsidy + machinerySubsidy;

    setCalculationResult({
      pmKisanAmount,
      pmfbyInsuranceCover,
      solarSubsidy,
      machinerySubsidy,
      totalPotentialValue
    });
    toast.success("Subsidy eligibility calculated!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-8 max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Landmark className="h-6 w-6" />
              </div>
              <h1 className="font-serif text-3xl font-bold text-foreground">Government Schemes & Subsidies</h1>
            </div>
            <p className="text-muted-foreground mt-1">
              Direct access to Central & State welfare initiatives, PM-Kisan DBT, solar pump grants, and machinery subsidies
            </p>
          </div>

          <Badge variant="outline" className="w-fit border-primary/30 text-primary bg-primary/5 gap-1.5 py-1 px-3">
            <Sparkles className="h-3.5 w-3.5" /> Direct Benefit Transfer (DBT) Ready
          </Badge>
        </div>

        {/* Interactive Eligibility & Subsidy Calculator */}
        <Card className="border-primary/30 bg-gradient-to-br from-card via-card to-primary/5 shadow-md overflow-hidden">
          <CardHeader className="bg-primary/5 border-b border-primary/10">
            <div className="flex items-center gap-2 text-primary">
              <Calculator className="h-5 w-5" />
              <CardTitle className="text-xl font-bold">Smart Agricultural Subsidy Calculator</CardTitle>
            </div>
            <CardDescription>
              Estimate your total entitled government support, equipment grants, and insurance coverage in seconds
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleCalculateSubsidy} className="grid gap-6 md:grid-cols-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="landSize">Land Holding (Acres)</Label>
                <Input
                  id="landSize"
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={calculatorState.landSize}
                  onChange={(e) => setCalculatorState(prev => ({ ...prev, landSize: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="farmerType">Farmer Category</Label>
                <select
                  id="farmerType"
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  value={calculatorState.farmerType}
                  onChange={(e) => setCalculatorState(prev => ({ ...prev, farmerType: e.target.value }))}
                >
                  <option value="marginal">Marginal Farmer (&lt; 2.5 Acres)</option>
                  <option value="small">Small Farmer (2.5 - 5.0 Acres)</option>
                  <option value="medium">Medium / Large Farmer (&gt; 5.0 Acres)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cropType">Primary Cropping</Label>
                <select
                  id="cropType"
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  value={calculatorState.cropType}
                  onChange={(e) => setCalculatorState(prev => ({ ...prev, cropType: e.target.value }))}
                >
                  <option value="Grain">Paddy / Wheat / Cereals</option>
                  <option value="Cotton">Cotton / Oilseeds</option>
                  <option value="Horticulture">Fruits & Vegetables / Spices</option>
                </select>
              </div>

              <Button type="submit" className="gap-2 h-10">
                <Sparkles className="h-4 w-4" /> Calculate Subsidies
              </Button>
            </form>

            {/* Calculation Result Drawer */}
            {calculationResult && (
              <div className="mt-6 pt-6 border-t border-border grid gap-4 sm:grid-cols-4">
                <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
                  <p className="text-xs text-blue-700 dark:text-blue-300 font-semibold">PM-Kisan Income</p>
                  <p className="text-2xl font-bold text-foreground mt-1">₹{calculationResult.pmKisanAmount.toLocaleString()}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Annual guaranteed DBT</p>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
                  <p className="text-xs text-amber-700 dark:text-amber-300 font-semibold">Solar Pump Grant</p>
                  <p className="text-2xl font-bold text-foreground mt-1">₹{calculationResult.solarSubsidy.toLocaleString()}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Under PM KUSUM 60-90%</p>
                </div>

                <div className="p-4 rounded-xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900">
                  <p className="text-xs text-purple-700 dark:text-purple-300 font-semibold">Machinery Subsidy</p>
                  <p className="text-2xl font-bold text-foreground mt-1">₹{calculationResult.machinerySubsidy.toLocaleString()}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">SMAM Capital Grant</p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800">
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold">Total Estimated Value</p>
                  <p className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400 mt-1">
                    ₹{calculationResult.totalPotentialValue.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-emerald-800 dark:text-emerald-300 mt-0.5">Eligible Central Benefits</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {["All", "Financial Support", "Insurance", "Solar & Energy", "Machinery", "Organic"].map((cat) => (
              <Button
                key={cat}
                size="sm"
                variant={selectedCategory === cat ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat)}
                className="text-xs h-8"
              >
                {cat}
              </Button>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">Showing {filteredSchemes.length} Schemes</span>
        </div>

        {/* Schemes Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {filteredSchemes.map((scheme) => (
            <Card key={scheme.id} className="border-border hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className={`h-11 w-11 rounded-xl flex items-center justify-center border ${scheme.accent}`}>
                        <scheme.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold text-foreground leading-snug">{scheme.name}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-0.5">{scheme.ministry}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 text-xs">
                  <div className="rounded-lg bg-muted/40 p-3">
                    <p className="font-semibold text-foreground text-xs">Key Benefit:</p>
                    <p className="text-primary font-bold text-sm mt-0.5">{scheme.benefit}</p>
                  </div>

                  <div>
                    <p className="font-semibold text-foreground mb-1">Eligibility Criteria:</p>
                    <p className="text-muted-foreground leading-relaxed">{scheme.eligibility}</p>
                  </div>

                  <div>
                    <p className="font-semibold text-foreground mb-1.5 flex items-center gap-1">
                      <FileCheck className="h-3.5 w-3.5 text-primary" /> Required Documents:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {scheme.documents.map((doc, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-muted text-[11px] text-muted-foreground">
                          {doc}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {scheme.tags.map((tag, i) => (
                      <Badge key={i} variant="secondary" className="text-[10px] font-medium">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </div>

              <CardFooter className="pt-2 border-t bg-muted/10 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> {scheme.status}
                </span>
                <a href={scheme.link} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="ghost" className="gap-1.5 text-xs text-primary hover:text-primary">
                    Apply Online <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
