import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Globe2,
  CheckCircle2,
  Search,
  Sparkles,
  Volume2,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Check,
  Cpu,
  Key,
  ExternalLink,
  Trash2,
  Bot
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getStoredApiKey, setStoredApiKey, isCloudGeminiActive } from "@/lib/ai/kisanAiService";
import { toast } from "sonner";

export default function Settings() {
  const {
    currentLanguage,
    activeLangObj,
    changeLanguage,
    INDIAN_LANGUAGES,
    t,
    voiceAssistEnabled,
    setVoiceAssistEnabled,
    smsAlertsLanguage,
    setSmsAlertsLanguage
  } = useLanguage();

  const { user, updateUserProfile } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [geminiKey, setGeminiKey] = useState(() => getStoredApiKey());
  const [isGeminiActive, setIsGeminiActive] = useState(() => isCloudGeminiActive());

  const handleSaveGeminiKey = () => {
    const key = geminiKey.trim();
    if (key && !key.startsWith("AIzaSy")) {
      toast.error("Please enter a valid Google Gemini API Key (starts with AIzaSy...)");
      return;
    }
    setStoredApiKey(key);
    setIsGeminiActive(Boolean(key));
    if (key) {
      toast.success("Google Gemini 2.5 Flash connected successfully! 🚀");
    } else {
      toast.info("Switched to Built-in Regional Agricultural Engine.");
    }
  };

  const handleRemoveGeminiKey = () => {
    setStoredApiKey("");
    setGeminiKey("");
    setIsGeminiActive(false);
    toast.info("Gemini API Key removed. Using Smart Regional Engine.");
  };

  const filteredLanguages = INDIAN_LANGUAGES.filter((lang) => {
    const matchesSearch =
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.code.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilter === "all") return true;
    if (selectedFilter === "popular") {
      return ["hi", "en", "mr", "bn", "te", "ta", "gu", "pa"].includes(lang.code);
    }
    if (selectedFilter === "north_central") {
      return ["hi", "pa", "doi", "mai", "ks", "ne"].includes(lang.code);
    }
    if (selectedFilter === "south") {
      return ["te", "ta", "kn", "ml"].includes(lang.code);
    }
    if (selectedFilter === "west") {
      return ["mr", "gu", "sd", "kok"].includes(lang.code);
    }
    if (selectedFilter === "east_ne") {
      return ["bn", "as", "or", "mni", "brx", "sat"].includes(lang.code);
    }
    return true;
  });

  const handleSelectLanguage = (langCode) => {
    changeLanguage(langCode, true);
    // Sync with user profile if logged in
    if (user && updateUserProfile) {
      const selectedObj = INDIAN_LANGUAGES.find((l) => l.code === langCode);
      if (selectedObj) {
        updateUserProfile({ language: selectedObj.name }).catch(() => {});
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-8 max-w-5xl">
        {/* Header Banner */}
        <div className="mb-8 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-card to-background p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-primary/20 text-primary border-primary/30 gap-1.5 px-3 py-0.5 text-xs font-semibold">
                  <Globe2 className="h-3.5 w-3.5" /> All 22 Official Indian Languages Supported
                </Badge>
                <Badge variant="outline" className="text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500/30 gap-1 text-xs">
                  <Sparkles className="h-3 w-3" /> Live Multilingual Engine
                </Badge>
              </div>
              <h1 className="text-3xl font-bold font-serif text-foreground tracking-tight">
                {t("settings.title", "Language & Regional Settings")}
              </h1>
              <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
                {t("settings.subtitle", "Select your preferred Indian language for the portal, mandi prices, voice advisory, and WhatsApp SMS alerts.")}
              </p>
            </div>

            {/* Currently Active Display */}
            <div className="flex items-center gap-3 p-3.5 rounded-xl border border-primary/30 bg-card/80 shadow-sm min-w-[200px]">
              <div className="h-10 w-10 rounded-lg bg-primary/15 flex items-center justify-center text-primary font-bold text-lg">
                {activeLangObj.nativeName.charAt(0)}
              </div>
              <div>
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{t("settings.current", "Active Language")}</p>
                <p className="text-base font-bold text-foreground">
                  {activeLangObj.nativeName} <span className="text-xs font-normal text-muted-foreground">({activeLangObj.name})</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: All Indian Languages Grid */}
        <Card className="mb-8 overflow-hidden shadow-md">
          <CardHeader className="bg-muted/20 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Globe2 className="h-5 w-5 text-primary" /> Choose Portal Language
                </CardTitle>
                <CardDescription>
                  Click any language to immediately localize all navigation, pricing data, and agricultural features
                </CardDescription>
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("settings.searchPlaceholder", "Search language or state...")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Regional Filter Chips */}
            <div className="flex flex-wrap gap-1.5 mt-4 pt-2 border-t">
              {[
                { id: "all", label: "All Languages (23)" },
                { id: "popular", label: "Most Popular" },
                { id: "north_central", label: "North & Central" },
                { id: "south", label: "South" },
                { id: "west", label: "West" },
                { id: "east_ne", label: "East & North East" },
              ].map((chip) => (
                <Button
                  key={chip.id}
                  variant={selectedFilter === chip.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter(chip.id)}
                  className="h-7 text-xs rounded-full px-3"
                >
                  {chip.label}
                </Button>
              ))}
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredLanguages.map((lang) => {
                const isCurrent = currentLanguage === lang.code;

                return (
                  <motion.button
                    key={lang.code}
                    onClick={() => handleSelectLanguage(lang.code)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative p-4 rounded-xl text-left border transition-all duration-200 cursor-pointer ${
                      isCurrent
                        ? "border-primary bg-primary/10 shadow-sm ring-2 ring-primary/30"
                        : "border-border hover:border-primary/50 hover:bg-muted/30 bg-card"
                    }`}
                  >
                    {isCurrent && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 text-primary text-xs font-semibold">
                        <CheckCircle2 className="h-4 w-4 fill-primary text-primary-foreground" />
                        <span className="hidden sm:inline">Active</span>
                      </div>
                    )}

                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-xl font-bold text-foreground font-sans tracking-tight">
                          {lang.nativeName}
                        </div>
                        <div className="text-sm font-medium text-muted-foreground mt-0.5">
                          {lang.name}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground border-t pt-2 border-border/50">
                      <span className="truncate max-w-[170px]">{lang.region}</span>
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                        {lang.script}
                      </Badge>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {filteredLanguages.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">
                <Globe2 className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-sm font-medium">No Indian languages matched &quot;{searchQuery}&quot;</p>
                <Button variant="link" size="sm" onClick={() => setSearchQuery("")} className="mt-1">
                  Clear search filter
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Section 2: Regional Communication & Voice Preferences */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Voice Assistant */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Volume2 className="h-5 w-5 text-primary" /> {t("settings.voiceTitle", "Agri Voice Assistant")}
              </CardTitle>
              <CardDescription>
                {t("settings.voiceDesc", "Listen to real-time Mandi crop prices and weather advisories in your local language.")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/20">
                <div className="space-y-0.5">
                  <p className="font-semibold text-sm text-foreground">Speech Readout for Crop Prices</p>
                  <p className="text-xs text-muted-foreground">
                    Automatically speaks price changes in {activeLangObj.nativeName} ({activeLangObj.name})
                  </p>
                </div>
                <Switch
                  checked={voiceAssistEnabled}
                  onCheckedChange={setVoiceAssistEnabled}
                />
              </div>

              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                Supports hands-free agricultural operations on tractors and mobile devices
              </div>
            </CardContent>
          </Card>

          {/* SMS & WhatsApp Mandi Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" /> {t("settings.smsTitle", "Mandi SMS & WhatsApp Alerts")}
              </CardTitle>
              <CardDescription>
                {t("settings.smsDesc", "Receive daily APMC Mandi price notifications and buyer bids in your chosen script.")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">Alert Message Script</label>
                <select
                  value={smsAlertsLanguage}
                  onChange={(e) => setSmsAlertsLanguage(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm ring-offset-background"
                >
                  {INDIAN_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.nativeName} ({l.name}) - {l.region}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-xs text-muted-foreground">
                Example SMS: <span className="font-mono text-foreground font-semibold">“किसान बाज़ार: करनाल मंडी में बासमती धान का आज का भाव ₹3,850/क्विंटल है।”</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section 3: Kisan Bazaar GenAI Copilot & Google Gemini Integration */}
        <div className="mt-6">
          <Card className="border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 via-card to-background">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Bot className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    Kisan Bazaar GenAI Copilot & Intelligence Engine
                  </CardTitle>
                  <CardDescription>
                    Configure Google Gemini 2.5 Flash for human-grade agricultural advice, live DOM screen awareness, and multilingual comprehension in Marathi, Hindi & English.
                  </CardDescription>
                </div>
                <Badge className={`w-fit font-semibold text-xs px-3 py-1 ${isGeminiActive ? "bg-emerald-600 text-white" : "bg-amber-600 text-white"}`}>
                  {isGeminiActive ? "Gemini 2.5 Flash Active 🟢" : "Smart Regional Engine 🟠"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl border border-border bg-background space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                      <Key className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> Google Gemini API Key
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Connect your free Gemini API key to activate cloud inference with real-time reasoning.
                    </p>
                  </div>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:underline shrink-0"
                  >
                    Get Free Key <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    type="password"
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                    placeholder="Paste Gemini API Key (e.g. AIzaSy...)"
                    className="flex-1 text-sm bg-muted/40 font-mono"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveGeminiKey}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shrink-0"
                    >
                      <Check className="h-4 w-4" /> Save Key
                    </Button>
                    {isGeminiActive && (
                      <Button
                        variant="outline"
                        onClick={handleRemoveGeminiKey}
                        className="text-destructive border-destructive/30 hover:bg-destructive/10 gap-1.5 shrink-0"
                      >
                        <Trash2 className="h-4 w-4" /> Remove
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs text-muted-foreground border-t border-border/50">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>मराठी, हिंदी & English Natural Dialogues</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Live DOM Screen Element Scraping</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>APMC Mandi & 7/12 Satbara Knowledge</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
