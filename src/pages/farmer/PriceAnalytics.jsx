import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, ArrowUpRight, Flame, MapPin, Calculator, Sparkles, Clock, Crown, ShieldAlert } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const cropAnalyticsData = {
    wheat: {
        name: "Wheat (HD 3086)",
        chart: [
            { name: 'Mon', price: 2450 },
            { name: 'Tue', price: 2500 },
            { name: 'Wed', price: 2550 },
            { name: 'Thu', price: 2580 },
            { name: 'Fri', price: 2620 },
            { name: 'Sat', price: 2650 },
            { name: 'Sun', price: 2700 },
        ],
        currentAvg: 2700,
        change: "+12%",
        demandLevel: "High 🔥",
        demandDesc: "89% active flour mill buyers seeking Grade A stock",
        predictedPrice: 2750,
        priceLogic: {
            baseMSP: 2275,
            gradeMultiplier: "1.08x (Grade A)",
            moistureAdj: "+₹120 (<12% Dry Grain)",
            demandBoost: "+₹180 (Seasonal Flour Mill Deficit)"
        },
        bestPlaceToSell: [
            { mandi: "Ludhiana Central Mandi", distance: "8 km", price: 2720, freight: 120, netProfit: 2600 },
            { mandi: "Khanna Grain Market", distance: "24 km", price: 2750, freight: 210, netProfit: 2540 },
            { mandi: "Sirhind APMC Mandi", distance: "35 km", price: 2710, freight: 280, netProfit: 2430 }
        ],
        whenToSell: {
            action: "Sell Now (Optimal Timing)",
            forecast: "+2% max gain next 7 days",
            reasoning: "Harvest arrivals peaking next week across North India; sell now to capture top market premium."
        }
    },
    rice: {
        name: "Basmati Rice (Pusa 1121)",
        chart: [
            { name: 'Mon', price: 3900 },
            { name: 'Tue', price: 4000 },
            { name: 'Wed', price: 4100 },
            { name: 'Thu', price: 4150 },
            { name: 'Fri', price: 4200 },
            { name: 'Sat', price: 4280 },
            { name: 'Sun', price: 4350 },
        ],
        currentAvg: 4350,
        change: "+18%",
        demandLevel: "High 🔥",
        demandDesc: "94% export buyers & millers placing urgent bids",
        predictedPrice: 4500,
        priceLogic: {
            baseMSP: 3800,
            gradeMultiplier: "1.12x (Export Grade)",
            moistureAdj: "+₹150 (Optimal 12.5% Moisture)",
            demandBoost: "+₹250 (Middle East Export Orders)"
        },
        bestPlaceToSell: [
            { mandi: "Karnal Grain Market", distance: "12 km", price: 4380, freight: 180, netProfit: 4200 },
            { mandi: "Taraori Rice Hub", distance: "19 km", price: 4410, freight: 230, netProfit: 4180 },
            { mandi: "Kurukshetra Mandi", distance: "38 km", price: 4360, freight: 320, netProfit: 4040 }
        ],
        whenToSell: {
            action: "Hold 2 Weeks (Recommended)",
            forecast: "+12% projected gain in 14 days",
            reasoning: "Major export vessel loading at Mundra port in 10 days will drive prices above ₹4,800/quintal."
        }
    },
    tomatoes: {
        name: "Tomatoes (Hybrid)",
        chart: [
            { name: 'Mon', price: 2300 },
            { name: 'Tue', price: 2250 },
            { name: 'Wed', price: 2200 },
            { name: 'Thu', price: 2180 },
            { name: 'Fri', price: 2150 },
            { name: 'Sat', price: 2100 },
            { name: 'Sun', price: 2050 },
        ],
        currentAvg: 2050,
        change: "-10%",
        demandLevel: "Medium ⚖️",
        demandDesc: "62% active local vegetable traders buying",
        predictedPrice: 2000,
        priceLogic: {
 baseMSP: 1700,
            gradeMultiplier: "1.10x (Grade A Red)",
            moistureAdj: "+₹0 (High Fresh Perishable)",
            demandBoost: "+₹150 (Urban City Supply)"
        },
        bestPlaceToSell: [
            { mandi: "Nashik Wholesale APMC", distance: "15 km", price: 2180, freight: 200, netProfit: 1980 },
            { mandi: "Pimpalgaon Produce Market", distance: "28 km", price: 2150, freight: 260, netProfit: 1890 },
            { mandi: "Mumbai Vashi Wholesale", distance: "165 km", price: 2600, freight: 850, netProfit: 1750 }
        ],
        whenToSell: {
            action: "Sell Immediately",
            forecast: "-15% risk over next 48 hours",
            reasoning: "Perishable produce; shelf life degrades rapidly. Transport immediately to closest APMC."
        }
    }
};

