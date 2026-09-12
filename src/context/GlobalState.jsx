import React, { createContext, useContext, useState, useEffect } from "react";
import { mockCrops, mockBids, mockFarmerStats, mockFactoryContracts } from "@/lib/mockData";
import { toast } from "sonner";

const INITIAL_NOTIFICATIONS = [
    {
        id: "notif-init-1",
        recipientId: "F001",
        recipientRole: "farmer",
        type: "bid_received",
        title: "🎯 New Auction Bid Received!",
        message: "Agromart Exports submitted a verified bid of ₹4,200/quintal for your Basmati Rice (Pusa 1121).",
        timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
        read: false,
        cropId: "1",
        cropName: "Basmati Rice",
        amount: 4200,
        senderName: "Agromart Exports",
        link: "/profile",
        badge: "Bid Alert"
    },
    {
        id: "notif-init-2",
        recipientId: "F001",
        recipientRole: "farmer",
        type: "order_created",
        title: "🚚 Consignment Pickup Scheduled",
        message: "Order #ORD-9821 has been confirmed. Sandhu Agri-Freight truck is arriving tomorrow at 10:00 AM.",
        timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        read: false,
        orderId: "ORD-9821",
        cropName: "Basmati Rice",
        badge: "Dispatch"
    },
    {
        id: "notif-init-3",
        recipientId: "BU001",
        recipientRole: "buyer",
        type: "bid_placed",
        title: "✅ Bid Active on HD 3086 Wheat",
        message: "Your bid of ₹2,650/q is currently the highest bid for Wheat lot in Ludhiana.",
        timestamp: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
        read: false,
        cropId: "2",
        cropName: "Wheat",
        amount: 2650,
        badge: "Bidding"
    },
    {
        id: "notif-init-4",
        recipientId: "BU001",
        recipientRole: "buyer",
        type: "order_created",
        title: "📦 Order Dispatched & In-Transit",
        message: "Order #ORD-9821 has departed Karnal warehouse with electronic weighbridge verification slip.",
        timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
        read: true,
        orderId: "ORD-9821",
        badge: "Logistics"
    },
    {
        id: "notif-init-5",
        recipientId: "L001",
        recipientRole: "logistics",
        type: "consignment_assigned",
        title: "🚛 New Transport Route Assigned",
        message: "You have been assigned shipment route Karnal -> New Delhi (50 Quintals Basmati Rice).",
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        read: false,
        orderId: "ORD-9821",
        badge: "Fleet Dispatch"
    },
    {
        id: "notif-init-6",
        recipientId: "S001",
        recipientRole: "storage",
        type: "storage_intake",
        title: "🏢 Grain Lot Intake Reserved",
        message: "120 Quintals Wheat booked for CA Cold Chamber 2. e-NWR receipt ready for generation.",
        timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
        read: false,
        badge: "Warehousing"
    }
];

