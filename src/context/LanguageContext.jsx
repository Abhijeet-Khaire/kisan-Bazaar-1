import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

/**
 * All 22 Scheduled Official Languages of the Republic of India + English
 */
export const INDIAN_LANGUAGES = [
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", region: "North / Central India", script: "Devanagari" },
  { code: "en", name: "English", nativeName: "English", region: "Pan-India & Global", script: "Latin" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", region: "Maharashtra & Goa", script: "Devanagari" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", region: "West Bengal, Tripura, Assam", script: "Bengali" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", region: "Andhra Pradesh & Telangana", script: "Telugu" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", region: "Tamil Nadu & Puducherry", script: "Tamil" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", region: "Gujarat, Daman & Diu", script: "Gujarati" },
  { code: "ur", name: "Urdu", nativeName: "اردو", region: "Pan-India & Telangana, UP, J&K", script: "Perso-Arabic", dir: "rtl" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", region: "Karnataka", script: "Kannada" },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ", region: "Odisha", script: "Odia" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", region: "Kerala & Lakshadweep", script: "Malayalam" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", region: "Punjab & Haryana", script: "Gurmukhi" },
  { code: "as", name: "Assamese", nativeName: "অসমীয়া", region: "Assam", script: "Assamese" },
  { code: "mai", name: "Maithili", nativeName: "मैथिली", region: "Bihar & Jharkhand", script: "Devanagari" },
  { code: "sat", name: "Santali", nativeName: "ᱥᱟᱱᱛᱟᱲᱤ", region: "Jharkhand, Odisha, WB", script: "Ol Chiki" },
  { code: "ks", name: "Kashmiri", nativeName: "कॉशुर / کٲشُر", region: "Jammu & Kashmir", script: "Perso-Arabic / Devanagari" },
  { code: "ne", name: "Nepali", nativeName: "नेपाली", region: "Sikkim & West Bengal", script: "Devanagari" },
  { code: "sd", name: "Sindhi", nativeName: "सिन्धी / سنڌي", region: "Gujarat, Maharashtra, Rajasthan", script: "Devanagari / Arabic" },
  { code: "kok", name: "Konkani", nativeName: "कोंकणी", region: "Goa, Karnataka, Maharashtra", script: "Devanagari" },
  { code: "doi", name: "Dogri", nativeName: "डोगरी", region: "Jammu & Himachal Pradesh", script: "Devanagari" },
  { code: "mni", name: "Manipuri (Meitei)", nativeName: "মৈতৈলোন্ / ꯃꯤꯇꯩꯂꯣꯟ", region: "Manipur", script: "Meetei Mayek / Bengali" },
  { code: "brx", name: "Bodo", nativeName: "बर'", region: "Assam & Northeast", script: "Devanagari" },
  { code: "sa", name: "Sanskrit", nativeName: "संस्कृतम्", region: "Classical Heritage / Pan-India", script: "Devanagari" }
];

/**
 * Key UI phrases translated across major Indian languages
 */
export const TRANSLATIONS = {
  en: {
    "nav.marketplace": "Marketplace",
    "nav.advisory": "Agro Advisory",
    "nav.schemes": "Govt Schemes",
    "nav.analytics": "AI Analytics",
    "nav.logistics": "Logistics",
    "nav.storage": "Storage",
    "nav.community": "Community",
    "nav.settings": "Settings & Language",
    "nav.profile": "Profile & KYC Center",
    "nav.logout": "Logout",
    "nav.login": "Login",
    "nav.register": "Register",
    "settings.title": "Language & Regional Settings",
    "settings.subtitle": "Select your preferred Indian language for KisanBazaar portal, advisories, and SMS alerts.",
    "settings.current": "Active Language",
    "settings.searchPlaceholder": "Search Indian language or region...",
    "settings.voiceTitle": "Agri Voice Assistant",
    "settings.voiceDesc": "Speak and listen to crop prices and weather advisories in your local language",
    "settings.smsTitle": "Mandi SMS & WhatsApp Alerts",
    "settings.smsDesc": "Receive real-time price updates in this language",
    "settings.save": "Save Language Preferences",
    "settings.applied": "Language changed successfully to",
    "role.farmer": "Farmer",
    "role.buyer": "Buyer / Trader",
    "role.logistics": "Logistics",
    "role.storage": "Cold Storage",
    "action.edit": "Edit",
    "action.save": "Save",
    "action.cancel": "Cancel",
    "action.search": "Search"
  },
  hi: {
    "nav.marketplace": "कृषि मंडी",
    "nav.advisory": "कृषि सलाह",
    "nav.schemes": "सरकारी योजनाएं",
    "nav.analytics": "एआई एनालिटिक्स",
    "nav.logistics": "परिवहन (लॉजिस्टिक्स)",
    "nav.storage": "कोल्ड स्टोरेज",
    "nav.community": "किसान समुदाय",
    "nav.settings": "सेटिंग्स और भाषा",
    "nav.profile": "प्रोफ़ाइल एवं केवाईसी केंद्र",
    "nav.logout": "लॉग आउट",
    "nav.login": "लॉग इन",
    "nav.register": "पंजीकरण",
    "settings.title": "भाषा और क्षेत्रीय सेटिंग्स",
    "settings.subtitle": "किसान बाज़ार पोर्टल, सलाह और मंडी अलर्ट के लिए अपनी पसंदीदा भारतीय भाषा चुनें।",
    "settings.current": "सक्रिय भाषा",
    "settings.searchPlaceholder": "भारतीय भाषा या राज्य खोजें...",
    "settings.voiceTitle": "कृषि ध्वनि सहायक (Voice Assistant)",
    "settings.voiceDesc": "अपनी स्थानीय भाषा में फसल के दाम और मौसम की जानकारी सुनें",
    "settings.smsTitle": "मंडी एसएमएस और व्हाट्सएप अलर्ट",
    "settings.smsDesc": "इस भाषा में रीयल-टाइम मंडी भाव प्राप्त करें",
    "settings.save": "भाषा प्राथमिकताएं सुरक्षित करें",
    "settings.applied": "भाषा सफलतापूर्वक बदल दी गई:",
    "role.farmer": "किसान",
    "role.buyer": "व्यापारी / खरीदार",
    "role.logistics": "परिवहन प्रदाता",
    "role.storage": "कोल्ड स्टोरेज संचालक",
    "action.edit": "संपादित करें",
    "action.save": "सहेजें",
    "action.cancel": "रद्द करें",
    "action.search": "खोजें"
  },
  mr: {
    "nav.marketplace": "बाजारपेठ (मंडी)",
    "nav.advisory": "कृषी सल्ला",
    "nav.schemes": "शासकीय योजना",
    "nav.analytics": "एआय विश्लेषण",
    "nav.logistics": "वाहतूक व्यवस्था",
    "nav.storage": "शीतगृह (स्टोरेज)",
    "nav.community": "शेतकरी समुदाय",
    "nav.settings": "सेटिंग्ज आणि भाषा",
    "nav.profile": "प्रोफाइल आणि केवायसी",
    "nav.logout": "बाहेर पडा",
    "nav.login": "लॉगिन करा",
    "nav.register": "नोंदणी करा",
    "settings.title": "भाषा आणि प्रादेशिक सेटिंग्ज",
    "settings.subtitle": "किसान बाजार पोर्टल, पीक सल्ला आणि बाजारभावांसाठी तुमची पसंतीची भाषा निवडा.",
    "settings.current": "सध्याची भाषा",
    "settings.searchPlaceholder": "भाषा किंवा राज्य शोधा...",
    "settings.voiceTitle": "व्हॉइस असिस्टंट",
    "settings.voiceDesc": "स्थानिक भाषेत बाजारभाव आणि हवामानाचा अंदाज ऐका",
    "settings.smsTitle": "बाजारभाव एसएमएस व व्हॉट्सअ‍ॅप अलर्ट",
    "settings.smsDesc": "या भाषेत थेट शेतीमालाचे ताजे दर मिळवा",
    "settings.save": "भाषा प्राधान्ये जतन करा",
    "settings.applied": "भाषा यशस्वीरित्या बदलली:",
    "role.farmer": "शेतकरी",
    "role.buyer": "खरेदीदार / व्यापारी",
    "role.logistics": "वाहतूकदार",
    "role.storage": "शीतगृह मालक",
    "action.edit": "बदल करा",
    "action.save": "जतन करा",
    "action.cancel": "रद्द करा",
    "action.search": "शोधा"
  },
  bn: {
    "nav.marketplace": "কৃষি বাজার",
    "nav.advisory": "কৃষি পরামর্শ",
    "nav.schemes": "সরকারি প্রকল্প",
    "nav.analytics": "এআই অ্যানালিটিক্স",
    "nav.logistics": "পরিবহন ব্যবস্থা",
    "nav.storage": "কোল্ড স্টোরেজ",
    "nav.community": "কৃষক সম্প্রদায়",
    "nav.settings": "সেটিংস ও ভাষা",
    "nav.profile": "প্রোফাইল ও কেওয়াইসি",
    "nav.logout": "লগআউট",
    "nav.login": "লগইন",
    "nav.register": "নিবন্ধন",
    "settings.title": "ভাষা এবং আঞ্চলিক সেটিংস",
    "settings.subtitle": "কিসানবাজার পোর্টাল এবং সতর্কবার্তা জন্য আপনার পছন্দের ভারতীয় ভাষা বেছে নিন।",
    "settings.current": "সক্রিয় ভাষা",
    "settings.searchPlaceholder": "ভাষা বা অঞ্চল খুঁজুন...",
    "settings.voiceTitle": "ভয়েস অ্যাসিস্ট্যান্ট",
    "settings.voiceDesc": "আপনার ভাষায় ফসলের দাম এবং আবহাওয়ার পূর্বাভাস শুনুন",
    "settings.smsTitle": "মন্ডি এসএমএস ও হোয়াটসঅ্যাপ সতর্কতা",
    "settings.smsDesc": "এই ভাষায় তাত্ক্ষণিক বাজার দর পান",
    "settings.save": "ভাষা সংরক্ষণ করুন",
    "settings.applied": "ভাষা সফলভাবে পরিবর্তিত হয়েছে:",
    "role.farmer": "কৃষক",
    "role.buyer": "ক্রেতা / ব্যবসায়ী",
    "role.logistics": "পরিবহনকারী",
    "role.storage": "স্টোরেজ মালিক",
    "action.edit": "সম্পাদনা",
    "action.save": "সংরক্ষণ",
    "action.cancel": "বাতিল",
    "action.search": "অনুসন্ধান"
  },
  te: {
    "nav.marketplace": "రైతు బజార్",
    "nav.advisory": "వ్యవసాయ సలహాలు",
    "nav.schemes": "ప్రభుత్వ పథకాలు",
    "nav.analytics": "AI విశ్లేషణ",
    "nav.logistics": "రవాణా సేవలు",
    "nav.storage": "శీతల గిడ్డంగి (స్టోరేజ్)",
    "nav.community": "రైతు సంఘం",
    "nav.settings": "సెట్టింగ్‌లు & భాష",
    "nav.profile": "ప్రొఫైల్ & కేవైసీ",
    "nav.logout": "లాగౌట్",
    "nav.login": "లాగిన్",
    "nav.register": "రిజిస్టర్",
    "settings.title": "భాష & ప్రాంతీయ సెట్టింగ్‌లు",
    "settings.subtitle": "కిసాన్ బజార్ పోర్టల్ మరియు వ్యవసాయ సలహాల కోసం మీ ప్రాధాన్యత గల భారతీయ భాషను ఎంచుకోండి.",
    "settings.current": "ప్రస్తుత భాష",
    "settings.searchPlaceholder": "భాష లేదా రాష్ట్రాన్ని శోధించండి...",
    "settings.voiceTitle": "వాయిస్ అసిస్టెంట్",
    "settings.voiceDesc": "మీ ప్రాంతీయ భాషలో పంట ధరలు మరియు వాతావరణ సమాచారం వినండి",
    "settings.smsTitle": "మార్కెట్ ధరల SMS & WhatsApp హెచ్చరికలు",
    "settings.smsDesc": "ఈ భాషలో నిజ సమయ పంట ధరలను అందుకోండి",
    "settings.save": "భాష ప్రాధాన్యతలను సేవ్ చేయండి",
    "settings.applied": "భాష విజయవంతంగా మార్చబడింది:",
    "role.farmer": "రైతు",
    "role.buyer": "కొనుగోలుదారుడు / వ్యాపారి",
    "role.logistics": "రవాణాదారు",
    "role.storage": "స్టోరేజ్ యజమాని",
    "action.edit": "సవరించు",
    "action.save": "సేవ్ చేయి",
    "action.cancel": "రద్దు చేయి",
    "action.search": "శోధించు"
  },
  ta: {
    "nav.marketplace": "விவசாய சந்தை",
    "nav.advisory": "வேளாண் ஆலோசனை",
    "nav.schemes": "அரசு திட்டங்கள்",
    "nav.analytics": "AI பகுப்பாய்வு",
    "nav.logistics": "போக்குவரத்து (லாஜிஸ்டிக்ஸ்)",
    "nav.storage": "குளிர்பதன சேமிப்பு",
    "nav.community": "விவசாயிகள் சமூகம்",
    "nav.settings": "அமைப்புகள் & மொழி",
    "nav.profile": "சுயவிவரம் & KYC",
    "nav.logout": "வெளியேறு",
    "nav.login": "உள்நுழைக",
    "nav.register": "பதிவு செய்க",
    "settings.title": "மொழி மற்றும் அமைப்புகள்",
    "settings.subtitle": "கிசான் பஜார் தளம் மற்றும் சந்தை விழிப்பூட்டல்களுக்கு உங்களுக்கு விருப்பமான இந்திய மொழியைத் தேர்ந்தெடுக்கவும்.",
    "settings.current": "செயலில் உள்ள மொழி",
    "settings.searchPlaceholder": "மொழி அல்லது மாநிலத்தைத் தேடுங்கள்...",
    "settings.voiceTitle": "குரல் உதவியாளர்",
    "settings.voiceDesc": "உங்கள் சொந்த மொழியில் பயிர் விலைகள் மற்றும் வானிலை முன்னறிவிப்புகளைக் கேளுங்கள்",
    "settings.smsTitle": "சந்தை SMS & WhatsApp விழிப்பூட்டல்கள்",
    "settings.smsDesc": "இந்த மொழியில் உடனடி பயிர் விலை புதுப்பிப்புகளைப் பெறுங்கள்",
    "settings.save": "மொழியைச் சேமிக்கவும்",
    "settings.applied": "மொழி வெற்றிகரமாக மாற்றப்பட்டது:",
    "role.farmer": "விவசாயி",
    "role.buyer": "வாங்குபவர் / வியாபாரி",
    "role.logistics": "போக்குவரத்து வழங்குநர்",
    "role.storage": "சேமிப்பக உரிமையாளர்",
    "action.edit": "திருத்து",
    "action.save": "சேமி",
    "action.cancel": "ரத்துசெய்",
    "action.search": "தேடு"
  },
  gu: {
    "nav.marketplace": "કૃષિ બજાર",
    "nav.advisory": "ખેતી સલાહ",
    "nav.schemes": "સરકારી યોજનાઓ",
    "nav.analytics": "AI એનાલિટિક્સ",
    "nav.logistics": "પરિવહન સેવા",
    "nav.storage": "કોલ્ડ સ્ટોરેજ",
    "nav.community": "ખેડૂત સમુદાય",
    "nav.settings": "સેટિંગ્સ અને ભાષા",
    "nav.profile": "પ્રોફાઇલ અને KYC",
    "nav.logout": "લૉગ આઉટ",
    "nav.login": "લૉગ ઇન",
    "nav.register": "નોંધણી",
    "settings.title": "ભાષા અને પ્રાદેશિક સેટિંગ્સ",
    "settings.subtitle": "કિસાનબજાર પોર્ટલ અને એગ્રી એલર્ટ માટે તમારી મનપસંદ ભારતીય ભાષા પસંદ કરો.",
    "settings.current": "સક્રિય ભાષા",
    "settings.searchPlaceholder": "ભાષા અથવા રાજ્ય શોધો...",
    "settings.voiceTitle": "વોઇસ આસિસ્ટન્ટ",
    "settings.voiceDesc": "તમારી પ્રાદેશિક ભાષામાં પાકના ભાવ અને હવામાનની માહિતી સાંભળો",
    "settings.smsTitle": "મંડી SMS અને WhatsApp એલર્ટ",
    "settings.smsDesc": "આ ભાષામાં તાજા બજાર ભાવો મેળવો",
    "settings.save": "ભાષા સેટિંગ સાચવો",
    "settings.applied": "ભાષા સફળતાપૂર્વક બદલાઈ:",
    "role.farmer": "ખેડૂત",
    "role.buyer": "વેપારી / ખરીદનાર",
    "role.logistics": "ટ્રાન્સપોર્ટર",
    "role.storage": "સ્ટોરેજ માલિક",
    "action.edit": "ફેરફાર કરો",
    "action.save": "સાચવો",
    "action.cancel": "રદ કરો",
    "action.search": "શોધો"
  },
  kn: {
    "nav.marketplace": "ಕೃಷಿ ಮಾರುಕಟ್ಟೆ",
    "nav.advisory": "ಕೃಷಿ ಸಲಹೆ",
    "nav.schemes": "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು",
    "nav.analytics": "AI ವಿಶ್ಲೇಷಣೆ",
    "nav.logistics": "ಸಾರಿಗೆ (ಲಾಜಿಸ್ಟಿಕ್ಸ್)",
    "nav.storage": "ಶೀತಲ ಸಂಗ್ರಹಣಾಗಾರ",
    "nav.community": "ರೈತ ಸಮುದಾಯ",
    "nav.settings": "ಸೆಟ್ಟಿಂಗ್‌ಗಳು ಮತ್ತು ಭಾಷೆ",
    "nav.profile": "ಪ್ರೊಫೈಲ್ ಮತ್ತು KYC",
    "nav.logout": "ಲಾಗ್‌ಔಟ್",
    "nav.login": "ಲಾಗಿನ್",
    "nav.register": "ನೋಂದಣಿ",
    "settings.title": "ಭಾಷೆ ಮತ್ತು ಪ್ರಾದೇಶಿಕ ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    "settings.subtitle": "ಕಿಸಾನ್ ಬಜಾರ್ ಪೋರ್ಟಲ್ ಮತ್ತು ಕೃಷಿ ಸಲಹೆಗಳಿಗಾಗಿ ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾರತೀಯ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.",
    "settings.current": "ಸಕ್ರಿಯ ಭಾಷೆ",
    "settings.searchPlaceholder": "ಭಾಷೆ ಅಥವಾ ರಾಜ್ಯವನ್ನು ಹುಡುಕಿ...",
    "settings.voiceTitle": "ಧ್ವನಿ ಸಹಾಯಕ (Voice Assistant)",
    "settings.voiceDesc": "ಸ್ಥಳೀಯ ಭಾಷೆಯಲ್ಲಿ ಬೆಳೆ ಬೆಲೆಗಳು ಮತ್ತು ಹವಾಮಾನ ಮುನ್ಸೂಚನೆಯನ್ನು ಆಲಿಸಿ",
    "settings.smsTitle": "ಮಾರುಕಟ್ಟೆ SMS & WhatsApp ಎಚ್ಚರಿಕೆಗಳು",
    "settings.smsDesc": "ಈ ಭಾಷೆಯಲ್ಲಿ ನೈಜ ಸಮಯದ ಮಾರುಕಟ್ಟೆ ದರಗಳನ್ನು ಸ್ವೀಕರಿಸಿ",
    "settings.save": "ಭಾಷಾ ಆದ್ಯತೆಗಳನ್ನು ಉಳಿಸಿ",
    "settings.applied": "ಭಾಷೆಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಬದಲಾಯಿಸಲಾಗಿದೆ:",
    "role.farmer": "ರೈತ",
    "role.buyer": "ಖರೀದಿದಾರ / ವ್ಯಾಪಾರಿ",
    "role.logistics": "ಸಾರಿಗೆದಾರ",
    "role.storage": "ಸಂಗ್ರಹಣಾ ಮಾಲೀಕ",
    "action.edit": "ತಿದ್ದುಪಡಿ",
    "action.save": "ಉಳಿಸಿ",
    "action.cancel": "ರದ್ದುಮಾಡಿ",
    "action.search": "ಹುಡುಕಿ"
  },
  pa: {
    "nav.marketplace": "ਅਨਾਜ ਮੰਡੀ",
    "nav.advisory": "ਖੇਤੀ ਸਲਾਹ",
    "nav.schemes": "ਸਰਕਾਰੀ ਸਕੀਮਾਂ",
    "nav.analytics": "AI ਵਿਸ਼ਲੇਸ਼ਣ",
    "nav.logistics": "ਟਰਾਂਸਪੋਰਟ",
    "nav.storage": "ਕੋਲਡ ਸਟੋਰੇਜ",
    "nav.community": "ਕਿਸਾਨ ਭਾਈਚਾਰਾ",
    "nav.settings": "ਸੈਟਿੰਗਾਂ ਅਤੇ ਭਾਸ਼ਾ",
    "nav.profile": "ਪ੍ਰੋਫਾਈਲ ਅਤੇ ਕੇਵਾਈਸੀ",
    "nav.logout": "ਲੌਗਆਉਟ",
    "nav.login": "ਲੌਗਇਨ",
    "nav.register": "ਰਜਿਸਟਰ",
    "settings.title": "ਭਾਸ਼ਾ ਅਤੇ ਖੇਤਰੀ ਸੈਟਿੰਗਾਂ",
    "settings.subtitle": "ਕਿਸਾਨ ਬਾਜ਼ਾਰ ਪੋਰਟਲ ਅਤੇ ਮੰਡੀ ਅਲਰਟ ਲਈ ਆਪਣੀ ਪਸੰਦੀਦਾ ਭਾਰਤੀ ਭਾਸ਼ਾ ਚੁਣੋ।",
    "settings.current": "ਮੌਜੂਦਾ ਭਾਸ਼ਾ",
    "settings.searchPlaceholder": "ਭਾਸ਼ਾ ਜਾਂ ਰਾਜ ਖੋਜੋ...",
    "settings.voiceTitle": "ਖੇਤੀਬਾੜੀ ਵੌਇਸ ਅਸਿਸਟੈਂਟ",
    "settings.voiceDesc": "ਆਪਣੀ ਸਥਾਨਕ ਬੋਲੀ ਵਿੱਚ ਫਸਲਾਂ ਦੇ ਭਾਅ ਅਤੇ ਮੌਸਮ ਬਾਰੇ ਸੁਣੋ",
    "settings.smsTitle": "ਮੰਡੀ SMS ਅਤੇ ਵਟਸਐਪ ਅਲਰਟ",
    "settings.smsDesc": "ਇਸ ਭਾਸ਼ਾ ਵਿੱਚ ਤਾਜ਼ਾ ਮੰਡੀ ਭਾਅ ਪ੍ਰਾਪਤ ਕਰੋ",
    "settings.save": "ਭਾਸ਼ਾ ਸੇਵ ਕਰੋ",
    "settings.applied": "ਭਾਸ਼ਾ ਸਫਲਤਾਪੂਰਵਕ ਬਦਲੀ ਗਈ:",
    "role.farmer": "ਕਿਸਾਨ",
    "role.buyer": "ਵਪਾਰੀ / ਖਰੀਦਦਾਰ",
    "role.logistics": "ਟਰਾਂਸਪੋਰਟਰ",
    "role.storage": "ਕੋਲਡ ਸਟੋਰ ਮਾਲਕ",
    "action.edit": "ਸੋਧੋ",
    "action.save": "ਸੇਵ ਕਰੋ",
    "action.cancel": "ਰੱਦ ਕਰੋ",
    "action.search": "ਖੋਜੋ"
  },
  ml: {
    "nav.marketplace": "കാർഷിക ചന്ത",
    "nav.advisory": "കാർഷിക ഉപദേശം",
    "nav.schemes": "സർക്കാർ പദ്ധതികൾ",
    "nav.analytics": "AI വിശകലനം",
    "nav.logistics": "ഗതാഗത സേവനം",
    "nav.storage": "ശീതീകരണ സംഭരണശാല",
    "nav.community": "കർഷക കൂട്ടായ്മ",
    "nav.settings": "ക്രമീകരണങ്ങളും ഭാഷയും",
    "nav.profile": "പ്രൊഫൈലും KYC യും",
    "nav.logout": "പുറത്തുകടക്കുക",
    "nav.login": "ലോഗിൻ",
    "nav.register": "രജിസ്റ്റർ",
    "settings.title": "ഭാഷയും ക്രമീകരണങ്ങളും",
    "settings.subtitle": "കിസാൻ ബസാർ പോർട്ടലിൽ നിങ്ങളുടെ ഇഷ്ടപ്പെട്ട ഇന്ത്യൻ ഭാഷ തിരഞ്ഞെടുക്കുക.",
    "settings.current": "നിലവിലെ ഭാഷ",
    "settings.searchPlaceholder": "ഭാഷ അല്ലെങ്കിൽ സംസ്ഥാനം തിരയുക...",
    "settings.voiceTitle": "വോയ്‌സ് അസിസ്റ്റന്റ്",
    "settings.voiceDesc": "വിളകളുടെ വിലയും കാലാവസ്ഥയും പ്രാദേശിക ഭാഷയിൽ കേൾക്കുക",
    "settings.smsTitle": "മാർക്കറ്റ് SMS & WhatsApp അറിയിപ്പുകൾ",
    "settings.smsDesc": "ഈ ഭാഷയിൽ തത്സമയ വിളവില അറിയിപ്പുകൾ നേടുക",
    "settings.save": "ഭാഷ സംരക്ഷിക്കുക",
    "settings.applied": "ഭാഷ വിജയകരമായി മാറ്റി:",
    "role.farmer": "കർഷകൻ",
    "role.buyer": "വ്യാപാരി / വാങ്ങുന്നയാൾ",
    "role.logistics": "ലോജിസ്റ്റിക്സ്",
    "role.storage": "സ്റ്റോറേജ് ഉടമ",
    "action.edit": "മാറ്റുക",
    "action.save": "സംരക്ഷിക്കുക",
    "action.cancel": "റദ്ദാക്കുക",
    "action.search": "തിരയുക"
  },
  or: {
    "nav.marketplace": "କୃଷି ବଜାର (ମଣ୍ଡି)",
    "nav.advisory": "କୃଷି ପରାମର୍ଶ",
    "nav.schemes": "ସରକାରୀ ଯୋଜନା",
    "nav.analytics": "AI ବିଶ୍ଳେଷଣ",
    "nav.logistics": "ପରିବହନ ସେବା",
    "nav.storage": "ଶୀତଳ ଭଣ୍ଡାର",
    "nav.community": "କୃଷକ ସମୁଦାୟ",
    "nav.settings": "ସେଟିଂସ ଓ ଭାଷା",
    "nav.profile": "ପ୍ରୋଫାଇଲ ଓ KYC",
    "nav.logout": "ଲଗ୍ ଆଉଟ୍",
    "nav.login": "ଲଗ୍ ଇନ୍",
    "nav.register": "ପଞ୍ଜୀକରଣ",
    "settings.title": "ଭାଷା ଓ ଆଞ୍ଚଳିକ ସେଟିଂସ",
    "settings.subtitle": "କିସାନବଜାର ପୋର୍ଟାଲ ପାଇଁ ଆପଣଙ୍କ ପସନ୍ଦର ଭାରତୀୟ ଭାଷା ବାଛନ୍ତୁ।",
    "settings.current": "ସକ୍ରିୟ ଭାଷା",
    "settings.searchPlaceholder": "ଭାଷା କିମ୍ବା ରାଜ୍ୟ ଖୋଜନ୍ତୁ...",
    "settings.voiceTitle": "କୃଷି ଭଏସ୍ ସହାୟକ",
    "settings.voiceDesc": "ନିଜ ଭାଷାରେ ଫସଲ ଦର ଏବଂ ପାଣିପାଗ ସୂଚନା ଶୁଣନ୍ତୁ",
    "settings.smsTitle": "ମଣ୍ଡି SMS ଏବଂ WhatsApp ଆଲର୍ଟ",
    "settings.smsDesc": "ଏହି ଭାଷାରେ ଫସଲର ସଦ୍ୟତମ ଦର ପାଆନ୍ତୁ",
    "settings.save": "ଭାଷା ସଂରକ୍ଷଣ କରନ୍ତୁ",
    "settings.applied": "ଭାଷା ସଫଳତାର ସହ ପରିବର୍ତ୍ତିତ ହେଲା:",
    "role.farmer": "କୃଷକ",
    "role.buyer": "ବ୍ୟବସାୟୀ / କ୍ରେତା",
    "role.logistics": "ପରିବହନକାରୀ",
    "role.storage": "ଭଣ୍ଡାର ମାଲିକ",
    "action.edit": "ସମ୍ପାଦନ",
    "action.save": "ସେଭ୍ କରନ୍ତୁ",
    "action.cancel": "ବାତିଲ",
    "action.search": "ଖୋଜନ୍ତୁ"
  },
  ur: {
    "nav.marketplace": "منڈی / مارکیٹ",
    "nav.advisory": "زرعی مشورہ",
    "nav.schemes": "سرکاری اسکیمیں",
    "nav.analytics": "اے آئی تجزیات",
    "nav.logistics": "نقل و حمل (لاجسٹکس)",
    "nav.storage": "کولڈ اسٹوریج",
    "nav.community": "کسان کمیونٹی",
    "nav.settings": "سیٹنگز اور زبان",
    "nav.profile": "پروفائل اور کے وائی سی",
    "nav.logout": "لاگ آؤٹ",
    "nav.login": "لاگ ان",
    "nav.register": "رجسٹر کریں",
    "settings.title": "زبان اور علاقائی ترتیبات",
    "settings.subtitle": "کسان بازار پورٹل کے لیے اپنی پسندیدہ ہندوستانی زبان منتخب کریں۔",
    "settings.current": "موجودہ زبان",
    "settings.searchPlaceholder": "زبان یا ریاست تلاش کریں...",
    "settings.voiceTitle": "وائس اسسٹنٹ",
    "settings.voiceDesc": "اپنی مادری زبان میں فصل کی قیمتیں اور موسم کی معلومات سنیں",
    "settings.smsTitle": "منڈی ایس ایم ایس اور واٹس ایپ الرٹس",
    "settings.smsDesc": "اس زبان میں فصل کی تازہ ترین قیمتیں حاصل کریں",
    "settings.save": "زبان محفوظ کریں",
    "settings.applied": "زبان کامیابی سے تبدیل کر دی گئی:",
    "role.farmer": "کسان",
    "role.buyer": "خریدار / تاجر",
    "role.logistics": "ٹرانسپورٹر",
    "role.storage": "اسٹوریج کا مالک",
    "action.edit": "ترمیم",
    "action.save": "محفوظ کریں",
    "action.cancel": "منسوخ",
    "action.search": "تلاش کریں"
  },
  as: {
    "nav.marketplace": "কৃষি বজাৰ",
    "nav.advisory": "কৃষি পৰামৰ্শ",
    "nav.schemes": "চৰকাৰী আঁচনি",
    "nav.analytics": "এআই বিশ্লেষণ",
    "nav.logistics": "পৰিবহণ",
    "nav.storage": "শীতল ভঁৰাল",
    "nav.community": "কৃষক সমাজ",
    "nav.settings": "ছেটিংছ আৰু ভাষা",
    "nav.profile": "প্রোফাইল আৰু কেৱাইচি",
    "nav.logout": "লগআউট",
    "nav.login": "লগইন",
    "nav.register": "পঞ্জীয়ন",
    "settings.title": "ভাষা আৰু আঞ্চলিক ছেটিংছ",
    "settings.subtitle": "কিষাণ বাজাৰ পৰ্টেলৰ বাবে আপোনাৰ পছন্দৰ ভাষা বাছক।",
    "settings.current": "সক্ৰিয় ভাষা",
    "settings.searchPlaceholder": "ভাষা বা ৰাজ্য সন্ধান কৰক...",
    "settings.voiceTitle": "ভইচ এছিষ্টেণ্ট",
    "settings.voiceDesc": "আপোনাৰ ভাষাত শস্যৰ মূল্য আৰু বতৰৰ তথ্য শুনক",
    "settings.smsTitle": "এছএমএছ আৰু হোৱাটছএপ সতৰ্কবাৰ্তা",
    "settings.smsDesc": "এই ভাষাত শস্যৰ বজাৰ মূল্য লাভ কৰক",
    "settings.save": "ভাষা সংৰক্ষণ কৰক",
    "settings.applied": "ভাষা সফলতাৰে সলনি হ'ল:",
    "role.farmer": "কৃষক",
    "role.buyer": "ব্যৱসায়ী / ক্ৰেতা",
    "role.logistics": "পৰিবহণকাৰী",
    "role.storage": "ভঁৰালৰ মালিক",
    "action.edit": "সম্পাদনা",
    "action.save": "সংৰক্ষণ",
    "action.cancel": "বাতিল",
    "action.search": "সন্ধান"
  }
};

export const GOOGLE_LANG_MAP = {
  en: "en",
  hi: "hi",
  mr: "mr",
  bn: "bn",
  te: "te",
  ta: "ta",
  gu: "gu",
  ur: "ur",
  kn: "kn",
  ml: "ml",
  pa: "pa",
  or: "or",
  as: "as",
  mai: "mai",
  ne: "ne",
  sd: "sd",
  sa: "sa",
  doi: "doi",
  kok: "gom",
  mni: "mni",
  brx: "brx",
  ks: "ks",
  sat: "sat"
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  // Retrieve saved language code from localStorage or default to English ("en")
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem("kisan_language") || "en";
  });

  const [voiceAssistEnabled, setVoiceAssistEnabled] = useState(() => {
    return localStorage.getItem("kisan_voice_assist") === "true";
  });

  const [smsAlertsLanguage, setSmsAlertsLanguage] = useState(() => {
    return localStorage.getItem("kisan_sms_lang") || "hi";
  });

  // Find active language object
  const activeLangObj = INDIAN_LANGUAGES.find((l) => l.code === currentLanguage) || INDIAN_LANGUAGES[1] || INDIAN_LANGUAGES[0];

  // Translation helper function
  const t = useCallback(
    (key, fallback = "") => {
      // Check in current language dictionary
      if (TRANSLATIONS[currentLanguage] && TRANSLATIONS[currentLanguage][key]) {
        return TRANSLATIONS[currentLanguage][key];
      }
      // Fallback to Hindi dictionary
      if (TRANSLATIONS["hi"] && TRANSLATIONS["hi"][key]) {
        return TRANSLATIONS["hi"][key];
      }
      // Fallback to English dictionary
      if (TRANSLATIONS["en"] && TRANSLATIONS["en"][key]) {
        return TRANSLATIONS["en"][key];
      }
      return fallback || key;
    },
    [currentLanguage]
  );

  const clearGoogleTransCookies = () => {
    try {
      const host = window.location.hostname;
      const domains = [host, `.${host}`, ''];
      const paths = ['/', window.location.pathname];
      domains.forEach((d) => {
        paths.forEach((p) => {
          document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${p};${d ? ` domain=${d};` : ''}`;
        });
      });
    } catch {
      // Ignore cookie errors
    }
  };

  // Trigger Google Translate script bridge cleanly without forcing destructive reloads
  const applyGoogleTranslateBridge = (langCode) => {
    try {
      const googleCode = GOOGLE_LANG_MAP[langCode] || langCode;
      const domain = window.location.hostname;

      if (googleCode === "en") {
        clearGoogleTransCookies();
        const selectElem = document.querySelector(".goog-te-combo");
        if (selectElem && selectElem.value !== "en") {
          selectElem.value = "en";
          selectElem.dispatchEvent(new Event("change"));
        }
        return;
      }

      document.cookie = `googtrans=/auto/${googleCode}; path=/;`;
      if (domain) {
        document.cookie = `googtrans=/auto/${googleCode}; domain=${domain}; path=/;`;
      }

      const selectElem = document.querySelector(".goog-te-combo");
      if (selectElem) {
        selectElem.value = googleCode;
        selectElem.dispatchEvent(new Event("change"));
      }

      // Ensure body is never shifted down by Google Translate banner
      if (document.body) {
        document.body.style.top = "0px";
      }
    } catch {
      // Ignore background bridge errors
    }
  };

  // Change language function
  const changeLanguage = (langCode, showToast = true) => {
    const lang = INDIAN_LANGUAGES.find((l) => l.code === langCode || l.name.toLowerCase() === langCode.toLowerCase());
    const validCode = lang ? lang.code : "en";

    setCurrentLanguage(validCode);
    localStorage.setItem("kisan_language", validCode);
    applyGoogleTranslateBridge(validCode);

    // Set document direction if RTL (Urdu, Kashmiri in Perso-Arabic)
    if (lang?.dir === "rtl") {
      document.documentElement.dir = "rtl";
    } else {
      document.documentElement.dir = "ltr";
    }

    if (showToast && lang) {
      toast.success(`${t("settings.applied", "Language changed to")} ${lang.nativeName} (${lang.name})`);
    }
  };

  useEffect(() => {
    // Initial setup on mount
    applyGoogleTranslateBridge(currentLanguage);
  }, [currentLanguage]);

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        activeLangObj,
        changeLanguage,
        t,
        INDIAN_LANGUAGES,
        voiceAssistEnabled,
        setVoiceAssistEnabled: (enabled) => {
          setVoiceAssistEnabled(enabled);
          localStorage.setItem("kisan_voice_assist", String(enabled));
        },
        smsAlertsLanguage,
        setSmsAlertsLanguage: (lang) => {
          setSmsAlertsLanguage(lang);
          localStorage.setItem("kisan_sms_lang", lang);
        }
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
