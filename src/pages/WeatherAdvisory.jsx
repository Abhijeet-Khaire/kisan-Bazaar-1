import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CloudSun,
  CloudRain,
  Droplets,
  Wind,
  Sun,
  AlertTriangle,
  Bug,
  Calendar,
  MapPin,
  CheckCircle2,
  Sparkles,
  ThermometerSun,
  Compass,
  ArrowUpRight,
  ShieldAlert,
  Info
} from "lucide-react";
import { toast } from "sonner";

const REGIONAL_WEATHER = [
  {
    region: "Karnal, Haryana",
    state: "Haryana",
    cropCluster: "Basmati Rice & Wheat Belt",
    temp: 28,
    condition: "Partly Cloudy",
    humidity: 58,
    wind: "14 km/h NW",
    soilMoisture: "62% (Optimal)",
    rainChance: "15%",
    sprayWindow: "Optimal",
    irrigationAdvice: "Hold for 48 hrs - Soil moisture adequate",
    advisoryAlert: "Mild morning humidity; monitor wheat crop for early stripe rust symptoms.",
    forecast: [
      { day: "Mon", temp: "29° / 18°", icon: Sun, condition: "Sunny", spray: "Ideal" },
      { day: "Tue", temp: "28° / 19°", icon: CloudSun, condition: "Partly Cloudy", spray: "Good" },
      { day: "Wed", temp: "26° / 17°", icon: CloudRain, condition: "Scattered Rain", spray: "Avoid" },
      { day: "Thu", temp: "25° / 16°", icon: CloudRain, condition: "Light Rain", spray: "Avoid" },
      { day: "Fri", temp: "27° / 17°", icon: CloudSun, condition: "Clear Sky", spray: "Good" },
      { day: "Sat", temp: "29° / 18°", icon: Sun, condition: "Sunny", spray: "Ideal" },
      { day: "Sun", temp: "30° / 19°", icon: Sun, condition: "Hot & Dry", spray: "Ideal" },
    ]
  },
  {
    region: "Ludhiana, Punjab",
    state: "Punjab",
    cropCluster: "Wheat, Mustard & Fodder Hub",
    temp: 27,
    condition: "Sunny",
    humidity: 52,
    wind: "11 km/h W",
    soilMoisture: "55% (Good)",
    rainChance: "5%",
    sprayWindow: "Optimal",
    irrigationAdvice: "Apply light irrigation to late-sown wheat blocks",
    advisoryAlert: "Clear sunny weather next 3 days. Excellent window for fertilizer top-dressing.",
    forecast: [
      { day: "Mon", temp: "28° / 17°", icon: Sun, condition: "Clear", spray: "Ideal" },
      { day: "Tue", temp: "29° / 18°", icon: Sun, condition: "Clear", spray: "Ideal" },
      { day: "Wed", temp: "27° / 17°", icon: CloudSun, condition: "Breezy", spray: "Caution" },
      { day: "Thu", temp: "26° / 16°", icon: CloudSun, condition: "Overcast", spray: "Good" },
      { day: "Fri", temp: "28° / 17°", icon: Sun, condition: "Sunny", spray: "Ideal" },
      { day: "Sat", temp: "29° / 18°", icon: Sun, condition: "Sunny", spray: "Ideal" },
      { day: "Sun", temp: "30° / 19°", icon: Sun, condition: "Sunny", spray: "Ideal" },
    ]
  },
  {
    region: "Nashik, Maharashtra",
    state: "Maharashtra",
    cropCluster: "Onion, Tomato & Grapes",
    temp: 31,
    condition: "Sunny & Dry",
    humidity: 44,
    wind: "18 km/h E",
    soilMoisture: "48% (Moderate)",
    rainChance: "0%",
    sprayWindow: "Optimal",
    irrigationAdvice: "Drip fertigation recommended during morning hours",
    advisoryAlert: "Protect onion nurseries from afternoon heat stress; keep shade nets ready.",
    forecast: [
      { day: "Mon", temp: "32° / 19°", icon: Sun, condition: "Sunny", spray: "Ideal" },
      { day: "Tue", temp: "31° / 19°", icon: Sun, condition: "Sunny", spray: "Ideal" },
      { day: "Wed", temp: "33° / 20°", icon: Sun, condition: "Dry Heat", spray: "Caution" },
      { day: "Thu", temp: "32° / 19°", icon: CloudSun, condition: "Pleasant", spray: "Good" },
      { day: "Fri", temp: "31° / 18°", icon: Sun, condition: "Sunny", spray: "Ideal" },
      { day: "Sat", temp: "31° / 18°", icon: Sun, condition: "Sunny", spray: "Ideal" },
      { day: "Sun", temp: "32° / 19°", icon: Sun, condition: "Sunny", spray: "Ideal" },
    ]
  },
  {
    region: "Guntur, Andhra Pradesh",
    state: "Andhra Pradesh",
    cropCluster: "Cotton & Chilli Capital",
    temp: 33,
    condition: "Hot & Humid",
    humidity: 71,
    wind: "16 km/h SE",
    soilMoisture: "68% (High)",
    rainChance: "40%",
    sprayWindow: "Caution",
    irrigationAdvice: "Drain excess water from low-lying chilli furrows",
    advisoryAlert: "High humidity may trigger thrips and die-back in chillies. Install blue sticky traps.",
    forecast: [
      { day: "Mon", temp: "33° / 24°", icon: CloudRain, condition: "Afternoon Showers", spray: "Caution" },
      { day: "Tue", temp: "32° / 23°", icon: CloudRain, condition: "Thunderstorm", spray: "Avoid" },
      { day: "Wed", temp: "31° / 23°", icon: CloudSun, condition: "Overcast", spray: "Good" },
      { day: "Thu", temp: "33° / 24°", icon: Sun, condition: "Hot", spray: "Ideal" },
      { day: "Fri", temp: "34° / 25°", icon: Sun, condition: "Humid", spray: "Ideal" },
      { day: "Sat", temp: "33° / 24°", icon: CloudSun, condition: "Partly Cloudy", spray: "Good" },
      { day: "Sun", temp: "32° / 23°", icon: CloudRain, condition: "Passing Showers", spray: "Caution" },
    ]
  }
];

