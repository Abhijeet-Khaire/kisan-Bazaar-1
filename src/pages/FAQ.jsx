import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container py-12 max-w-3xl">
                <h1 className="font-serif text-3xl font-bold mb-2">Frequently Asked Questions</h1>
                <p className="text-muted-foreground mb-8">Everything you need to know about KisanBazaar</p>

                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>How does the bidding process work?</AccordionTrigger>
                        <AccordionContent>
                            Farmers list their produce with a floor price. Verified buyers place bids in real-time.
                            When the auction ends, the highest bid wins. The farmer can also choose to accept a bid
                            before the auction time runs out.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                        <AccordionTrigger>When do I get paid?</AccordionTrigger>
                        <AccordionContent>
                            Payments are processed securely once the buyer confirms the receipt of goods or the logistics partner confirms delivery.
                            Funds typically appear in your registered bank account within 24 hours of confirmation.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                        <AccordionTrigger>Who handles the transportation?</AccordionTrigger>
                        <AccordionContent>
                            We have integrated logistics partners. Once a deal is finalized, you can book a truck directly through our platform.
                            Our partners are verified and insured to ensure safe delivery.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                        <AccordionTrigger>Is there a fee for listing crops?</AccordionTrigger>
                        <AccordionContent>
                            The basic plan allows listing up to 5 crops per month for free. For unlimited listings and premium features,
                            you can upgrade to our Pro plan at ₹499/month.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-5">
                        <AccordionTrigger>How is the quality verified?</AccordionTrigger>
                        <AccordionContent>
                            Farmers self-certify the grade during listing (A/B/C). Buyers can request detailed photos or use our third-party
                            quality verification service for bulk orders. Disputes regarding quality are handled by our support team.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </main>
            <Footer />
        </div>
    );
}
