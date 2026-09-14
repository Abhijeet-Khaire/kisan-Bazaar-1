import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Menu,
  Leaf,
  TrendingUp,
  Truck,
  Warehouse,
  LogOut,
  User,
  Building2,
  CloudSun,
  Landmark,
  ShoppingBag,
  ShieldCheck,
  PlusCircle,
  Tractor,
  Building,
  Check,
  Settings as SettingsIcon
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { NotificationBell } from "@/components/notifications/NotificationBell";

const navLinks = [
  { href: "/buyer/marketplace", label: "Marketplace", icon: TrendingUp },
  { href: "/advisory", label: "Agro Advisory", icon: CloudSun },
  { href: "/schemes", label: "Govt Schemes", icon: Landmark },
  { href: "/farmer/analytics", label: "AI Analytics", icon: Leaf },
  { href: "/logistics", label: "Logistics", icon: Truck },
  { href: "/storage", label: "Storage", icon: Warehouse },
  { href: "/community", label: "Community", icon: Building2 },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout, switchDemoRole } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user) return "/";
    switch (user.role) {
      case 'farmer': return "/farmer/dashboard";
      case 'buyer': return "/buyer/orders";
      case 'logistics': return "/logistics";
      case 'storage': return "/storage";
      default: return "/";
    }
  };

  const dynamicNavLinks = [
    { href: "/buyer/marketplace", label: t("nav.marketplace", "Marketplace"), icon: TrendingUp },
    { href: "/advisory", label: t("nav.advisory", "Agro Advisory"), icon: CloudSun },
    { href: "/schemes", label: t("nav.schemes", "Govt Schemes"), icon: Landmark },
    { href: "/farmer/analytics", label: t("nav.analytics", "AI Analytics"), icon: Leaf },
    { href: "/logistics", label: t("nav.logistics", "Logistics"), icon: Truck },
    { href: "/storage", label: t("nav.storage", "Storage"), icon: Warehouse },
    { href: "/community", label: t("nav.community", "Community"), icon: Building2 },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 notranslate" translate="no">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-white/95 p-1 shadow-xs border border-border/50 transition-all duration-200 group-hover:scale-105 group-hover:shadow-sm">
            <img 
              src="/logo-icon.png" 
              alt="Kisan Bazaar Logo" 
              className="h-full w-full object-contain" 
            />
          </div>
          <span className="font-serif text-xl font-bold text-foreground tracking-tight">
            Kisan<span className="text-primary">Bazaar</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-5 lg:flex">
          {dynamicNavLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`flex items-center gap-1.5 text-xs lg:text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === link.href
                  ? "text-primary font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {/* Real-time Bid & Order Notification Bell */}
          <NotificationBell />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 border-primary/30">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <User className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="max-w-[110px] truncate">{user.name}</span>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 capitalize bg-primary/10 text-primary">
                    {user.role || 'farmer'}
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => navigate("/profile")} className="gap-2 cursor-pointer font-medium text-primary">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  {t("nav.profile", "Profile & KYC Center")}
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => navigate("/settings")} className="gap-2 cursor-pointer font-medium">
                  <SettingsIcon className="h-4 w-4 text-primary" />
                  {t("nav.settings", "Settings & Language")}
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => navigate(getDashboardLink())} className="gap-2 cursor-pointer">
                  {user.role === 'buyer' ? <ShoppingBag className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  {user.role === 'buyer' ? 'Procurement Orders' : 'Dashboard'}
                </DropdownMenuItem>

                {user.role === 'farmer' && (
                  <DropdownMenuItem onClick={() => navigate("/farmer/add-crop")} className="gap-2 cursor-pointer">
                    <PlusCircle className="h-4 w-4" />
                    Add New Crop
                  </DropdownMenuItem>
                )}

                {user.role === 'buyer' && (
                  <DropdownMenuItem onClick={() => navigate("/buyer/marketplace")} className="gap-2 cursor-pointer">
                    <TrendingUp className="h-4 w-4" />
                    Marketplace
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Switch Active Role (सिम्युलेटर)
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={() => switchDemoRole("farmer")} className="gap-2 cursor-pointer">
                  <Tractor className="h-4 w-4 text-emerald-600" />
                  <span className="flex-1">Farmer Mode</span>
                  {user.role === "farmer" && <Check className="h-3.5 w-3.5 text-emerald-600 font-bold" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => switchDemoRole("buyer")} className="gap-2 cursor-pointer">
                  <Building className="h-4 w-4 text-emerald-600" />
                  <span className="flex-1">Buyer / Trader</span>
                  {user.role === "buyer" && <Check className="h-3.5 w-3.5 text-emerald-600 font-bold" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => switchDemoRole("logistics")} className="gap-2 cursor-pointer">
                  <Truck className="h-4 w-4 text-emerald-600" />
                  <span className="flex-1">Logistics Carrier</span>
                  {user.role === "logistics" && <Check className="h-3.5 w-3.5 text-emerald-600 font-bold" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => switchDemoRole("storage")} className="gap-2 cursor-pointer">
                  <Warehouse className="h-4 w-4 text-emerald-600" />
                  <span className="flex-1">Cold Storage</span>
                  {user.role === "storage" && <Check className="h-3.5 w-3.5 text-emerald-600 font-bold" />}
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 gap-2 cursor-pointer">
                  <LogOut className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Navigation Header Items */}
        <div className="flex items-center gap-2 md:hidden">
          <NotificationBell />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
          <SheetContent side="right" className="w-80 overflow-y-auto">
            <div className="flex flex-col gap-6 pt-6">
              <Link to="/" className="flex items-center gap-2.5" onClick={() => setIsOpen(false)}>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-white/95 p-1 shadow-xs border border-border/50">
                  <img 
                    src="/logo-icon.png" 
                    alt="Kisan Bazaar Logo" 
                    className="h-full w-full object-contain" 
                  />
                </div>
                <span className="font-serif text-xl font-bold text-foreground">Kisan<span className="text-primary">Bazaar</span></span>
              </Link>

              <div className="flex flex-col gap-2">
                {dynamicNavLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent ${
                      location.pathname === link.href
                        ? "bg-accent text-accent-foreground font-semibold"
                        : "text-muted-foreground"
                    }`}
                  >
                    <link.icon className="h-5 w-5 text-primary" />
                    {link.label}
                  </Link>
                ))}

                <Link
                  to="/settings"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent text-muted-foreground"
                >
                  <SettingsIcon className="h-5 w-5 text-primary" />
                  <span>{t("nav.settings", "Settings")}</span>
                </Link>
              </div>

              <div className="flex flex-col gap-3 border-t border-border pt-4">
                {user ? (
                  <>
                    <div className="px-2 text-sm font-medium text-muted-foreground">Signed in as {user.name} ({user.role})</div>
                    
                    {/* Quick Role Simulator for Mobile */}
                    <div className="px-2 py-1 bg-muted/40 rounded-xl border border-border/50">
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase mb-1.5">Switch Persona</p>
                      <div className="grid grid-cols-2 gap-1.5">
                        <Button
                          size="sm"
                          variant={user.role === "farmer" ? "default" : "outline"}
                          className="h-7 text-[11px] justify-start gap-1"
                          onClick={() => { switchDemoRole("farmer"); setIsOpen(false); }}
                        >
                          <Tractor className="h-3 w-3" /> Farmer
                        </Button>
                        <Button
                          size="sm"
                          variant={user.role === "buyer" ? "default" : "outline"}
                          className="h-7 text-[11px] justify-start gap-1"
                          onClick={() => { switchDemoRole("buyer"); setIsOpen(false); }}
                        >
                          <Building className="h-3 w-3" /> Buyer
                        </Button>
                        <Button
                          size="sm"
                          variant={user.role === "logistics" ? "default" : "outline"}
                          className="h-7 text-[11px] justify-start gap-1"
                          onClick={() => { switchDemoRole("logistics"); setIsOpen(false); }}
                        >
                          <Truck className="h-3 w-3" /> Logistics
                        </Button>
                        <Button
                          size="sm"
                          variant={user.role === "storage" ? "default" : "outline"}
                          className="h-7 text-[11px] justify-start gap-1"
                          onClick={() => { switchDemoRole("storage"); setIsOpen(false); }}
                        >
                          <Warehouse className="h-3 w-3" /> Storage
                        </Button>
                      </div>
                    </div>

                    <Button
                      variant="default"
                      className="w-full justify-start gap-2"
                      onClick={() => {
                        navigate("/profile");
                        setIsOpen(false);
                      }}
                    >
                      <ShieldCheck className="h-4 w-4" />
                      {t("nav.profile", "Profile & KYC Center")}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                      onClick={() => {
                        navigate("/settings");
                        setIsOpen(false);
                      }}
                    >
                      <SettingsIcon className="h-4 w-4" />
                      {t("nav.settings", "Settings & Language")}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                      onClick={() => {
                        navigate(getDashboardLink());
                        setIsOpen(false);
                      }}
                    >
                      {user.role === 'buyer' ? <ShoppingBag className="h-4 w-4" /> : <User className="h-4 w-4" />}
                      {user.role === 'buyer' ? 'Procurement Orders' : 'Dashboard'}
                    </Button>
                    <Button
                      variant="destructive"
                      className="w-full justify-start gap-2"
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full justify-start gap-2">
                        Login
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setIsOpen(false)}>
                      <Button className="w-full justify-start gap-2">
                        Register
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      </div>
    </nav>
  );
}

