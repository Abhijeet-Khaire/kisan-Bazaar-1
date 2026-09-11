import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IndianRupee, Download, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Mock data
const payments = [
    { id: "TXN001", date: "2024-12-28", amount: 45000, status: "completed", buyer: "Agromart Exports", crop: "Basmati Rice" },
    { id: "TXN002", date: "2024-12-25", amount: 22000, status: "completed", buyer: "Fresh Foods Ltd", crop: "Wheat" },
    { id: "TXN003", date: "2024-12-20", amount: 18000, status: "processing", buyer: "Grain Traders", crop: "Corn" },
];

export default function PaymentHistory() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container py-8">
                <div className="mb-8 space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                            <IndianRupee className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <h1 className="font-serif text-3xl font-bold text-foreground">Payment History</h1>
                    </div>
                    <p className="text-muted-foreground">
                        View and download your transaction statements
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Recent Transactions</CardTitle>
                                <CardDescription>A list of your recent received payments</CardDescription>
                            </div>
                            <Button variant="outline" size="sm">
                                <Download className="mr-2 h-4 w-4" />
                                Export
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {payments.map((txn) => (
                                <div key={txn.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                    <div className="space-y-1">
                                        <p className="font-medium">{txn.buyer}</p>
                                        <p className="text-sm text-muted-foreground">Payment for {txn.crop} • ID: {txn.id}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold">₹{txn.amount.toLocaleString()}</p>
                                        <div className="flex items-center justify-end gap-1 mt-1">
                                            {txn.status === "completed" ? (
                                                <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                                                    <CheckCircle className="mr-1 h-3 w-3" />
                                                    Received
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="border-yellow-200 bg-yellow-50 text-yellow-700">
                                                    <Clock className="mr-1 h-3 w-3" />
                                                    Processing
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </main>
            <Footer />
        </div>
    );
}