const PEST_BULLETINS = [
  {
    crop: "Wheat",
    pest: "Yellow Rust (Puccinia striiformis)",
    severity: "Medium Alert",
    statusColor: "text-amber-600 bg-amber-50 border-amber-200",
    symptoms: "Bright yellow stripe pustules arranged linearly along leaf veins.",
    preventiveAction: "Spray Propiconazole 25% EC @ 1ml/litre water immediately on noticing first symptom.",
    organicAlternative: "Neem oil 1500 ppm @ 5ml/litre + fermented butter-milk foliar spray."
  },
  {
    crop: "Cotton",
    pest: "Pink Bollworm (Pectinophora gossypiella)",
    severity: "High Alert",
    statusColor: "text-red-600 bg-red-50 border-red-200",
    symptoms: "Rosetted flowers, bore holes blocked with frass on young bolls.",
    preventiveAction: "Install 5-8 Pheromone traps per acre. Mass trapping with gossyplure lures.",
    organicAlternative: "Release Trichogramma bactrae egg parasitoids @ 60,000/acre at weekly intervals."
  },
  {
    crop: "Onion & Garlic",
    pest: "Purple Blotch (Alternaria porri)",
    severity: "Low Alert",
    statusColor: "text-blue-600 bg-blue-50 border-blue-200",
    symptoms: "Small, sunken, whitish flecks with purple centers on foliage.",
    preventiveAction: "Mancozeb 75% WP @ 2.5g/litre with sticking agent (Triton/sandovit).",
    organicAlternative: "Trichoderma viride 1% WP @ 5g/litre as preventative seed/foliage treatment."
  }
];

