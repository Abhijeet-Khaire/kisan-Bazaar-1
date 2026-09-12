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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
        className="w-80 sm:w-96 p-0 shadow-2xl rounded-2xl border border-border/80 bg-card/98 backdrop-blur-xl z-50 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 bg-muted/40 p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Bell className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                Notifications
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="bg-primary/15 text-primary text-[10px] font-bold px-1.5 py-0 h-4">
                    {unreadCount} New
                  </Badge>
                )}
              </h4>
              <p className="text-[11px] text-muted-foreground capitalize">
                Showing alerts for {user?.name ? user.name.split(" ")[0] : "User"} ({currentRole})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs px-2 text-primary hover:text-primary hover:bg-primary/10"
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
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              onClick={() => clearNotifications(currentUid, currentRole)}
              title="Clear all"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="border-b border-border/50 bg-background/50 px-3 py-2">
          <Tabs value={filter} onValueChange={setFilter} className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-7 p-0.5 bg-muted/50 rounded-lg">
              <TabsTrigger value="all" className="text-xs h-6 rounded-md">
                All ({userNotifications.length})
              </TabsTrigger>
              <TabsTrigger value="bids" className="text-xs h-6 rounded-md">
                Bids
              </TabsTrigger>
              <TabsTrigger value="orders" className="text-xs h-6 rounded-md">
                Orders
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Notification List */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-border/40 scroll-smooth">
          {filteredList.length === 0 ? (
            <div className="py-12 px-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted/60 text-muted-foreground mb-3">
                <CheckCircle2 className="h-6 w-6 text-muted-foreground/60" />
              </div>
              <p className="text-sm font-medium text-foreground">All caught up!</p>
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
                    "group relative p-3.5 transition-colors hover:bg-accent/40 cursor-pointer flex items-start gap-3 text-left",
                    isUnread ? "bg-primary/[0.03] dark:bg-primary/[0.06]" : "opacity-85"
                  )}
                >
                  {/* Left Icon Badge */}
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-background border border-border/60 shadow-xs mt-0.5">
                    {getIcon(notif.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-xs font-semibold text-foreground truncate flex items-center gap-1.5">
                        {notif.title}
                        {isUnread && (
                          <span className="inline-block h-2 w-2 rounded-full bg-primary shrink-0" />
                        )}
                      </span>
                      {notif.badge && (
                        <Badge variant="outline" className="text-[9px] px-1.5 py-0 shrink-0 font-medium bg-muted/40">
                          {notif.badge}
                        </Badge>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {notif.message}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-border/30 text-[11px] text-muted-foreground">
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
                          <Button size="sm" variant="default" className="h-6 text-[10px] px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md">
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
        </div>

        {/* Footer Link */}
        <div className="border-t border-border/60 bg-muted/30 p-2.5 text-center flex items-center justify-between px-4">
          <button
            onClick={() => {
              setOpen(false);
              navigate("/profile");
            }}
            className="text-xs text-primary hover:underline font-medium flex items-center gap-1 cursor-pointer"
          >
            <span>Orders & Bids Center</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
          <span className="text-[10px] text-muted-foreground">
            KisanBazaar Realtime v2.4
          </span>
        </div>
      </PopoverContent>
    </Popover>
  );
}
