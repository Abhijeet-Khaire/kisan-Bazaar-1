import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Gavel,
  Package,
  Truck,
  IndianRupee,
  CheckCircle2,
  AlertTriangle,
  Check,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Search,
  Filter,
  Smartphone,
  MessageSquare,
  Mail,
  Warehouse,
  Sparkles,
  Clock
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useGlobalState } from "@/context/GlobalState";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

export function ProfileNotificationsTab() {
  const { user } = useAuth();
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    acceptBid
  } = useGlobalState();
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [onlyUnread, setOnlyUnread] = useState(false);

  // Communication channel toggles state
  const [channels, setChannels] = useState({
    smsBids: true,
    whatsappDispatches: true,
    emailInvoices: true,
    browserSound: true
  });

  const role = user?.role || "farmer";
  const currentUid = user?.uid || (role === "farmer" ? "F001" : "BU001");

  // Notifications relevant to current user
  const userNotifications = notifications.filter(n => {
    if (n.recipientId === currentUid) return true;
    if (n.recipientRole === role) return true;
    if (n.recipientId === "all" || n.recipientRole === "all") return true;
    return false;
  });

  const unreadCount = userNotifications.filter(n => !n.read).length;

  const filteredList = userNotifications.filter(n => {
    // Unread toggle
    if (onlyUnread && n.read) return false;

    // Filter categories
    if (activeFilter === "bids" && !n.type?.includes("bid") && !n.badge?.toLowerCase().includes("bid")) {
      return false;
    }
    if (activeFilter === "orders" && !n.type?.includes("order") && !n.type?.includes("consignment") && !n.type?.includes("payment")) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = n.title?.toLowerCase().includes(q);
      const matchMsg = n.message?.toLowerCase().includes(q);
      const matchBadge = n.badge?.toLowerCase().includes(q);
      if (!matchTitle && !matchMsg && !matchBadge) return false;
    }

    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case "bid_received":
      case "bid_placed":
      case "bid_won":
        return <Gavel className="h-5 w-5 text-amber-500" />;
      case "outbid":
      case "bid_rejected":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "order_created":
      case "order_updated":
        return <Package className="h-5 w-5 text-emerald-500" />;
      case "consignment_assigned":
        return <Truck className="h-5 w-5 text-blue-500" />;
      case "payment_credited":
      case "escrow_settled":
        return <IndianRupee className="h-5 w-5 text-emerald-600" />;
      case "storage_intake":
        return <Warehouse className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-emerald-500/5 to-teal-500/10 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="secondary" className="bg-primary/20 text-primary font-bold px-2 py-0.5">
                Real-Time Notification Hub
              </Badge>
              {unreadCount > 0 && (
                <Badge className="bg-red-600 text-white font-semibold text-xs px-2">
                  {unreadCount} Unread
                </Badge>
              )}
            </div>
            <h2 className="font-serif text-2xl font-bold text-foreground">
              Auction & Logistics Notification Center
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Instant alerts for live bids, outbid warnings, freight assignments, weighbridge receipts, and direct DBT bank payouts.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 rounded-xl border-primary/40 text-primary hover:bg-primary/10 text-xs"
                onClick={() => markAllAsRead(currentUid, role)}
              >
                <Check className="h-4 w-4" /> Mark All as Read
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 rounded-xl text-destructive hover:bg-destructive/10 border-destructive/30 text-xs"
              onClick={() => clearNotifications(currentUid, role)}
            >
              <Trash2 className="h-4 w-4" /> Clear All
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Chips & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "all", label: `All Alerts (${userNotifications.length})` },
            { id: "bids", label: "Bids & Offers" },
            { id: "orders", label: "Shipments & Orders" },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeFilter === tab.id ? "default" : "outline"}
              size="sm"
              className={cn(
                "rounded-xl text-xs font-medium h-8",
                activeFilter === tab.id ? "bg-primary text-primary-foreground" : "border-border/70"
              )}
              onClick={() => setActiveFilter(tab.id)}
            >
              {tab.label}
            </Button>
          ))}

          <Button
            variant={onlyUnread ? "secondary" : "ghost"}
            size="sm"
            className="rounded-xl text-xs h-8 border border-border/50"
            onClick={() => setOnlyUnread(!onlyUnread)}
          >
            {onlyUnread ? "✓ Showing Unread Only" : "Show Unread Only"}
          </Button>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 text-xs h-8 bg-background rounded-xl"
          />
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredList.length === 0 ? (
          <Card className="p-12 text-center border-dashed rounded-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground mb-3">
              <CheckCircle2 className="h-7 w-7 text-muted-foreground/70" />
            </div>
            <p className="font-semibold text-foreground text-base">You're completely up to date!</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              No notifications matching your filter criteria. New bids and order status updates will appear here automatically.
            </p>
          </Card>
        ) : (
          filteredList.map((notif) => {
            const isUnread = !notif.read;

            return (
              <div
                key={notif.id}
                onClick={() => markAsRead(notif.id)}
                className={cn(
                  "group relative rounded-2xl border p-4 sm:p-5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer border-l-4",
                  isUnread
                    ? "bg-emerald-500/10 dark:bg-emerald-500/15 border-border border-l-emerald-600 dark:border-l-emerald-400 shadow-xs ring-1 ring-emerald-500/20"
                    : "bg-card border-border/80 hover:bg-muted/40 border-l-transparent opacity-90"
                )}
              >
                {/* Left side: icon & details */}
                <div className="flex items-start gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-background border border-border/80 shadow-xs mt-0.5 text-foreground">
                    {getIcon(notif.type)}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h4 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                        {notif.title}
                        {isUnread && (
                          <span className="h-2 w-2 rounded-full bg-emerald-600 dark:bg-emerald-400 inline-block shrink-0 animate-pulse" />
                        )}
                      </h4>
                      {notif.badge && (
                        <Badge variant="outline" className="text-[10px] px-2 py-0.5 bg-background font-semibold border-border text-foreground">
                          {notif.badge}
                        </Badge>
                      )}
                    </div>

                    <p className="text-xs font-medium text-foreground/80 dark:text-foreground/85 leading-relaxed max-w-2xl">
                      {notif.message}
                    </p>

                    <p className="text-[11px] text-muted-foreground font-medium mt-1.5 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {notif.timestamp ? formatDistanceToNow(new Date(notif.timestamp), { addSuffix: true }) : "Recently"}
                    </p>
                  </div>
                </div>

                {/* Right side: quick actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {/* Farmer quick accept if bid received */}
                  {role === "farmer" && notif.type === "bid_received" && notif.cropId && notif.bidId && (
                    <Button
                      size="sm"
                      className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        acceptBid(notif.cropId, notif.bidId);
                        markAsRead(notif.id);
                      }}
                    >
                      <Check className="h-3.5 w-3.5" /> Accept Bid
                    </Button>
                  )}

                  {notif.cropId && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs rounded-xl gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/farmer/crop/${notif.cropId}`);
                      }}
                    >
                      View Crop <ExternalLink className="h-3 w-3" />
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 text-xs px-2 text-muted-foreground hover:text-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsRead(notif.id);
                    }}
                  >
                    {isUnread ? "Mark Read" : <Check className="h-3.5 w-3.5 text-emerald-600" />}
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Notification Delivery Preferences Card */}
      <Card className="rounded-2xl border border-border/80 bg-muted/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-primary" />
            Direct Multichannel Dispatch Preferences
          </CardTitle>
          <CardDescription className="text-xs">
            Configure how KisanBazaar delivers live auction bids and e-Weighbridge alerts directly to your mobile device.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-background border border-border/60">
              <div className="flex items-center gap-2.5">
                <Smartphone className="h-4 w-4 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">SMS Mandi Alerts</p>
                  <p className="text-muted-foreground text-[11px]">+91 98765 43210</p>
                </div>
              </div>
              <Switch
                checked={channels.smsBids}
                onCheckedChange={(val) => setChannels(prev => ({ ...prev, smsBids: val }))}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-background border border-border/60">
              <div className="flex items-center gap-2.5">
                <MessageSquare className="h-4 w-4 text-emerald-600" />
                <div>
                  <p className="font-semibold text-foreground">WhatsApp KisanBot</p>
                  <p className="text-muted-foreground text-[11px]">Instant PDFs & Slips</p>
                </div>
              </div>
              <Switch
                checked={channels.whatsappDispatches}
                onCheckedChange={(val) => setChannels(prev => ({ ...prev, whatsappDispatches: val }))}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-background border border-border/60">
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="font-semibold text-foreground">Email Tax Invoices</p>
                  <p className="text-muted-foreground text-[11px]">Daily Statements</p>
                </div>
              </div>
              <Switch
                checked={channels.emailInvoices}
                onCheckedChange={(val) => setChannels(prev => ({ ...prev, emailInvoices: val }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
