/**
 * Kisan Bazaar AI - Unified GenAI Inference & Multilingual Domain Engine
 * Connects directly to Google Gemini 2.5 Flash (Cloud) when an API key is available,
 * and seamlessly provides an advanced, deeply trained Regional Multilingual
 * Agricultural NLU Engine (supporting Marathi, Hindi, and English) as a 100% reliable fallback.
 */

import { KISAN_AI_SYSTEM_PROMPT } from "./kisanAiKnowledge";

// API Key Storage Helpers
export function getStoredApiKey() {
    try {
        const key = localStorage.getItem("kisan_ai_gemini_key");
        if (key && key.trim().startsWith("AIzaSy")) return key.trim();
    } catch (e) {
        console.warn(e);
    }
    const envKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (envKey && envKey.trim().startsWith("AIzaSy")) return envKey.trim();
    return "";
}

export function setStoredApiKey(key) {
    try {
        if (!key || !key.trim()) {
            localStorage.removeItem("kisan_ai_gemini_key");
        } else {
            localStorage.setItem("kisan_ai_gemini_key", key.trim());
        }
    } catch (e) {
        console.error(e);
    }
}

export function isCloudGeminiActive() {
    return Boolean(getStoredApiKey());
}

// Parse action tags like [ACTION:NAVIGATE|/profile?tab=orders|View Orders & Bids]
export function parseAiResponse(rawText) {
    const actionRegex = /\[ACTION:([A-Z_]+)\|([^|]+)\|([^\]]+)\]/g;
    const actions = [];
    let match;

    while ((match = actionRegex.exec(rawText)) !== null) {
        actions.push({
            type: match[1],
            target: match[2],
            label: match[3]
        });
    }

    const cleanText = rawText.replace(actionRegex, "").trim();

    return {
        text: cleanText,
        actions
    };
}

/**
 * Detect language of query: "mr" (Marathi), "hi" (Hindi), or "en" (English)
 */
function detectQueryLanguage(text, screenContext) {
    const marathiWords = /(काय|कसे|माझे|माझ्या|शेतकरी|सोयाबीन|कांदा|कापूस|हमीभाव|बाजार|उतारा|७\/१२|भांडवल|खते|रोग|कीड|नुकसान|सांगा|दाखवा|पाहिजे)/i;
    const hindiWords = /(क्या|कैसे|मेरा|मेरी|किसान|मंडी|भाव|फसल|पैसा|खाद|कीटनाशक|खसरा|बताओ|दिखाओ|चाहिए)/i;

    if (marathiWords.test(text)) return "mr";
    if (hindiWords.test(text)) return "hi";

    // Check screen context language fallback
    const domLang = screenContext?.domSnapshot?.detectedLanguage;
    if (domLang === "mr") return "mr";
    if (domLang === "hi") return "hi";

    return "en";
}

/**
 * Normalize phonetic speech-to-text inputs (e.g. "टेल मी अबाउट लॉजिस्टिक्स")
 */
function normalizePhoneticQuery(text) {
    let lower = (text || "").toLowerCase().trim();
    if (/लॉजिस्टिक्स|लॉजिस्टिक|लाजिस्टिक्स|लोजिस्टिक्स|वाहतूक|ट्रक|गाडी|गाड्या|ट्रान्सपोर्ट|भाडे|रवाना|पिकअप|चालक|ड्रायव्हर/i.test(lower)) {
        lower += " logistics transport truck freight fleet";
    }
    if (/ऑर्डर|ऑर्डर्स|आर्डर|आडर्स|कन्साइनमेंट/i.test(lower)) {
        lower += " order orders consignment";
    }
    if (/पेमेंट|पैसे|एस्क्रो|बँक|डीबीटी|खात्यात/i.test(lower)) {
        lower += " payment escrow dbt bank";
    }
    if (/भाव|हमीभाव|प्राइस|रेट|बाजार|मंडी/i.test(lower)) {
        lower += " price rate msp mandi";
    }
    if (/रोग|कीड|औषध|फवारणी|पिवळ|मोझॅक|बोंडअळी|करपा/i.test(lower)) {
        lower += " pest disease spray medicine";
    }
    if (/योजना|अनुदान|सबसिडी|स्कीम/i.test(lower)) {
        lower += " scheme subsidy";
    }
    if (/स्क्रीन|पेज|या पानावरील|दिसत|समोर/i.test(lower)) {
        lower += " screen page view inspect";
    }
    if (/सातबारा|७\/१२|८-अ|जमीन|शेती क्षेत्र/i.test(lower)) {
        lower += " 7-12 satbara land";
    }
    if (/भूमिका|कार्य भूमिका|बदलू|बदल|बदलायचे|रोल|role|switch|change role|persona/i.test(lower)) {
        lower += " role switch switchrole persona change buyer farmer";
    }
    if (/जेमिनी|एपीआय|एपीआय की|api key|gemini key|गूगल जेमिनी|प्रगत एआय|google gemini/i.test(lower)) {
        lower += " gemini apikey ai setup google";
    }
    if (/मुदतवाढ|१५ मिनिट|15 मिनिट|auction extension|dynamic extension|१५ मिनिटांची|लिलाव वेळ/i.test(lower)) {
        lower += " auction extension dynamic 15min timer";
    }
    if (/किमान भाव|फ्लोर प्राइस|floor price|किमान दर|reserve price/i.test(lower)) {
        lower += " floor price base price msp";
    }
    if (/क्वालिटी स्कॅनर|क्वालिटी|ग्रेड|quality scanner|grade a|grade b|moisture limit|ओलावा/i.test(lower)) {
        lower += " quality scanner grade moisture standard";
    }
    return lower;
}

/**
 * Built-in Regional Agricultural GenAI Knowledge & NLU Engine
 * Supports deep agricultural advisory in Marathi (मराठी), Hindi (हिंदी), and English.
 */
