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
  ChevronRight,
  ShieldCheck,
  Warehouse
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useGlobalState } from "@/context/GlobalState";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

export function NotificationBell({ className }) {
  const { user } = useAuth();
  const { notifications, markAsRead, markAllAsRead, clearNotifications, acceptBid } = useGlobalState();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  const currentRole = user?.role || "farmer";
  const currentUid = user?.uid || (currentRole === "farmer" ? "F001" : "BU001");

  // Filter notifications relevant to this user or role
  const userNotifications = notifications.filter(n => {
    if (n.recipientId === currentUid) return true;
    if (n.recipientRole === currentRole) return true;
    if (n.recipientId === "all" || n.recipientRole === "all") return true;
    return false;
  });

  const unreadCount = userNotifications.filter(n => !n.read).length;

  const filteredList = userNotifications.filter(n => {
    if (filter === "all") return true;
    if (filter === "bids") {
      return n.type?.includes("bid") || n.badge?.toLowerCase().includes("bid");
    }
    if (filter === "orders") {
      return (
        n.type?.includes("order") ||
        n.type?.includes("consignment") ||
        n.type?.includes("storage") ||
        n.type?.includes("payment") ||
        n.badge?.toLowerCase().includes("dispatch") ||
        n.badge?.toLowerCase().includes("order")
      );
    }
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case "bid_received":
      case "bid_placed":
      case "bid_won":
        return <Gavel className="h-4 w-4 text-amber-500" />;
      case "outbid":
      case "bid_rejected":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "order_created":
      case "order_updated":
        return <Package className="h-4 w-4 text-emerald-500" />;
      case "consignment_assigned":
        return <Truck className="h-4 w-4 text-blue-500" />;
      case "payment_credited":
      case "escrow_settled":
        return <IndianRupee className="h-4 w-4 text-emerald-600" />;
      case "storage_intake":
        return <Warehouse className="h-4 w-4 text-purple-500" />;
      default:
        return <Bell className="h-4 w-4 text-primary" />;
    }
  };

  const handleNotificationClick = (notif) => {
    markAsRead(notif.id);
    setOpen(false);
    if (notif.link) {
      navigate(notif.link);
    } else if (notif.orderId) {
      navigate("/profile");
    } else if (notif.cropId) {
      navigate(`/farmer/crop/${notif.cropId}`);
    } else {
      navigate("/profile");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "relative rounded-xl border-border/80 hover:bg-accent/40 transition-all cursor-pointer",
            unreadCount > 0 && "border-primary/40 bg-primary/5",
            className
          )}
          aria-label={`Notifications (${unreadCount} unread)`}
        >
          <Bell className={cn("h-4 w-4 text-foreground transition-transform", unreadCount > 0 && "text-primary animate-bounce-short")} />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-bold text-white shadow-md ring-2 ring-background animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-80 sm:w-96 p-0 shadow-2xl rounded-2xl border-2 border-border bg-popover text-popover-foreground z-50 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-muted/70 dark:bg-muted/40 p-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Bell className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                Notifications
                {unreadCount > 0 && (
                  <Badge className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0 h-4 shadow-xs">
                    {unreadCount} New
                  </Badge>
                )}
              </h4>
              <p className="text-[11px] font-medium text-muted-foreground capitalize">
                Showing alerts for {user?.name ? user.name.split(" ")[0] : "User"} ({currentRole})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs px-2 font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-500/15"
                onClick={() => markAllAsRead(currentUid, currentRole)}
                title="Mark all as read"
              >
                <Check className="h-3.5 w-3.5 mr-1" />
                Read All
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={() => clearNotifications(currentUid, currentRole)}
              title="Clear all"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="border-b border-border bg-muted/30 px-3 py-2">
          <div
            role="tablist"
            aria-label="Filter notifications"
            className="relative grid w-full grid-cols-3 h-8 p-1 bg-muted/90 dark:bg-muted/60 rounded-xl border border-border/60 select-none"
          >
            {[
              { id: "all", label: `All (${userNotifications.length})` },
              { id: "bids", label: "Bids" },
              { id: "orders", label: "Orders" },
            ].map((tab) => {
              const isActive = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setFilter(tab.id)}
                  className={cn(
                    "relative flex items-center justify-center text-xs font-semibold h-6 rounded-lg transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 cursor-pointer",
                    isActive
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNotificationFilterTab"
                      className="absolute inset-0 bg-background rounded-lg shadow-sm border border-border/40"
                      transition={{
                        type: "spring",
                        stiffness: 480,
                        damping: 34,
                        mass: 0.8,
                      }}
                    />
                  )}
                  <span className="relative z-10 truncate px-1">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Notification List */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-border/60 scroll-smooth bg-card">
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15, ease: "easeInOut" }}
              className="divide-y divide-border/60"
            >
              {filteredList.length === 0 ? (
                <div className="py-12 px-4 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-3">
                    <CheckCircle2 className="h-6 w-6 text-muted-foreground/70" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">All caught up!</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    No {filter !== "all" ? filter : ""} notifications at the moment.
                  </p>
                </div>
              ) : (
                filteredList.map((notif) => {
                  const isUnread = !notif.read;
                  return (
                    <div
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif)}
                      className={cn(
                        "group relative p-3.5 transition-colors cursor-pointer flex items-start gap-3 text-left border-l-4",
                        isUnread
                          ? "bg-emerald-500/10 dark:bg-emerald-500/15 hover:bg-emerald-500/20 border-l-emerald-600 dark:border-l-emerald-400"
                          : "bg-card hover:bg-muted/40 border-l-transparent opacity-85"
                      )}
                    >
                      {/* Left Icon Badge */}
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-background border border-border/80 shadow-xs mt-0.5 text-foreground">
                        {getIcon(notif.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-xs font-bold text-foreground truncate flex items-center gap-1.5">
                            {notif.title}
                            {isUnread && (
                              <span className="inline-block h-2 w-2 rounded-full bg-emerald-600 dark:bg-emerald-400 shrink-0 animate-pulse" />
                            )}
                          </span>
                          {notif.badge && (
                            <Badge variant="outline" className="text-[10px] px-2 py-0.5 shrink-0 font-semibold bg-background border-border text-foreground">
                              {notif.badge}
                            </Badge>
                          )}
                        </div>

                        <p className="text-xs font-medium text-foreground/80 dark:text-foreground/85 leading-relaxed line-clamp-2">
                          {notif.message}
                        </p>

                        <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-border/50 text-[11px] text-muted-foreground font-medium">
                          <span>
                            {notif.timestamp ? formatDistanceToNow(new Date(notif.timestamp), { addSuffix: true }) : "Recently"}
                          </span>

                          {/* Interactive quick action if incoming bid on farmer's crop */}
                          {currentRole === "farmer" && notif.type === "bid_received" && notif.bidId && (
                            <div
                              className="flex items-center gap-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (notif.cropId && notif.bidId) {
                                  acceptBid(notif.cropId, notif.bidId);
                                  markAsRead(notif.id);
                                  setOpen(false);
                                  navigate("/profile");
                                }
                              }}
                            >
                              <Button size="sm" variant="default" className="h-6 text-[10px] px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md shadow-xs">
                                Accept Bid
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Link */}
        <div className="border-t border-border bg-muted/60 dark:bg-muted/30 p-2.5 text-center flex items-center justify-between px-4">
          <button
            onClick={() => {
              setOpen(false);
              navigate("/profile");
            }}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Orders & Bids Center</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
          <span className="text-[10px] font-semibold text-muted-foreground">
            KisanBazaar Realtime v2.4
          </span>
        </div>
      </PopoverContent>
    </Popover>
  );
}
