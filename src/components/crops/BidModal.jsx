import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { mockBids } from "@/lib/mockData";
import { Gavel, TrendingUp, Clock, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";



export function BidModal({ crop, isOpen, onClose, onBidSubmit }) {
  const [bidAmount, setBidAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  if (!crop) return null;

  const minBid = crop.currentBid + 50;
  const recentBids = mockBids.filter((b) => b.cropId === crop.id).slice(0, 5);

  const handleSubmit = async () => {
    const amount = parseFloat(bidAmount);

    if (isNaN(amount) || amount < minBid) {
      toast({
        title: "Invalid Bid",
        description: `Minimum bid must be ₹${minBid.toLocaleString()}`,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Call the callback from parent
    onBidSubmit(amount);

    toast({
      title: "Bid Placed Successfully!",
      description: `Your bid of ₹${amount.toLocaleString()} has been placed.`,
    });

    setIsSubmitting(false);
    setBidAmount("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-serif text-xl">
            <Gavel className="h-5 w-5 text-primary" />
            Place Your Bid
          </DialogTitle>
          <DialogDescription>
            Bidding on {crop.name} ({crop.variety}) from {crop.location}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Crop Summary */}
          <div className="flex gap-4 rounded-lg border border-border bg-accent/30 p-4">
            <img
              src={crop.imageUrl}
              alt={crop.name}
              className="h-20 w-20 rounded-lg object-cover"
            />
            <div className="flex-1 space-y-1">
              <h4 className="font-semibold">{crop.name}</h4>
              <p className="text-sm text-muted-foreground">
                {crop.quantity} {crop.unit} · Grade {crop.quality}
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Ends in {formatDistanceToNow(new Date(crop.auctionEndsAt))}
                </span>
              </div>
            </div>
          </div>

          {/* Current Price Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-border p-3 text-center">
              <p className="text-sm text-muted-foreground">Floor Price</p>
              <p className="text-lg font-bold">₹{crop.floorPrice.toLocaleString()}</p>
            </div>
            <div className="rounded-lg border border-primary bg-accent p-3 text-center">
              <p className="text-sm text-accent-foreground">Current Bid</p>
              <p className="text-lg font-bold text-primary">₹{crop.currentBid.toLocaleString()}</p>
            </div>
          </div>

          {/* Bid Input */}
          <div className="space-y-2">
            <Label htmlFor="bidAmount">Your Bid Amount (₹)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
              <Input
                id="bidAmount"
                type="number"
                placeholder={minBid.toString()}
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="pl-8"
                min={minBid}
              />
            </div>
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              Minimum bid: ₹{minBid.toLocaleString()} (₹50 increment)
            </p>
          </div>

          {/* Quick Bid Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBidAmount(minBid.toString())}
            >
              ₹{minBid.toLocaleString()}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBidAmount((minBid + 100).toString())}
            >
              ₹{(minBid + 100).toLocaleString()}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBidAmount((minBid + 250).toString())}
            >
              ₹{(minBid + 250).toLocaleString()}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBidAmount((minBid + 500).toString())}
            >
              ₹{(minBid + 500).toLocaleString()}
            </Button>
          </div>

          {/* Recent Bids */}
          {recentBids.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Recent Bids</h4>
              <div className="max-h-32 space-y-2 overflow-y-auto">
                {recentBids.map((bid) => (
                  <div
                    key={bid.id}
                    className="flex items-center justify-between rounded-md bg-muted/30 px-3 py-2 text-sm"
                  >
                    <span className="text-muted-foreground">{bid.buyerName}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">₹{bid.amount.toLocaleString()}</span>
                      {bid.status === "active" && (
                        <Badge variant="default" className="text-xs">Highest</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md gap-2"
            onClick={handleSubmit}
            disabled={isSubmitting || !bidAmount}
          >
            {isSubmitting ? (
              "Placing Bid..."
            ) : (
              <>
                <TrendingUp className="h-4 w-4" />
                Place Bid
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
