import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useGlobalState } from "@/context/GlobalState";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Truck, MapPin, Calendar, CheckCircle, Package, Clock, ShieldCheck, Scale, QrCode, UserCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function Logistics() {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { confirmLogistics, confirmWeight, crops } = useGlobalState();

    const cropId = searchParams.get("cropId");
    const selectedCrop = crops.find(c => c.id === cropId);

    const [logisticsMode, setLogisticsMode] = useState("app_arranged");
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [pickupDate, setPickupDate] = useState("2025-01-06");
    const [pickupTime, setPickupTime] = useState("10:00");
    const [vehicleReg, setVehicleReg] = useState("MH-15-AB-4920");

    // Weight confirmation state
    const [grossWeight, setGrossWeight] = useState(selectedCrop ? selectedCrop.quantity : "50");
    const [tareWeight, setTareWeight] = useState("0");
    const [verifiedNetWeight, setVerifiedNetWeight] = useState(selectedCrop ? selectedCrop.quantity : "50");

    // Tracking state
    const [trackingId, setTrackingId] = useState("TRK-9842");
    const [trackingStatus, setTrackingStatus] = useState({
        id: "TRK-9842",
        mode: "App-Arranged Truck (Eicher Pro)",
        step: 3, // 1: Scheduled, 2: Loading, 3: Weight Confirmed, 4: In Transit, 5: Delivered
        location: "Karnal Highway Toll Plaza",
        eta: "Today, 4:30 PM",
        lastUpdate: "15 mins ago"
    });

    useEffect(() => {
        if (cropId) {
            handleSearch();
        }
    }, [cropId]);

    const handleSearch = () => {
        setIsSearching(true);
        setSearchResults([]);

        setTimeout(() => {
            setSearchResults([
                { id: 1, provider: "FastTrack Logistics", vehicle: "Tata Ace (Chota Hathi)", capacity: "1.2 Tons", price: 1200, eta: "2 hours" },
                { id: 2, provider: "AgriMovers Express", vehicle: "Eicher 14ft Commercial", capacity: "4 Tons", price: 3400, eta: "3 hours" },
                { id: 3, provider: "Reliable Freight Line", vehicle: "Ashok Leyland 10-Wheeler", capacity: "12 Tons", price: 7500, eta: "Tomorrow Morning" },
            ]);
            setIsSearching(false);
        }, 1200);
    };

    const handleBookAppTransport = (truck) => {
        if (cropId) {
            confirmLogistics(cropId, {
                mode: "app_arranged",
                schedule: { date: pickupDate, time: pickupTime },
                carrier: truck.provider
            });
            toast({
                title: "App Transport Booked!",
                description: `${truck.vehicle} scheduled for pickup on ${pickupDate} at ${pickupTime}.`,
            });
            navigate("/farmer/dashboard");
        } else {
            toast({
                title: "Booking Confirmed",
                description: `${truck.vehicle} booked. Driver contact details sent via SMS.`,
            });
        }
    };

    const handleBuyerPickupConfirm = (e) => {
        e.preventDefault();
        if (cropId) {
            confirmLogistics(cropId, {
                mode: "buyer_pickup",
                schedule: { date: pickupDate, time: pickupTime },
                carrier: `Self-Pickup (${vehicleReg})`
            });
            toast({
                title: "Buyer Pickup Scheduled",
                description: `Pickup pass generated for ${vehicleReg} on ${pickupDate} at ${pickupTime}.`,
            });
            navigate("/farmer/dashboard");
        } else {
            toast({
                title: "Buyer Gate Pass Generated",
                description: `Gate Pass #GP-8831 active for ${vehicleReg}.`,
            });
        }
    };

    const handleConfirmWeight = () => {
        const net = Math.max(0, Number(grossWeight) - Number(tareWeight));
        setVerifiedNetWeight(net);
        if (cropId) {
            confirmWeight(cropId, net);
        }
        toast({
            title: "Weighbridge Weight Confirmed",
            description: `Verified Net Weight: ${net} Quintals. Manifest updated.`,
        });
    };

    const handleTrack = () => {
        if (!trackingId) return;
        setTrackingStatus({
            id: trackingId,
            mode: "In Transit",
            step: 4,
            location: "Pune Highway, MH",
            eta: "Today, 6:00 PM",
            lastUpdate: "Just now"
        });
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container py-8">
                <div className="mb-8 space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                            <Truck className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <h1 className="font-serif text-3xl font-bold text-foreground">Integrated Logistics & Dispatch</h1>
                    </div>
                    <p className="text-muted-foreground">
                        Fragmented logistics solved: Choose App-Arranged Transport or Buyer Self-Pickup with weighbridge confirmation.
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Booking & Mode Selection */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Choose Logistics Mode {selectedCrop && `- for ${selectedCrop.name}`}</CardTitle>
                                <CardDescription>Select preferred pickup & transport arrangement</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Tabs defaultValue="app_arranged" onValueChange={setLogisticsMode} className="w-full">
                                    <TabsList className="grid w-full grid-cols-2 mb-6">
                                        <TabsTrigger value="app_arranged" className="gap-2">
                                            <Truck className="h-4 w-4" /> App-Arranged Transport
                                        </TabsTrigger>
                                        <TabsTrigger value="buyer_pickup" className="gap-2">
                                            <UserCheck className="h-4 w-4" /> Buyer Self-Pickup
                                        </TabsTrigger>
                                    </TabsList>

                                    {/* Mode 1: App-Arranged Transport */}
                                    <TabsContent value="app_arranged" className="space-y-4">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Pickup Date</label>
                                                <div className="flex items-center gap-2 rounded-md border border-input px-3 py-2">
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    <input
                                                        type="date"
                                                        value={pickupDate}
                                                        onChange={(e) => setPickupDate(e.target.value)}
                                                        className="flex-1 bg-transparent outline-none text-foreground"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Pickup Time Slot</label>
                                                <div className="flex items-center gap-2 rounded-md border border-input px-3 py-2">
                                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                                    <input
                                                        type="time"
                                                        value={pickupTime}
                                                        onChange={(e) => setPickupTime(e.target.value)}
                                                        className="flex-1 bg-transparent outline-none text-foreground"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <Button className="w-full md:w-auto mt-2" onClick={handleSearch} disabled={isSearching}>
                                            {isSearching ? "Searching Local Vehicles..." : "Find Available Trucks"}
                                        </Button>

                                        {searchResults.length > 0 && (
                                            <div className="mt-4 space-y-3">
                                                <h4 className="font-semibold text-sm">Nearby Available Carriers</h4>
                                                {searchResults.map((truck) => (
                                                    <div key={truck.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent/10 transition-colors gap-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-12 w-12 rounded bg-primary/10 flex items-center justify-center shrink-0">
                                                                <Truck className="h-6 w-6 text-primary" />
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold">{truck.vehicle}</p>
                                                                <p className="text-xs text-muted-foreground">{truck.provider} • Max Capacity: {truck.capacity}</p>
                                                                <span className="text-xs text-green-600 font-medium">ETA: {truck.eta}</span>
                                                            </div>
                                                        </div>
                                                        <div className="text-right w-full sm:w-auto flex items-center justify-between sm:block">
                                                            <p className="text-lg font-bold text-primary">₹{truck.price}</p>
                                                            <Button size="sm" className="mt-1" onClick={() => handleBookAppTransport(truck)}>Select Vehicle</Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </TabsContent>

                                    {/* Mode 2: Buyer Self-Pickup */}
                                    <TabsContent value="buyer_pickup" className="space-y-4">
                                        <form onSubmit={handleBuyerPickupConfirm} className="space-y-4">
                                            <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 text-sm space-y-1">
                                                <p className="font-semibold text-amber-900 dark:text-amber-300">Buyer Self-Pickup Protocol</p>
                                                <p className="text-xs text-muted-foreground">The buyer arranges their own transport vehicle. A digital gate pass & QR verification code will be generated upon confirmation.</p>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Pickup Date</label>
                                                    <Input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Scheduled Time</label>
                                                    <Input type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Buyer Vehicle Reg / Plate Number</label>
                                                <Input
                                                    placeholder="e.g. MH-15-AB-4920"
                                                    value={vehicleReg}
                                                    onChange={(e) => setVehicleReg(e.target.value)}
                                                    required
                                                />
                                            </div>

                                            <Button type="submit" className="w-full gap-2">
                                                <QrCode className="h-4 w-4" /> Confirm Pickup & Generate Gate Pass
                                            </Button>
                                        </form>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>

                        {/* Weight Confirmation Section */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Scale className="h-5 w-5 text-primary" />
                                    <CardTitle>Weighbridge Weight Confirmation</CardTitle>
                                </div>
                                <CardDescription>Confirm actual weight at pickup point before release</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid sm:grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs text-muted-foreground font-medium">Gross Weight (Quintals)</label>
                                        <Input
                                            type="number"
                                            value={grossWeight}
                                            onChange={(e) => setGrossWeight(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-muted-foreground font-medium">Tare Weight (Truck Weight)</label>
                                        <Input
                                            type="number"
                                            value={tareWeight}
                                            onChange={(e) => setTareWeight(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-muted-foreground font-medium">Net Crop Weight</label>
                                        <div className="h-10 rounded-md border bg-muted/40 px-3 flex items-center font-bold text-primary">
                                            {Math.max(0, Number(grossWeight) - Number(tareWeight))} Quintals
                                        </div>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" onClick={handleConfirmWeight} className="gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" /> Verify Weighbridge Slip
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Delivery Status Tracker Sidebar */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Real-Time Delivery Tracker</CardTitle>
                                <CardDescription>Live status for active crop shipment</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Tracking ID (e.g. TRK-9842)"
                                        value={trackingId}
                                        onChange={(e) => setTrackingId(e.target.value)}
                                    />
                                    <Button variant="outline" onClick={handleTrack}>Track</Button>
                                </div>

                                {trackingStatus && (
                                    <div className="space-y-4 border rounded-lg p-4 bg-muted/30">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status Progress</span>
                                            <Badge variant="default" className="bg-primary">{trackingStatus.location}</Badge>
                                        </div>

                                        {/* Step progress timeline */}
                                        <div className="space-y-3">
                                            {[
                                                { step: 1, title: "Pickup Scheduled", detail: `${pickupDate} at ${pickupTime}` },
                                                { step: 2, title: "Driver Assigned & Arrived", detail: "Vehicle verified at farm gate" },
                                                { step: 3, title: "Weight Confirmed", detail: `${verifiedNetWeight} Quintals verified` },
                                                { step: 4, title: "In Transit", detail: trackingStatus.location },
                                                { step: 5, title: "Delivered & Payment Released", detail: "Destination buyer acceptance" }
                                            ].map((s) => (
                                                <div key={s.step} className="flex items-start gap-3 text-xs">
                                                    <div className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${s.step <= trackingStatus.step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                                                        {s.step <= trackingStatus.step ? "✓" : s.step}
                                                    </div>
                                                    <div>
                                                        <p className={`font-semibold ${s.step <= trackingStatus.step ? "text-foreground" : "text-muted-foreground"}`}>{s.title}</p>
                                                        <p className="text-muted-foreground text-[11px]">{s.detail}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <p className="text-[11px] text-center text-muted-foreground border-t pt-2">
                                            Est. Delivery: {trackingStatus.eta} • Updated {trackingStatus.lastUpdate}
                                        </p>
                                    </div>
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