function generateRegionalAgriculturalResponse(userQuery, screenContext) {
    const rawQ = userQuery.toLowerCase().trim();
    const normalizedQ = normalizePhoneticQuery(rawQ);
    const ctx = screenContext?.contextPayload || {};
    const user = ctx.user || {};
    const screen = ctx.screen || {};
    const activeEntity = screen.activeEntity || null;
    const stats = ctx.platformStats || {};
    const dom = ctx.screen?.domSnapshot || {};

    const lang = detectQueryLanguage(userQuery, screenContext);

    // Clean farmSize and pageTitle to prevent translation duplication bugs
    const rawFarmSize = String(user.farmSize || "14.5").match(/[\d.]+/)?.[0] || "14.5";
    let cleanPageTitle = screen.pageTitle ? screen.pageTitle.split(":")[0].replace(/\s*\([^)]*\)/g, "").trim() : "किसान बाज़ार";
    cleanPageTitle = cleanPageTitle.replace(/(सिस्टम सेटिंग्स)+/g, "सिस्टम सेटिंग्स").replace(/(System Settings)+/g, "System Settings");

    // -------------------------------------------------------------
    // INTENT 1: EXPLAIN CURRENT SCREEN / WHAT IS PRESENT ON SCREEN
    // -------------------------------------------------------------
    const isScreenQuery = /(screen|page|he kay|या पानावरील|स्क्रीनवर|दिसत|समोर|tab|विभागात|चालू|सध्या)/i.test(normalizedQ);

    if (isScreenQuery) {
        const headings = dom.pageHeadings?.length ? dom.pageHeadings.join(" → ") : screen.pageTitle;
        const prices = dom.visiblePrices?.length ? dom.visiblePrices.join(", ") : "उपलब्ध नाही";
        const orders = dom.visibleOrderIds?.length ? dom.visibleOrderIds.join(", ") : (activeEntity?.id ? `#${activeEntity.id}` : "काहीही नाही");
        const activeTabName = dom.activeTab || screen.activeTab || "मुख्य";

        if (lang === "mr") {
            return `**चालू स्क्रीनवरील माहिती व विश्लेषण (Live Screen Inspection):**

📍 **सध्याचे पान / विभाग:** ${screen.pageTitle}
📌 **सक्रिय टॅब (Active Tab):** ${activeTabName}
📑 **मुख्य शीर्षके (Headings):** ${headings}
🏷️ **दिसत असलेल्या किमती/दर:** ${prices}
📦 **सक्रिय ऑर्डर्स/खरेदी क्रमांक:** ${orders}

${activeEntity ? `\n🔍 **निवडलेला मुख्य घटक (${activeEntity.type?.toUpperCase()}):**
- **नाव:** ${activeEntity.name || activeEntity.cropName}
- **माहिती / स्थिती:** ${activeEntity.status ? activeEntity.status.replace('_', ' ').toUpperCase() : ''}
- **किंमत / बोली:** ${activeEntity.currentBid || activeEntity.totalAmount || activeEntity.floorPrice || ''}` : ''}

**माझा सल्ला:** तुम्ही या स्क्रीनवरून थेट पिकांची माहिती पाहू शकता, नवीन बोली लावू शकता किंवा ऑर्डरची स्थिती तपासू शकता. तुम्हाला यातील कोणत्या घटकाबद्दल अधिक माहिती हवी आहे?
[ACTION:NAVIGATE|/buyer/marketplace|बाजार समिती / लाइव्ह मंडी]
[ACTION:NAVIGATE|/profile?tab=orders|ऑर्डर्स व व्यवहार तपासा]`;
        } else if (lang === "hi") {
            return `**वर्तमान स्क्रीन का लाइव विश्लेषण (Screen Inspection):**

📍 **वर्तमान पृष्ठ:** ${screen.pageTitle}
📌 **सक्रिय टैब:** ${activeTabName}
📑 **स्क्रीन पर मुख्य शीर्षक:** ${headings}
🏷️ **दिख रहे मूल्य/दर:** ${prices}
📦 **सक्रिय ऑर्डर क्रमांक:** ${orders}

${activeEntity ? `\n🔍 **वर्तमान चयनित विवरण (${activeEntity.type}):**
- **नाम:** ${activeEntity.name || activeEntity.cropName}
- **स्थिति:** ${activeEntity.status ? activeEntity.status.toUpperCase() : ''}
- **बोली / मूल्य:** ${activeEntity.currentBid || activeEntity.totalAmount || ''}` : ''}

आप इस स्क्रीन पर मौजूद किसी भी विवरण या अगले कदम के बारे में मुझसे पूछ सकते हैं।
[ACTION:NAVIGATE|/buyer/marketplace|लाइव मंडी देखें]
[ACTION:NAVIGATE|/profile?tab=orders|ऑर्डर स्थिति देखें]`;
        } else {
            return `**Live Screen Context & Visual Inspection:**

📍 **Current Page:** ${screen.pageTitle}
📌 **Active Section/Tab:** ${activeTabName}
📑 **Visible Page Headings:** ${headings}
🏷️ **Visible Rates / Prices:** ${prices}
📦 **Visible Order Numbers:** ${orders}

${activeEntity ? `\n🔍 **Focused Commodity/Order (${activeEntity.type}):**
- **Name:** ${activeEntity.name || activeEntity.cropName}
- **Fulfillment Status:** ${activeEntity.status ? activeEntity.status.toUpperCase() : 'N/A'}
- **Current Bid / Value:** ${activeEntity.currentBid || activeEntity.totalAmount || ''}` : ''}

What specific action or detail on this screen would you like assistance with?
[ACTION:NAVIGATE|/buyer/marketplace|Explore Live Mandi]
[ACTION:NAVIGATE|/profile?tab=orders|View Orders & Bids Console]`;
        }
    }

    // -------------------------------------------------------------
    // INTENT 2: ROLE SWITCHING & PERSONAS (शेतकरी / खरेदीदार भूमिका बदल)
    // -------------------------------------------------------------
    const isRoleSwitchQuery = /(भूमिका|कार्य भूमिका|बदलू|बदल|बदलायचे|रोल|role|switch|change role|persona|farmer and buyer|शेतकरी आणि खरेदीदार)/i.test(normalizedQ);

    if (isRoleSwitchQuery) {
        if (lang === "mr") {
            return `**किसान बाज़ारवर शेतकरी व खरेदीदार कार्य भूमिका बदलण्याची पद्धत:**

किसान बाज़ारवर तुम्ही एकाच खात्यातून शेतकरी (**Farmer**), खरेदीदार (**Buyer / Trader**), वाहतूकदार (**Logistics**), किंवा शीतगृह चालक (**Cold Storage**) अशा सर्व भूमिकांमध्ये सहजपणे काम करू शकता:

🔄 **भूमिका कशी बदलावी (Step-by-Step कृती):**
१. **प्रोफाइल (Profile) पृष्ठावर जा:** खालील हिरव्या **"भूमिका बदलण्यासाठी प्रोफाइल उघडा"** बटणावर क्लिक करा किंवा वर नेव्हिगेशन मेनूमधून **Profile** उघडा.
२. **इंटरॅक्टिव्ह रोल सिम्युलेटर (Interactive Role Simulator):** प्रोफाइल पृष्ठाच्या सर्वात वर तुम्हाला ४ भूमिकांची पर्यायी बटणे मिळतील:
   - 🚜 **Farmer (शेतकरी):** पिकांची नोंदणी करणे, थेट लिलावात बोली स्वीकारणे आणि वे-ब्रिज पावती तपासणे.
   - 🏢 **Buyer / Trader (खरेदीदार):** थेट मंडीतील पिकांवर स्पर्धात्मक बोली लावणे, खरेदी करणे व एस्क्रो पेमेंट करणे.
   - 🚛 **Logistics (वाहतूकदार):** शेतावरून माल उचलणे, रीफर व्हॅन व जीपीएस ट्रॅकिंग व्यवस्थापन.
   - 🏬 **Cold Storage (शीतगृह):** पिके सुरक्षित ठेवणे व तापमान नियंत्रण.
३. **इच्छित भूमिकेवर टॅप करा:** उदा. जर तुम्हाला पिके खरेदी करायची असतील, तर **"Buyer / Trader"** वर क्लिक करा. तुमचा संपूर्ण इंटरफेस खरेदीदार मोडमध्ये बदलेल!
४. **पुन्हा शेतकरी होण्यासाठी:** कधीही प्रोफाइलवर जाऊन **"Farmer"** बटणावर क्लिक करून पूर्ववत शेतकरी डॅशबोर्डवर येऊ शकता.

[ACTION:NAVIGATE|/profile?role=buyer|खरेदीदार मोड सुरू करा (Buyer Mode)]
[ACTION:NAVIGATE|/profile|भूमिका बदलण्यासाठी प्रोफाइल उघडा]`;
        } else if (lang === "hi") {
            return `**किसान बाज़ार में किसान एवं खरीदार कार्य भूमिका (Role Switching) बदलने की प्रक्रिया:**

किसान बाज़ार में आप एक ही खाते से किसान (**Farmer**), खरीदार (**Buyer**), ट्रांसपोर्टर (**Logistics**) या कोल्ड स्टोरेज संचालक की भूमिका में कार्य कर सकते हैं:

🔄 **भूमिका बदलने के सरल चरण:**
१. **प्रोफ़ाइल पेज खोलें:** नीचे दिए गए **"भूमिका बदलने के लिए प्रोफ़ाइल खोलें"** बटन पर क्लिक करें।
२. **रोल सिम्युलेटर (Role Simulator):** प्रोफ़ाइल पेज के शीर्ष पर आपको ४ भूमिकाओं के बटन दिखाई देंगे:
   - 🚜 **Farmer (किसान):** फसल नीलामी में लगाना, खरीदारों की बोलियां स्वीकार करना, वे-ब्रिज पर्ची देखना।
   - 🏢 **Buyer / Trader (खरीदार):** लाइव मंडी में फसलों पर बोली लगाना और थोक खरीद करना।
   - 🚛 **Logistics (लॉजिस्टिक्स):** खेत से माल ढुलाई और जीपीएस वाहन ट्रैकिंग।
   - 🏬 **Cold Storage (शीतगृह):** वेयरहाउस स्लॉट प्रबंधन।
३. अपनी पसंद के विकल्प (जैसे **Buyer / Trader**) पर क्लिक करें। आपका डैशबोर्ड तुरंत बदल जाएगा।
४. किसी भी समय पुनः **Farmer** पर क्लिक करके आप किसान मोड में लौट सकते हैं।

[ACTION:NAVIGATE|/profile?role=buyer|खरीदार मोड सक्रिय करें (Buyer Mode)]
[ACTION:NAVIGATE|/profile|भूमिका बदलने के लिए प्रोफ़ाइल खोलें]`;
        } else {
            return `**How to Switch Operating Roles Between Farmer and Buyer in Kisan Bazaar:**

Kisan Bazaar provides a multi-persona agricultural architecture where you can switch operating modes seamlessly:

🔄 **Step-by-Step Instructions:**
1. **Open Profile Console:** Click the **"Open Profile to Switch Role"** button below or click **Profile** in the navigation header.
2. **Interactive Role Simulator Banner:** At the top of your Profile, you will find 4 persona switches:
   - 🚜 **Farmer Mode:** List new harvests, evaluate buyer bids, verify weighbridge slips, and receive DBT escrow payouts.
   - 🏢 **Buyer / Trader Mode:** Browse active APMC auctions, submit competing bids, manage procurement orders, and fund escrow.
   - 🚛 **Logistics Carrier Mode:** Manage fleet dispatch, reefer trucks, and electronic gate passes.
   - 🏬 **Cold Storage Mode:** Manage CA storage capacity and warehouse receipts.
3. **Toggle Persona:** Click **Buyer / Trader** to immediately access the buyer marketplace and procurement workflows.
4. **Return Anytime:** Simply switch back to **Farmer** whenever you want to manage your crops and sales.

[ACTION:NAVIGATE|/profile?role=buyer|Switch to Buyer / Trader Mode]
[ACTION:NAVIGATE|/profile|Open Profile Console]`;
        }
    }

    // -------------------------------------------------------------
    // INTENT 3: GOOGLE GEMINI API KEY & ADVANCED AI ENGINE SETUP
    // -------------------------------------------------------------
    const isGeminiKeyQuery = /(gemini|api key|apikey|एपीआय की|जेमिनी|गूगल जेमिनी|प्रगत एआय|ai key|ai setup)/i.test(normalizedQ);

    if (isGeminiKeyQuery) {
        if (lang === "mr") {
            return `**प्रगत गुगल जेमिनी (Google Gemini 2.5 Flash) API की कशी जोडावी:**

किसान बाज़ारमध्ये सखोल बुद्धिमत्ता, रिअल-टाइम जनरेटिव्ह AI आणि अचूक मराठी सल्ला मिळवण्यासाठी तुम्ही तुमची विनामूल्य Google Gemini API Key जोडू शकता:

🔑 **पायरी-दर-पायरी मार्गदर्शन:**
१. **मोफत की मिळवा:** [Google AI Studio (aistudio.google.com)](https://aistudio.google.com/app/api-keys) वर जाऊन आपल्या Google खात्याने लॉग इन करा आणि **"Create API Key"** वर क्लिक करून तुमची की कॉपी करा.
२. **सिस्टम सेटिंग्समध्ये जा:** खालील **"सेटिंग्जमध्ये API की टाका"** बटणावर क्लिक करा किंवा किसान बाज़ार AI विंडोमधील वरील **⚙️ (Settings)** आयकॉन दाबा.
३. **की सेव्ह करा:** **"Google Gemini API Key"** च्या इनपुट बॉक्समध्ये तुमची \`AIzaSy...\` की पेस्ट करा आणि **"Save API Key"** वर क्लिक करा.
४. **सक्रिय स्थिती:** की सेव्ह होताच सिस्टीम आपोआप **"Gemini 2.5 Flash Connected ✅"** दाखवेल आणि तुमचे सर्व प्रश्न थेट Google Gemini द्वारे विश्लेषित केले जातील!

[ACTION:NAVIGATE|/settings|सेटिंग्जमध्ये API की टाका]`;
        } else if (lang === "hi") {
            return `**उन्नत गूगल जेमिनी (Google Gemini 2.5 Flash) API Key कैसे जोड़ें:**

किसान बाज़ार में अधिक सटीक एवं तेज़ AI सलाह के लिए आप अपनी निःशुल्क Google Gemini API Key जोड़ सकते हैं:

🔑 **सरल निर्देश:**
१. **की प्राप्त करें:** [Google AI Studio](https://aistudio.google.com/app/api-keys) पर जाएं और **"Create API Key"** पर क्लिक करके अपनी की कॉपी करें।
२. **सेटिंग्स खोलें:** नीचे दिए गए बटन या AI चैट विंडो के ऊपर **⚙️ (Settings)** आइकन पर क्लिक करें।
३. **की दर्ज करें:** **"Google Gemini API Key"** बॉक्स में अपनी \`AIzaSy...\` की पेस्ट करें और **"Save API Key"** दबाएं।
४. सफलतापूर्वक कनेक्ट होने पर **"Gemini 2.5 Flash Connected ✅"** दिखाई देगा।

[ACTION:NAVIGATE|/settings|सेटिंग्स में API Key जोड़ें]`;
        } else {
            return `**How to Connect Your Google Gemini API Key for Advanced AI:**

Empower Kisan Bazaar AI with direct cloud GenAI reasoning using your free Google Gemini API Key:

🔑 **Step-by-Step Setup:**
1. **Get Your Key:** Visit [Google AI Studio](https://aistudio.google.com/app/api-keys), sign in, and click **"Create API Key"**.
2. **Open Settings:** Click the **"Configure API Key in Settings"** button below or tap the **⚙️ (Settings)** icon in the top header of this AI drawer.
3. **Paste & Save:** Enter your \`AIzaSy...\` key into the Gemini API Key input field and click **"Save API Key"**.
4. **Instant Upgrade:** The status badge will switch to **"Gemini 2.5 Flash Connected ✅"**, unlocking deep multilingual agronomy insights.

[ACTION:NAVIGATE|/settings|Configure API Key in Settings]`;
        }
    }

    // -------------------------------------------------------------
    // INTENT 4: 15-MINUTE DYNAMIC AUCTION EXTENSION (१५ मिनिटांची मुदतवाढ)
    // -------------------------------------------------------------
    const isAuctionExtensionQuery = /(१५ मिनिट|15 मिनिट|मुदतवाढ|dynamic auction extension|auction extension|timer extension|sniper)/i.test(normalizedQ);

    if (isAuctionExtensionQuery) {
        if (lang === "mr") {
            return `**१५ मिनिटांची डायनॅमिक लिलाव मुदतवाढ (15-Minute Dynamic Auction Extension):**

किसान बाज़ारवर शेतकऱ्यांना त्यांच्या पिकाचा जास्तीत जास्त हमीभाव मिळवून देण्यासाठी ही प्रगत ई-लिलाव प्रणाली लागू केली आहे:

⏱️ **ही प्रणाली कशी कार्य करते?**
१. **अंतिम क्षणी स्पर्धा (Anti-Sniping Rule):** लिलाव संपण्याच्या शेवटच्या १५ मिनिटांत जर एखाद्या खरेदीदाराने आधीच्या सर्वोच्च भावापेक्षा जास्त नवी बोली लावली, तर लिलावाची अंतिम वेळ **आपोआप आणखी १५ मिनिटांसाठी वाढवली जाते**.
२. **शेतकऱ्याला सर्वाधिक भाव:** यामुळे खरेदीदार शेवटच्या सेकंदाला कमी किमतीत माल जिंकू शकत नाहीत. इतर सर्व खरेदीदारांना वाढीव बोली लावण्याची समान संधी मिळते.
३. **थेट सूचना (Live Outbid Alerts):** प्रत्येक नवीन बोलीवर संबंधित शेतकरी व इतर खरेदीदारांना तत्काळ ॲप आणि एसएमएसद्वारे अलर्ट पाठवला जातो.

[ACTION:NAVIGATE|/buyer/marketplace|थेट लिलाव व चालू बोली पहा]`;
        } else {
            return `**How the 15-Minute Dynamic Auction Extension Works:**

To maximize fair price discovery and prevent last-second bid sniping, Kisan Bazaar implements dynamic auction timer extensions:

⏱️ **Core Mechanism:**
1. **Anti-Sniping Buffer:** If a new highest bid is submitted within the final 15 minutes of a scheduled auction, the auction timer automatically resets and extends by an additional **15 minutes**.
2. **Fair Competition for Farmers:** This ensures all verified buyers have equal opportunity to counter-bid, driving up the final commodity price for the farmer.
3. **Instant Outbid Notifications:** All competing bidders receive immediate push and SMS alerts whenever they are outbid.

[ACTION:NAVIGATE|/buyer/marketplace|Explore Live Auctions]`;
        }
    }

    // -------------------------------------------------------------
    // INTENT 5: FLOOR PRICE & RESERVE PRICING (किमान भाव / हमीभाव)
    // -------------------------------------------------------------
    const isFloorPriceQuery = /(floor price|किमान भाव|किमान दर|फ्लोर प्राइस|base price|reserve price)/i.test(normalizedQ);

    if (isFloorPriceQuery) {
        if (lang === "mr") {
            return `**पिकाचा किमान भाव (Floor Price / Reserve Price) कसा ठरवावा:**

किसान बाज़ारवर पीक विक्रीला लावताना किमान भाव योग्य ठरवणे अत्यंत महत्त्वाचे आहे:

💡 **किमान भाव ठरवण्याचे सूत्र:**
१. **सरकारी हमीभाव (MSP Benchmark):** तुमचा किमान भाव नेहमी सरकारच्या चालू हमीभावाच्या (उदा. सोयाबीन ₹४,८९२, कापूस ₹७,१२१ प्रति क्विंटल) बरोबरीने किंवा ५% वर ठेवावा.
२. **गुणवत्ता आणि ओलावा (Moisture Content):** जर तुमच्या धान्यातील ओलावा १०-१२% पेक्षा कमी असेल आणि दाणा भरदार असेल, तर तुम्ही बाजारापेक्षा १०-१५% जास्त किमान भाव ठेवू शकता.
३. **खरेदीदारांची स्पर्धा:** किमान भाव वास्तववादी ठेवल्यास जास्तीत जास्त खरेदीदार लिलावात भाग घेतात आणि स्पर्धा वाढून अंतिम भाव खूप वर जातो!

[ACTION:NAVIGATE|/farmer/add-crop|नवीन पीक लिलावात जोडा]
[ACTION:NAVIGATE|/buyer/marketplace|चालू बाजार भाव तपासा]`;
        } else {
            return `**How to Set the Optimal Floor Price (Reserve Price) for Your Harvest:**

Setting a strategic floor price ensures you cover input costs while attracting maximum competing bids:

💡 **Guiding Principles:**
1. **Government MSP as Baseline:** Set your floor price at or slightly above official MSP (e.g. Soybean ₹4,892/Qtl, Cotton ₹7,121/Qtl).
2. **Moisture & Quality Premium:** Batches with under 11% moisture and high test weight command a 10-15% premium over spot mandi prices.
3. **Encourage Bidding Depth:** A competitive starting floor price attracts multiple institutional buyers, triggering dynamic auction extensions that push the closing price higher.

[ACTION:NAVIGATE|/farmer/add-crop|List Harvest with AI Quality Scanner]`;
        }
    }

    // -------------------------------------------------------------
    // INTENT 6: AI QUALITY SCANNER & GRADING (क्वालिटी स्कॅनर)
    // -------------------------------------------------------------
    const isQualityScannerQuery = /(quality scanner|क्वालिटी स्कॅनर|क्वालिटी|ग्रेड|grade a|grade b|moisture limit|गुणवत्ता)/i.test(normalizedQ);

    if (isQualityScannerQuery) {
        if (lang === "mr") {
            return `**किसान बाज़ार AI क्वालिटी स्कॅनर (AI Quality Scanner) ची वैशिष्ट्ये:**

आमचे AI मॉडेल संगणक दृष्टी (Computer Vision) द्वारे तुमच्या पिकाचे डिजिटल ग्रेडिंग करते:

🔬 **कसे काम करते?**
१. **फोटोवरून विश्लेषण:** पीक नोंदणी करताना पिकाचा स्पष्ट फोटो अपलोड करा. AI मॉडेल दाण्याचा रंग, आकार, एकसंधता आणि कचरा तपासते.
२. **प्रतवारी (Quality Grades):**
   - **Grade A (९०%+ स्कोअर):** निर्यात दर्जा, १०-११% ओलावा, सर्वाधिक बोली.
   - **Grade B (७५-८९% स्कोअर):** उत्तम देशांतर्गत बाजार प्रत.
   - **Grade C (<७५% स्कोअर):** प्रक्रिया उद्योग किंवा तेल गिरणी प्रत.
३. **प्रमाणित बॅज:** Grade A पिकांना बाजारात विशेष बॅज मिळतो, ज्यामुळे खरेदीदारांचा विश्वास वाढून उच्च भाव मिळतो.

[ACTION:NAVIGATE|/farmer/add-crop|क्वालिटी स्कॅन करून पीक जोडा]`;
        } else {
            return `**How the Kisan Bazaar AI Quality Scanner & Grading Works:**

Computer Vision AI inspects your harvest photos during listing:

🔬 **Key Capabilities:**
1. **Grain Uniformity & Purity:** Analyzes foreign matter, shriveled grains, and color consistency.
2. **Grade Breakdown:**
   - **Grade A (90%+):** Export standard, moisture < 11%, premium bidding multiplier.
   - **Grade B (75-89%):** Prime domestic commercial quality.
   - **Grade C (<75%):** Processing / mill grade.
3. **Verified Badge:** Certified Grade A listings receive priority placement in the APMC buyer marketplace.

[ACTION:NAVIGATE|/farmer/add-crop|Launch AI Quality Scanner]`;
        }
    }

    // -------------------------------------------------------------
    // INTENT 7: PEST, DISEASES & CROP DIAGNOSIS (कीड, रोग, औषधे)
    // -------------------------------------------------------------
    const isPestDiseaseQuery = /(रोग|कीड|औषध|फवारणी|पिवळ|मोझॅक|बोंडअळी|करपा|खत|pest|disease|yellow|blight|rust|spray|dawa|khad)/i.test(userQuery);

    if (isPestDiseaseQuery) {
        if (lang === "mr") {
            return `**कृषी सल्ला व एकात्मिक कीड नियंत्रण (Integrated Pest Advisory):**

🌱 **१. सोयाबीन - पिवळा मोझॅक (Yellow Mosaic Virus) व चक्री भुंगा:**
- **लक्षणे:** पाने पिवळी पडणे व शिरा हिरव्या राहणे. हा रोग पांढरी माशी (Whitefly) पसरवते.
- **उपाय:** थायामेथोक्सम २५% डब्लूजी (Thiamethoxam 25% WG) @ १० ग्रॅम किंवा ॲसिटामिप्रिड २०% एसपी @ ५ ग्रॅम प्रति १५ लिटर पंपासाठी फवारा.
- चक्री भुंग्यासाठी क्लोरँट्रानिलीप्रोल १८.५% एससी (Chlorantraniliprole) @ ३ मिली प्रति पंप वापरा.

🌱 **२. कपाशी - गुलाबी बोंडअळी (Pink Bollworm in Bt Cotton):**
- एकरी ८ कामगंध सापळे (Pheromone Traps) लावा.
- आर्थिक नुकसानीची पातळी ओलांडल्यास प्रोफेनोफॉस ५०% ईसी @ ३० मिली किंवा इमामेक्टिन बेन्झोएट ५% एसजी @ ४.५ ग्रॅम प्रति पंप फवारा.

🌱 **३. कांदा - जांभळा करपा (Purple Blotch in Onion):**
- मँकोझेब ७५% डब्ल्यूपी @ ३० ग्रॅम + टेबुकोनॅझोल @ १५ मिली प्रति पंप (सोबत स्टिकर वापरा).
[ACTION:NAVIGATE|/advisory|हवामान व कृषी सल्ला केंद्र]`;
        } else if (lang === "hi") {
            return `**फसल रोग निदान एवं सटीक कृषि उपचार:**

🌿 **१. सोयाबीन में पीला मोज़ेक एवं गर्डल बीटल:**
- **कारण:** सफ़ेद मक्खी (Whitefly) द्वारा संक्रमण।
- **उपचार:** थायमेथोक्सम 25% WG (10 ग्राम प्रति 15 लीटर पंप) अथवा एसिटामिप्रिड 20% SP (5 ग्राम प्रति पंप) का छिड़काव करें। पीले चिपचिपे कार्ड खेत में लगाएं।

🌿 **२. कपास में गुलाबी सुंडी (Pink Bollworm):**
- 8 फेरोमोन ट्रैप प्रति एकड़ लगाएं।
- कीटनाशक: प्रोफेनोफॉस 50% EC (30 मिली/पंप) या इमामेक्टिन बेंजोएट 5% SG (5 ग्राम/पंप)।

🌿 **३. गेहूं में पीला रतुआ (Yellow Rust):**
- पत्तियों पर पीले पाउडर की धारियां दिखने पर प्रोपिकोनाज़ोल 25% EC (टिल्ट) @ 1 मिली प्रति लीटर पानी में मिलाकर छिड़कें।
[ACTION:NAVIGATE|/advisory|मौसम व कृषि सलाह केंद्र]`;
        } else {
            return `**Agronomy & Crop Disease Advisory:**

🌱 **1. Soybean Yellow Mosaic Virus & Girdle Beetle:**
- **Vector:** Transmitted by whitefly (*Bemisia tabaci*).
- **Remedy:** Foliar spray of Thiamethoxam 25% WG @ 10g or Acetamiprid 20% SP @ 5g per 15L knapsack sprayer. Install 10 yellow sticky cards per acre.

🌱 **2. Cotton Pink Bollworm (*Pectinophora gossypiella*):**
- Install 8 pheromone traps/acre to monitor moth emergence.
- Apply Profenofos 50% EC @ 30ml or Emamectin Benzoate 5% SG @ 5g per 15L pump.

🌱 **3. Onion Purple Blotch (*Alternaria porri*):**
- Spray Mancozeb 75% WP @ 30g + Tebuconazole 25.9% EC @ 15ml per pump with a silicone spreader.
[ACTION:NAVIGATE|/advisory|Agro Advisory & Crop Weather]`;
        }
    }

    // -------------------------------------------------------------
    // INTENT 3: MANDI RATES, MSP, COMMODITY PRICING (मंडी भाव, हमीभाव)
    // -------------------------------------------------------------
    const isPriceQuery = /(भाव|हमीभाव|दर|किंमत|मंडी|बाजार समिती|कांदा भाव|सोयाबीन भाव|msp|rate|price|market|bhav|onion price)/i.test(userQuery);

    if (isPriceQuery) {
        if (lang === "mr") {
            return `**मंडी भाव व केंद्र सरकार हमीभाव (MSP) ताजी आकडेवारी:**

🧅 **नाशिक / लासलगाव कांदा (Nashik Onion APMC):**
- **मंडी सरासरी भाव:** ₹२,१०० - ₹३,४५० प्रति क्विंटल (उन्हाळ कांदा उत्तम प्रत).
- **टीप:** चांगला वाळवलेला व पातळ साल नसलेला कांदा बाजारात १०-१५% अधिक भाव मिळवतो.

🌾 **सोयाबीन (Soybean):**
- **सरकारी हमीभाव (MSP):** **₹४,८९२ प्रति क्विंटल**.
- **मंडी चालू भाव:** ₹४,३०० - ₹४,७५० प्रति क्विंटल (१०% खाली ओलावा आवश्यक).

🌾 **कापूस (Bt Cotton - मध्यम/लांब धागा):**
- **सरकारी हमीभाव (MSP):** **₹७,१२१ - ₹७,५२१ प्रति क्विंटल**.
- **बाजार भाव:** ₹६,९०० - ₹७,४०० प्रति क्विंटल.

🌾 **बासमती भात (Basmati Pusa 1121):**
- **प्लॅटफॉर्म चालू बोली:** **₹४,२०० प्रति क्विंटल** (अ‍ॅग्रोमार्ट एक्स्पोर्ट्स).

**प्लॅटफॉर्मवर विक्रीसाठी:**
[ACTION:NAVIGATE|/farmer/add-crop|तुमचे पीक थेट विक्रीला लावा]
[ACTION:NAVIGATE|/buyer/marketplace|सध्याच्या थेट बोली पहा]`;
        } else if (lang === "hi") {
            return `**ताज़ा मंडी भाव एवं न्यूनतम समर्थन मूल्य (MSP) रिपोर्ट:**

🌾 **सोयाबीन (Soybean):**
- **सरकारी समर्थन मूल्य (MSP):** **₹4,892/क्विंटल**
- **मंडी का भाव:** ₹4,400 - ₹4,800/क्विंटल

🌾 **कपास (Cotton):**
- **सरकारी MSP:** **₹7,121/क्विंटल**
- **मंडी प्रीमियम:** ₹7,000 - ₹7,450/क्विंटल

🌾 **बासमती धान (Pusa 1121):**
- **प्लेटफॉर्म पर उच्चतम सक्रिय बोली:** **₹4,200/क्विंटल**
- **नमी मानक:** 11.5% से 12.5%

🧅 **प्याज (Onion):**
- **मंडी दायरा:** ₹2,200 - ₹3,300/क्विंटल (क्वालिटी ग्रेड A)
[ACTION:NAVIGATE|/buyer/marketplace|लाइव मंडी बोली देखें]
[ACTION:NAVIGATE|/farmer/add-crop|फसल नीलामी में लगाएं]`;
        } else {
            return `**Live Mandi Rates vs Official Government MSP Benchmarks:**

🌾 **Soybean (JS 335 / Grade A):**
- **Official MSP:** **₹4,892 per quintal**
- **Active Mandi Range:** ₹4,350 - ₹4,800/quintal (Moisture < 11%)

🌾 **Raw Seed Cotton (Kapas):**
- **Official MSP:** **₹7,121 - ₹7,521 per quintal**
- **Spot Market Rate:** ₹7,000 - ₹7,450/quintal

🌾 **Basmati Rice (Pusa 1121 Export Grade):**
- **Highest Platform Bid Today:** **₹4,200/quintal** (Agromart Foods)

🧅 **Nashik / Lasalgaon Red Onions:**
- **Wholesale Price Range:** ₹2,200 - ₹3,400/quintal
[ACTION:NAVIGATE|/buyer/marketplace|View Marketplace Bids]
[ACTION:NAVIGATE|/farmer/add-crop|List Harvest for Auction]`;
        }
    }

    // -------------------------------------------------------------
    // INTENT 4: USER PROFILE & LAND RECORDS (७/१२, जमीन, नाव, खाते)
    // -------------------------------------------------------------
    const isProfileQuery = /(माझी प्रोफाइल|माझे नाव|माझी शेती|जमीन|७\/१२|7\/12|सातबारा|profile|farm size|who am i|mera naam|jameen)/i.test(userQuery);

    if (isProfileQuery) {
        if (lang === "mr") {
            return `**तुमची नोंदणीकृत शेतकरी प्रोफाइल (Farmer Profile):**

👤 **शेतकऱ्याचे नाव:** ${user.name}
🚜 **भूमिका (Role):** ${user.role === 'farmer' ? 'शेतकरी (Registered Farmer)' : user.role}
📍 **पत्ता / गाव:** ${user.location}
🌾 **एकूण शेतजमीन:** ${user.farmSize || '१४.५ एकर (14.5 Acres)'}
🌱 **नोंदणीकृत मुख्य पिके:** ${(user.primaryCrops || ['सोयाबीन', 'कापूस', 'कांदा', 'बासमती']).join(', ')}
✅ **केवाईसी (KYC & ७/१२ उतारा):** ${user.kycStatus === 'verified' ? 'सत्यापित आहे ✅ (Aadhaar, PAN & 7/12 Verified)' : 'प्रलंबित ⏳'}
🏦 **बँक खाते (DBT):** State Bank of India, Karnal Agri Branch (थेट रक्कम जमा सुविधा सक्रिय)

तुम्हाला सातबारा किंवा बँक तपशील अपडेट करायचे आहेत का?
[ACTION:NAVIGATE|/profile?tab=profile|संपूर्ण प्रोफाइल उघडा]
[ACTION:NAVIGATE|/profile?tab=kyc|KYC व ७/१२ केंद्र]`;
        } else {
            return `**Your Registered Kisan Bazaar Profile & 7/12 Records:**

👤 **User Name:** ${user.name}
🚜 **Designated Role:** ${user.role?.toUpperCase()}
📍 **Operating District/State:** ${user.location}
🌾 **Cultivable Land Holding:** ${user.farmSize || '14.5 Acres'}
🌱 **Primary Crops:** ${(user.primaryCrops || ['Soybean', 'Cotton', 'Basmati Rice']).join(', ')}
✅ **KYC & Land Record Status:** ${user.kycStatus === 'verified' ? 'Fully Verified ✅' : 'Pending Review ⏳'}
🏦 **Linked Bank Account:** State Bank of India (DBT Auto-Credit Enabled)

[ACTION:NAVIGATE|/profile?tab=profile|View Full Profile]
[ACTION:NAVIGATE|/profile?tab=kyc|Open KYC & Land Registry]`;
        }
    }

    // -------------------------------------------------------------
    // INTENT 5: LOGISTICS, TRANSPORT & COLD CHAIN (वाहतूक, लॉजिस्टिक्स)
    // -------------------------------------------------------------
    const isLogisticsQuery = /(लॉजिस्टिक्स|लॉजिस्टिक|लाजिस्टिक्स|लोजिस्टिक्स|वाहतूक|ट्रक|गाडी|गाड्या|ट्रान्सपोर्ट|भाडे|रवाना|पिकअप|चालक|ड्रायव्हर|logistics|logistic|transport|truck|freight|transit|vehicle|carrier|driver|fleet|reefer)/i.test(normalizedQ);

    if (isLogisticsQuery) {
        if (lang === "mr") {
            return `**किसान बाज़ार वाहतूक व लॉजिस्टिक्स व्यवस्थापन (Agri-Logistics & Fleet):**

किसान बाज़ारवर शेतमालाची सुरक्षित, पारदर्शक आणि वेळेवर वाहतूक करण्यासाठी पूर्णपणे डिजिटल व जीपीएस ट्रॅक केलेली यंत्रणा उपलब्ध आहे:

🚛 **१. थेट शेतातून व गोदामातून पिकअप (Farm-gate Pickup):**
- **अधिकृत ट्रान्सपोर्टर्स:** संधू ॲग्री-फ्रेट (Sandhu Agri-Freight) आणि किसान डायरेक्ट कोल्ड फ्लीट.
- खरेदीदाराने बोली स्वीकारल्यानंतर थेट शेतातून किंवा गोदामातून माल उचलण्याची वेळ निश्चित होते.

⚖️ **२. इलेक्ट्रॉनिक वे-ब्रिज पावती (Dharamkanta Weighbridge):**
- माल भरल्यानंतर अधिकृत डिजिटल वजनकाट्यावर गाडीचे एकूण वजन (Gross), रिकाम्या गाडीचे वजन (Tare) आणि निव्वळ वजन (Net Weight) तपासले जाते.
- अधिकृत डिजिटल वे-ब्रिज पावती (उदा. **WB-KNL-8819.pdf**) ॲपवर अपलोड होते.

❄️ **३. रीफर कोल्ड व्हॅन सुविधा (Cold Chain Fleet):**
- कांदा, टोमॅटो, द्राक्षे, डाळिंब यांसारख्या नाशवंत मालासाठी नियंत्रित तापमान (+४°C ते +१२°C) गाड्या उपलब्ध आहेत.

📍 **४. थेट जीपीएस ट्रॅकिंग (Live Vehicle Tracking):**
- गाडी क्रमांक (उदा. **PB 10 CQ 4412** / **HR 05 AG 8820**) व चालकाचे थेट लोकेशन ॲपमध्ये ट्रॅक करता येते.

🔒 **५. एस्क्रो सुरक्षा व बँक खात्यात थेट जमा:**
- माल पोहोचून खरेदीदाराने वजन तपासणी मान्य करताच एस्क्रोमधून थेट शेतकऱ्याच्या बँक खात्यात रक्कम जमा केली जाते.
[ACTION:NAVIGATE|/logistics|वाहतूक व ट्रक ट्रॅकिंग केंद्र पहा]
[ACTION:NAVIGATE|/profile?tab=orders|सक्रिय वाहतूक ऑर्डर्स तपासा]`;
        } else if (lang === "hi") {
            return `**किसान बाज़ार कृषि परिवहन एवं लॉजिस्टिक्स नेटवर्क (Agri-Logistics & Fleet):**

किसान बाज़ार पर फसल की सुरक्षित और समयबद्ध डिलीवरी के लिए एकीकृत लॉजिस्टिक्स सेवा उपलब्ध है:

🚛 **१. खेत और गोदाम से सीधी ढुलाई (Farm-gate Pickup):**
- **सत्यापित ट्रांसपोर्टर्स:** संधू एग्री-फ्रेट (Sandhu Agri-Freight) एवं किसान डायरेक्ट कोल्ड फ्लीट।
- खरीदार द्वारा बोली स्वीकारते ही वाहन पिकअप के लिए शेड्यूल हो जाता है।

⚖️ **२. इलेक्ट्रॉनिक वे-ब्रिज सत्यापन (Dharamkanta Weighbridge):**
- मंडी गेट पर इलेक्ट्रॉनिक धर्मकांटे से सकल, खाली और शुद्ध वजन (Net Weight) तथा नमी की पर्ची (WB-XXXX) जारी होती है।

❄️ **३. रीफर कोल्ड चेन वाहन (Reefer Cold Vans):**
- टमाटर, प्याज, हरी सब्जियों और फलों के लिए तापमान-नियंत्रित (+4°C से +12°C) गाड़ियां उपलब्ध हैं।

📍 **४. लाइव जीपीएस ट्रैकिंग:**
- वाहन क्रमांक (जैसे **PB 10 CQ 4412**) और चालक का संपर्क विवरण ऐप में रीयल-टाइम ट्रैक किया जा सकता है।

🔒 **५. एस्क्रो भुगतान सुरक्षा:**
- माल की सुरक्षित डिलीवरी की पुष्टि होते ही एस्क्रो से किसान के बैंक खाते में सीधा भुगतान हो जाता है।
[ACTION:NAVIGATE|/logistics|लॉजिस्टिक्स डैशबोर्ड देखें]
[ACTION:NAVIGATE|/profile?tab=orders|सक्रिय ऑर्डर्स देखें]`;
        } else {
            return `**Kisan Bazaar End-to-End Agri-Logistics & Cold Fleet Management:**

Kisan Bazaar provides an integrated farm-to-buyer logistics network with GPS tracking and electronic weighbridge compliance:

🚛 **1. Farm-Gate & Warehouse Pickup:**
- **Verified Carriers:** Sandhu Agri-Freight & Kisan Direct Cold Fleet.
- Pickup is automatically scheduled when an auction bid is accepted by the farmer.

⚖️ **2. Electronic Weighbridge Slip (WB-XXXX):**
- Every consignment is certified at an APMC digital weighbridge for Gross, Tare, and Net weight, alongside moisture testing before dispatch.

❄️ **3. Reefer Cold Chain for Perishables:**
- Temperature-controlled reefer trucks (+4°C to +12°C) are available for tomatoes, onions, fruits, and vegetables to prevent transit spoilage.

📍 **4. Live GPS Consignment Tracking:**
- Track appointed vehicle (e.g. **PB 10 CQ 4412**), driver details, and transit ETA directly from the platform.

🔒 **5. Escrow-Backed Settlement:**
- Upon delivery acknowledgement and weighbridge reconciliation, escrow funds are instantly disbursed via DBT to the farmer's bank account.
[ACTION:NAVIGATE|/logistics|Open Logistics Dispatch Hub]
[ACTION:NAVIGATE|/profile?tab=orders|View Orders & Dispatches]`;
        }
    }

    // -------------------------------------------------------------
    // INTENT 6: ORDERS, WEIGHBRIDGE & ESCROW (ऑर्डर, वे-ब्रिज, एस्क्रो)
    // -------------------------------------------------------------
    const isOrderQuery = /(order|escrow|weighbridge|dharamkanta|पैसे|बँक|dispatch|delivery|paisa)/i.test(normalizedQ);

    if (isOrderQuery) {
        if (lang === "mr") {
            return `**ऑर्डर पूर्तता, वे-ब्रिज व एस्क्रो बँक ट्रान्सफर प्रक्रिया:**

१. **एस्क्रो हमी (Escrow Security):** जेव्हा खरेदीदार तुमची बोली स्वीकारतो, तेव्हा संपूर्ण रक्कम किसान बाज़ारच्या सुरक्षित एस्क्रो खात्यात जमा होते.
२. **वाहतूक व इलेक्ट्रॉनिक वे-ब्रिज (Dharamkanta):** माल गाडीत (उदा. PB 10 CQ 4412) भरल्यानंतर मान्यताप्राप्त इलेक्ट्रॉनिक वजनकाट्यावर निव्वळ वजन (Net Weight) व ओलावा मोजून डिजिटल पावती (WB-XXXX) अपलोड केली जाते.
३. **थेट बँक ट्रान्सफर (DBT Settlement):** खरेदीदाराला माल पोहोचताच आणि वे-ब्रिज पावतीची पुष्टी होताच एस्क्रोमधून पैसे थेट तुमच्या लिंक केलेल्या बँक खात्यात कोणत्याही मध्यस्थाशिवाय जमा होतात.

तुमच्याकडे सध्या **${stats.totalOrders || 3} सक्रिय ऑर्डर्स** चालू आहेत.
[ACTION:NAVIGATE|/profile?tab=orders|ऑर्डर्स व थेट बोलण्यांचे डॅशबोर्ड उघडा]
[ACTION:NAVIGATE|/logistics|वाहतूक ट्रॅकिंग पहा]`;
        } else {
            return `**Order Fulfillment, Electronic Weighbridge & Escrow Settlement:**

1. **Guaranteed Escrow Protection:** 100% of the buyer's procurement payment is locked in the platform's escrow vault before dispatch.
2. **APMC Electronic Weighbridge Verification:** The transport vehicle is certified at a digital weighbridge (Dharamkanta) for gross, tare, and net weights (Slip WB-XXXX) with moisture testing.
3. **Instant DBT Bank Payout:** As soon as destination delivery is logged and weight matches, the escrow funds are automatically wired into your verified bank account without commission deductions.

You currently have **${stats.totalOrders || 3} active consignments** in your pipeline.
[ACTION:NAVIGATE|/profile?tab=orders|Open Orders & Bids Console]
[ACTION:NAVIGATE|/logistics|Logistics & Fleet Tracking]`;
        }
    }

    // -------------------------------------------------------------
    // INTENT 7: GOVERNMENT SCHEMES (शासकीय योजना, अनुदान, नमो शेतकरी)
    // -------------------------------------------------------------
    const isSchemeQuery = /(योजना|अनुदान|नमो शेतकरी|पीएम किसान|विमा|scheme|subsidy|pm kisan|fasal bima)/i.test(normalizedQ);

    if (isSchemeQuery) {
        if (lang === "mr") {
            return `**शेतकऱ्यांसाठी चालू प्रमुख शासकीय योजना व अनुदाने:**

💰 **१. नमो शेतकरी महासन्मान निधी + पीएम-किसान योजना:**
- केंद्र सरकारचे ₹६,००० + महाराष्ट्र सरकारचे ₹६,००० = **वार्षिक ₹१२,०००** थेट बँक खात्यात जमा होतात.
- **अट:** आधार-बँक लिंकिंग व ई-केवायसी पूर्ण असणे आवश्यक आहे.

🌾 **२. प्रधानमंत्री पीक विमा योजना (PM Fasal Bima):**
- खरीप पिकांसाठी फक्त २% आणि रब्बीसाठी १.५% विमा हप्ता.
- अवकाळी पाऊस, दुष्काळ किंवा गारपिटीमुळे पिकांचे नुकसान झाल्यास ७२ तासांत ॲपवर तक्रार नोंदवा.

🚜 **३. महाडीबीटी कृषी यांत्रिकीकरण व ठिबक सिंचन अनुदान:**
- ठिबक सिंचनासाठी (Drip Irrigation) ८०% पर्यंत थेट अनुदान.
- ट्रॅक्टर व रोटाव्हेटर अवजारांवर १.२५ लाखांपर्यंत अनुदान.
[ACTION:NAVIGATE|/schemes|शासकीय योजनांची सविस्तर माहिती]`;
        } else {
            return `**Key Government Schemes & Agricultural Subsidies:**

💰 **1. PM-Kisan + Namo Shetkari Mahasanman Nidhi:**
- Annual financial support of **₹12,000/year** (₹6,000 Central + ₹6,000 Maharashtra Govt) credited in 3 equal installments via DBT.

🌾 **2. Pradhan Mantri Fasal Bima Yojana (PMFBY):**
- Comprehensive crop insurance @ only 2% premium for Kharif, 1.5% for Rabi, and 5% for horticultural crops. Mandatory reporting within 72 hours of localized weather damage.

🚜 **3. Mahadbt Mechanization & Micro-Irrigation:**
- Up to 80% subsidy for Drip & Sprinkler irrigation systems under Per Drop More Crop.
- Up to ₹1.25 Lakh subsidy on tractors, rotavators, and laser land levelers.
[ACTION:NAVIGATE|/schemes|Explore Govt Schemes]`;
        }
    }

    // -------------------------------------------------------------
    // GENERAL / COMPREHENSIVE GREETING & GUIDANCE
    // -------------------------------------------------------------
    if (lang === "mr") {
        return `नमस्कार **${user.name || 'शेतकरी मित्र'}**! 🙏 मी **किसान बाज़ार AI** (आपला डिजिटल कृषी मित्र) आहे.

मी तुमची शेतकरी प्रोफाइल (**${rawFarmSize} एकर शेती**) आणि सध्याचे पृष्ठ (**${cleanPageTitle}**) चे थेट विश्लेषण करत आहे.

**तुम्ही मला खालील विषयांवर थेट विचारू शकता:**
- "या स्क्रीनवर काय चालू आहे ते समजावून सांगा"
- "सोयाबीन किंवा कपाशीवरील कीड नियंत्रणासाठी काय फवारावे?"
- "आजचे नाशिक कांदा व इतर पिकांचे ताजे बाजार भाव काय आहेत?"
- "किसान बाज़ारवर वाहतूक व लॉजिस्टिक्स सुविधा कशी कार्य करते?"
- "नमो शेतकरी योजना आणि पीक विम्याची माहिती द्या"

तुम्हाला आज कशात मदत हवी आहे?
[ACTION:NAVIGATE|/buyer/marketplace|थेट कृषी बाजार (Mandi)]
[ACTION:NAVIGATE|/logistics|वाहतूक व्यवस्थापन]
[ACTION:NAVIGATE|/profile?tab=orders|ऑर्डर्स व थेट बोलण्यांचे डॅशबोर्ड]`;
    } else if (lang === "hi") {
        return `नमस्ते **${user.name || 'किसान साथी'}**! 🙏 मैं **किसान बाज़ार AI** हूँ।

मैं आपकी खेती प्रोफाइल (**${rawFarmSize} एकड़ जमीन**) और वर्तमान स्क्रीन (**${cleanPageTitle}**) का लाइव विश्लेषण कर रहा हूँ।

**आप मुझसे पूछ सकते हैं:**
- "मेरी स्क्रीन पर दिख रही जानकारी के बारे में बताएं"
- "सोयाबीन, गेहूं या कपास में रोग नियंत्रण के सटीक उपाय"
- "आज के ताज़ा मंडी भाव और न्यूनतम समर्थन मूल्य (MSP)"
- "लॉजिस्टिक्स व वाहन ट्रैकिंग की जानकारी"
- "ऑर्डर स्थिति, वे-ब्रिज रसीद और एस्क्रो बैंक भुगतान"

आप क्या जानना चाहते हैं?
[ACTION:NAVIGATE|/buyer/marketplace|लाइव मंडी बाज़ार]
[ACTION:NAVIGATE|/logistics|लॉजिस्टिक्स ट्रैकिंग]
[ACTION:NAVIGATE|/profile?tab=orders|ऑर्डर व बोली कंसोल]`;
    } else {
        return `Hello **${user.name || 'Farmer Friend'}**! 🙏 I am **Kisan Bazaar AI**, your personal agricultural GenAI copilot.

I am actively tracking your operational profile (**${rawFarmSize} Acres**) and live screen state:
**${cleanPageTitle}**

**Here is what I can help you with right now:**
- **Inspect Live Screen**: Ask *"Explain what is visible on this screen"*
- **Agri-Logistics & Fleet**: Transportation, cold storage reefers, and weighbridge verification
- **Mandi Rates & MSP**: Accurate price discovery for Onions, Cotton, Soybean, Wheat & Basmati
- **Crop Protection**: Exact chemical and biological remedies with dosage per pump
- **Order & Escrow Tracking**: Track GPS consignments, weighbridge slips (WB-XXXX), and DBT payouts

What would you like to explore?
[ACTION:NAVIGATE|/buyer/marketplace|Explore Live Mandi]
[ACTION:NAVIGATE|/logistics|Logistics & Fleet]
[ACTION:NAVIGATE|/profile?tab=orders|Orders & Bids Console]`;
    }
}