export default function WeatherAdvisory() {
  const [selectedRegionIndex, setSelectedRegionIndex] = useState(0);
  const currentRegion = REGIONAL_WEATHER[selectedRegionIndex];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-8 max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <CloudSun className="h-6 w-6" />
              </div>
              <h1 className="font-serif text-3xl font-bold text-foreground">Agro-Weather & Crop Advisory</h1>
            </div>
            <p className="text-muted-foreground mt-1">
              Hyperlocal microclimate forecasts, precision spraying windows, and ICAR pest outbreak warnings
            </p>
          </div>

          <Badge variant="outline" className="w-fit border-emerald-500/30 text-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 gap-1.5 py-1 px-3">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            IMD Satellite Sync Active
          </Badge>
        </div>

        {/* Region Selector Pills */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-muted/50 rounded-xl border">
          <span className="text-xs font-semibold text-muted-foreground px-3 flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-primary" /> Agricultural Belt:
          </span>
          {REGIONAL_WEATHER.map((r, idx) => (
            <Button
              key={idx}
              size="sm"
              variant={selectedRegionIndex === idx ? "default" : "ghost"}
              onClick={() => setSelectedRegionIndex(idx)}
              className="text-xs h-8"
            >
              {r.region}
            </Button>
          ))}
        </div>

        {/* Current Weather Banner */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">{currentRegion.cropCluster}</span>
                  <CardTitle className="text-2xl font-bold mt-1 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" /> {currentRegion.region}
                  </CardTitle>
                </div>
                <Badge variant="secondary" className="text-sm px-3 py-1 font-semibold">
                  {currentRegion.condition}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <Sun className="h-12 w-12" />
                  </div>
                  <div>
                    <div className="text-5xl font-extrabold text-foreground tracking-tight">
                      {currentRegion.temp}°<span className="text-2xl font-normal text-muted-foreground">C</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Precipitation Chance: <span className="font-semibold text-foreground">{currentRegion.rainChance}</span></p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t sm:border-t-0 sm:border-l pt-4 sm:pt-0 sm:pl-6">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Droplets className="h-3.5 w-3.5 text-blue-500" /> Humidity
                    </span>
                    <p className="text-base font-bold text-foreground">{currentRegion.humidity}%</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Wind className="h-3.5 w-3.5 text-slate-500" /> Wind Speed
                    </span>
                    <p className="text-base font-bold text-foreground">{currentRegion.wind}</p>
                  </div>
                  <div className="space-y-1 col-span-2 sm:col-span-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <ThermometerSun className="h-3.5 w-3.5 text-emerald-500" /> Soil Moisture
                    </span>
                    <p className="text-base font-bold text-foreground">{currentRegion.soilMoisture}</p>
                  </div>
                </div>
              </div>

              {/* Advisory Flash Box */}
              <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-50/50 dark:bg-amber-950/20 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-semibold text-amber-900 dark:text-amber-200">Agronomist Advisory Bulletin</p>
                  <p className="text-amber-800 dark:text-amber-300 leading-relaxed">{currentRegion.advisoryAlert}</p>
                </div>
              </div>

              {/* 7-Day Micro Forecast Strip */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-3 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" /> 7-Day Agricultural Forecast & Spray Windows
                </p>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {currentRegion.forecast.map((f, i) => (
                    <div key={i} className="p-2.5 rounded-lg border bg-card text-center space-y-1 hover:border-primary/40 transition-colors">
                      <p className="text-xs font-bold text-foreground">{f.day}</p>
                      <f.icon className="h-5 w-5 mx-auto text-primary" />
                      <p className="text-[11px] font-medium text-muted-foreground">{f.temp}</p>
                      <Badge
                        variant="outline"
                        className={`text-[9px] px-1 py-0 h-4 w-full justify-center ${
                          f.spray === "Ideal"
                            ? "border-emerald-500/40 text-emerald-700 bg-emerald-50/50"
                            : f.spray === "Good"
                            ? "border-blue-500/40 text-blue-700 bg-blue-50/50"
                            : f.spray === "Caution"
                            ? "border-amber-500/40 text-amber-700 bg-amber-50/50"
                            : "border-red-500/40 text-red-700 bg-red-50/50"
                        }`}
                      >
                        {f.spray}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actionable Agro-Advisory Quick Cards */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" /> Precision Spraying Window
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Today's Spray Recommendation:</span>
                  <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs">
                    {currentRegion.sprayWindow} Window
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Low wind velocity (&lt;15 km/h) and minimal wash-off probability make this morning ideal for weedicide and foliar nutrition sprays.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => toast.success("Set SMS spray reminder for tomorrow 06:00 AM")}
                >
                  Set Spray Reminder
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-blue-500" /> Irrigation Guidance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs font-semibold text-foreground">{currentRegion.irrigationAdvice}</p>
                <div className="rounded-lg bg-blue-50/60 dark:bg-blue-950/30 p-2.5 text-xs text-blue-800 dark:text-blue-300">
                  ⚡ Saving electricity & water: Soil moisture at 62% is adequate for root-zone absorption until Thursday.
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-500/20 bg-emerald-50/20 dark:bg-emerald-950/10">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-foreground">Kisan Call Centre 24/7</p>
                  <p className="text-xs text-muted-foreground">Toll-free Agronomy Helpline</p>
                </div>
                <a href="tel:18001801551">
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8">
                    Call 1800-180-1551
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Pest & Outbreak Warning Center */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bug className="h-5 w-5 text-red-600" />
              <h2 className="font-serif text-2xl font-bold text-foreground">Active Crop Pest & Disease Alerts</h2>
            </div>
            <span className="text-xs text-muted-foreground">Updated by State Krishi Vigyan Kendras</span>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {PEST_BULLETINS.map((b, idx) => (
              <Card key={idx} className="border-border hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="font-semibold text-xs">
                      {b.crop}
                    </Badge>
                    <Badge className={`text-[10px] font-bold border ${b.statusColor}`}>
                      {b.severity}
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-bold mt-2 text-foreground leading-snug">
                    {b.pest}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  <div>
                    <span className="font-semibold text-foreground">Field Symptoms: </span>
                    <span className="text-muted-foreground">{b.symptoms}</span>
                  </div>

                  <div className="rounded-lg bg-muted/40 p-2.5 space-y-1">
                    <p className="font-semibold text-foreground flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Chemical Recommendation:
                    </p>
                    <p className="text-muted-foreground leading-relaxed">{b.preventiveAction}</p>
                  </div>

                  <div className="rounded-lg bg-emerald-50/50 dark:bg-emerald-950/30 p-2.5 space-y-1 border border-emerald-500/20">
                    <p className="font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5 text-emerald-600" /> Jaivik / Organic Solution:
                    </p>
                    <p className="text-emerald-900/80 dark:text-emerald-300/80 leading-relaxed">{b.organicAlternative}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
