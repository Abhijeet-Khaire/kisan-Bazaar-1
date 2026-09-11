import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useGlobalState } from "@/context/GlobalState";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Clock, MapPin, Gavel, User, Star, Droplets, Sparkles, ShieldCheck, Flame, Warehouse, Truck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export default function CropDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { crops, bids, placeBid, acceptBid } = useGlobalState();
    const { user } = useAuth();

    const [bidAmount, setBidAmount] = useState("");

    const crop = crops.find(c => c.id === id);
    const cropBids = bids.filter(b => b.cropId === id);

    if (!crop) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <main className="container py-8 text-center">
                    <h2 className="text-2xl font-bold">Crop not found</h2>
                    <Button onClick={() => navigate("/farmer/dashboard")} className="mt-4">Back to Dashboard</Button>
                </main>
            </div>
        );
    }

    const minNextBid = Math.max(crop.floorPrice, crop.currentBid + 50);

    const handlePlaceBid = (e) => {
        e.preventDefault();
        const amt = Number(bidAmount);
        if (!amt || amt < minNextBid) {
            toast({
                title: "Invalid Bid Amount",
                description: `Bid must be at least ₹${minNextBid.toLocaleString()}`,
                variant: "destructive",
            });
            return;
        }

        placeBid(crop.id, amt, user?.name || "Agri Buyer");
        toast({
            title: "Bid Submitted Successfully!",
            description: `You placed a bid of ₹${amt.toLocaleString()} for ${crop.name}`,
        });
        setBidAmount("");
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container py-8">
                <Button variant="ghost" className="mb-6 gap-2" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-4 w-4" /> Back
                </Button>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Main Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="rounded-xl border bg-card text-card-foreground shadow overflow-hidden">
                            <div className="h-64 w-full bg-muted relative">
                                <img src={crop.imageUrl} alt={crop.name} className="h-full w-full object-cover" />
                                <Badge className="absolute top-4 right-4 text-sm px-3 py-1 bg-primary text-primary-foreground">
                                    {crop.demandLevel ? `Demand: ${crop.demandLevel}` : "High Demand 🔥"}
                                </Badge>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h1 className="text-3xl font-serif font-bold">{crop.name}</h1>
                                        <p className="text-muted-foreground">{crop.variety} • {crop.quantity} {crop.unit}</p>
                                    </div>
                                    <Badge variant="outline" className="text-lg px-3 py-1 border-primary text-primary font-bold">Grade {crop.quality}</Badge>
                                </div>

                                {/* Farmer & AI Ratings bar */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 p-4 rounded-lg bg-muted/40 text-sm">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Moisture %</p>
                                        <p className="font-semibold flex items-center gap-1 text-blue-600">
                                            <Droplets className="h-4 w-4" /> {crop.moisture || "12.5"}%
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">AI Vision Quality Score</p>
                                        <p className="font-semibold flex items-center gap-1 text-green-600">
                                            <Sparkles className="h-4 w-4" /> {crop.aiQualityScore || 94}/100
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Farmer Rating</p>
                                        <p className="font-semibold flex items-center gap-1 text-amber-500">
                                            <Star className="h-4 w-4 fill-amber-400" /> {crop.farmerRating || 4.9} / 5.0
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Buyer Rating</p>
                                        <p className="font-semibold flex items-center gap-1 text-amber-500">
                                            <ShieldCheck className="h-4 w-4 text-primary" /> {crop.buyerRating || 4.8} / 5.0
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-6">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">Auction Ends</p>
                                            <p className="text-sm text-muted-foreground">{formatDistanceToNow(new Date(crop.auctionEndsAt), { addSuffix: true })}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">Location</p>
                                            <p className="text-sm text-muted-foreground">{crop.location}, {crop.state}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* AI Storage & Logistics Suggestions Card */}
                        <Card className="border-blue-200 bg-blue-50/20">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base flex items-center gap-2 text-blue-900">
                                    <Warehouse className="h-5 w-5 text-blue-600" />
                                    AI Storage & Perishability Recommendation
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-2 text-muted-foreground">
                                <p>• <strong>Optimal Storage:</strong> {crop.moisture && crop.moisture > 14 ? "Cold Storage (< 10°C) recommended to prevent mold due to moisture content." : "Dry Grain Silo / Standard Ventilated Warehouse."}</p>
                                <p>• <strong>Max Shelf Life:</strong> {crop.name === "Tomatoes" ? "5 Days fresh" : "6 Months in Silo"}</p>
                                <p>• <strong>Recommended Transport:</strong> {crop.quantity > 50 ? "Heavy Commercial Vehicle (Eicher/Ashok Leyland 10-Ton)" : "Local Tempo (Tata Ace / Pickup)"}</p>
                            </CardContent>
                        </Card>

                        {/* Live Bids History */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Received Bids ({cropBids.length})</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {cropBids.length === 0 ? (
                                        <p className="text-center text-muted-foreground py-8">No bids received yet. Be the first to place a bid!</p>
                                    ) : (
                                        cropBids.map(bid => (
                                            <div key={bid.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                                        <User className="h-5 w-5 text-muted-foreground" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{bid.buyerName}</p>
                                                        <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(bid.timestamp), { addSuffix: true })}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold flex items-center gap-1 justify-end text-lg">
                                                        ₹{bid.amount.toLocaleString()}
                                                    </div>
                                                    {bid.status === "active" && <Badge className="mt-1 bg-green-600">Highest Active Bid</Badge>}
                                                    {user?.role === 'farmer' && bid.status === "active" && crop.status === "live" && (
                                                        <Button
                                                            size="sm"
                                                            className="ml-4"
                                                            onClick={() => {
                                                                acceptBid(crop.id, bid.id);
                                                                navigate(`/logistics?cropId=${crop.id}`);
                                                            }}
                                                        >
                                                            Accept Offer
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar Actions */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Price & Live Bidding</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Floor Price</span>
                                    <span className="font-semibold">₹{crop.floorPrice.toLocaleString()} / {crop.unit}</span>
                                </div>
                                <div className="flex justify-between items-center text-lg border-t pt-3">
                                    <span className="font-medium">Current Highest Bid</span>
                                    <span className="font-bold text-primary text-xl">₹{crop.currentBid.toLocaleString()}</span>
                                </div>

                                {/* Place Bid Form for Buyers */}
                                {user?.role !== 'farmer' && (
                                    <form onSubmit={handlePlaceBid} className="space-y-3 border-t pt-4">
                                        <label className="text-sm font-semibold block">Place Your Bid (₹ per {crop.unit})</label>
                                        <Input
                                            type="number"
                                            placeholder={`Min bid: ₹${minNextBid}`}
                                            value={bidAmount}
                                            onChange={(e) => setBidAmount(e.target.value)}
                                        />
                                        <Button type="submit" className="w-full gap-2">
                                            <Gavel className="h-4 w-4" /> Submit Live Bid
                                        </Button>
                                        <p className="text-xs text-muted-foreground text-center">Bids are legally binding upon farmer acceptance.</p>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

