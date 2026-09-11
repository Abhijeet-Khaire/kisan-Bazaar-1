import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useGlobalState } from "@/context/GlobalState";
// import { Crop } from "@/lib/mockData";
import { useAuth } from "@/context/AuthContext";

export default function AddCrop() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { addCrop } = useGlobalState();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    // Form state
    const [cropName, setCropName] = useState("");
    const [variety, setVariety] = useState("");
    const [quality, setQuality] = useState("A");
    const [quantity, setQuantity] = useState("");
    const [unit, setUnit] = useState("quintal");
    const [floorPrice, setFloorPrice] = useState("");
    const [moisture, setMoisture] = useState("12.5");
    const [aiScanning, setAiScanning] = useState(false);
    const [aiResult, setAiResult] = useState(null);

    const handleAiInspect = () => {
        setAiScanning(true);
        setTimeout(() => {
            const m = parseFloat(moisture) || 12.0;
            const score = Math.max(70, Math.min(98, Math.round(96 - Math.abs(m - 12) * 3)));
            const grade = score >= 90 ? "A" : score >= 80 ? "B" : "C";
            setAiResult({
                score,
                grade,
                freshness: "Optimal Freshness",
                defects: "0.2% minor surface blemishes detected",
                moistureStatus: m <= 13 ? "Safe Safe Moisture Range (<13%)" : "Higher Moisture; Drying Recommended"
            });
            setQuality(grade);
            setAiScanning(false);
            toast({
                title: "AI Quality Inspection Complete",
                description: `Verified Grade ${grade} (Score: ${score}/100)`,
            });
        }, 1200);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            const m = parseFloat(moisture) || 12.5;
            const score = aiResult ? aiResult.score : 92;
            addCrop({
                name: cropName,
                variety,
                quality,
                moisture: m,
                aiQualityScore: score,
                aiSuggestedGrade: quality,
                quantity: Number(quantity),
                unit,
                floorPrice: Number(floorPrice),
                harvestDate: new Date().toISOString(),
                location: "Karnal",
                state: "Haryana",
                farmerName: user?.name || "Farmer",
                farmerRating: 4.9,
                imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
                auctionEndsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            });

            setLoading(false);
            toast({
                title: "Crop Listed Successfully",
                description: "Your crop with AI quality verification has been added to the marketplace.",
            });
            navigate("/farmer/dashboard");
        }, 1200);
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container px-4 py-8">
                <div className="mb-8 max-w-2xl mx-auto">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                            <Leaf className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <h1 className="font-serif text-3xl font-bold text-foreground">List New Crop</h1>
                    </div>
                    <p className="text-muted-foreground">
                        Fill in the details below to list your products with instant AI quality assessment.
                    </p>
                </div>

                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>Crop Details & AI Quality Check</CardTitle>
                        <CardDescription>Provide accurate information & upload media for AI rating</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="cropName">Crop Name</Label>
                                <Select required value={cropName} onValueChange={setCropName}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select crop" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Wheat">Wheat</SelectItem>
                                        <SelectItem value="Basmati Rice">Basmati Rice</SelectItem>
                                        <SelectItem value="Corn">Corn</SelectItem>
                                        <SelectItem value="Potato">Potato</SelectItem>
                                        <SelectItem value="Tomatoes">Tomatoes</SelectItem>
                                        <SelectItem value="Onions">Onions</SelectItem>
                                        <SelectItem value="Cotton">Cotton</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="variety">Variety</Label>
                                    <Input
                                        id="variety"
                                        placeholder="e.g. Basmati Pusa 1121, HD 3086"
                                        required
                                        value={variety}
                                        onChange={(e) => setVariety(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="moisture">Moisture Content (%)</Label>
                                    <Input
                                        id="moisture"
                                        type="number"
                                        step="0.1"
                                        placeholder="e.g. 12.5"
                                        required
                                        value={moisture}
                                        onChange={(e) => setMoisture(e.target.value)}
                                    />
                                    <p className="text-xs text-muted-foreground">Manual input or moisture meter reading</p>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="quality">Quality Grade</Label>
                                    <Select required value={quality} onValueChange={(val) => setQuality(val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select grade" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="A">Grade A (Premium)</SelectItem>
                                            <SelectItem value="B">Grade B (Standard)</SelectItem>
                                            <SelectItem value="C">Grade C (Fair)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="quantity">Quantity</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="quantity"
                                            type="number"
                                            placeholder="Amount"
                                            required
                                            value={quantity}
                                            onChange={(e) => setQuantity(e.target.value)}
                                            className="flex-1"
                                        />
                                        <Select required value={unit} onValueChange={setUnit}>
                                            <SelectTrigger className="w-[110px]">
                                                <SelectValue placeholder="Unit" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="quintal">Quintal</SelectItem>
                                                <SelectItem value="kg">Kg</SelectItem>
                                                <SelectItem value="ton">Ton</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="price">Floor Price (₹ per {unit})</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    placeholder="Minimum acceptable bid price"
                                    required
                                    value={floorPrice}
                                    onChange={(e) => setFloorPrice(e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">Bidding will start from this price.</p>
                            </div>

                            <div className="space-y-3 border rounded-lg p-4 bg-muted/30">
                                <div className="flex justify-between items-center">
                                    <Label className="font-semibold">AI Quality Inspection (Photos & Videos)</Label>
                                    <Button type="button" size="sm" variant="secondary" onClick={handleAiInspect} disabled={aiScanning}>
                                        {aiScanning ? "Analyzing Produce..." : "Run AI Scan"}
                                    </Button>
                                </div>
                                <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-accent/50 transition-colors">
                                    <Upload className="mx-auto h-6 w-6 text-muted-foreground mb-1" />
                                    <p className="text-sm font-medium">Upload Photos or Short Video of Harvest</p>
                                    <p className="text-xs text-muted-foreground">JPG, PNG, MP4 (Max 25MB)</p>
                                </div>
                                {aiResult && (
                                    <div className="mt-3 p-3 bg-card border rounded-md text-sm space-y-1">
                                        <div className="flex justify-between items-center font-semibold text-primary">
                                            <span>AI Quality Score: {aiResult.score}/100</span>
                                            <span className="text-xs px-2 py-0.5 bg-primary/10 rounded">Grade {aiResult.grade}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">• {aiResult.defects}</p>
                                        <p className="text-xs text-green-600 font-medium">• {aiResult.moistureStatus}</p>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Additional Notes</Label>
                                <Textarea id="description" placeholder="Describe harvest date, storage condition, organic certification, location details etc." />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button type="button" variant="outline" className="flex-1" onClick={() => navigate(-1)}>Cancel</Button>
                                <Button type="submit" className="flex-1" disabled={loading}>
                                    {loading ? "Listing..." : "List Crop"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </main>
            <Footer />
        </div>
    );
}

