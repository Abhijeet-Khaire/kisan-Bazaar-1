import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { CropCard } from "@/components/crops/CropCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useGlobalState } from "@/context/GlobalState";
import {
  ListPlus,
  Gavel,
  IndianRupee,
  TrendingUp,
  Package,
  Clock,
  CheckCircle,
  Eye,
  MoreVertical,
  Leaf
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

export default function FarmerDashboard() {
  const [activeTab, setActiveTab] = useState("active");
  const { user } = useAuth();
  const { crops, bids, farmerStats, extendAuction, cancelListing, confirmPayment } = useGlobalState();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Filter crops for "my listings" - simulating farmer's own crops (F001 is current user)
  const myListings = crops.filter(c => c.farmerId === "F001" || c.farmerId === "F002");
  const activeBids = bids.filter(b => myListings.some(c => c.id === b.cropId));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <Leaf className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-foreground">Welcome back, {user?.name || 'Farmer'}</h1>
              <p className="text-muted-foreground">Manage your crop listings and track bids</p>
            </div>
          </div>
          <Link to="/farmer/add-crop">
            <Button size="lg" className="gap-2">
              <ListPlus className="h-5 w-5" />
              Add New Crop
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Listings"
            value={farmerStats.totalListings}
            subtitle="4 active, 8 sold"
            icon={Package}
          />
          <StatsCard
            title="Active Bids"
            value={farmerStats.activeBids}
            subtitle="On your crops"
            icon={Gavel}
            variant="accent"
          />
          <StatsCard
            title="Total Earnings"
            value={`₹${(farmerStats.totalEarnings / 1000).toFixed(0)}K`}
            subtitle="This season"
            icon={IndianRupee}
            variant="primary"
          />
          <StatsCard
            title="Avg. Price Increase"
            value={`+${farmerStats.avgPriceIncrease}%`}
            subtitle="vs. floor price"
            icon={TrendingUp}
            trend={{ value: 2.5, isPositive: true }}
          />
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Listings Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>My Crop Listings</CardTitle>
                    <CardDescription>Track your active auctions and bids</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="active" className="gap-2">
                      <Clock className="h-4 w-4" />
                      Active ({myListings.filter(c => c.status === "live").length})
                    </TabsTrigger>
                    <TabsTrigger value="pending" className="gap-2">
                      <Eye className="h-4 w-4" />
                      Pending ({myListings.filter(c => c.status === "payment_pending" || c.status === "logistics_pending").length})
                    </TabsTrigger>
                    <TabsTrigger value="sold" className="gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Sold
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="active" className="mt-4 space-y-4">
                    {myListings.filter(c => c.status === "live").map((crop) => (
                      <div
                        key={crop.id}
                        className="flex items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-accent/30 cursor-pointer"
                        onClick={() => navigate(`/farmer/crop/${crop.id}`)}
                      >
                        <img
                          src={crop.imageUrl}
                          alt={crop.name}
                          className="h-16 w-16 rounded-lg object-cover"
                        />
                        <div className="flex-1 space-y-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <h4 className="font-semibold text-foreground">{crop.name}</h4>
                            <Badge variant="outline" className="w-fit text-xs">
                              Grade {crop.quality}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {crop.quantity} {crop.unit} · {crop.variety}
                          </p>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                            <span className="text-muted-foreground">
                              Floor: ₹{crop.floorPrice.toLocaleString()}
                            </span>
                            <span className="font-medium text-primary">
                              Current: ₹{crop.currentBid.toLocaleString()}
                            </span>
                            <span className="text-chart-1">
                              +{((crop.currentBid - crop.floorPrice) / crop.floorPrice * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                        <div className="text-right hidden sm:block">
                          <div className="flex items-center justify-end gap-1 text-sm text-muted-foreground">
                            <Gavel className="h-4 w-4" />
                            {crop.totalBids} bids
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Ends {formatDistanceToNow(new Date(crop.auctionEndsAt), { addSuffix: true })}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/farmer/crop/${crop.id}`)}>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/farmer/crop/${crop.id}`)}>
                              View All Bids
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              extendAuction(crop.id, 3);
                              toast({ title: "Auction Extended", description: "Auction extended by 3 days." });
                            }}>
                              Extend Auction
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => {
                              cancelListing(crop.id);
                              toast({ title: "Listing Cancelled", description: "The crop listing has been removed." });
                            }}>
                              Cancel Listing
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="pending" className="mt-4 space-y-4">
                    {myListings.filter(c => c.status === "payment_pending" || c.status === "logistics_pending").length === 0 ? (
                      <div className="rounded-lg border border-dashed border-border p-8 text-center">
                        <Package className="mx-auto h-10 w-10 text-muted-foreground" />
                        <p className="mt-2 text-muted-foreground">No pending actions</p>
                      </div>
                    ) : (
                      myListings.filter(c => c.status === "payment_pending" || c.status === "logistics_pending").map((crop) => (
                        <div key={crop.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-lg border border-border p-4 bg-muted/20">
                          <div className="flex w-full sm:w-auto items-center gap-4">
                            <img src={crop.imageUrl} alt={crop.name} className="h-16 w-16 rounded-lg object-cover" />
                            <div className="sm:hidden flex-1">
                              <h4 className="font-semibold">{crop.name}</h4>
                            </div>
                          </div>
                          <div className="flex-1 w-full sm:w-auto">
                            <h4 className="hidden sm:block font-semibold">{crop.name}</h4>
                            <p className="text-sm text-muted-foreground">Sold at: ₹{crop.currentBid}</p>
                            <Badge variant={crop.status === "payment_pending" ? "default" : "outline"} className="mt-1">
                              {crop.status === "payment_pending" ? "Payment Pending" : "Logistics Pending"}
                            </Badge>
                          </div>
                          <div className="w-full sm:w-auto">
                            {crop.status === "logistics_pending" && (
                              <Button size="sm" className="w-full sm:w-auto" onClick={() => navigate(`/logistics?cropId=${crop.id}`)}>
                                Book Logistics
                              </Button>
                            )}
                            {crop.status === "payment_pending" && (
                              <Button size="sm" className="w-full sm:w-auto" onClick={() => {
                                confirmPayment(crop.id);
                                toast({ title: "Payment Received", description: "Funds have been added to your account." });
                              }}>
                                Confirm Payment
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </TabsContent>

                  <TabsContent value="sold" className="mt-4 space-y-4">
                    {myListings.filter(c => c.status === "completed" || c.status === "sold").length === 0 ? (
                      <div className="rounded-lg border border-dashed border-border p-8 text-center">
                        <CheckCircle className="mx-auto h-10 w-10 text-muted-foreground" />
                        <p className="mt-2 text-muted-foreground">No completed sales yet.</p>
                      </div>
                    ) : (
                      myListings.filter(c => c.status === "completed" || c.status === "sold").map((crop) => (
                        <div key={crop.id} className="flex items-center gap-4 rounded-lg border border-border p-4 bg-green-50/50">
                          <img src={crop.imageUrl} alt={crop.name} className="h-16 w-16 rounded-lg object-cover grayscale" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">{crop.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>Sold: {crop.quantity} {crop.unit}</span>
                              <span>•</span>
                              <span>Total: ₹{((crop.currentBid || crop.floorPrice) * crop.quantity).toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Completed
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                              {crop.auctionEndsAt ? formatDistanceToNow(new Date(crop.auctionEndsAt), { addSuffix: true }) : "Recently"}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Bids */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Bids</CardTitle>
                <CardDescription>Latest activity on your crops</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeBids.slice(0, 5).map((bid) => {
                  const crop = myListings.find(c => c.id === bid.cropId);
                  return (
                    <div
                      key={bid.id}
                      className="flex items-center gap-3 border-b border-border pb-3 last:border-0 last:pb-0"
                    >
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${bid.status === "active" ? "bg-chart-1/20 text-chart-1" : "bg-muted text-muted-foreground"
                        }`}>
                        <Gavel className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{bid.buyerName}</p>
                        <p className="text-xs text-muted-foreground">
                          on {crop?.name || "Crop"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-primary">
                          ₹{bid.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(bid.timestamp), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2" onClick={() => navigate("/farmer/add-crop")}>
                  <ListPlus className="h-4 w-4" />
                  Add New Crop
                </Button>

                <Button variant="outline" className="w-full justify-start gap-2" onClick={() => navigate("/farmer/analytics")}>
                  <TrendingUp className="h-4 w-4" />
                  View Price Analytics
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2" onClick={() => navigate("/farmer/payments")}>
                  <IndianRupee className="h-4 w-4" />
                  Payment History
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main >
      <Footer />
    </div >
  );
}
