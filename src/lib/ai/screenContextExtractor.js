/**
 * Screen Context Extractor for Kisan Bazaar AI
 * Dynamically captures active route, live rendered DOM content (headings, prices,
 * table rows, active badges), user profile details, and platform state
 * to ground the GenAI model in what the user is ACTUALLY seeing on screen.
 */

/**
 * Extracts visible text, headings, badges, and pricing data directly from the DOM
 */
export function extractLiveDomSnapshot() {
    if (typeof window === "undefined" || typeof document === "undefined") {
        return null;
    }

    try {
        // 1. Page Title & Headings (deduplicated)
        const h1s = Array.from(document.querySelectorAll("h1")).map(el => el.innerText.trim()).filter(Boolean);
        const h2s = Array.from(document.querySelectorAll("h2")).map(el => el.innerText.trim()).filter(Boolean).slice(0, 4);
        const uniqueHeadings = Array.from(new Set([...h1s, ...h2s]));

        // 2. Active Tab / Navigation selection
        const activeTabEl = document.querySelector("[role='tab'][data-state='active'], [role='tab'][aria-selected='true'], .active-tab");
        const activeTabLabel = activeTabEl ? activeTabEl.innerText.trim() : null;

        // 3. Visible Status Badges & Tags
        const badges = Array.from(document.querySelectorAll(".badge, [class*='badge'], [class*='Badge']"))
            .map(b => b.innerText.trim())
            .filter(t => t && t.length < 30)
            .slice(0, 8);

        // 4. Currency / Price elements visible on screen
        const priceRegex = /₹[\d,]+(\.\d+)?/;
        const allTextNodes = [];
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) {
            const val = node.nodeValue?.trim();
            if (val && (priceRegex.test(val) || val.includes("Quintal") || val.includes("क्विंटल") || val.includes("Acre") || val.includes("एकर"))) {
                allTextNodes.push(val);
            }
            if (allTextNodes.length >= 10) break;
        }

        // 5. Active Order / Card Identifiers (e.g. ORD-XXXX, lot numbers)
        const orderMatches = document.body.innerText.match(/ORD-\d{4}/g);
        const uniqueOrders = orderMatches ? Array.from(new Set(orderMatches)) : [];

        // 6. Detected UI Language
        const htmlLang = document.documentElement.lang || "en";
        const pageText = document.body.innerText.slice(0, 800);
        const hasMarathi = /[\u0900-\u097F]/.test(pageText) && /(शेतकरी|बाजार|उत्पादन|हमीभाव|खाते|नोंदणी)/.test(pageText);
        const hasHindi = /[\u0900-\u097F]/.test(pageText) && /(किसान|फसल|बोली|मंडी|दुकान|बिक्री)/.test(pageText);
        const detectedLanguage = hasMarathi ? "mr" : (hasHindi ? "hi" : htmlLang);

        return {
            pageHeadings: uniqueHeadings,
            activeTab: activeTabLabel,
            visibleBadges: badges,
            visiblePrices: allTextNodes.slice(0, 6),
            visibleOrderIds: uniqueOrders,
            detectedLanguage
        };
    } catch (e) {
        console.warn("DOM scraping non-critical notice:", e);
        return null;
    }
}

