import React, { createContext, useContext, useState } from "react";
import { mockCrops, mockBids, mockFarmerStats, mockFactoryContracts } from "@/lib/mockData";

const GlobalStateContext = createContext(undefined);

export const GlobalStateProvider = ({ children }) => {
    const [crops, setCrops] = useState(mockCrops);
    const [bids, setBids] = useState(mockBids);
    const [farmerStats, setFarmerStats] = useState(mockFarmerStats);
    const [factoryContracts, setFactoryContracts] = useState(mockFactoryContracts);

    const addCrop = (newCropData) => {
        const newCrop = {
            ...newCropData,
            id: Math.random().toString(36).substr(2, 9),
            currentBid: newCropData.floorPrice,
            totalBids: 0,
            status: "live",
            farmerId: "F001", // Simulating current user is always F001
            farmerRating: newCropData.farmerRating || 4.9,
            buyerRating: 4.8,
            demandLevel: newCropData.demandLevel || "High",
            predictedPrice: newCropData.predictedPrice || (newCropData.floorPrice * 1.15),
            logisticsMode: newCropData.logisticsMode || "app_arranged",
            weightConfirmed: newCropData.quantity,
        };
        setCrops((prev) => [newCrop, ...prev]);
        setFarmerStats((prev) => ({
            ...prev,
            totalListings: prev.totalListings + 1,
        }));
    };

    const placeBid = (cropId, amount, buyerName) => {
        const newBid = {
            id: Math.random().toString(36).substr(2, 9),
            cropId,
            buyerId: "BU_CURRENT",
            buyerName,
            amount,
            timestamp: new Date().toISOString(),
            status: "active",
        };

        setBids((prev) => [
            newBid,
            ...prev.map(b => b.cropId === cropId && b.status === "active" ? { ...b, status: "outbid" } : b)
        ]);

        // Update crop current bid
        setCrops((prev) => prev.map(crop => {
            if (crop.id === cropId) {
                return {
                    ...crop,
                    currentBid: amount > crop.currentBid ? amount : crop.currentBid,
                    totalBids: crop.totalBids + 1
                };
            }
            return crop;
        }));
    };

    const extendAuction = (cropId, days) => {
        setCrops((prev) => prev.map(crop => {
            if (crop.id === cropId) {
                const currentEnd = new Date(crop.auctionEndsAt);
                const newEnd = new Date(currentEnd.setDate(currentEnd.getDate() + days));
                return { ...crop, auctionEndsAt: newEnd.toISOString() };
            }
            return crop;
        }));
    };

    const cancelListing = (cropId) => {
        setCrops((prev) => prev.filter(crop => crop.id !== cropId));
        setFarmerStats((prev) => ({
            ...prev,
            totalListings: prev.totalListings - 1
        }));
    };

    const acceptBid = (cropId, bidId) => {
        // Mark bid as won
        setBids(prev => prev.map(bid =>
            bid.id === bidId ? { ...bid, status: "won" } : bid
        ));

        // Update crop status
        setCrops(prev => prev.map(crop =>
            crop.id === cropId ? { ...crop, status: "logistics_pending" } : crop
        ));
    };

    const confirmLogistics = (cropId, details = {}) => {
        setCrops(prev => prev.map(crop =>
            crop.id === cropId ? {
                ...crop,
                status: "payment_pending",
                logisticsMode: details.mode || crop.logisticsMode || "app_arranged",
                pickupSchedule: details.schedule || crop.pickupSchedule,
                carrier: details.carrier || "AgriMovers Express"
            } : crop
        ));
    };

    const confirmWeight = (cropId, verifiedWeight) => {
        setCrops(prev => prev.map(crop =>
            crop.id === cropId ? {
                ...crop,
                weightConfirmed: Number(verifiedWeight),
            } : crop
        ));
    };

    const joinContractPool = (contractId, quantity) => {
        setFactoryContracts(prev => prev.map(contract => {
            if (contract.id === contractId) {
                return {
                    ...contract,
                    committedQuantity: contract.committedQuantity + Number(quantity),
                    joinedFarmers: contract.joinedFarmers + 1
                };
            }
            return contract;
        }));
    };

    const confirmPayment = (cropId) => {
        setCrops(prev => prev.map(crop =>
            crop.id === cropId ? { ...crop, status: "completed" } : crop
        ));

        // Add earnings (simulated based on current bid)
        const crop = crops.find(c => c.id === cropId);
        if (crop) {
            setFarmerStats(prev => ({
                ...prev,
                completedSales: prev.completedSales + 1,
                totalEarnings: prev.totalEarnings + (crop.currentBid * crop.quantity)
            }));
        }
    };

    return (
        <GlobalStateContext.Provider value={{
            crops, bids, farmerStats, factoryContracts,
            addCrop, placeBid, extendAuction, cancelListing,
            acceptBid, confirmLogistics, confirmWeight, confirmPayment, joinContractPool
        }}>
            {children}
        </GlobalStateContext.Provider>
    );
};

export const useGlobalState = () => {
    const context = useContext(GlobalStateContext);
    if (context === undefined) {
        throw new Error("useGlobalState must be used within a GlobalStateProvider");
    }
    return context;
};