const INITIAL_ORDERS = [
    {
        id: "ORD-9821",
        cropId: "1",
        cropName: "Basmati Rice (Pusa 1121)",
        variety: "Pusa 1121",
        quantity: 50,
        unit: "quintal",
        farmerId: "F001",
        farmerName: "Rajesh Kumar",
        farmerPhone: "+91 98765 43210",
        farmerLocation: "Taraori, Karnal, Haryana",
        buyerId: "BU001",
        buyerName: "Vikram Singhania (Agromart)",
        buyerPhone: "+91 98112 34567",
        buyerCompany: "Agromart Foods & Exports Pvt Ltd",
        destination: "Lawrence Road, New Delhi",
        finalPricePerUnit: 4200,
        totalAmount: 210000,
        status: "in_transit", // "logistics_pending" | "in_transit" | "delivered" | "completed"
        orderDate: "2025-01-04",
        deliveryDate: "2025-01-08",
        logisticsPartner: "Sandhu Agri-Freight & Cold Fleet",
        logisticsId: "L001",
        logisticsPhone: "+91 97791 22334",
        vehicleNumber: "PB 10 CQ 4412",
        driverName: "Harjeet Singh",
        trackingNumber: "SAF-TRK-7712",
        weighbridgeSlip: "WB-KNL-8819.pdf",
        verifiedWeight: "49.85 Quintals",
        moisturePercentage: "12.2%",
        escrowStatus: "held_in_escrow", // "held_in_escrow" | "released"
        imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
        storageFacility: "Patel CA Cold Storage Unit 4",
        storageId: "S001"
    },
    {
        id: "ORD-9822",
        cropId: "2",
        cropName: "HD 3086 Sharbati Wheat",
        variety: "HD 3086",
        quantity: 100,
        unit: "quintal",
        farmerId: "F001",
        farmerName: "Rajesh Kumar",
        farmerPhone: "+91 98765 43210",
        farmerLocation: "Taraori, Karnal, Haryana",
        buyerId: "BU001",
        buyerName: "Vikram Singhania (Agromart)",
        buyerPhone: "+91 98112 34567",
        buyerCompany: "Agromart Foods & Exports Pvt Ltd",
        destination: "Narela Mandi, Delhi",
        finalPricePerUnit: 2650,
        totalAmount: 265000,
        status: "logistics_pending",
        orderDate: "2025-01-05",
        deliveryDate: "2025-01-10",
        logisticsPartner: "Kisan Direct Logistics",
        logisticsId: "L001",
        logisticsPhone: "+91 97791 22334",
        vehicleNumber: "HR 05 AG 8820",
        driverName: "Malkeet Sandhu",
        trackingNumber: "KDL-HR-9901",
        weighbridgeSlip: "WB-KNL-9912.pdf",
        verifiedWeight: "100.0 Quintals",
        moisturePercentage: "11.5%",
        escrowStatus: "held_in_escrow",
        imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400",
        storageFacility: "Central Silo Karnal",
        storageId: "S001"
    },
    {
        id: "ORD-9820",
        cropId: "3",
        cropName: "Yellow Soybean (Grade A)",
        variety: "JS 335",
        quantity: 80,
        unit: "quintal",
        farmerId: "F001",
        farmerName: "Rajesh Kumar",
        farmerPhone: "+91 98765 43210",
        farmerLocation: "Taraori, Karnal, Haryana",
        buyerId: "BU001",
        buyerName: "Vikram Singhania (Agromart)",
        buyerPhone: "+91 98112 34567",
        buyerCompany: "Agromart Foods & Exports Pvt Ltd",
        destination: "Indore Agro Complex, MP",
        finalPricePerUnit: 4400,
        totalAmount: 352000,
        status: "completed",
        orderDate: "2024-12-28",
        deliveryDate: "2025-01-02",
        logisticsPartner: "Sandhu Agri-Freight & Cold Fleet",
        logisticsId: "L001",
        logisticsPhone: "+91 97791 22334",
        vehicleNumber: "PB 10 DE 9002",
        driverName: "Gurdas Singh",
        trackingNumber: "SAF-TRK-6619",
        weighbridgeSlip: "WB-KNL-7721.pdf",
        verifiedWeight: "80.2 Quintals",
        moisturePercentage: "10.0%",
        escrowStatus: "released",
        imageUrl: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=400",
        storageFacility: "Patel CA Cold Storage Unit 4",
        storageId: "S001"
    }
];

const GlobalStateContext = createContext(undefined);