export default function PriceAnalytics() {
    const [selectedCropKey, setSelectedCropKey] = useState("wheat");
    const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(true);

    const activeData = cropAnalyticsData[selectedCropKey] || cropAnalyticsData.wheat;

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container py-8">
                <div className="mb-8 space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                            <TrendingUp className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <h1 className="font-serif text-3xl font-bold text-foreground">AI Price Intelligence & Analytics</h1>
                    </div>
                    <p className="text-muted-foreground">
                        Transparent AI price predictions, demand indicators, mandi suggestions, and sell-timing advisor.
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Market Trends Chart */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <CardTitle>Market Price Trends</CardTitle>
                                    <CardDescription>7-day historical prices & AI predictions for {activeData.name}</CardDescription>
                                </div>
                                <Select value={selectedCropKey} onValueChange={setSelectedCropKey}>
                                    <SelectTrigger className="w-[200px]">
                                        <SelectValue placeholder="Select crop" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="wheat">Wheat (HD 3086)</SelectItem>
                                        <SelectItem value="rice">Basmati Rice (Pusa 1121)</SelectItem>
                                        <SelectItem value="tomatoes">Tomatoes (Hybrid)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={activeData.chart}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis domain={['dataMin - 100', 'dataMax + 100']} />
                                        <Tooltip formatter={(value) => [`₹${value}`, "Price/Quintal"]} />
                                        <Line type="monotone" dataKey="price" stroke="#16a34a" strokeWidth={3} dot={{ r: 5 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Metrics Column */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                                    <span>AI Predicted Fair Price</span>
                                    <Sparkles className="h-4 w-4 text-primary" />
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold text-primary">₹{activeData.predictedPrice.toLocaleString()}</span>
                                    <span className="text-sm text-green-600 font-semibold flex items-center">
                                        <ArrowUpRight className="h-4 w-4" /> {activeData.change}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">Calculated via AI Multivariable Valuation Model</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                                    <span>Demand Indicator</span>
                                    <Flame className="h-4 w-4 text-orange-500" />
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2">
                                    <Badge className="text-base px-3 py-1 bg-amber-500 text-white hover:bg-amber-600">
                                        {activeData.demandLevel}
                                    </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">{activeData.demandDesc}</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Second Row: AI Price Logic Breakdown & Best Place to Sell */}
                <div className="grid gap-6 md:grid-cols-2 mt-6">
                    {/* Logic Behind Price Prediction */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Calculator className="h-5 w-5 text-primary" />
                                <CardTitle>Logic Behind Price Prediction</CardTitle>
                            </div>
                            <CardDescription>Transparent AI formula breakdown per quintal</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between p-2.5 rounded-md bg-muted/40 text-sm">
                                <span className="text-muted-foreground">Base Govt MSP / Regional Floor:</span>
                                <span className="font-semibold">₹{activeData.priceLogic.baseMSP}</span>
                            </div>
                            <div className="flex justify-between p-2.5 rounded-md bg-muted/40 text-sm">
                                <span className="text-muted-foreground">Grade Quality Multiplier:</span>
                                <span className="font-semibold text-green-700">{activeData.priceLogic.gradeMultiplier}</span>
                            </div>
                            <div className="flex justify-between p-2.5 rounded-md bg-muted/40 text-sm">
                                <span className="text-muted-foreground">Moisture Content Factor:</span>
                                <span className="font-semibold text-blue-700">{activeData.priceLogic.moistureAdj}</span>
                            </div>
                            <div className="flex justify-between p-2.5 rounded-md bg-muted/40 text-sm">
                                <span className="text-muted-foreground">Seasonal Demand & Buyer Deficit:</span>
                                <span className="font-semibold text-amber-700">{activeData.priceLogic.demandBoost}</span>
                            </div>
                            <div className="border-t pt-3 flex justify-between items-center text-base font-bold">
                                <span>Estimated AI Fair Value:</span>
                                <span className="text-primary text-xl">₹{activeData.predictedPrice} / qt</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Best Place to Sell Today */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-primary" />
                                <CardTitle>Best Place to Sell Today</CardTitle>
                            </div>
                            <CardDescription>Nearby Mandis ranked by net margin after transport</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {activeData.bestPlaceToSell.map((item, idx) => (
                                <div key={idx} className={`p-3 rounded-lg border ${idx === 0 ? "border-primary bg-primary/5" : "bg-card"} flex items-center justify-between text-sm`}>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold">{item.mandi}</span>
                                            {idx === 0 && <Badge variant="default" className="text-[10px] py-0">Top Profit</Badge>}
                                        </div>
                                        <p className="text-xs text-muted-foreground">{item.distance} away • Mandi Rate: ₹{item.price}/qt • Freight: ₹{item.freight}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs text-muted-foreground block">Net Profit</span>
                                        <span className="font-bold text-base text-primary">₹{item.netProfit}/qt</span>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Third Row: Premium Feature - When to Sell Advisor */}
                <div className="mt-6">
                    <Card className="border-amber-200 bg-amber-50/20 dark:bg-amber-950/10">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Crown className="h-5 w-5 text-amber-500" />
                                    <CardTitle className="text-lg">"When to Sell" AI Advisor (Premium Feature)</CardTitle>
                                </div>
                                <Badge variant="outline" className="border-amber-500 text-amber-600 bg-amber-100">
                                    Unlocked Premium
                                </Badge>
                            </div>
                            <CardDescription>Smart predictive hold vs. sell decision advisor to maximize farmer revenue</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-lg bg-card border gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-5 w-5 text-primary" />
                                        <h4 className="font-bold text-lg">{activeData.whenToSell.action}</h4>
                                    </div>
                                    <p className="text-sm font-semibold text-green-600">{activeData.whenToSell.forecast}</p>
                                    <p className="text-xs text-muted-foreground max-w-2xl">{activeData.whenToSell.reasoning}</p>
                                </div>
                                <Button className="shrink-0 bg-primary hover:bg-primary/90">
                                    Set Sell Price Alert
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
}

