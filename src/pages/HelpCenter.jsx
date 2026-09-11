import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, User, Truck, CreditCard, ShoppingBag, Leaf } from "lucide-react";

const categories = [
    { title: "Account & Profile", icon: User, items: ["Reset Password", "Update Profile", "Verification Process"] },
    { title: "Selling Crops", icon: Leaf, items: ["How to maximize earnings", "Listing Guidelines", "Understanding Auctions"] },
    { title: "Logistics & Delivery", icon: Truck, items: ["Track Shipment", "Booking Guidelines", "Insurance Policy"] },
    { title: "Payments", icon: CreditCard, items: ["Withdrawal Schedule", "Payment Methods", "Transaction Fees"] },
    { title: "Buying Guide", icon: ShoppingBag, items: ["Placing Bids", "Quality Assurance", "Bulk Orders"] },
];

export default function HelpCenter() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="bg-primary/5 py-16">
                <div className="container text-center space-y-6">
                    <h1 className="font-serif text-4xl font-bold">How can we help you?</h1>
                    <div className="max-w-2xl mx-auto relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            className="pl-12 h-12 text-lg bg-background"
                            placeholder="Search for answers (e.g., 'how to list crop', 'payment issues')"
                        />
                    </div>
                </div>
            </div>

            <main className="container py-12">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {categories.map((cat) => (
                        <Card key={cat.title} className="hover:shadow-md transition-shadow cursor-pointer">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <cat.icon className="h-5 w-5 text-primary" />
                                </div>
                                <CardTitle className="text-lg">{cat.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {cat.items.map((item) => (
                                        <li key={item} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                            • {item}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}