export function getScreenContext({
    location,
    user,
    crops = [],
    orders = [],
    bids = [],
    notifications = [],
    activeTab
}) {
    const pathname = location?.pathname || "/";
    const searchParams = new URLSearchParams(location?.search || "");
    const domSnapshot = extractLiveDomSnapshot();

    let pageTitle = "Home / Overview";
    let activeEntity = null;
    let screenSummary = "Viewing Homepage";
    let quickSuggestions = [
        "How does Kisan Bazaar connect farmers with buyers?",
        "What are the benefits of Escrow payment protection?",
        "How can I register as a Farmer or Buyer?"
    ];

    // Detect active page and screen details
    if (pathname.includes("/buyer/marketplace") || pathname.includes("/marketplace")) {
        pageTitle = "Live APMC Mandi Marketplace (थेट कृषी बाजार)";
        screenSummary = `Browsing ${crops.length} live crop auctions`;
        quickSuggestions = [
            "आज सर्वात जास्त बोली कोणत्या पिकावर लागली आहे?",
            "Which crop has the highest active bidding today?",
            "How does the 15-minute dynamic auction extension work?",
            "नाशिक कांदा व बासमती भाताचा हमीभाव काय आहे?"
        ];
    } else if (pathname.startsWith("/farmer/crop/") || pathname.startsWith("/buyer/crop/")) {
        const cropId = pathname.split("/crop/")[1];
        const crop = crops.find(c => String(c.id) === String(cropId));
        if (crop) {
            pageTitle = `Crop Details: ${crop.name}`;
            activeEntity = {
                type: "crop",
                id: crop.id,
                name: crop.name,
                variety: crop.variety,
                quantity: `${crop.quantity} ${crop.unit}`,
                floorPrice: `₹${crop.floorPrice}`,
                currentBid: `₹${crop.currentBid}`,
                totalBids: crop.totalBids,
                aiQualityScore: crop.aiQualityScore || 92,
                moisture: `${crop.moisture}%`,
                location: `${crop.location}, ${crop.state}`,
                farmerName: crop.farmerName,
                status: crop.status
            };
            screenSummary = `Viewing Lot #${crop.id}: ${crop.name} (Current Bid ₹${crop.currentBid}/${crop.unit})`;
            quickSuggestions = [
                `या स्क्रीनवरील ${crop.name} चा भाव बाजारापेक्षा चांगला आहे का?`,
                `What does moisture level ${crop.moisture}% mean for storage?`,
                `How do I accept or counter this bid?`,
                `What are the delivery terms for ${crop.location}?`
            ];
        }
    } else if (pathname.includes("/farmer/add-crop")) {
        pageTitle = "Crop Listing Studio & AI Inspection (नवीन पीक नोंदणी)";
        screenSummary = "Adding a new crop listing with AI Quality grading";
        quickSuggestions = [
            "माझ्या पिकासाठी किमान भाव (Floor Price) कसा ठरवावा?",
            "How does AI Quality Scanner calculate grades?",
            "What is the ideal moisture limit for Grade A?",
            "How soon will verified buyers start bidding?"
        ];
    } else if (pathname.includes("/farmer/dashboard")) {
        pageTitle = "Farmer Commercial Dashboard (शेतकरी डॅशबोर्ड)";
        screenSummary = "Reviewing farm revenues, active listings, and market stats";
        quickSuggestions = [
            "माझी विक्री व बँक खात्यातील रक्कम कशी तपासावी?",
            "How to optimize my active listings for maximum bids?",
            "When will escrow sales earnings be credited via DBT?",
            "How to download my monthly mandi sales summary?"
        ];
    } else if (pathname.includes("/profile")) {
        pageTitle = "User Profile & Operations Console (प्रोफाइल व ऑर्डर्स)";
        const currentTab = activeTab || domSnapshot?.activeTab || searchParams.get("tab") || "orders";
        screenSummary = `In Profile: ${currentTab.toUpperCase()} Section`;

        if (currentTab.toLowerCase().includes("order") || currentTab === "orders") {
            const activeOrder = orders[0];
            activeEntity = activeOrder ? {
                type: "order",
                id: activeOrder.id,
                cropName: activeOrder.cropName,
                status: activeOrder.status,
                totalAmount: `₹${activeOrder.totalAmount?.toLocaleString()}`,
                escrowStatus: activeOrder.escrowStatus,
                logisticsPartner: activeOrder.logisticsPartner,
                weighbridgeSlip: activeOrder.weighbridgeSlip
            } : null;

            screenSummary = activeOrder
                ? `Orders Console: Active #${activeOrder.id} (${activeOrder.status})`
                : "Reviewing multi-role orders & live bids";

            quickSuggestions = [
                "माझा ऑर्डर क्रमांक #ORD-9821 सध्या कोणत्या टप्प्यावर आहे?",
                "How does electronic weighbridge slip (Dharamkanta) verification work?",
                "When will funds in Escrow be released to my bank account?",
                "How do I track Sandhu Agri-Freight truck in real time?"
            ];
        } else if (currentTab.toLowerCase().includes("notif") || currentTab === "notifications") {
            const unreadCount = notifications.filter(n => !n.read).length;
            screenSummary = `Notifications Center (${unreadCount} unread alerts)`;
            quickSuggestions = [
                "मला आलेल्या ताज्या बोली (Bid) बद्दल माहिती सांगा",
                "How do I configure SMS/WhatsApp auction alerts?",
                "What happens when I receive an 'Outbid Alert'?",
                "Mark all my notifications as reviewed"
            ];
        } else if (currentTab.toLowerCase().includes("kyc") || currentTab === "kyc") {
            screenSummary = `KYC & Bank Verification (${user?.kycStatus === 'verified' ? 'Verified ✅' : 'Pending Review ⏳'})`;
            quickSuggestions = [
                "शेतकरी KYC साठी 7/12 उतारा आणि आधार कार्ड कसे जोडावे?",
                "Which bank documents are accepted for DBT auto-credit?",
                "How long does Aadhaar and PAN verification take?",
                "Why is KYC verification mandatory for e-NAM trading?"
            ];
        }
    } else if (pathname.includes("/settings")) {
        pageTitle = "System Settings & Language Configuration (सेटिंग्ज व भाषा)";
        screenSummary = "Configuring system preferences, language switcher, and account settings";
        quickSuggestions = [
            "या स्क्रीनवर कोणती भाषा व पर्याय निवडलेले आहेत?",
            "Explain all features available in Kisan Bazaar settings",
            "How do I change my operating role between Farmer and Buyer?",
            "How do I connect my Google Gemini API key for advanced AI?"
        ];
    } else if (pathname.includes("/logistics")) {
        pageTitle = "Logistics Dispatch & Cold Fleet Management (वाहतूक व्यवस्थापन)";
        screenSummary = "Managing freight routes, truck dispatches, and weighbridge slips";
        quickSuggestions = [
            "ट्रक क्र. PB 10 CQ 4412 सध्या कोठे पोहोचला आहे?",
            "How to upload the verified weighbridge receipt slip?",
            "What are the mandated temperature rules for Reefer trucks?",
            "What is the standard transit time from Karnal to Delhi Mandi?"
        ];
    } else if (pathname.includes("/services") || pathname.includes("/schemes") || pathname.includes("/advisory")) {
        pageTitle = "Agri-Services, Schemes & Weather Advisory (कृषी योजना व हवामान)";
        screenSummary = "Accessing CA cold storage locators, weather advisory, and schemes";
        quickSuggestions = [
            "नमो शेतकरी महासन्मान निधी व पीएम-किसान योजनेची माहिती द्या",
            "Find nearest CA cold storage for perishable vegetables",
            "How to apply for PM-Kisan Samman Nidhi DBT scheme?",
            "Check current 7-day weather advisory for farming"
        ];
    } else if (pathname.includes("/community")) {
        pageTitle = "Corporate Contract Farming Pools (अनुबंध शेती पूल)";
        screenSummary = "Browsing guaranteed buyback contracts (PepsiCo, Haldiram, etc.)";
        quickSuggestions = [
            "पेप्सिको व हल्दीराम सोबत थेट करार शेती कशी करावी?",
            "What is the minimum quantity needed to join an FPO pool?",
            "Are contract farming prices fixed regardless of market crash?",
            "How are input subsidies provided by corporate buyers?"
        ];
    }

    const cleanFarmSizeNum = String(user?.farmSize || "14.5").match(/[\d.]+/)?.[0] || "14.5";
    const contextPayload = {
        timestamp: new Date().toISOString(),
        user: {
            uid: user?.uid || "guest",
            role: user?.role || "farmer",
            name: user?.name || "Rajesh Kumar",
            location: user?.state ? `${user.district || ''}, ${user.state}` : "Maharashtra / Haryana",
            kycStatus: user?.kycStatus || "verified",
            farmSize: `${cleanFarmSizeNum} Acres`,
            primaryCrops: user?.primaryCrops || ["सोयाबीन (Soybean)", "कांदा (Onion)", "कापूस (Cotton)", "बासमती भात (Basmati)"],
            bankLinked: user?.bankName ? `${user.bankName} (DBT Active)` : "SBI Agri Branch (DBT Active)"
        },
        screen: {
            pathname,
            pageTitle,
            activeTab: activeTab || domSnapshot?.activeTab || searchParams.get("tab") || "default",
            summary: screenSummary,
            activeEntity,
            domSnapshot
        },
        platformStats: {
            totalLiveCrops: crops.length,
            totalOrders: orders.length,
            unreadNotificationsCount: notifications.filter(n => !n.read).length
        }
    };

    return {
        contextPayload,
        pageTitle,
        screenSummary,
        quickSuggestions,
        domSnapshot
    };
}