export const GlobalStateProvider = ({ children }) => {
    const [crops, setCrops] = useState(mockCrops);
    const [bids, setBids] = useState(mockBids);
    const [farmerStats, setFarmerStats] = useState(mockFarmerStats);
    const [factoryContracts, setFactoryContracts] = useState(mockFactoryContracts);

    // Persistent notifications
    const [notifications, setNotifications] = useState(() => {
        try {
            const saved = localStorage.getItem("kisan_bazaar_notifications");
            if (saved) return JSON.parse(saved);
        } catch (e) {
            console.error("Failed to load notifications from storage", e);
        }
        return INITIAL_NOTIFICATIONS;
    });

    // Persistent orders
    const [orders, setOrders] = useState(() => {
        try {
            const saved = localStorage.getItem("kisan_bazaar_orders");
            if (saved) return JSON.parse(saved);
        } catch (e) {
            console.error("Failed to load orders from storage", e);
        }
        return INITIAL_ORDERS;
    });

    useEffect(() => {
        try {
            localStorage.setItem("kisan_bazaar_notifications", JSON.stringify(notifications));
        } catch (e) {
            console.error("Failed to save notifications", e);
        }
    }, [notifications]);

    useEffect(() => {
        try {
            localStorage.setItem("kisan_bazaar_orders", JSON.stringify(orders));
        } catch (e) {
            console.error("Failed to save orders", e);
        }
    }, [orders]);

    const addNotification = (notif) => {
        const fullNotif = {
            id: notif.id || `notif-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            timestamp: notif.timestamp || new Date().toISOString(),
            read: false,
            ...notif
        };
        setNotifications(prev => [fullNotif, ...prev]);
        return fullNotif;
    };

    const markAsRead = (notificationId) => {
        setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
    };

    const markAllAsRead = (recipientId, recipientRole) => {
        setNotifications(prev => prev.map(n => {
            const matchesId = !recipientId || n.recipientId === recipientId || n.recipientId === "all";
            const matchesRole = !recipientRole || n.recipientRole === recipientRole || n.recipientRole === "all";
            return (matchesId && matchesRole) ? { ...n, read: true } : n;
        }));
    };

    const clearNotifications = (recipientId, recipientRole) => {
        setNotifications(prev => prev.filter(n => {
            const matchesId = recipientId && (n.recipientId === recipientId || n.recipientId === "all");
            const matchesRole = recipientRole && (n.recipientRole === recipientRole || n.recipientRole === "all");
            return !(matchesId || matchesRole);
        }));
    };

    const addCrop = (newCropData) => {
        const newCrop = {
            ...newCropData,
            id: Math.random().toString(36).substr(2, 9),
            currentBid: newCropData.floorPrice,
            totalBids: 0,
            status: "live",
            farmerId: newCropData.farmerId || "F001",
            farmerName: newCropData.farmerName || "Rajesh Kumar",
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

        addNotification({
            recipientId: newCrop.farmerId,
            recipientRole: "farmer",
            type: "crop_published",
            title: "🌾 Crop Listing Live on APMC Mandi",
            message: `Your listing for ${newCrop.name} (${newCrop.quantity} ${newCrop.unit}) is now live for verified buyer bidding.`,
            cropId: newCrop.id,
            cropName: newCrop.name,
            badge: "Listing Live"
        });
    };

    const placeBid = (cropId, amount, buyerName = "Agromart Buyer", buyerId = "BU001") => {
        const targetCrop = crops.find(c => c.id === cropId);
        const previousActiveBid = bids.find(b => b.cropId === cropId && b.status === "active");

        const newBid = {
            id: Math.random().toString(36).substr(2, 9),
            cropId,
            buyerId: buyerId || "BU001",
            buyerName: buyerName || "Verified Buyer",
            amount,
            timestamp: new Date().toISOString(),
            status: "active",
        };

        // Update bids list: mark prior active bid on this crop as outbid
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

        const cropTitle = targetCrop ? targetCrop.name : "Crop Lot";
        const unit = targetCrop ? targetCrop.unit : "quintal";
        const farmerTargetId = targetCrop ? (targetCrop.farmerId || "F001") : "F001";

        // 1. NOTIFY THE FARMER: The farmer receives the new bid notification!
        addNotification({
            recipientId: farmerTargetId,
            recipientRole: "farmer",
            type: "bid_received",
            title: `🎯 New Bid: ₹${amount.toLocaleString()}/${unit} on ${cropTitle}`,
            message: `${buyerName} submitted an active offer of ₹${amount.toLocaleString()} per ${unit} for your lot "${cropTitle}". Review or accept in Orders & Bids.`,
            cropId: cropId,
            bidId: newBid.id,
            cropName: cropTitle,
            amount: amount,
            senderName: buyerName,
            badge: "New Bid",
            link: "/profile"
        });

        // 2. NOTIFY THE BUYER: Confirmation that their bid was logged
        addNotification({
            recipientId: buyerId,
            recipientRole: "buyer",
            type: "bid_placed",
            title: `✅ Bid Placed on ${cropTitle}`,
            message: `You placed an offer of ₹${amount.toLocaleString()}/${unit} for ${cropTitle}. The farmer has been notified in real time.`,
            cropId: cropId,
            bidId: newBid.id,
            cropName: cropTitle,
            amount: amount,
            badge: "Bid Active",
            link: "/profile"
        });

        // 3. NOTIFY PREVIOUS BIDDER IF OUTBID
        if (previousActiveBid && previousActiveBid.buyerId && previousActiveBid.buyerId !== buyerId) {
            addNotification({
                recipientId: previousActiveBid.buyerId,
                recipientRole: "buyer",
                type: "outbid",
                title: `⚠️ Outbid Alert on ${cropTitle}`,
                message: `Your bid of ₹${previousActiveBid.amount.toLocaleString()} was outbid by another buyer at ₹${amount.toLocaleString()}. Counter now to secure the lot!`,
                cropId: cropId,
                cropName: cropTitle,
                amount: amount,
                badge: "Outbid",
                link: `/farmer/crop/${cropId}`
            });
        }

        toast.success(`Bid of ₹${amount.toLocaleString()} placed! Farmer has been notified.`);
        return newBid;
    };

    const acceptBid = (cropId, bidId) => {
        const winningBid = bids.find(b => b.id === bidId);
        const targetCrop = crops.find(c => c.id === cropId);

        // Mark bid as won
        setBids(prev => prev.map(bid =>
            bid.id === bidId ? { ...bid, status: "won" } : (bid.cropId === cropId ? { ...bid, status: "outbid" } : bid)
        ));

        // Update crop status
        setCrops(prev => prev.map(crop =>
            crop.id === cropId ? { ...crop, status: "logistics_pending" } : crop
        ));

        // Create a new active Order automatically
        const generatedOrderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
        const totalValue = winningBid && targetCrop ? (winningBid.amount * targetCrop.quantity) : (targetCrop ? targetCrop.currentBid * targetCrop.quantity : 150000);

        const newOrder = {
            id: generatedOrderId,
            cropId: cropId,
            cropName: targetCrop ? `${targetCrop.name} (${targetCrop.variety})` : "Agricultural Lot",
            variety: targetCrop ? targetCrop.variety : "Standard",
            quantity: targetCrop ? targetCrop.quantity : 50,
            unit: targetCrop ? targetCrop.unit : "quintal",
            farmerId: targetCrop ? (targetCrop.farmerId || "F001") : "F001",
            farmerName: targetCrop ? (targetCrop.farmerName || "Rajesh Kumar") : "Rajesh Kumar",
            farmerPhone: "+91 98765 43210",
            farmerLocation: targetCrop ? `${targetCrop.location}, ${targetCrop.state}` : "Karnal, Haryana",
            buyerId: winningBid ? winningBid.buyerId : "BU001",
            buyerName: winningBid ? winningBid.buyerName : "Vikram Singhania (Agromart)",
            buyerPhone: "+91 98112 34567",
            buyerCompany: "Agromart Foods & Exports Pvt Ltd",
            destination: "Lawrence Road, New Delhi",
            finalPricePerUnit: winningBid ? winningBid.amount : (targetCrop?.currentBid || 4200),
            totalAmount: totalValue,
            status: "logistics_pending",
            orderDate: new Date().toISOString().split("T")[0],
            deliveryDate: new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0],
            logisticsPartner: "Sandhu Agri-Freight & Cold Fleet",
            logisticsId: "L001",
            logisticsPhone: "+91 97791 22334",
            vehicleNumber: "PB 10 CQ 4412",
            driverName: "Harjeet Singh Sandhu",
            trackingNumber: `SAF-TRK-${Math.floor(1000 + Math.random() * 9000)}`,
            weighbridgeSlip: `WB-${Math.floor(1000 + Math.random() * 9000)}.pdf`,
            verifiedWeight: `${targetCrop ? targetCrop.quantity : 50} Quintals`,
            moisturePercentage: targetCrop ? `${targetCrop.moisture}%` : "12%",
            escrowStatus: "held_in_escrow",
            imageUrl: targetCrop ? targetCrop.imageUrl : "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
            storageFacility: "Patel CA Cold Storage Unit 4",
            storageId: "S001"
        };

        setOrders(prev => [newOrder, ...prev]);

        // Notifications for order creation
        // To Farmer:
        addNotification({
            recipientId: newOrder.farmerId,
            recipientRole: "farmer",
            type: "order_created",
            title: `🎉 Bid Accepted! Order #${newOrder.id} Created`,
            message: `You accepted ${winningBid?.buyerName || "the buyer"}'s bid of ₹${winningBid?.amount || targetCrop?.currentBid}. Lot #${newOrder.id} is now queued for logistics pickup.`,
            orderId: newOrder.id,
            cropName: newOrder.cropName,
            badge: "Order Created",
            link: "/profile"
        });

        // To Winning Buyer:
        addNotification({
            recipientId: newOrder.buyerId,
            recipientRole: "buyer",
            type: "bid_won",
            title: `🏆 Offer Accepted by Farmer! Order #${newOrder.id}`,
            message: `Farmer ${newOrder.farmerName} accepted your bid of ₹${newOrder.finalPricePerUnit}/${newOrder.unit}. Order #${newOrder.id} is confirmed with Escrow protection.`,
            orderId: newOrder.id,
            cropName: newOrder.cropName,
            badge: "Bid Accepted",
            link: "/profile"
        });

        // To Logistics Partner:
        addNotification({
            recipientId: "L001",
            recipientRole: "logistics",
            type: "consignment_assigned",
            title: `🚚 New Freight Assigned: #${newOrder.id}`,
            message: `Pickup lot ready in ${newOrder.farmerLocation} (${newOrder.quantity} ${newOrder.unit} ${newOrder.cropName}). Scheduled for dispatch.`,
            orderId: newOrder.id,
            badge: "Pickup Ready",
            link: "/profile"
        });

        toast.success(`Bid accepted! Order #${newOrder.id} generated.`);
        return newOrder;
    };

    const rejectBid = (cropId, bidId) => {
        const rejected = bids.find(b => b.id === bidId);
        setBids(prev => prev.map(b => b.id === bidId ? { ...b, status: "rejected" } : b));

        if (rejected) {
            addNotification({
                recipientId: rejected.buyerId,
                recipientRole: "buyer",
                type: "bid_rejected",
                title: "❌ Bid Declined by Farmer",
                message: `Farmer declined your bid of ₹${rejected.amount.toLocaleString()} on lot #${cropId}. You can place an updated offer.`,
                cropId: cropId,
                badge: "Bid Declined",
                link: `/farmer/crop/${cropId}`
            });
        }
        toast.info("Bid has been declined.");
    };

    const updateOrderStatus = (orderId, newStatus, details = {}) => {
        setOrders(prev => prev.map(order => {
            if (order.id === orderId) {
                return {
                    ...order,
                    status: newStatus,
                    ...details
                };
            }
            return order;
        }));

        const target = orders.find(o => o.id === orderId);
        if (target) {
            const statusLabels = {
                logistics_pending: "Pickup Queued",
                in_transit: "Dispatched & In Transit",
                delivered: "Delivered to Warehouse",
                completed: "Completed & Payment Settled"
            };

            const label = statusLabels[newStatus] || newStatus;

            // Notify farmer and buyer
            addNotification({
                recipientId: target.farmerId,
                recipientRole: "farmer",
                type: "order_updated",
                title: `📦 Order #${orderId}: ${label}`,
                message: `Status updated for your ${target.cropName} shipment to ${label}.`,
                orderId: orderId,
                badge: "Status Update",
                link: "/profile"
            });

            addNotification({
                recipientId: target.buyerId,
                recipientRole: "buyer",
                type: "order_updated",
                title: `📦 Order #${orderId}: ${label}`,
                message: `Shipment from farmer ${target.farmerName} is now ${label}.`,
                orderId: orderId,
                badge: "Shipment Update",
                link: "/profile"
            });
        }

        toast.success(`Order #${orderId} marked as ${newStatus.replace('_', ' ')}`);
    };

    const releaseEscrow = (orderId) => {
        setOrders(prev => prev.map(o => {
            if (o.id === orderId) {
                return {
                    ...o,
                    escrowStatus: "released",
                    status: "completed"
                };
            }
            return o;
        }));

        const target = orders.find(o => o.id === orderId);
        if (target) {
            setFarmerStats(prev => ({
                ...prev,
                completedSales: prev.completedSales + 1,
                totalEarnings: prev.totalEarnings + target.totalAmount
            }));

            // Notify Farmer: Money credited
            addNotification({
                recipientId: target.farmerId,
                recipientRole: "farmer",
                type: "payment_credited",
                title: `💰 Payment of ₹${target.totalAmount.toLocaleString()} Released!`,
                message: `Escrow payment for Order #${orderId} (${target.cropName}) has been directly credited to your registered bank account via DBT.`,
                orderId: orderId,
                badge: "DBT Payout",
                link: "/profile"
            });

            // Notify Buyer: Escrow completed
            addNotification({
                recipientId: target.buyerId,
                recipientRole: "buyer",
                type: "escrow_settled",
                title: `🔒 Escrow Settled for Order #${orderId}`,
                message: `Payment of ₹${target.totalAmount.toLocaleString()} successfully settled with farmer ${target.farmerName}. Digital receipt issued.`,
                orderId: orderId,
                badge: "Escrow Released",
                link: "/profile"
            });
        }

        toast.success("Escrow payment successfully released to farmer's account!");
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
            notifications, orders,
            addNotification, markAsRead, markAllAsRead, clearNotifications,
            updateOrderStatus, releaseEscrow, rejectBid,
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

