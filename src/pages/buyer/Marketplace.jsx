import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CropCard } from "@/components/crops/CropCard";
import { CropFilters } from "@/components/crops/CropFilters";
import { BidModal } from "@/components/crops/BidModal";
import { Button } from "@/components/ui/button";
import { cropCategories } from "@/lib/mockData";
import { Gavel, TrendingUp, ChevronLeft, ChevronRight, Layers, Sparkles } from "lucide-react";
import { useGlobalState } from "@/context/GlobalState";
import { useAuth } from "@/context/AuthContext";

const ITEMS_PER_PAGE = 16;

export default function Marketplace() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Crops");
  const [selectedState, setSelectedState] = useState("All States");
  const [selectedQuality, setSelectedQuality] = useState("all");
  const [sortBy, setSortBy] = useState("endingSoon");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const { crops, placeBid } = useGlobalState();

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedState, selectedQuality, sortBy]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { "All Crops": crops.filter((c) => c.status === "live").length };
    crops.forEach((c) => {
      if (c.status === "live" && c.category) {
        counts[c.category] = (counts[c.category] || 0) + 1;
      }
    });
    return counts;
  }, [crops]);

  // Filter crops
  const filteredCrops = useMemo(() => {
    return crops.filter((crop) => {
      const matchesSearch =
        crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crop.variety.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crop.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (crop.location && crop.location.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === "All Crops" || crop.category === selectedCategory;

      const matchesState = selectedState === "All States" || crop.state === selectedState;
      const matchesQuality = selectedQuality === "all" || crop.quality === selectedQuality;

      return matchesSearch && matchesCategory && matchesState && matchesQuality && crop.status === "live";
    });
  }, [crops, searchQuery, selectedCategory, selectedState, selectedQuality]);

  // Sort crops
  const sortedCrops = useMemo(() => {
    return [...filteredCrops].sort((a, b) => {
      if (sortBy === "priceLow") return a.floorPrice - b.floorPrice;
      if (sortBy === "priceHigh") return b.floorPrice - a.floorPrice;
      if (sortBy === "bids") return b.totalBids - a.totalBids;
      if (sortBy === "aiScore") return (b.aiQualityScore || 0) - (a.aiQualityScore || 0);
      if (sortBy === "endingSoon") {
        return new Date(a.auctionEndsAt || 0) - new Date(b.auctionEndsAt || 0);
      }
      return 0;
    });
  }, [filteredCrops, sortBy]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(sortedCrops.length / ITEMS_PER_PAGE));
  const paginatedCrops = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedCrops.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedCrops, currentPage]);

  const handleBid = (crop) => {
    setSelectedCrop(crop);
    setIsBidModalOpen(true);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 280, behavior: "smooth" });
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
            Browse and bid on fresh produce directly from farmers across 15+ agricultural states in India
          </p>
        </div>

        {/* Stats Bar */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-sm">
            <span className="h-2 w-2 rounded-full bg-chart-2 animate-pulse" />
            <span className="font-semibold text-accent-foreground">{filteredCrops.length} Active Auctions</span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-muted/40 border border-border px-4 py-1.5 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span>Avg. +15% above floor price</span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-muted/40 border border-border px-4 py-1.5 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>AI Moisture & Quality Verified</span>
          </div>
        </div>

        {/* Horizontal Category Filter Pills */}
        <div className="mb-6 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-2 min-w-max">
            {cropCategories.map((category) => {
              const count = categoryCounts[category] || 0;
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 border ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  <span>{category}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      isActive
                        ? "bg-primary-foreground/20 text-primary-foreground font-semibold"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed Search & Filter Bar */}
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
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>

        {/* Results summary bar */}
        <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
          <div>
            Showing <strong className="text-foreground">{paginatedCrops.length}</strong> of{" "}
            <strong className="text-foreground">{sortedCrops.length}</strong> crops
            {selectedCategory !== "All Crops" && (
              <span> in <span className="text-primary font-medium">{selectedCategory}</span></span>
            )}
            {selectedState !== "All States" && (
              <span> from <span className="text-foreground font-medium">{selectedState}</span></span>
            )}
          </div>
          {totalPages > 1 && (
            <div className="text-xs text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
          )}
        </div>

        {/* Crop Grid */}
        {paginatedCrops.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {paginatedCrops.map((crop) => (
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
              Try adjusting your category, state filter, or search query
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All Crops");
                setSelectedState("All States");
                setSelectedQuality("all");
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border pt-6">
            <p className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
              {Math.min(currentPage * ITEMS_PER_PAGE, sortedCrops.length)} of {sortedCrops.length} crops
            </p>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Prev</span>
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                // Show first, last, and pages around current
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      className={`h-9 w-9 p-0 ${currentPage === pageNum ? "font-bold" : ""}`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                  return (
                    <span key={pageNum} className="px-1 text-muted-foreground">
                      ...
                    </span>
                  );
                }
                return null;
              })}

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="gap-1"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
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
              const buyerName = user?.name || (user?.companyName || "Agromart Buyer");
              const buyerId = user?.uid || "BU001";
              placeBid(selectedCrop.id, amount, buyerName, buyerId);
            }
          }}
        />
      </main>
      <Footer />
    </div>
  );
}
