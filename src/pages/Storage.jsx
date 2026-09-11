import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Warehouse, MapPin, Thermometer, ShieldCheck, Sparkles, Droplets, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function Storage() {
    const { toast } = useToast();
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    // AI Advisor State
    const [calcCrop, setCalcCrop] = useState("Wheat");
    const [calcMoisture, setCalcMoisture] = useState("13.0");
    const [aiRecommendation, setAiRecommendation] = useState(null);

    const handleCalculateAiStorage = () => {
        const m = parseFloat(calcMoisture) || 13.0;
        let storageType = "Grain Silo / Dry Storage";
        let temp = "Ambient (20-25°C)";
        let safeDays = 180;
        let risk = "Low risk of spoilage";

        if (calcCrop === "Tomatoes" || calcCrop === "Onions") {
            storageType = "Cold Storage (Climate Controlled)";
            temp = "4°C - 8°C (85% RH)";
            safeDays = calcCrop === "Tomatoes" ? 14 : 90;
            risk = "High moisture produce requires humidity regulation.";
        } else if (m > 14.0) {
            storageType = "Aerated Cold Silo";
            temp = "12°C - 15°C";
            safeDays = 45;
            risk = "Moisture exceeds 14%; mechanical aeration required to prevent fungal sprouting.";
        }

        setAiRecommendation({
            storageType,
            temp,
            safeDays,
            risk
        });

        toast({
            title: "AI Storage Analysis Ready",
            description: `Recommended: ${storageType} for ${calcCrop}`,
        });
    };

    const handleSearch = () => {
        setIsSearching(true);
        setSearchResults([]);

        setTimeout(() => {
            setSearchResults([
                { id: 1, name: "Karnal Cold Chain Logistics Park", location: "Karnal, HR", type: "Cold Storage (0-4°C)", price: "₹180/qt/mo" },
                { id: 2, name: "Punjab State Warehouse Silos", location: "Ludhiana, PB", type: "Hermetic Grain Silo", price: "₹75/qt/mo" },
                { id: 3, name: "Sahyadri Agri Cold Care", location: "Nashik, MH", type: "Cold Storage & Pre-Cooling", price: "₹220/qt/mo" },
                { id: 4, name: "SafeKeep Agri Dry Silos", location: "Pune, MH", type: "Dry Aerated Storage", price: "₹110/qt/mo" },
            ]);
            setIsSearching(false);
        }, 1200);
    };

    const handleBook = (name) => {
        toast({
            title: "Storage Request Sent",
            description: `A booking request for ${name} has been sent. The facility manager will contact you shortly.`,
        });
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container py-8">
                <div className="mb-8 space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                            <Warehouse className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <h1 className="font-serif text-3xl font-bold text-foreground">AI Storage Solutions & Warehousing</h1>
                    </div>
                    <p className="text-muted-foreground">
                        Secure, climate-controlled storage advisor matched with certified regional cold chains & silos.
                    </p>
                </div>

                {/* AI Storage Advisor Tool */}
                <Card className="mb-8 border-primary/30 bg-primary/5">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                            <CardTitle>AI Moisture-to-Storage Duration Advisor</CardTitle>
                        </div>
                        <CardDescription>Enter crop details & moisture % to get AI storage shelf life and temperature guidance</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid sm:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold">Crop Type</label>
                                <Select value={calcCrop} onValueChange={setCalcCrop}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Crop" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Wheat">Wheat</SelectItem>
                                        <SelectItem value="Basmati Rice">Basmati Rice</SelectItem>
                                        <SelectItem value="Tomatoes">Tomatoes</SelectItem>
                                        <SelectItem value="Onions">Onions</SelectItem>
                                        <SelectItem value="Cotton">Cotton</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold">Moisture Content (%)</label>
                                <Input
                                    type="number"
                                    step="0.1"
                                    value={calcMoisture}
                                    onChange={(e) => setCalcMoisture(e.target.value)}
                                    placeholder="e.g. 13.0"
                                />
                            </div>

                            <div className="flex items-end">
                                <Button className="w-full gap-2" onClick={handleCalculateAiStorage}>
                                    <Sparkles className="h-4 w-4" /> Run AI Storage Diagnosis
                                </Button>
                            </div>
                        </div>

                        {aiRecommendation && (
                            <div className="p-4 rounded-lg bg-card border text-sm grid sm:grid-cols-3 gap-4 mt-4">
                                <div>
                                    <span className="text-xs text-muted-foreground block">Recommended Storage</span>
                                    <span className="font-bold text-primary">{aiRecommendation.storageType}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-muted-foreground block">Temperature & RH</span>
                                    <span className="font-semibold">{aiRecommendation.temp}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-muted-foreground block">Max Safe Shelf Life</span>
                                    <span className="font-bold text-green-600">{aiRecommendation.safeDays} Days</span>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Find Storage</CardTitle>
                            <CardDescription>Locate certified warehouses near you</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Location</label>
                                    <div className="flex items-center gap-2 rounded-md border border-input px-3 py-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <input type="text" placeholder="Enter city or zip code" className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Storage Type</label>
                                    <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                                        <option>All Storage Types</option>
                                        <option>Cold Storage (0-4°C)</option>
                                        <option>Dry Aerated Silos</option>
                                        <option>Controlled Atmosphere (CA)</option>
                                    </select>
                                </div>
                                <Button className="w-full" onClick={handleSearch} disabled={isSearching}>
                                    {isSearching ? "Searching..." : "Search Warehouses"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Available Storage Facilities</CardTitle>
                            <CardDescription>Verified storage partners with real-time capacity</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {searchResults.length > 0 ? (
                                    searchResults.map((facility) => (
                                        <div key={facility.id} className="flex flex-col gap-4 rounded-lg border p-4 bg-card hover:bg-accent/10 transition-colors">
                                            <div className="flex gap-4">
                                                <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center shrink-0">
                                                    <Warehouse className="h-8 w-8 text-muted-foreground" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-semibold">{facility.name}</h4>
                                                    <p className="text-sm text-muted-foreground">{facility.location}</p>
                                                    <p className="text-sm font-medium text-primary mt-1">{facility.price}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 text-xs">
                                                <div className="flex items-center text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                                    <Thermometer className="mr-1 h-3 w-3" />
                                                    {facility.type}
                                                </div>
                                                <div className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded">
                                                    <ShieldCheck className="mr-1 h-3 w-3" />
                                                    Verified
                                                </div>
                                            </div>
                                            <Button size="sm" variant="outline" className="w-full mt-auto" onClick={() => handleBook(facility.name)}>
                                                Request Quote & Space
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-12 text-center text-muted-foreground">
                                        <Warehouse className="mx-auto h-12 w-12 text-muted-foreground/30 mb-3" />
                                        <p>Click "Search Warehouses" to see available facilities near you.</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
}

