import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Gavel,
  Package,
  Truck,
  IndianRupee,
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  Calendar,
  FileText,
  ShieldCheck,
  AlertCircle,
  Download,
  Phone,
  Building,
  Check,
  X,
  TrendingUp,
  User,
  ArrowRight,
  Warehouse,
  Flame,
  Search,
  Filter
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useGlobalState } from "@/context/GlobalState";
import { useAuth } from "@/context/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ProfileOrdersTab() {
  const { user } = useAuth();
  const {
    crops,
    bids,
    orders,
    acceptBid,
    rejectBid,
    updateOrderStatus,
    releaseEscrow,
    placeBid
  } = useGlobalState();
  const navigate = useNavigate();

  const role = user?.role || "farmer";
  const currentUid = user?.uid || (role === "farmer" ? "F001" : "BU001");

  const [activeSubTab, setActiveSubTab] = useState(role === "farmer" ? "incoming_bids" : "orders");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Counter-bid modal state for buyers
  const [counterBidCrop, setCounterBidCrop] = useState(null);
  const [counterBidAmount, setCounterBidAmount] = useState("");

  // 1. FARMER DATA:
  // Farmer's listed crops and bids received on them
  const farmerCrops = crops.filter(c => c.farmerId === currentUid || c.farmerId === "F001");
  const farmerIncomingBids = bids.filter(b => farmerCrops.some(c => c.id === b.cropId));
  const farmerOrders = orders.filter(o => o.farmerId === currentUid || o.farmerId === "F001");

  // 2. BUYER DATA:
  // Bids placed by buyer and procurement orders
  const buyerBids = bids.filter(b => b.buyerId === currentUid || b.buyerId === "BU001");
  const buyerOrders = orders.filter(o => o.buyerId === currentUid || o.buyerId === "BU001");

  // 3. LOGISTICS DATA:
  const logisticsOrders = orders.filter(o => o.logisticsId === "L001" || role === "logistics");

  // 4. STORAGE DATA:
  const storageOrders = orders.filter(o => o.storageId === "S001" || role === "storage");

  // Stats calculation
  const totalBidsCount = role === "farmer" ? farmerIncomingBids.length : buyerBids.length;
  const activeOrdersCount = (
    role === "farmer" ? farmerOrders :
    role === "buyer" ? buyerOrders :
    role === "logistics" ? logisticsOrders : storageOrders
  ).filter(o => o.status !== "completed").length;

  const totalValue = (
    role === "farmer" ? farmerOrders :
    role === "buyer" ? buyerOrders :
    role === "logistics" ? logisticsOrders : storageOrders
  ).reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

  const handleOpenCounterBid = (crop) => {
    setCounterBidCrop(crop);
    setCounterBidAmount(String((crop.currentBid || crop.floorPrice) + 100));
  };

  const handleConfirmCounterBid = () => {
    if (!counterBidCrop) return;
    const amount = Number(counterBidAmount);
    if (!amount || amount <= counterBidCrop.currentBid) {
      toast.error(`Counter bid must be higher than ₹${counterBidCrop.currentBid}`);
      return;
    }
    placeBid(counterBidCrop.id, amount, user?.name || "Agromart Buyer", user?.uid || "BU001");
    setCounterBidCrop(null);
  };

  const getOrderStatusStep = (status) => {
    switch (status) {
      case "logistics_pending": return 1;
      case "in_transit": return 2;
      case "delivered": return 3;
      case "completed": return 4;
      default: return 1;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner & Live Role Summary */}
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-emerald-500/5 to-teal-500/10 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="secondary" className="capitalize bg-primary/20 text-primary font-bold px-2 py-0.5">
                {role} Console
              </Badge>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> APMC Mandi Escrow Verified
              </span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-foreground">
              {role === "farmer" && "Farmer Crop Bids & Sales Fulfillment"}
              {role === "buyer" && "Buyer Auction Bids & Procurement Orders"}
              {role === "logistics" && "Logistics Freight Consignments & Dispatches"}
              {role === "storage" && "Warehouse Storage Orders & e-NWR Lots"}
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {role === "farmer" && "Receive buyer bids in real-time, accept offers to create dispatches, and track DBT payments."}
              {role === "buyer" && "Track live auction bids, monitor farm-to-factory shipments, and release escrow upon weighbridge inspection."}
              {role === "logistics" && "Manage crop hauling routes, update GPS transit milestones, and verify digital e-way bills."}
              {role === "storage" && "Maintain CA cold chamber intake receipts, dry silo allotments, and moisture monitoring."}
            </p>
          </div>

          {role === "farmer" && (
            <Link to="/farmer/add-crop">
              <Button className="gap-2 shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md">
                <Package className="h-4 w-4" /> Add New Crop Listing
              </Button>
            </Link>
          )}

          {role === "buyer" && (
            <Link to="/buyer/marketplace">
              <Button className="gap-2 shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md">
                <TrendingUp className="h-4 w-4" /> Explore Live Marketplace
              </Button>
            </Link>
          )}
        </div>

        {/* Quick KPI Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-border/60">
          <div className="bg-background/80 backdrop-blur rounded-xl p-3 border border-border/60">
            <p className="text-xs text-muted-foreground font-medium">
              {role === "farmer" ? "Bids Received" : "Bids Placed"}
            </p>
            <p className="text-xl font-bold text-foreground mt-0.5 flex items-center gap-1.5">
              <Gavel className="h-4 w-4 text-amber-500" /> {totalBidsCount}
            </p>
          </div>

          <div className="bg-background/80 backdrop-blur rounded-xl p-3 border border-border/60">
            <p className="text-xs text-muted-foreground font-medium">Active Shipments</p>
            <p className="text-xl font-bold text-primary mt-0.5 flex items-center gap-1.5">
              <Truck className="h-4 w-4 text-blue-500" /> {activeOrdersCount}
            </p>
          </div>

          <div className="bg-background/80 backdrop-blur rounded-xl p-3 border border-border/60">
            <p className="text-xs text-muted-foreground font-medium">Total Lot Volume</p>
            <p className="text-xl font-bold text-emerald-600 mt-0.5 flex items-center gap-1.5">
              <IndianRupee className="h-4 w-4 text-emerald-600" /> ₹{(totalValue / 1000).toFixed(0)}K
            </p>
          </div>

          <div className="bg-background/80 backdrop-blur rounded-xl p-3 border border-border/60">
            <p className="text-xs text-muted-foreground font-medium">Escrow Security</p>
            <p className="text-xl font-bold text-teal-600 mt-0.5 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-teal-600" /> 100% Guaranteed
            </p>
          </div>
        </div>
      </div>

      {/* Subtabs Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full sm:w-auto">
          <TabsList className="bg-muted/80 p-1 rounded-xl">
            {role === "farmer" && (
              <TabsTrigger value="incoming_bids" className="gap-2 text-xs sm:text-sm font-medium">
                <Gavel className="h-4 w-4 text-amber-500" />
                Incoming Bids ({farmerIncomingBids.filter(b => b.status === "active").length} Active)
              </TabsTrigger>
            )}

            {role === "buyer" && (
              <TabsTrigger value="my_bids" className="gap-2 text-xs sm:text-sm font-medium">
                <Gavel className="h-4 w-4 text-amber-500" />
                My Bids ({buyerBids.length})
              </TabsTrigger>
            )}

            <TabsTrigger value="orders" className="gap-2 text-xs sm:text-sm font-medium">
              <Package className="h-4 w-4 text-primary" />
              {role === "farmer" ? "Dispatches & Orders" :
               role === "buyer" ? "Procurement Orders" :
               role === "logistics" ? "Freight Shipments" : "Storage Lots"}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search & Filter bar */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search crop, lot or buyer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 text-xs h-9 bg-background rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. FARMER VIEW: INCOMING BIDS                                              */}
      {/* ========================================================================= */}
      {role === "farmer" && activeSubTab === "incoming_bids" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-foreground">Active Bids on Your Crop Listings</h3>
              <p className="text-xs text-muted-foreground">
                Buyers place live offers here. You can accept an offer immediately to convert it into a confirmed sale order.
              </p>
            </div>
            <Badge variant="outline" className="text-xs font-semibold">
              {farmerIncomingBids.length} Total Offers
            </Badge>
          </div>

          {farmerIncomingBids.length === 0 ? (
            <Card className="p-8 text-center border-dashed">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-3">
                <Gavel className="h-6 w-6" />
              </div>
              <p className="font-semibold text-foreground">No buyer bids received yet</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
                Once verified buyers browse the marketplace and submit bids on your listed crops, they will instantly appear here for your review and one-click acceptance.
              </p>
              <Button onClick={() => navigate("/farmer/add-crop")} className="mt-4 gap-2" size="sm">
                Add Crop to Receive Bids
              </Button>
            </Card>
          ) : (
            <div className="grid gap-4">
              {farmerIncomingBids
                .filter(b => {
                  const crop = crops.find(c => c.id === b.cropId);
                  const searchStr = `${crop?.name} ${b.buyerName} ${b.cropId}`.toLowerCase();
                  return searchStr.includes(searchTerm.toLowerCase());
                })
                .map((bid) => {
                  const crop = crops.find(c => c.id === bid.cropId);
                  const floor = crop?.floorPrice || 3500;
                  const percentOverFloor = Math.round(((bid.amount - floor) / floor) * 100);
                  const totalLotAmount = (bid.amount * (crop?.quantity || 50));
                  const isWon = bid.status === "won";
                  const isOutbid = bid.status === "outbid";
                  const isRejected = bid.status === "rejected";

                  return (
                    <motion.div
                      key={bid.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "rounded-2xl border p-4 sm:p-5 transition-all",
                        isWon ? "border-emerald-500/50 bg-emerald-50/40 dark:bg-emerald-950/20" :
                        bid.status === "active" ? "border-border/80 bg-card hover:border-primary/50 shadow-xs" :
                        "border-border/40 bg-muted/20 opacity-75"
                      )}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        {/* Crop and Buyer Info */}
                        <div className="flex items-start gap-3.5">
                          <img
                            src={crop?.imageUrl || "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200"}
                            alt={crop?.name}
                            className="h-16 w-16 rounded-xl object-cover border border-border/60 shrink-0"
                          />
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h4 className="font-semibold text-foreground text-base">
                                {crop?.name || "Crop Lot"}
                              </h4>
                              <Badge variant="outline" className="text-[10px] font-medium">
                                {crop?.quantity || 50} {crop?.unit || "quintal"} · Grade {crop?.quality || "A"}
                              </Badge>
                              {isWon && (
                                <Badge className="bg-emerald-600 text-white text-[10px]">
                                  <Check className="h-3 w-3 mr-1" /> Offer Accepted
                                </Badge>
                              )}
                              {isOutbid && (
                                <Badge variant="secondary" className="text-[10px] text-muted-foreground">
                                  Outbid
                                </Badge>
                              )}
                              {isRejected && (
                                <Badge variant="destructive" className="text-[10px]">
                                  Declined
                                </Badge>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1 font-medium text-foreground">
                                <Building className="h-3.5 w-3.5 text-primary" />
                                {bid.buyerName}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {formatDistanceToNow(new Date(bid.timestamp), { addSuffix: true })}
                              </span>
                              <span>•</span>
                              <span>Floor: ₹{floor.toLocaleString()}/{crop?.unit || "q"}</span>
                            </div>
                          </div>
                        </div>

                        {/* Price & Action Section */}
                        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-border/60 gap-2">
                          <div className="text-left sm:text-right">
                            <div className="flex items-baseline sm:justify-end gap-1.5">
                              <span className="text-lg sm:text-xl font-bold text-primary">
                                ₹{bid.amount.toLocaleString()}
                              </span>
                              <span className="text-xs text-muted-foreground">/ {crop?.unit || "q"}</span>
                              {percentOverFloor > 0 && (
                                <span className="text-xs font-semibold text-emerald-600">
                                  (+{percentOverFloor}%)
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground font-medium">
                              Total Lot: <strong className="text-foreground">₹{totalLotAmount.toLocaleString()}</strong>
                            </p>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2">
                            {bid.status === "active" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="default"
                                  className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5 rounded-xl px-3 cursor-pointer shadow-xs"
                                  onClick={() => acceptBid(crop?.id, bid.id)}
                                >
                                  <Check className="h-3.5 w-3.5" />
                                  Accept Bid
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 text-xs text-destructive hover:bg-destructive/10 border-destructive/30 rounded-xl px-2.5 cursor-pointer"
                                  onClick={() => rejectBid(crop?.id, bid.id)}
                                >
                                  <X className="h-3.5 w-3.5" />
                                </Button>
                              </>
                            )}

                            {isWon && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 text-xs gap-1 border-emerald-500/40 text-emerald-700 dark:text-emerald-300"
                                onClick={() => setActiveSubTab("orders")}
                              >
                                View Order <ArrowRight className="h-3.5 w-3.5" />
                              </Button>
                            )}

                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 text-xs px-2"
                              onClick={() => navigate(`/farmer/crop/${crop?.id}`)}
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. BUYER VIEW: MY BIDS                                                     */}
      {/* ========================================================================= */}
      {role === "buyer" && activeSubTab === "my_bids" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-foreground">My Live Auction Bids</h3>
              <p className="text-xs text-muted-foreground">
                Bids submitted by you across APMC electronic mandis. When a farmer accepts your bid, an Escrow-protected order is generated.
              </p>
            </div>
            <Badge variant="outline" className="text-xs">
              {buyerBids.length} Active Bids
            </Badge>
          </div>

          {buyerBids.length === 0 ? (
            <Card className="p-8 text-center border-dashed">
              <p className="font-semibold text-foreground">You haven't placed any bids yet</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
                Explore the crop marketplace to find fresh grains, pulses, and oilseeds directly from verified farmers across India.
              </p>
              <Link to="/buyer/marketplace">
                <Button className="mt-4 gap-2" size="sm">
                  Go to Marketplace
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid gap-4">
              {buyerBids.map((bid) => {
                const crop = crops.find(c => c.id === bid.cropId);
                const isHighest = crop && crop.currentBid <= bid.amount;
                const isWon = bid.status === "won";
                const isOutbid = bid.status === "outbid" || (!isHighest && !isWon);

                return (
                  <div
                    key={bid.id}
                    className={cn(
                      "rounded-2xl border p-4 sm:p-5 transition-all bg-card",
                      isWon ? "border-emerald-500 bg-emerald-50/20" :
                      isOutbid ? "border-amber-500/40 bg-amber-50/15" :
                      "border-primary/40 bg-primary/[0.02]"
                    )}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3.5">
                        <img
                          src={crop?.imageUrl || "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200"}
                          alt={crop?.name}
                          className="h-16 w-16 rounded-xl object-cover border border-border/60 shrink-0"
                        />
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h4 className="font-semibold text-foreground text-base">
                              {crop?.name || "Agricultural Lot"}
                            </h4>
                            <Badge variant="outline" className="text-[10px]">
                              {crop?.quantity || 50} {crop?.unit || "quintal"} · {crop?.variety || "Standard"}
                            </Badge>

                            {isWon ? (
                              <Badge className="bg-emerald-600 text-white text-[10px]">
                                <CheckCircle2 className="h-3 w-3 mr-1" /> Won & Converted to Order
                              </Badge>
                            ) : isOutbid ? (
                              <Badge variant="destructive" className="text-[10px] bg-amber-600 text-white">
                                <AlertCircle className="h-3 w-3 mr-1" /> Outbid
                              </Badge>
                            ) : (
                              <Badge className="bg-primary text-primary-foreground text-[10px]">
                                Highest Active Bid
                              </Badge>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground">
                            <span>Farmer: <strong className="text-foreground">{crop?.farmerName || "Rajesh Kumar"}</strong></span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {crop?.location || "Karnal"}, {crop?.state || "Haryana"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-border/60 gap-2">
                        <div className="text-left sm:text-right">
                          <p className="text-xs text-muted-foreground">Your Bid Rate</p>
                          <p className="text-lg font-bold text-primary">₹{bid.amount.toLocaleString()} / {crop?.unit || "q"}</p>
                          <p className="text-[11px] text-muted-foreground">
                            Lot Total: ₹{(bid.amount * (crop?.quantity || 50)).toLocaleString()}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          {isOutbid && crop && (
                            <Button
                              size="sm"
                              className="h-8 text-xs bg-amber-600 hover:bg-amber-700 text-white rounded-xl gap-1"
                              onClick={() => handleOpenCounterBid(crop)}
                            >
                              <TrendingUp className="h-3.5 w-3.5" /> Increase Bid
                            </Button>
                          )}

                          {isWon && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-xs gap-1 border-emerald-500/50 text-emerald-700"
                              onClick={() => setActiveSubTab("orders")}
                            >
                              Track Order <ArrowRight className="h-3.5 w-3.5" />
                            </Button>
                          )}

                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 text-xs"
                            onClick={() => navigate(`/farmer/crop/${crop?.id}`)}
                          >
                            View Auction
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. UNIFIED ORDERS FULFILLMENT TAB (FOR ALL USER TYPES)                     */}
      {/* ========================================================================= */}
      {activeSubTab === "orders" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-semibold text-foreground">
                {role === "farmer" && "Sales Orders & Mandi Dispatches"}
                {role === "buyer" && "Procurement Orders & Shipments"}
                {role === "logistics" && "Assigned Freight Consignments"}
                {role === "storage" && "Warehouse Grain Storage Bookings"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {role === "farmer" && "Track weighbridge inspection slips, logistics pickups, and DBT direct bank settlement."}
                {role === "buyer" && "Verify truck dispatch, inspect digital weighbridge certificates, and release escrow."}
                {role === "logistics" && "Update pickup milestones, verify e-Way bills, and confirm warehouse delivery."}
                {role === "storage" && "Monitor cold storage chambers, e-NWR compliance, and outbound releases."}
              </p>
            </div>

            <div className="flex items-center gap-1.5 self-start sm:self-auto">
              <Button
                variant={statusFilter === "all" ? "secondary" : "ghost"}
                size="sm"
                className="h-7 text-xs px-2.5 rounded-lg"
                onClick={() => setStatusFilter("all")}
              >
                All
              </Button>
              <Button
                variant={statusFilter === "in_transit" ? "secondary" : "ghost"}
                size="sm"
                className="h-7 text-xs px-2.5 rounded-lg"
                onClick={() => setStatusFilter("in_transit")}
              >
                In Transit
              </Button>
              <Button
                variant={statusFilter === "completed" ? "secondary" : "ghost"}
                size="sm"
                className="h-7 text-xs px-2.5 rounded-lg"
                onClick={() => setStatusFilter("completed")}
              >
                Completed
              </Button>
            </div>
          </div>

          {/* Orders List for current role */}
          {(() => {
            const roleOrdersList = (
              role === "farmer" ? farmerOrders :
              role === "buyer" ? buyerOrders :
              role === "logistics" ? logisticsOrders : storageOrders
            ).filter(o => {
              const matchesSearch =
                o.cropName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                o.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                o.farmerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                o.buyerName?.toLowerCase().includes(searchTerm.toLowerCase());

              const matchesStatus = statusFilter === "all" || o.status === statusFilter;
              return matchesSearch && matchesStatus;
            });

            if (roleOrdersList.length === 0) {
              return (
                <Card className="p-8 text-center border-dashed">
                  <Package className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p className="font-semibold text-foreground">No orders matching this filter</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    When bids are accepted, orders appear here with full tracking and documentation.
                  </p>
                </Card>
              );
            }

            return (
              <div className="grid gap-5">
                {roleOrdersList.map((order) => {
                  const step = getOrderStatusStep(order.status);
                  const isDelivered = order.status === "delivered" || order.status === "completed";
                  const isEscrowReleased = order.escrowStatus === "released";

                  return (
                    <Card key={order.id} className="overflow-hidden border border-border/80 shadow-xs hover:border-primary/40 transition-all rounded-2xl">
                      <CardHeader className="bg-muted/30 p-4 sm:p-5 border-b border-border/50">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold">
                              <Package className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-sm font-bold text-foreground">#{order.id}</span>
                                <Badge
                                  className={cn(
                                    "text-[10px] font-semibold capitalize",
                                    order.status === "completed" ? "bg-emerald-600 text-white" :
                                    order.status === "in_transit" ? "bg-blue-600 text-white" :
                                    order.status === "delivered" ? "bg-teal-600 text-white" :
                                    "bg-amber-500 text-white"
                                  )}
                                >
                                  {order.status.replace("_", " ")}
                                </Badge>
                                {isEscrowReleased && (
                                  <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/20">
                                    <Check className="h-3 w-3 mr-1" /> DBT Settled
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                Booked on {order.orderDate} · Delivery ETA: {order.deliveryDate}
                              </p>
                            </div>
                          </div>

                          <div className="text-left sm:text-right">
                            <span className="text-xs text-muted-foreground">Total Settlement Value</span>
                            <p className="text-lg font-bold text-primary">₹{order.totalAmount?.toLocaleString()}</p>
                            <span className="text-[11px] text-muted-foreground">
                              (₹{order.finalPricePerUnit?.toLocaleString()} × {order.quantity} {order.unit})
                            </span>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="p-4 sm:p-6 space-y-5">
                        {/* 4-Step Visual Shipment Stepper */}
                        <div className="py-2">
                          <div className="relative flex items-center justify-between">
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 w-full bg-muted -z-0" />
                            <div
                              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary transition-all duration-500 -z-0"
                              style={{ width: `${((step - 1) / 3) * 100}%` }}
                            />

                            {[
                              { label: "Order Accepted", icon: CheckCircle2 },
                              { label: "Pickup & Weighbridge", icon: Truck },
                              { label: "In-Transit GPS", icon: MapPin },
                              { label: "Delivery & Payout", icon: IndianRupee },
                            ].map((s, idx) => {
                              const isCompleted = step > idx + 1;
                              const isCurrent = step === idx + 1;
                              const IconComponent = s.icon;

                              return (
                                <div key={idx} className="flex flex-col items-center relative z-10">
                                  <div
                                    className={cn(
                                      "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-all",
                                      isCompleted ? "bg-primary border-primary text-primary-foreground" :
                                      isCurrent ? "bg-background border-primary text-primary shadow-sm" :
                                      "bg-muted border-border text-muted-foreground"
                                    )}
                                  >
                                    <IconComponent className="h-3.5 w-3.5" />
                                  </div>
                                  <span className="text-[10px] sm:text-xs font-medium mt-1 text-center max-w-[80px] leading-tight text-foreground">
                                    {s.label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Order Specification Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-border/50 text-xs">
                          {/* Crop & Quality */}
                          <div className="p-3 bg-muted/20 rounded-xl space-y-1.5 border border-border/40">
                            <span className="text-muted-foreground font-medium flex items-center gap-1">
                              <Package className="h-3.5 w-3.5 text-primary" /> Crop Lot Specs
                            </span>
                            <p className="font-semibold text-foreground text-sm">{order.cropName}</p>
                            <p className="text-muted-foreground">
                              Quantity: <strong className="text-foreground">{order.quantity} {order.unit}</strong>
                            </p>
                            <p className="text-muted-foreground">
                              Verified Weight: <strong className="text-foreground">{order.verifiedWeight}</strong>
                            </p>
                            <p className="text-muted-foreground">
                              Moisture: <strong className="text-foreground">{order.moisturePercentage}</strong>
                            </p>
                          </div>

                          {/* Trading Counterparties */}
                          <div className="p-3 bg-muted/20 rounded-xl space-y-1.5 border border-border/40">
                            <span className="text-muted-foreground font-medium flex items-center gap-1">
                              <User className="h-3.5 w-3.5 text-primary" /> Trade Partners
                            </span>
                            <p className="text-muted-foreground">
                              Farmer: <strong className="text-foreground">{order.farmerName}</strong>
                            </p>
                            <p className="text-muted-foreground">
                              Pickup: <strong className="text-foreground">{order.farmerLocation}</strong>
                            </p>
                            <p className="text-muted-foreground">
                              Buyer: <strong className="text-foreground">{order.buyerName}</strong>
                            </p>
                            <p className="text-muted-foreground">
                              Destination: <strong className="text-foreground">{order.destination}</strong>
                            </p>
                          </div>

                          {/* Freight & Documentation */}
                          <div className="p-3 bg-muted/20 rounded-xl space-y-1.5 border border-border/40">
                            <span className="text-muted-foreground font-medium flex items-center gap-1">
                              <Truck className="h-3.5 w-3.5 text-primary" /> Logistics & Transit
                            </span>
                            <p className="text-muted-foreground">
                              Carrier: <strong className="text-foreground">{order.logisticsPartner}</strong>
                            </p>
                            <p className="text-muted-foreground">
                              Vehicle: <strong className="text-foreground">{order.vehicleNumber}</strong>
                            </p>
                            <p className="text-muted-foreground">
                              Tracking ID: <strong className="text-foreground font-mono">{order.trackingNumber}</strong>
                            </p>
                            <p className="text-muted-foreground">
                              Weighbridge Slip: <strong className="text-primary underline cursor-pointer">{order.weighbridgeSlip}</strong>
                            </p>
                          </div>
                        </div>

                        {/* Interactive Role Actions Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/50">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <ShieldCheck className="h-4 w-4 text-emerald-600" />
                            <span>
                              Escrow Status: <strong className="text-foreground capitalize">{order.escrowStatus.replace(/_/g, " ")}</strong>
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            {/* FARMER ACTIONS */}
                            {role === "farmer" && order.status === "logistics_pending" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 text-xs rounded-xl"
                                onClick={() => {
                                  updateOrderStatus(order.id, "in_transit");
                                  toast.success(`Consignment #${order.id} marked as dispatched!`);
                                }}
                              >
                                Mark Ready & Dispatched
                              </Button>
                            )}

                            {/* BUYER ACTIONS: RELEASE ESCROW */}
                            {role === "buyer" && order.escrowStatus === "held_in_escrow" && (
                              <Button
                                size="sm"
                                className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-1 shadow-xs"
                                onClick={() => releaseEscrow(order.id)}
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Verify Quality & Release Escrow
                              </Button>
                            )}

                            {/* LOGISTICS ACTIONS */}
                            {role === "logistics" && order.status === "in_transit" && (
                              <Button
                                size="sm"
                                className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-xl gap-1"
                                onClick={() => updateOrderStatus(order.id, "delivered")}
                              >
                                <Check className="h-3.5 w-3.5" /> Confirm Delivery
                              </Button>
                            )}

                            {/* STORAGE ACTIONS */}
                            {role === "storage" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 text-xs rounded-xl gap-1"
                                onClick={() => toast.success(`e-NWR receipt issued for ${order.cropName}`)}
                              >
                                <Warehouse className="h-3.5 w-3.5" /> Issue e-NWR Receipt
                              </Button>
                            )}

                            {/* Download Invoice / Pass */}
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-xs rounded-xl gap-1"
                              onClick={() => {
                                toast.success(`Mandi Gate Pass & Tax Invoice for #${order.id} downloaded.`);
                              }}
                            >
                              <Download className="h-3.5 w-3.5" /> Invoice & Pass
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}

      {/* Counter Bid Dialog for Buyers */}
      <Dialog open={!!counterBidCrop} onOpenChange={() => setCounterBidCrop(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Gavel className="h-5 w-5 text-primary" />
              Increase Auction Bid
            </DialogTitle>
            <DialogDescription>
              Counter previous bid on {counterBidCrop?.name} ({counterBidCrop?.variety}). Minimum next bid is ₹{((counterBidCrop?.currentBid || counterBidCrop?.floorPrice || 0) + 50).toLocaleString()}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="rounded-xl bg-muted/40 p-3 flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Current Highest Bid:</span>
              <span className="font-bold text-primary">₹{counterBidCrop?.currentBid?.toLocaleString()}</span>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">Your New Bid (₹ per {counterBidCrop?.unit || "quintal"})</label>
              <Input
                type="number"
                value={counterBidAmount}
                onChange={(e) => setCounterBidAmount(e.target.value)}
                placeholder="Enter amount"
                className="text-base font-semibold"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setCounterBidCrop(null)}>Cancel</Button>
            <Button onClick={handleConfirmCounterBid} className="bg-primary text-primary-foreground">
              Submit Counter Offer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