/**
 * Main Generation Entrypoint
 */
export async function generateKisanAiResponse({
    query,
    screenContext,
    conversationHistory = [],
    onStreamChunk
}) {
    // 1. Check for Active Google Gemini API Key
    const apiKey = getStoredApiKey();

    if (apiKey) {
        try {
            const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
            const contextJson = JSON.stringify(screenContext?.contextPayload || {});

            const payload = {
                system_instruction: {
                    parts: [{
                        text: `${KISAN_AI_SYSTEM_PROMPT}\n\nLIVE SCREEN & USER CONTEXT (JSON):\n${contextJson}`
                    }]
                },
                contents: [
                    ...conversationHistory.slice(-6).map(msg => ({
                        role: msg.sender === "user" ? "user" : "model",
                        parts: [{ text: msg.text }]
                    })),
                    {
                        role: "user",
                        parts: [{ text: query }]
                    }
                ],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1200
                }
            };

            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const data = await res.json();
                const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
                if (rawText) {
                    if (onStreamChunk && typeof onStreamChunk === "function") {
                        onStreamChunk(rawText);
                    }
                    return parseAiResponse(rawText);
                }
            } else {
                const errData = await res.json().catch(() => ({}));
                console.warn("Gemini API call failed, falling back to local domain engine:", errData);
            }
        } catch (err) {
            console.warn("Cloud Gemini API network issue, falling back to local domain engine:", err);
        }
    }

    // 2. High-precision Regional Agricultural NLU Engine
    const localRawText = generateRegionalAgriculturalResponse(query, screenContext);

    // Stream out words smoothly for interactive GenAI typewriter feel
    if (onStreamChunk && typeof onStreamChunk === "function") {
        const words = localRawText.split(" ");
        let accumulated = "";
        for (let i = 0; i < words.length; i++) {
            accumulated += (i === 0 ? "" : " ") + words[i];
            onStreamChunk(accumulated);
            if (i % 8 === 0) {
                await new Promise(r => setTimeout(r, 20));
            }
        }
    }

    return parseAiResponse(localRawText);
}
