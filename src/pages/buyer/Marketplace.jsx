import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CropCard } from "@/components/crops/CropCard";
import { CropFilters } from "@/components/crops/CropFilters";
import { BidModal } from "@/components/crops/BidModal";
import { mockCrops } from "@/lib/mockData";
import { Gavel, TrendingUp } from "lucide-react";
import { useGlobalState } from "@/context/GlobalState";

export default function BuyerMarketplace() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Crops");
  const [selectedState, setSelectedState] = useState("All States");
  const [selectedQuality, setSelectedQuality] = useState("all");
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const { crops, placeBid } = useGlobalState();

  const filteredCrops = crops.filter((crop) => {
    const matchesSearch =
      crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.variety.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.farmerName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesState = selectedState === "All States" || crop.state === selectedState;
    const matchesQuality = selectedQuality === "all" || crop.quality === selectedQuality;

    return matchesSearch && matchesState && matchesQuality && crop.status === "live";
  });

  const handleBid = (crop) => {
    setSelectedCrop(crop);
    setIsBidModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        {/* Header */}
        <div className="mb-8 space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Gavel className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-foreground">Live Marketplace</h1>
          </div>
          <p className="text-muted-foreground">
            Browse and bid on fresh produce directly from farmers across India
          </p>
        </div>

        {/* Stats Bar */}
        <div className="mb-6 flex flex-wrap gap-4">
          <div className="flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm">
            <span className="h-2 w-2 rounded-full bg-chart-2 animate-pulse" />
            <span className="font-medium text-accent-foreground">{filteredCrops.length} Live Auctions</span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-muted/30 px-4 py-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            Avg. +15% above floor price
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <CropFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedState={selectedState}
            onStateChange={setSelectedState}
            selectedQuality={selectedQuality}
            onQualityChange={setSelectedQuality}
          />
        </div>

        {/* Crop Grid */}
        {filteredCrops.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCrops.map((crop) => (
              <CropCard
                key={crop.id}
                crop={crop}
                onBid={handleBid}
                onClick={(c) => navigate(`/buyer/crop/${c.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-card p-12 text-center">
            <Gavel className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">No crops found</h3>
            <p className="mt-2 text-muted-foreground">
              Try adjusting your filters or search query
            </p>
          </div>
        )}

        {/* Bid Modal */}
        <BidModal
          crop={selectedCrop}
          isOpen={isBidModalOpen}
          onClose={() => {
            setIsBidModalOpen(false);
            setSelectedCrop(null);
          }}
          onBidSubmit={(amount) => {
            if (selectedCrop) {
              placeBid(selectedCrop.id, amount, "Me (Buyer)");
            }
          }}
        />
      </main>
      <Footer />
    </div>
  );
}
