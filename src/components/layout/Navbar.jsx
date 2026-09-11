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
  const { user, logout } = useAuth();
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
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Leaf className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="font-serif text-xl font-bold text-foreground">
            KisanBazaar
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

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 overflow-y-auto">
            <div className="flex flex-col gap-6 pt-6">
              <Link to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                  <Leaf className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="font-serif text-xl font-bold">KisanBazaar</span>
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
    </nav>
  );
}

