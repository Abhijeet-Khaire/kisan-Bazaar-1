import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { useGlobalState } from "@/context/GlobalState";
import { useLanguage, INDIAN_LANGUAGES } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  User,
  ShieldCheck,
  MapPin,
  Building,
  Tractor,
  Warehouse,
  Truck,
  Landmark,
  CreditCard,
  Award,
  CheckCircle2,
  QrCode,
  FileText,
  Lock,
  Bell,
  Sparkles,
  Edit3,
  Save,
  Wheat,
  Download,
  Check,
  Globe2,
  Settings as SettingsIcon
} from "lucide-react";
import { toast } from "sonner";

export default function Profile() {
  const { user, updateUserProfile, switchDemoRole } = useAuth();
  const { crops, farmerStats } = useGlobalState();
  const { changeLanguage } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    alternatePhone: "",
    state: "",
    district: "",
    village: "",
    pincode: "",
    language: "Hindi",
    gender: "Male",
    dob: "",
    avatar: "",
    // Farmer fields
    farmName: "",
    farmSize: "",
    farmSizeUnit: "Acres",
    soilType: "",
    primaryCrops: [],
    irrigationType: "",
    machineryOwned: [],
    organicCertified: false,
    certificationNumber: "",
    // Buyer fields
    companyName: "",
    businessType: "",
    gstin: "",
    mandiLicenseNumber: "",
    dailyProcurementCapacity: "",
    sourcingCrops: [],
    // Logistics
    fleetSize: "",
    vehicleTypes: [],
    operatingRoutes: "",
    transportLicense: "",
    // Storage
    storageType: "",
    capacityMetricTons: "",
    temperatureRange: "",
    fssaiLicense: "",
    enwrRegistered: false,
    // KYC
    aadhaarNumber: "",
    panNumber: "",
    khasraNumber: "",
    pmKisanId: "",
    kisanCreditCard: "",
    kycStatus: "verified",
    // Bank & DBT
    bankName: "",
    branchName: "",
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    accountType: "Savings",
    upiId: "",
    dbtAutoCredit: true,
  });

  const [newCropTag, setNewCropTag] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [hoveredTab, setHoveredTab] = useState(null);

  // Sync state when user profile changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "+91 98765 43210",
        alternatePhone: user.alternatePhone || "",
        state: user.state || "Haryana",
        district: user.district || "Karnal",
        village: user.village || "Taraori, Ward 4",
        pincode: user.pincode || "132116",
        language: user.language || "Hindi",
        gender: user.gender || "Male",
        dob: user.dob || "1984-06-15",
        avatar: user.avatar || "",
        // Farmer fields
        farmName: user.farmName || (user.name ? `${user.name}'s Agro Farm` : "Green Valley Agro Farm"),
        farmSize: user.farmSize || "12.5",
        farmSizeUnit: user.farmSizeUnit || "Acres",
        soilType: user.soilType || "Alluvial Clay Loam",
        primaryCrops: user.primaryCrops || ["Basmati Rice", "Wheat", "Mustard"],
        irrigationType: user.irrigationType || "Solar Drip & Canal",
        machineryOwned: user.machineryOwned || ["Tractor (50 HP)", "Rotavator", "Laser Leveler"],
        organicCertified: user.organicCertified ?? true,
        certificationNumber: user.certificationNumber || "NPOP/AGRI/2024/991",
        // Buyer fields
        companyName: user.companyName || (user.name ? `${user.name} Agro Trading` : "National Grain Traders"),
        businessType: user.businessType || "Wholesale Grain Aggregator & Exporter",
        gstin: user.gstin || "07AAACA9921M1Z8",
        mandiLicenseNumber: user.mandiLicenseNumber || "APMC-DEL-2022-771",
        dailyProcurementCapacity: user.dailyProcurementCapacity || "120 MT",
        sourcingCrops: user.sourcingCrops || ["Rice", "Wheat", "Soybean", "Maize"],
        // Logistics
        fleetSize: user.fleetSize || "12 Multi-Axle Trucks",
        vehicleTypes: user.vehicleTypes || ["Reefer Van 10T", "Standard Freight 16T"],
        operatingRoutes: user.operatingRoutes || "Delhi - Punjab - Haryana - Maharashtra",
        transportLicense: user.transportLicense || "DL-TR-2020-0081",
        // Storage
        storageType: user.storageType || "Multi-Chamber CA Cold Storage",
        capacityMetricTons: user.capacityMetricTons || "10,000 MT",
        temperatureRange: user.temperatureRange || "-2°C to +12°C",
        fssaiLicense: user.fssaiLicense || "10020011000881",
        enwrRegistered: user.enwrRegistered ?? true,
        // KYC
        aadhaarNumber: user.aadhaarNumber || "•••• •••• 7821",
        panNumber: user.panNumber || "ABCDE7712K",
        khasraNumber: user.khasraNumber || "142/18, 142/19 (Khatauni #402)",
        pmKisanId: user.pmKisanId || "PMK-HR-KNL-9921",
        kisanCreditCard: user.kisanCreditCard || "KCC-SBI-009182",
        kycStatus: user.kycStatus || "verified",
        // Bank & DBT
        bankName: user.bankName || "State Bank of India",
        branchName: user.branchName || "Main Agri Branch",
        accountHolderName: user.accountHolderName || user.name || "Primary Account",
        accountNumber: user.accountNumber || "3892019827361",
        ifscCode: user.ifscCode || "SBIN0001248",
        accountType: user.accountType || "KCC Agri Account",
        upiId: user.upiId || `${(user.name || 'user').toLowerCase().replace(/\s+/g, '')}@oksbi`,
        dbtAutoCredit: user.dbtAutoCredit ?? true,
      });
    }
  }, [user]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddCrop = (e) => {
    e.preventDefault();
    if (!newCropTag.trim()) return;
    if (!formData.primaryCrops.includes(newCropTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        primaryCrops: [...prev.primaryCrops, newCropTag.trim()],
      }));
    }
    setNewCropTag("");
  };

  const handleRemoveCrop = (cropToRemove) => {
    setFormData((prev) => ({
      ...prev,
      primaryCrops: prev.primaryCrops.filter((c) => c !== cropToRemove),
    }));
  };

  const handleSave = async () => {
    try {
      await updateUserProfile(formData);
      setIsEditing(false);
    } catch {
      // Toast already shown in AuthContext
    }
  };

  const role = user?.role || "farmer";

  const profileTabs = [
    {
      id: "personal",
      label: "Personal",
      icon: User,
    },
    {
      id: "farm_business",
      label:
        role === "farmer"
          ? "Farm Details"
          : role === "buyer"
          ? "Business Info"
          : role === "logistics"
          ? "Fleet & Routes"
          : "Storage Specs",
      icon:
        role === "farmer"
          ? Tractor
          : role === "buyer"
          ? Building
          : role === "logistics"
          ? Truck
          : Warehouse,
    },
    {
      id: "kyc",
      label: "KYC & Land",
      icon: ShieldCheck,
    },
    {
      id: "banking",
      label: "Bank & DBT",
      icon: Landmark,
    },
    {
      id: "activity",
      label: "Badges & Stats",
      icon: Award,
    },
    {
      id: "security",
      label: "Security & Alerts",
      icon: Lock,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-8 max-w-6xl">
        {/* Role Preview Switcher Banner */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-primary/20 bg-primary/5 p-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            <div>
              <p className="text-sm font-semibold text-foreground">Interactive Profile Role Simulator</p>
              <p className="text-xs text-muted-foreground">Switch between agricultural personas to preview customized fields & KYC</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={role === "farmer" ? "default" : "outline"}
              onClick={() => switchDemoRole("farmer")}
              className="gap-1.5 h-8 text-xs"
            >
              <Tractor className="h-3.5 w-3.5" />
              Farmer
            </Button>
            <Button
              size="sm"
              variant={role === "buyer" ? "default" : "outline"}
              onClick={() => switchDemoRole("buyer")}
              className="gap-1.5 h-8 text-xs"
            >
              <Building className="h-3.5 w-3.5" />
              Buyer / Trader
            </Button>
            <Button
              size="sm"
              variant={role === "logistics" ? "default" : "outline"}
              onClick={() => switchDemoRole("logistics")}
              className="gap-1.5 h-8 text-xs"
            >
              <Truck className="h-3.5 w-3.5" />
              Logistics
            </Button>
            <Button
              size="sm"
              variant={role === "storage" ? "default" : "outline"}
              onClick={() => switchDemoRole("storage")}
              className="gap-1.5 h-8 text-xs"
            >
              <Warehouse className="h-3.5 w-3.5" />
              Cold Storage
            </Button>
          </div>
        </div>

        {/* Profile Header Card */}
        <Card className="mb-8 overflow-hidden border-border bg-gradient-to-r from-card via-card to-primary/5 shadow-md">
          <div className="h-28 bg-gradient-to-r from-primary/20 via-primary/30 to-accent relative">
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                variant={isEditing ? "default" : "secondary"}
                size="sm"
                onClick={() => {
                  if (isEditing) {
                    handleSave();
                  } else {
                    setIsEditing(true);
                  }
                }}
                className="gap-2 shadow-sm"
              >
                {isEditing ? (
                  <>
                    <Save className="h-4 w-4" /> Save Profile
                  </>
                ) : (
                  <>
                    <Edit3 className="h-4 w-4" /> Edit Profile
                  </>
                )}
              </Button>
            </div>
          </div>

          <CardContent className="relative pt-0 sm:flex sm:items-end sm:justify-between sm:space-x-5 px-6 pb-6">
            <div className="sm:flex sm:space-x-5 items-end -mt-14">
              <div className="relative">
                <div className="h-24 w-24 rounded-2xl border-4 border-card bg-primary/10 overflow-hidden shadow-lg flex items-center justify-center text-primary font-bold text-3xl">
                  {formData.avatar ? (
                    <img src={formData.avatar} alt={formData.name} className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-12 w-12 text-primary" />
                  )}
                </div>
                <div className="absolute bottom-0 right-0 rounded-full bg-green-500 p-1 border-2 border-card" title="Aadhaar Verified">
                  <CheckCircle2 className="h-4 w-4 text-white" />
                </div>
              </div>

              <div className="mt-4 sm:mt-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold font-serif text-foreground">{formData.name || "Kisan User"}</h1>
                  <Badge className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/30 capitalize">
                    {role}
                  </Badge>
                  <Badge variant="outline" className="border-green-500/40 text-green-700 bg-green-50 dark:bg-green-950/40 gap-1">
                    <ShieldCheck className="h-3 w-3 text-green-600" />
                    KYC Verified
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  {formData.village ? `${formData.village}, ` : ""}{formData.district}, {formData.state} - {formData.pincode}
                </p>
              </div>
            </div>

            <div className="mt-6 sm:mt-0 flex flex-wrap gap-4 border-t sm:border-t-0 pt-4 sm:pt-0">
              <div className="text-left sm:text-right">
                <p className="text-xs text-muted-foreground">Trust Rating</p>
                <div className="flex items-center gap-1 font-bold text-foreground text-lg sm:justify-end">
                  <span className="text-amber-500">★</span>
                  <span>{user?.trustRating || 4.9}</span>
                  <span className="text-xs text-muted-foreground font-normal">/ 5.0</span>
                </div>
              </div>
              <Separator orientation="vertical" className="hidden sm:block h-10" />
              <div className="text-left sm:text-right">
                <p className="text-xs text-muted-foreground">Completed Deals</p>
                <p className="text-lg font-bold text-foreground">{user?.totalDeals || 34}</p>
              </div>
              <Separator orientation="vertical" className="hidden sm:block h-10" />
              <div className="text-left sm:text-right">
                <p className="text-xs text-muted-foreground">Direct Payouts</p>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 gap-1">
                  <Check className="h-3 w-3" /> DBT Active
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* iOS 27 Fluid Sliding Tab Bar */}
          <div className="w-full">
            <div className="relative p-1.5 rounded-2xl bg-zinc-900/90 dark:bg-zinc-950/80 backdrop-blur-2xl border border-white/10 dark:border-white/10 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.12)]">
              <div
                className="flex w-full overflow-x-auto md:grid md:grid-cols-6 gap-1.5 no-scrollbar scroll-smooth"
                onMouseLeave={() => setHoveredTab(null)}
                role="tablist"
                aria-label="Profile Sections"
              >
                {profileTabs.map((tab) => {
                  const IconComponent = tab.icon;
                  const isActive = activeTab === tab.id;
                  const isHovered = hoveredTab === tab.id;

                  return (
                    <motion.button
                      key={tab.id}
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveTab(tab.id)}
                      onMouseEnter={() => setHoveredTab(tab.id)}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        "relative flex-1 min-w-[140px] md:min-w-0 py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm font-medium transition-colors duration-200 select-none cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                        isActive
                          ? "text-white font-semibold"
                          : "text-zinc-400 hover:text-zinc-100"
                      )}
                    >
                      {/* iOS 27 Hover Spotlight / Ghost Pill */}
                      {isHovered && !isActive && (
                        <motion.div
                          layoutId="ios27-hover-pill"
                          className="absolute inset-0 rounded-xl bg-white/[0.08] dark:bg-white/[0.06] border border-white/5 pointer-events-none"
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 35,
                          }}
                        />
                      )}

                      {/* iOS 27 Active Sliding Capsule */}
                      {isActive && (
                        <motion.div
                          layoutId="ios27-active-pill"
                          className="absolute inset-0 rounded-xl bg-gradient-to-b from-emerald-500 via-emerald-600 to-teal-700 shadow-[0_4px_22px_rgba(16,185,129,0.45),inset_0_1px_1px_rgba(255,255,255,0.4)] border border-white/25 pointer-events-none overflow-hidden"
                          transition={{
                            type: "spring",
                            stiffness: 420,
                            damping: 32,
                            mass: 0.75,
                          }}
                        >
                          {/* Apple Glass Specular Top Reflection */}
                          <div className="absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-white/35 via-white/10 to-transparent pointer-events-none" />
                          {/* Subtle ambient light sweep */}
                          <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-45 pointer-events-none" />
                        </motion.div>
                      )}

                      {/* Content: Icon, Label & Live Pulse */}
                      <span className="relative z-10 flex items-center gap-2">
                        <motion.span
                          animate={{
                            scale: isActive ? 1.15 : 1,
                            y: isActive ? -0.5 : 0,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 25,
                          }}
                        >
                          <IconComponent
                            className={cn(
                              "h-4 w-4 transition-colors duration-200",
                              isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"
                            )}
                          />
                        </motion.span>
                        <span className="whitespace-nowrap tracking-tight">{tab.label}</span>

                        {/* iOS active micro pulse indicator */}
                        {isActive && (
                          <span className="hidden sm:inline-block h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.95)] animate-pulse ml-0.5" />
                        )}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* TAB 1: PERSONAL DETAILS */}
          <TabsContent value="personal">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" /> Personal & Contact Details
                      </CardTitle>
                      <CardDescription>
                        Primary identity and communication preferences registered with KisanBazaar
                      </CardDescription>
                    </div>
                    {!isEditing && (
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-1.5">
                        <Edit3 className="h-3.5 w-3.5" /> Edit
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        disabled={!isEditing}
                        onChange={(e) => handleChange("name", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        disabled={!isEditing}
                        onChange={(e) => handleChange("email", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Mobile Number (Aadhaar linked)</Label>
                      <div className="flex gap-2">
                        <Input
                          id="phone"
                          value={formData.phone}
                          disabled={!isEditing}
                          onChange={(e) => handleChange("phone", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="alternatePhone">WhatsApp / Alternate Contact</Label>
                      <Input
                        id="alternatePhone"
                        value={formData.alternatePhone}
                        disabled={!isEditing}
                        onChange={(e) => handleChange("alternatePhone", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="language">Preferred App Language</Label>
                        <Link to="/settings" className="text-[11px] text-primary hover:underline flex items-center gap-1 font-medium">
                          <Globe2 className="h-3 w-3" /> All 22 Languages in Settings
                        </Link>
                      </div>
                      <select
                        id="language"
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background disabled:opacity-60 font-medium"
                        value={formData.language}
                        disabled={!isEditing}
                        onChange={(e) => {
                          const val = e.target.value;
                          handleChange("language", val);
                          const found = INDIAN_LANGUAGES.find(
                            (l) => l.name.toLowerCase() === val.toLowerCase() || l.code === val.toLowerCase()
                          );
                          if (found) {
                            changeLanguage(found.code, true);
                          }
                        }}
                      >
                        {INDIAN_LANGUAGES.map((lang) => (
                          <option key={lang.code} value={lang.name}>
                            {lang.nativeName} ({lang.name}) - {lang.region}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <select
                        id="gender"
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background disabled:opacity-60"
                        value={formData.gender}
                        disabled={!isEditing}
                        onChange={(e) => handleChange("gender", e.target.value)}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" /> Permanent Address & Agricultural Cluster
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="village">Village / Ward / Street Address</Label>
                        <Input
                          id="village"
                          value={formData.village}
                          disabled={!isEditing}
                          onChange={(e) => handleChange("village", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="district">District</Label>
                        <Input
                          id="district"
                          value={formData.district}
                          disabled={!isEditing}
                          onChange={(e) => handleChange("district", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={formData.state}
                          disabled={!isEditing}
                          onChange={(e) => handleChange("state", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pincode">Pincode</Label>
                        <Input
                          id="pincode"
                          value={formData.pincode}
                          disabled={!isEditing}
                          onChange={(e) => handleChange("pincode", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                {isEditing && (
                  <CardFooter className="flex justify-end gap-3 border-t bg-muted/20 py-4">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                    <Button onClick={handleSave} className="gap-1.5">
                      <Save className="h-4 w-4" /> Save Changes
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </motion.div>
          </TabsContent>

          {/* TAB 2: ROLE SPECIFIC DETAILS (Farmer / Buyer / Logistics / Storage) */}
          <TabsContent value="farm_business">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      {role === "farmer" && <Tractor className="h-5 w-5 text-primary" />}
                      {role === "buyer" && <Building className="h-5 w-5 text-primary" />}
                      {role === "logistics" && <Truck className="h-5 w-5 text-primary" />}
                      {role === "storage" && <Warehouse className="h-5 w-5 text-primary" />}
                      {role === "farmer"
                        ? "Agricultural Holding & Cultivation Details"
                        : role === "buyer"
                        ? "Procurement & Trading Operations"
                        : role === "logistics"
                        ? "Fleet & Logistics Network"
                        : "Storage Facility & Capacity Specifications"}
                    </CardTitle>
                    <CardDescription>
                      Tailored specifications enabling AI pricing, matching algorithms, and auction participation
                    </CardDescription>
                  </div>
                  {!isEditing && (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-1.5">
                      <Edit3 className="h-3.5 w-3.5" /> Edit
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* FARMER PROFILE FIELDS */}
                {role === "farmer" && (
                  <div className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="farmName">Farm / Estate Name</Label>
                        <Input
                          id="farmName"
                          value={formData.farmName}
                          disabled={!isEditing}
                          onChange={(e) => handleChange("farmName", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="farmSize">Total Cultivated Area ({formData.farmSizeUnit})</Label>
                        <div className="flex gap-2">
                          <Input
                            id="farmSize"
                            type="number"
                            value={formData.farmSize}
                            disabled={!isEditing}
                            onChange={(e) => handleChange("farmSize", e.target.value)}
                          />
                          <select
                            className="h-10 px-2 rounded-md border border-input bg-background text-sm"
                            value={formData.farmSizeUnit}
                            disabled={!isEditing}
                            onChange={(e) => handleChange("farmSizeUnit", e.target.value)}
                          >
                            <option value="Acres">Acres</option>
                            <option value="Bigha">Bigha</option>
                            <option value="Hectares">Hectares</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="soilType">Soil Profile & Type</Label>
                        <Input
                          id="soilType"
                          value={formData.soilType}
                          disabled={!isEditing}
                          onChange={(e) => handleChange("soilType", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="irrigationType">Irrigation System</Label>
                        <Input
                          id="irrigationType"
                          value={formData.irrigationType}
                          disabled={!isEditing}
                          onChange={(e) => handleChange("irrigationType", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="certificationNumber">Jaivik / NPOP Certification No.</Label>
                        <Input
                          id="certificationNumber"
                          value={formData.certificationNumber}
                          disabled={!isEditing}
                          onChange={(e) => handleChange("certificationNumber", e.target.value)}
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Primary Crops Cultivated */}
                    <div className="space-y-3">
                      <Label>Primary Crops Cultivated</Label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {formData.primaryCrops.map((crop, idx) => (
                          <Badge key={idx} variant="secondary" className="px-3 py-1 text-sm bg-primary/10 text-primary border border-primary/20 gap-2">
                            <Wheat className="h-3.5 w-3.5" />
                            {crop}
                            {isEditing && (
                              <button
                                type="button"
                                onClick={() => handleRemoveCrop(crop)}
                                className="text-muted-foreground hover:text-destructive text-xs ml-1"
                              >
                                ×
                              </button>
                            )}
                          </Badge>
                        ))}
                      </div>

                      {isEditing && (
                        <form onSubmit={handleAddCrop} className="flex gap-2 max-w-sm">
                          <Input
                            placeholder="Add crop (e.g. Cotton, Soybean)"
                            value={newCropTag}
                            onChange={(e) => setNewCropTag(e.target.value)}
                            className="h-9 text-sm"
                          />
                          <Button type="submit" size="sm" variant="outline">Add</Button>
                        </form>
                      )}
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/20">
                      <div className="space-y-0.5">
                        <div className="font-semibold text-foreground flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-emerald-600" />
                          Certified Organic Producer
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Displays the Green Certified Organic badge on your marketplace crop listings
                        </p>
                      </div>
                      <Switch
                        checked={formData.organicCertified}
                        disabled={!isEditing}
                        onCheckedChange={(checked) => handleChange("organicCertified", checked)}
                      />
                    </div>
                  </div>
                )}

                {/* BUYER PROFILE FIELDS */}
                {role === "buyer" && (
                  <div className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Business / Company Legal Name</Label>
                        <Input
                          id="companyName"
                          value={formData.companyName}
                          disabled={!isEditing}
                          onChange={(e) => handleChange("companyName", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="businessType">Buyer Category</Label>
                        <Input
                          id="businessType"
                          value={formData.businessType}
                          disabled={!isEditing}
                          onChange={(e) => handleChange("businessType", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gstin">GSTIN (Verified)</Label>
                        <Input
                          id="gstin"
                          value={formData.gstin}
                          disabled={!isEditing}
                          onChange={(e) => handleChange("gstin", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mandiLicenseNumber">Unified APMC Mandi License</Label>
                        <Input
                          id="mandiLicenseNumber"
                          value={formData.mandiLicenseNumber}
                          disabled={!isEditing}
                          onChange={(e) => handleChange("mandiLicenseNumber", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dailyProcurementCapacity">Daily Procurement Volume</Label>
                        <Input
                          id="dailyProcurementCapacity"
                          value={formData.dailyProcurementCapacity}
                          disabled={!isEditing}
                          onChange={(e) => handleChange("dailyProcurementCapacity", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* LOGISTICS PROFILE FIELDS */}
                {role === "logistics" && (
                  <div className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="fleetSize">Total Fleet Size</Label>
                        <Input
                          id="fleetSize"
                          value={formData.fleetSize}
                          disabled={!isEditing}
                          onChange={(e) => handleChange("fleetSize", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="transportLicense">National Transport Permit No.</Label>
                        <Input
                          id="transportLicense"
                          value={formData.transportLicense}
                          disabled={!isEditing}
                          onChange={(e) => handleChange("transportLicense", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="operatingRoutes">Active Highway Corridors & States</Label>
                        <Input
                          id="operatingRoutes"
                          value={formData.operatingRoutes}
                          disabled={!isEditing}
                          onChange={(e) => handleChange("operatingRoutes", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STORAGE PROFILE FIELDS */}
                {role === "storage" && (
                  <div className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="storageType">Storage Facility Type</Label>
                        <Input
                          id="storageType"
                          value={formData.storageType}
                          disabled={!isEditing}
                          onChange={(e) => handleChange("storageType", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="capacityMetricTons">Total Capacity</Label>
                        <Input
                          id="capacityMetricTons"
                          value={formData.capacityMetricTons}
                          disabled={!isEditing}
                          onChange={(e) => handleChange("capacityMetricTons", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="temperatureRange">Temperature Control</Label>
                        <Input
                          id="temperatureRange"
                          value={formData.temperatureRange}
                          disabled={!isEditing}
                          onChange={(e) => handleChange("temperatureRange", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fssaiLicense">FSSAI Storage License</Label>
                        <Input
                          id="fssaiLicense"
                          value={formData.fssaiLicense}
                          disabled={!isEditing}
                          onChange={(e) => handleChange("fssaiLicense", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              {isEditing && (
                <CardFooter className="flex justify-end gap-3 border-t bg-muted/20 py-4">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button onClick={handleSave} className="gap-1.5">
                    <Save className="h-4 w-4" /> Save Changes
                  </Button>
                </CardFooter>
              )}
            </Card>
          </TabsContent>

          {/* TAB 3: KYC & LAND VERIFICATION */}
          <TabsContent value="kyc">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl flex items-center gap-2">
                          <ShieldCheck className="h-5 w-5 text-green-600" /> Government KYC & Land Records
                        </CardTitle>
                        <CardDescription>
                          Government-verified identity documents ensuring trust and direct subsidy settlement
                        </CardDescription>
                      </div>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300 border-green-300">
                        100% Verified
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="aadhaarNumber">Aadhaar Card Number</Label>
                        <div className="relative">
                          <Input
                            id="aadhaarNumber"
                            value={formData.aadhaarNumber}
                            disabled={!isEditing}
                            onChange={(e) => handleChange("aadhaarNumber", e.target.value)}
                          />
                          <span className="absolute right-3 top-2.5 text-xs text-green-600 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="panNumber">PAN Number</Label>
                        <div className="relative">
                          <Input
                            id="panNumber"
                            value={formData.panNumber}
                            disabled={!isEditing}
                            onChange={(e) => handleChange("panNumber", e.target.value)}
                          />
                          <span className="absolute right-3 top-2.5 text-xs text-green-600 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" /> NSDL Verified
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="khasraNumber">Khasra / Khatauni (7/12 Land Record ID)</Label>
                        <Input
                          id="khasraNumber"
                          value={formData.khasraNumber}
                          disabled={!isEditing}
                          onChange={(e) => handleChange("khasraNumber", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="pmKisanId">PM-Kisan Beneficiary ID</Label>
                        <Input
                          id="pmKisanId"
                          value={formData.pmKisanId}
                          disabled={!isEditing}
                          onChange={(e) => handleChange("pmKisanId", e.target.value)}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" /> Verified Land & Identity Certificates
                      </h4>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/20 transition-colors">
                          <div className="flex items-center gap-3">
                            <FileText className="h-8 w-8 text-primary/80" />
                            <div>
                              <p className="text-sm font-medium text-foreground">Land Mutation Record (7/12)</p>
                              <p className="text-xs text-muted-foreground">Certified by Revenue Dept • PDF</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs text-green-600 border-green-300">
                            Valid
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/20 transition-colors">
                          <div className="flex items-center gap-3">
                            <FileText className="h-8 w-8 text-emerald-600" />
                            <div>
                              <p className="text-sm font-medium text-foreground">Soil Health Card 2024-25</p>
                              <p className="text-xs text-muted-foreground">ICAR / Krishi Vigyan Kendra</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs text-green-600 border-green-300">
                            Optimal NPK
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  {isEditing && (
                    <CardFooter className="flex justify-end gap-3 border-t bg-muted/20 py-4">
                      <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                      <Button onClick={handleSave} className="gap-1.5">
                        <Save className="h-4 w-4" /> Save Changes
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              </div>

              {/* Digital Farmer / Trader ID Card Preview */}
              <div>
                <Card className="border-primary/30 bg-gradient-to-br from-card via-card to-primary/10 overflow-hidden shadow-lg">
                  <CardHeader className="bg-primary text-primary-foreground p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wheat className="h-5 w-5" />
                        <span className="font-serif font-bold text-sm tracking-wide">KISANBAZAAR DIGITAL ID</span>
                      </div>
                      <Badge variant="secondary" className="bg-white/20 text-white text-[10px] hover:bg-white/30 border-0">
                        GOVT SYNC
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-xl border-2 border-primary/20 bg-muted overflow-hidden flex items-center justify-center font-bold text-xl text-primary">
                        {formData.avatar ? (
                          <img src={formData.avatar} alt={formData.name} className="h-full w-full object-cover" />
                        ) : (
                          <User className="h-8 w-8 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-foreground leading-tight">{formData.name || "Rajesh Kumar"}</p>
                        <p className="text-xs text-muted-foreground capitalize font-medium">{role} ID: {user?.uid || "KB-88219"}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{formData.district}, {formData.state}</p>
                      </div>
                    </div>

                    <div className="rounded-lg bg-muted/40 p-3 space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Khasra #</span>
                        <span className="font-medium text-foreground">{formData.khasraNumber?.split(' ')[0] || "142/18"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Holding</span>
                        <span className="font-medium text-foreground">{formData.farmSize} {formData.farmSizeUnit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">DBT Status</span>
                        <span className="font-semibold text-emerald-600">Enabled (SBI)</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <QrCode className="h-8 w-8 text-foreground" />
                        <span className="text-[10px] leading-tight">Scan to verify credentials at APMC Mandi</span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full text-xs gap-2"
                      onClick={() => toast.success("Digital Kisan Card downloaded as PDF!")}
                    >
                      <Download className="h-3.5 w-3.5" /> Download ID Card
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* TAB 4: BANK ACCOUNT & DBT PAYOUTS */}
          <TabsContent value="banking">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Landmark className="h-5 w-5 text-primary" /> Bank Account & Direct Benefit Transfer (DBT)
                    </CardTitle>
                    <CardDescription>
                      Auction settlements, escrow releases, and government subsidies are credited directly here
                    </CardDescription>
                  </div>
                  {!isEditing && (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-1.5">
                      <Edit3 className="h-3.5 w-3.5" /> Edit
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      value={formData.bankName}
                      disabled={!isEditing}
                      onChange={(e) => handleChange("bankName", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="branchName">Branch Name / City</Label>
                    <Input
                      id="branchName"
                      value={formData.branchName}
                      disabled={!isEditing}
                      onChange={(e) => handleChange("branchName", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountHolderName">Account Holder Name (As per Bank)</Label>
                    <Input
                      id="accountHolderName"
                      value={formData.accountHolderName}
                      disabled={!isEditing}
                      onChange={(e) => handleChange("accountHolderName", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      value={formData.accountNumber}
                      disabled={!isEditing}
                      onChange={(e) => handleChange("accountNumber", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ifscCode">IFSC Code</Label>
                    <Input
                      id="ifscCode"
                      value={formData.ifscCode}
                      disabled={!isEditing}
                      onChange={(e) => handleChange("ifscCode", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountType">Account Type</Label>
                    <select
                      id="accountType"
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      value={formData.accountType}
                      disabled={!isEditing}
                      onChange={(e) => handleChange("accountType", e.target.value)}
                    >
                      <option value="KCC Agri Account">Kisan Credit Card (KCC) Agri Account</option>
                      <option value="Savings Account">Savings Bank Account</option>
                      <option value="Current Account">Current Business Account</option>
                    </select>
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="upiId">Instant UPI ID (VPA) for Auction Payouts</Label>
                    <Input
                      id="upiId"
                      value={formData.upiId}
                      disabled={!isEditing}
                      onChange={(e) => handleChange("upiId", e.target.value)}
                      placeholder="e.g. name@oksbi"
                    />
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between p-4 rounded-xl border border-primary/20 bg-primary/5">
                  <div className="space-y-1">
                    <div className="font-semibold text-foreground flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-primary" />
                      Automatic Direct Benefit Transfer (DBT) Sync
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Link this account with PFMS for instant receipt of MSP minimum support price differentials and crop subsidies
                    </p>
                  </div>
                  <Switch
                    checked={formData.dbtAutoCredit}
                    disabled={!isEditing}
                    onCheckedChange={(checked) => handleChange("dbtAutoCredit", checked)}
                  />
                </div>
              </CardContent>
              {isEditing && (
                <CardFooter className="flex justify-end gap-3 border-t bg-muted/20 py-4">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button onClick={handleSave} className="gap-1.5">
                    <Save className="h-4 w-4" /> Save Changes
                  </Button>
                </CardFooter>
              )}
            </Card>
          </TabsContent>

          {/* TAB 5: ACTIVITY & BADGES */}
          <TabsContent value="activity">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Award className="h-5 w-5 text-amber-500" /> Platform Badges & Accreditations
                    </CardTitle>
                    <CardDescription>
                      Earned through transparent bidding, quality crop inspections, and punctual dispatches
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 sm:grid-cols-2">
                    {(user?.badges || [
                      "Verified Farmer",
                      "Grade A Quality Certified",
                      "Fast Dispatcher",
                      "Top Rated 2024",
                    ]).map((badgeName, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3.5 rounded-xl border bg-card hover:border-primary/40 transition-colors">
                        <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600">
                          <Award className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-foreground">{badgeName}</p>
                          <p className="text-xs text-muted-foreground">Awarded by KisanBazaar Trust Board</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Performance Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Operational Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4 sm:grid-cols-3">
                    <div className="p-4 rounded-lg bg-muted/30 border">
                      <p className="text-xs text-muted-foreground">Fulfillment Rate</p>
                      <p className="text-2xl font-bold text-foreground mt-1">99.4%</p>
                      <p className="text-xs text-emerald-600 mt-0.5">Top 2% in Haryana</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/30 border">
                      <p className="text-xs text-muted-foreground">Avg. Mandi Premium</p>
                      <p className="text-2xl font-bold text-primary mt-1">+18.5%</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Above base MSP</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/30 border">
                      <p className="text-xs text-muted-foreground">Dispute Resolution</p>
                      <p className="text-2xl font-bold text-foreground mt-1">0 Cases</p>
                      <p className="text-xs text-emerald-600 mt-0.5">Clean Track Record</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Platform Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-l-2 border-primary pl-3 py-1 space-y-0.5">
                      <p className="text-xs text-muted-foreground">Today at 11:30 AM</p>
                      <p className="text-sm font-medium text-foreground">Auction Bid Received</p>
                      <p className="text-xs text-muted-foreground">Agromart Exports bid ₹4,200/q on Basmati Rice</p>
                    </div>
                    <div className="border-l-2 border-emerald-500 pl-3 py-1 space-y-0.5">
                      <p className="text-xs text-muted-foreground">Yesterday</p>
                      <p className="text-sm font-medium text-foreground">DBT Payout Settled</p>
                      <p className="text-xs text-muted-foreground">₹84,000 transferred to SBI A/C •••• 7361</p>
                    </div>
                    <div className="border-l-2 border-amber-500 pl-3 py-1 space-y-0.5">
                      <p className="text-xs text-muted-foreground">3 days ago</p>
                      <p className="text-sm font-medium text-foreground">Soil Health Card Uploaded</p>
                      <p className="text-xs text-muted-foreground">Karnal Agriculture Lab verified optimal pH 7.2</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* TAB 6: SECURITY & ALERTS */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" /> Security & Notification Alerts
                </CardTitle>
                <CardDescription>
                  Configure instant Mandi price movement alerts and account login protection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Bell className="h-4 w-4 text-primary" /> SMS & WhatsApp Agricultural Alerts
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center justify-between p-3.5 rounded-lg border bg-card">
                      <div>
                        <p className="text-sm font-medium text-foreground">Outbid & Auction Winner SMS</p>
                        <p className="text-xs text-muted-foreground">Instant SMS to {formData.phone}</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-lg border bg-card">
                      <div>
                        <p className="text-sm font-medium text-foreground">Daily Mandi Rate WhatsApp Sheet</p>
                        <p className="text-xs text-muted-foreground">Morning market prices at 08:00 AM</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-lg border bg-card">
                      <div>
                        <p className="text-sm font-medium text-foreground">Severe Weather & Rain Warnings</p>
                        <p className="text-xs text-muted-foreground">Microclimate alerts for {formData.district}</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-lg border bg-card">
                      <div>
                        <p className="text-sm font-medium text-foreground">Govt Subsidy Application Deadlines</p>
                        <p className="text-xs text-muted-foreground">PM-Kisan & Fasal Bima reminders</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Lock className="h-4 w-4 text-primary" /> Password & Security
                  </h4>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Current Password</Label>
                      <Input type="password" placeholder="••••••••" />
                    </div>
                    <div className="space-y-2">
                      <Label>New Password</Label>
                      <Input type="password" placeholder="Min. 8 characters" />
                    </div>
                    <div className="space-y-2">
                      <Label>Confirm New Password</Label>
                      <Input type="password" placeholder="••••••••" />
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={() => toast.success("Password updated successfully!")}
                  >
                    Update Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
