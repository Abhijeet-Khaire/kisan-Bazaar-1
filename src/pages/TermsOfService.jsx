import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Scale, CheckCircle2, AlertTriangle } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-12 max-w-4xl space-y-8">
        <div className="space-y-2 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-2">
            <Scale className="h-6 w-6" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Terms of Service</h1>
          <p className="text-muted-foreground text-sm">Effective: January 2025 • KisanBazaar Agricultural Marketplace</p>
        </div>

        <Card className="border-border">
          <CardContent className="p-8 space-y-6 text-sm text-muted-foreground leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-foreground">1. Acceptance of Terms</h2>
              <p>
                By registering on or utilizing the KisanBazaar portal, mobile application, or API services, you agree to comply with and be legally bound by these Terms of Service. If you do not agree to these terms, do not access our platform.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-foreground">2. Marketplace Auctions & Bidding Protocols</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Binding Bids:</strong> All bids submitted by registered institutional buyers or traders during live crop auctions constitute a legally binding offer to purchase the designated crop lot at the specified rate.</li>
                <li><strong>Floor Price & Reserve:</strong> Farmers retain the absolute right to set minimum reserve floor prices based on Minimum Support Price (MSP) benchmarks. Listings with bids below the floor price may be cancelled without penalty.</li>
                <li><strong>Quality Verification:</strong> Crop samples undergo AI-assisted optical grading and digital moisture testing. Discrepancies between declared and delivered grades are resolved per APMC standard assay rules.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-foreground">3. Escrow Settlement & Payment Guarantee</h2>
              <p>
                To eliminate buyer default and ensure farmer payment security, all transaction funds are deposited into an RBI-regulated escrow account upon auction conclusion. Escrow funds are automatically disbursed to the farmer's verified bank account within 24 hours of weighbridge verification and pickup completion.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-foreground">4. Logistics & Cold Storage Liabilities</h2>
              <p>
                Logistics carriers and cold storage providers registered on KisanBazaar must maintain valid transit insurance, electronic warehouse receipts (e-NWR), and FSSAI handling hygiene standards. Perishable transit losses resulting from mechanical refrigeration failure are subject to carrier insurance claim protocols.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-foreground">5. Dispute Resolution</h2>
              <p>
                Any disputes arising out of crop quality or weighbridge discrepancy will be mediated by the KisanBazaar Grievance Committee in coordination with local APMC Mandi arbitrators.
              </p>
            </section>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
