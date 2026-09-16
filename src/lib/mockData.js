





import { mockCrops } from "./cropsData.js";
export { mockCrops };

export const mockBids = [
  { id: "B1", cropId: "1", buyerId: "BU001", buyerName: "Agromart Exports", amount: 4200, timestamp: "2025-01-03T10:30:00Z", status: "active" },
  { id: "B2", cropId: "1", buyerId: "BU002", buyerName: "Fresh Foods Ltd", amount: 4100, timestamp: "2025-01-03T10:15:00Z", status: "outbid" },
  { id: "B3", cropId: "1", buyerId: "BU003", buyerName: "Rice India Co", amount: 4000, timestamp: "2025-01-03T09:45:00Z", status: "outbid" },
  { id: "B4", cropId: "2", buyerId: "BU001", buyerName: "Agromart Exports", amount: 2650, timestamp: "2025-01-03T11:00:00Z", status: "active" },
  { id: "B5", cropId: "2", buyerId: "BU004", buyerName: "Grain Traders", amount: 2500, timestamp: "2025-01-03T10:00:00Z", status: "outbid" },
];

export const mockFarmerStats = {
  totalListings: 12,
  activeBids: 47,
  completedSales: 8,
  totalEarnings: 485000,
  avgPriceIncrease: 18.5,
};

export const mockFactoryContracts = [
  {
    id: "FC-101",
    factoryName: "PepsiCo India (Lays Division)",
    cropTarget: "Potato (FL-2027 Variety)",
    location: "Jalandhar, Punjab",
    guaranteedPrice: 1850,
    unit: "quintal",
    targetQuantity: 5000,
    committedQuantity: 3450,
    minFarmerCommitment: 50,
    harvestWindow: "Feb 15 - Mar 10, 2025",
    advancePaymentPercent: 20,
    requiredMoisture: "< 14%",
    requiredGrade: "Grade A Chip-Quality",
    joinedFarmers: 28,
    description: "Exclusive contract for chip-grade potato cultivation with free seed distribution & expert agronomist guidance.",
    status: "active",
  },
  {
    id: "FC-102",
    factoryName: "Haldiram Snacks Pvt Ltd",
    cropTarget: "Chickpeas / Desi Chana",
    location: "Nagpur, Maharashtra",
    guaranteedPrice: 5800,
    unit: "quintal",
    targetQuantity: 2000,
    committedQuantity: 1400,
    minFarmerCommitment: 30,
    harvestWindow: "Mar 01 - Mar 30, 2025",
    advancePaymentPercent: 25,
    requiredMoisture: "< 10%",
    requiredGrade: "Grade A Bold",
    joinedFarmers: 16,
    description: "Bulk procurement for snacks manufacturing with quality bonus of ₹200/q for moisture under 9%.",
    status: "active",
  },
  {
    id: "FC-103",
    factoryName: "Vardhman Textiles Ltd",
    cropTarget: "Bt Cotton (Staple > 29mm)",
    location: "Bhavnagar, Gujarat",
    guaranteedPrice: 7600,
    unit: "quintal",
    targetQuantity: 3000,
    committedQuantity: 2800,
    minFarmerCommitment: 40,
    harvestWindow: "Jan 20 - Feb 28, 2025",
    advancePaymentPercent: 15,
    requiredMoisture: "< 8%",
    requiredGrade: "Grade A Premium Fiber",
    joinedFarmers: 22,
    description: "Long-staple cotton contract farming pool with instant weighbridge payout upon delivery.",
    status: "active",
  },
];

export const cropCategories = [
  "All Crops",
  "Cereals",
  "Pulses",
  "Vegetables",
  "Fruits",
  "Oilseeds",
  "Cash Crops",
  "Spices",
];

export const qualityGrades = [
  { value: "A", label: "Grade A - Premium" },
  { value: "B", label: "Grade B - Standard" },
  { value: "C", label: "Grade C - Economy" },
];

export const indianStates = [
  "All States",
  "Andhra Pradesh",
  "Bihar",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu & Kashmir",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "West Bengal",
];
