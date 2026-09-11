import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Lock, FileText, CheckCircle2 } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-12 max-w-4xl space-y-8">
        <div className="space-y-2 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-2">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Privacy Policy</h1>
          <p className="text-muted-foreground text-sm">Last updated: January 2025 • KisanBazaar Agri-Tech Platform</p>
        </div>

        <Card className="border-border">
          <CardContent className="p-8 space-y-6 text-sm text-muted-foreground leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary" /> 1. Information We Collect
              </h2>
              <p>
                KisanBazaar collects information to provide transparent, secure agricultural marketplace services between farmers, corporate buyers, logistics partners, and cold warehouse operators. This includes:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Identity & KYC Data:</strong> Name, mobile number, government-issued identifiers (Aadhaar, PAN, Khasra/Khatauni land records) to verify farmer ownership and prevent fraudulent intermediary bids.</li>
                <li><strong>Agricultural & Mandi Data:</strong> Crop varieties, harvest dates, field acreage, moisture percentages, quality grades, and APMC trade licenses.</li>
                <li><strong>Financial & Payment Data:</strong> Bank account numbers, IFSC codes, UPI Virtual Payment Addresses for Direct Benefit Transfer (DBT) and escrow settlement.</li>
                <li><strong>Geo-location & Logistics Data:</strong> Mandi coordinates and transport vehicle tracking for live weighbridge verification and dispatch management.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" /> 2. How We Use Your Data
              </h2>
              <p>We use your data solely for executing agricultural commerce activities:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Facilitating direct peer-to-peer crop auction bidding and price discovery.</li>
                <li>AI price projection models utilizing regional Mandi arrivals and historical seasonal demand.</li>
                <li>Instant escrow payout disbursements upon verified weighbridge receipts.</li>
                <li>Weather alerts, crop spraying windows, and relevant government scheme eligibility updates.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> 3. Data Protection & Aadhaar Security
              </h2>
              <p>
                All personal records and financial details are encrypted in transit via SSL 256-bit encryption and at rest. Aadhaar numbers are masked according to UIDAI compliance norms. We never sell or share farmer landholding data with unauthorized third-party commercial marketing entities.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-foreground">4. Contact Grievance Officer</h2>
              <p>
                For questions regarding data privacy or to request correction of agricultural land records, please contact our Grievance Officer at <a href="mailto:privacy@kisanbazaar.in" className="text-primary underline">privacy@kisanbazaar.in</a> or visit Krishi Bhawan, Paranda, Maharashtra - 413502.
              </p>
            </section>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
