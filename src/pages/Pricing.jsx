import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

export default function Pricing() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container py-16">
                <div className="text-center mb-16">
                    <h1 className="font-serif text-4xl font-bold mb-4">Transparent Pricing for Everyone</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Whether you're a small farmer or a large buyer, we have a plan that fits your needs.
                        No hidden fees, ever.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Basic Plan */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Farmer Basic</CardTitle>
                            <CardDescription>Essential tools for direct selling</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold mb-6">Free</div>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> List up to 5 crops/month</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Access to Logistics</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Basic Market Direct Access</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Standard Support</li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" variant="outline">Get Started</Button>
                        </CardFooter>
                    </Card>

                    {/* Pro Plan */}
                    <Card className="border-primary shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-sm font-medium">
                            Popular
                        </div>
                        <CardHeader>
                            <CardTitle className="text-2xl">Farmer Pro</CardTitle>
                            <CardDescription>Advanced analytics & priority visibility</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold mb-6">₹499<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Unlimited Crop Listings</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Price Analytics Dashboard</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Priority Logistics Booking</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Featured Listings</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> 24/7 Support</li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full">Upgrade Now</Button>
                        </CardFooter>
                    </Card>

                    {/* Buyer Plan */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Buyer Direct</CardTitle>
                            <CardDescription>For bulk purchasers and exporters</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold mb-6">₹999<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Zero Commission on Bids</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Bulk Logistics Management</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Quality Verification Reports</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> API Access</li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" variant="outline">Contact Sales</Button>
                        </CardFooter>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
}
