import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGlobalState } from "@/context/GlobalState";
import { useAuth } from "@/context/AuthContext";
import {
  ShoppingBag,
  Gavel,
  Truck,
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  Calendar,
  IndianRupee,
  FileText,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

export default function BuyerOrders() {
  const { crops, bids } = useGlobalState();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");

  // Sample procurement orders tracking
  const [orders, setOrders] = useState([
    {
      id: "ORD-9821",
      cropName: "Basmati Rice (Pusa 1121)",
      variety: "Pusa 1121",
      quantity: 50,
      unit: "quintal",
      farmerName: "Rajesh Kumar",
      location: "Karnal, Haryana",
      finalPricePerUnit: 4200,
      totalAmount: 210000,
      status: "in_transit",
      orderDate: "2025-01-04",
      deliveryDate: "2025-01-07",
      logisticsPartner: "Sandhu Agri-Freight Express",
      trackingNumber: "SAF-TRK-7712",
      weighbridgeSlip: "WB-KNL-8819.pdf",
      imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
    },
    {
      id: "ORD-9822",
      cropName: "HD 3086 Wheat",
      variety: "HD 3086",
      quantity: 100,
      unit: "quintal",
      farmerName: "Gurpreet Singh",
      location: "Ludhiana, Punjab",
      finalPricePerUnit: 2650,
      totalAmount: 265000,
      status: "payment_pending",
      orderDate: "2025-01-03",
      deliveryDate: "2025-01-08",
      logisticsPartner: "Kisan Direct Haulage",
      trackingNumber: "KDH-PB-9901",
      weighbridgeSlip: "WB-LDH-0021.pdf",
      imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400",
    },
    {
      id: "ORD-9820",
      cropName: "Nashik Red Onion",
      variety: "Nashik Red",
      quantity: 80,
      unit: "quintal",
      farmerName: "Mahesh Jadhav",
      location: "Lasalgaon, Maharashtra",
      finalPricePerUnit: 1550,
      totalAmount: 124000,
      status: "delivered",
      orderDate: "2024-12-29",
      deliveryDate: "2025-01-02",
      logisticsPartner: "AgriMovers Express",
      trackingNumber: "AME-MH-1124",
      weighbridgeSlip: "WB-LSG-9932.pdf",
      imageUrl: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400",
    },
  ]);

  const handleConfirmReceipt = (orderId) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "delivered" } : o))
    );
    toast.success("Delivery verified and escrow released to farmer!");
  };

  const filteredOrders = orders.filter((o) => {
    if (activeTab === "all") return true;
    return o.status === activeTab;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-8 max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <h1 className="font-serif text-3xl font-bold text-foreground">Procurement & Orders Hub</h1>
            </div>
            <p className="text-muted-foreground mt-1">
              Track auction bids won, weighbridge receipts, in-transit logistics dispatches, and escrow releases
            </p>
          </div>

          <Link to="/buyer/marketplace">
            <Button className="gap-2">
              <Gavel className="h-4 w-4" /> Browse Live Auctions
            </Button>
          </Link>
        </div>

        {/* Stats Strip */}
        <div className="grid gap-4 sm:grid-cols-4">
          <Card className="p-4">
            <p className="text-xs text-muted-foreground">Total Procurement</p>
            <p className="text-2xl font-bold text-foreground mt-1">230 Quintals</p>
            <p className="text-xs text-primary mt-0.5">Across 3 mandis</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground">Active Dispatches</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">1 In Transit</p>
            <p className="text-xs text-muted-foreground mt-0.5">GPS Tracking live</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground">Escrow Balance</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">₹5,99,000</p>
            <p className="text-xs text-muted-foreground mt-0.5">Protected by ICICI Escrow</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground">Completed Deliveries</p>
            <p className="text-2xl font-bold text-foreground mt-1">100% Verified</p>
            <p className="text-xs text-muted-foreground mt-0.5">Zero weight disputes</p>
          </Card>
        </div>

        {/* Orders Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="h-10 bg-muted/60 p-1">
            <TabsTrigger value="all" className="text-xs sm:text-sm">
              All Orders ({orders.length})
            </TabsTrigger>
            <TabsTrigger value="in_transit" className="text-xs sm:text-sm gap-1.5">
              <Truck className="h-3.5 w-3.5" /> In Transit
            </TabsTrigger>
            <TabsTrigger value="payment_pending" className="text-xs sm:text-sm gap-1.5">
              <Clock className="h-3.5 w-3.5" /> Payment Pending
            </TabsTrigger>
            <TabsTrigger value="delivered" className="text-xs sm:text-sm gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" /> Delivered & Settled
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="overflow-hidden border-border hover:shadow-md transition-shadow">
                <div className="p-5 sm:flex sm:items-center sm:justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <img
                      src={order.imageUrl}
                      alt={order.cropName}
                      className="h-20 w-20 rounded-xl object-cover border"
                    />
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-lg text-foreground">{order.cropName}</h3>
                        <Badge
                          variant="outline"
                          className={
                            order.status === "delivered"
                              ? "border-emerald-500 text-emerald-700 bg-emerald-50/50"
                              : order.status === "in_transit"
                              ? "border-amber-500 text-amber-700 bg-amber-50/50"
                              : "border-blue-500 text-blue-700 bg-blue-50/50"
                          }
                        >
                          {order.status === "delivered"
                            ? "Delivered & Verified"
                            : order.status === "in_transit"
                            ? "In Transit (Truck Assigned)"
                            : "Escrow Payment Pending"}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        Sold by <span className="font-semibold text-foreground">{order.farmerName}</span> • {order.location}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground pt-1">
                        <span>Quantity: <strong className="text-foreground">{order.quantity} {order.unit}</strong></span>
                        <span>Rate: <strong className="text-foreground">₹{order.finalPricePerUnit}/{order.unit}</strong></span>
                        <span>Total: <strong className="text-primary font-bold text-sm">₹{order.totalAmount.toLocaleString()}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 sm:mt-0 flex flex-col sm:items-end gap-2 border-t sm:border-t-0 pt-3 sm:pt-0">
                    <p className="text-xs text-muted-foreground">
                      Logistics: <strong className="text-foreground">{order.logisticsPartner}</strong>
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs gap-1.5 h-8"
                        onClick={() => toast.info(`Weighbridge Slip ${order.weighbridgeSlip} downloaded.`)}
                      >
                        <FileText className="h-3.5 w-3.5" /> Weighbridge Slip
                      </Button>

                      {order.status === "in_transit" && (
                        <Button
                          size="sm"
                          className="text-xs gap-1.5 h-8 bg-emerald-600 hover:bg-emerald-700 text-white"
                          onClick={() => handleConfirmReceipt(order.id)}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" /> Confirm Delivery
                        </Button>
                      )}

                      {order.status === "payment_pending" && (
                        <Button
                          size="sm"
                          className="text-xs gap-1.5 h-8"
                          onClick={() => {
                            setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: "in_transit" } : o));
                            toast.success("Payment placed in escrow! Logistics dispatched.");
                          }}
                        >
                          <IndianRupee className="h-3.5 w-3.5" /> Deposit in Escrow
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
