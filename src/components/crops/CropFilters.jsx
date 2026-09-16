import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";
import { cropCategories, indianStates, qualityGrades } from "@/lib/mockData";



export function CropFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  showCategorySelect = false,
  selectedState,
  onStateChange,
  selectedQuality,
  onQualityChange,
  sortBy = "endingSoon",
  onSortChange,
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        {/* Search */}
        <div className="relative w-full lg:flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search crops, varieties, farmers..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 w-full"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 w-full lg:w-auto items-center">
          {showCategorySelect && (
            <Select value={selectedCategory} onValueChange={onCategoryChange}>
              <SelectTrigger className="w-full sm:w-[150px] overflow-hidden truncate">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {cropCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Select value={selectedState} onValueChange={onStateChange}>
            <SelectTrigger className="w-full sm:w-[150px] overflow-hidden truncate">
              <SelectValue placeholder="State" />
            </SelectTrigger>
            <SelectContent>
              {indianStates.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedQuality} onValueChange={onQualityChange}>
            <SelectTrigger className="w-full sm:w-[140px] overflow-hidden truncate">
              <SelectValue placeholder="Quality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Grades</SelectItem>
              {qualityGrades.map((grade) => (
                <SelectItem key={grade.value} value={grade.value}>
                  {grade.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {onSortChange && (
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="col-span-2 sm:col-span-1 w-full sm:w-[170px] overflow-hidden truncate">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="endingSoon">Ending Soonest</SelectItem>
                <SelectItem value="priceLow">Price: Low to High</SelectItem>
                <SelectItem value="priceHigh">Price: High to Low</SelectItem>
                <SelectItem value="bids">Most Bids</SelectItem>
                <SelectItem value="aiScore">Top AI Quality</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
    </div>
  );
}
