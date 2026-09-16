import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Clock, MapPin, TrendingUp, Gavel } from "lucide-react";
// import { Crop } from "@/lib/mockData";
import { formatDistanceToNow } from "date-fns";



export function CropCard({ crop, onBid, onClick, showBidButton = true }) {
  const timeLeft = formatDistanceToNow(new Date(crop.auctionEndsAt), { addSuffix: false });
  const priceIncrease = ((crop.currentBid - crop.floorPrice) / crop.floorPrice * 100).toFixed(1);

  return (
    <Card
      onClick={() => onClick?.(crop)}
      className="group overflow-hidden border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300 cursor-pointer"
    >
      <CardHeader className="p-0">
        <div className="relative h-48 overflow-hidden">
          <img
            src={crop.imageUrl}
            alt={crop.name}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80";
            }}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <Badge variant={crop.status === "live" ? "default" : "secondary"} className="gap-1">
              {crop.status === "live" && <span className="h-2 w-2 rounded-full bg-chart-2 animate-pulse" />}
              {crop.status === "live" ? "Live Auction" : crop.status}
            </Badge>
            <Badge variant="outline" className="bg-background/80 backdrop-blur-sm notranslate">
              Grade {crop.quality}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-serif text-lg font-bold text-foreground">{crop.name}</h3>
            <p className="text-sm text-muted-foreground">{crop.variety}</p>
          </div>
          {crop.farmerRating && (
            <Badge variant="outline" className="notranslate text-xs bg-amber-50 text-amber-700 border-amber-300 flex items-center gap-1">
              ★ {crop.farmerRating}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Moisture: <span className="notranslate">{crop.moisture ? `${crop.moisture}%` : "12.5%"}</span></span>
          <span className="text-primary font-semibold">{crop.demandLevel ? `Demand: ${crop.demandLevel}` : "High Demand 🔥"}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {crop.location}, {crop.state}
          </div>
          <div className="font-medium notranslate">
            {crop.quantity} {crop.unit}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Floor Price</span>
            <span className="text-sm font-medium notranslate">₹{crop.floorPrice.toLocaleString()}/{crop.unit}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Current Bid</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary notranslate">₹{crop.currentBid.toLocaleString()}</span>
              <Badge variant="secondary" className="notranslate bg-accent text-accent-foreground text-xs">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{priceIncrease}%
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            {timeLeft} left
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Gavel className="h-4 w-4" />
            {crop.totalBids} bids
          </div>
        </div>
      </CardContent>


      {showBidButton && (
        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md gap-2"
            onClick={(e) => {
              e.stopPropagation();
              onBid?.(crop);
            }}
          >
            <Gavel className="h-4 w-4" />
            Place Bid
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
