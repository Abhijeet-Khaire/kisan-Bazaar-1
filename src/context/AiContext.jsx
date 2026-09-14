/**
 * Kisan Bazaar AI - Global Context & Voice Accessibility Provider
 * Coordinates chat state, real-time screen awareness, action execution,
 * Web Speech Recognition (Mic), and Speech Synthesis (Speaker).
 */

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useGlobalState } from "./GlobalState";
import { getScreenContext } from "@/lib/ai/screenContextExtractor";
import { generateKisanAiResponse } from "@/lib/ai/kisanAiService";
import { toast } from "sonner";

const AiContext = createContext(undefined);

export const AiProvider = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, switchDemoRole } = useAuth();
    const { crops, orders, bids, notifications } = useGlobalState();

    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    // Dynamic screen context calculation
    const [screenContext, setScreenContext] = useState(() =>
        getScreenContext({ location, user, crops, orders, bids, notifications })
    );

    // Initial greeting
    const [messages, setMessages] = useState(() => {
        try {
            const saved = sessionStorage.getItem("kisan_bazaar_ai_messages");
            if (saved) return JSON.parse(saved);
        } catch (e) {
            console.error(e);
        }
        return [
            {
                id: "msg-welcome-1",
                sender: "ai",
                text: `**Namaste ${user?.name || "Kisan Friend"}! 🙏**
I am **Kisan Bazaar AI**, your personal agricultural GenAI assistant.

I am watching your current screen and have full context of your listings, orders, and market prices.

Ask me anything about today's mandi rates, your active orders, pest control, or how to get maximum value for your harvest!`,
                actions: [
                    { type: "NAVIGATE", target: "/buyer/marketplace", label: "Check Live Mandi" },
                    { type: "NAVIGATE", target: "/profile?tab=orders", label: "View My Orders" }
                ],
                timestamp: new Date().toISOString()
            }
        ];
    });

    // Update screen context on location or data change
    useEffect(() => {
        const updated = getScreenContext({
            location,
            user,
            crops,
            orders,
            bids,
            notifications
        });
        setScreenContext(updated);
    }, [location.pathname, location.search, user, crops, orders, bids, notifications]);

    // Save chat history
    useEffect(() => {
        try {
            sessionStorage.setItem("kisan_bazaar_ai_messages", JSON.stringify(messages));
        } catch (e) {
            console.error(e);
        }
    }, [messages]);

    // Speech recognition setup (Web Speech API)
    const recognitionRef = useRef(null);

    const startListening = (onTranscript) => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            toast.error("Speech Recognition is not supported by your browser.");
            return;
        }

        try {
            if (recognitionRef.current) {
                recognitionRef.current.abort();
            }

            const rec = new SpeechRecognition();
            rec.continuous = false;
            rec.interimResults = false;
            rec.lang = "hi-IN"; // Supports Hindi & English accents

            rec.onstart = () => {
                setIsListening(true);
                toast.info("Listening... Speak in Hindi or English", { duration: 3000 });
            };

            rec.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                if (transcript && onTranscript) {
                    onTranscript(transcript);
                }
            };

            rec.onerror = (err) => {
                console.error("Speech recognition error:", err);
                setIsListening(false);
            };

            rec.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current = rec;
            rec.start();
        } catch (err) {
            console.error(err);
            setIsListening(false);
        }
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    };

    // Text to Speech
    const speakText = (text) => {
        if (!window.speechSynthesis) {
            toast.error("Audio playback not supported in this browser");
            return;
        }

        window.speechSynthesis.cancel(); // stop previous
        const cleanText = text.replace(/\[ACTION:[^\]]+\]/g, "").replace(/[*_#`]/g, "");

        const utterance = new SpeechSynthesisUtterance(cleanText);
        // Detect hindi characters
        if (/[\u0900-\u097F]/.test(text)) {
            utterance.lang = "hi-IN";
        } else {
            utterance.lang = "en-IN";
        }
        utterance.rate = 1.0;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    };

    const stopSpeaking = () => {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };

    // Handle user query
    const sendMessage = async (inputText) => {
        const text = inputText?.trim();
        if (!text || isGenerating) return;

        const userMsg = {
            id: `msg-user-${Date.now()}`,
            sender: "user",
            text,
            timestamp: new Date().toISOString()
        };

        const placeholderAiMsg = {
            id: `msg-ai-${Date.now()}`,
            sender: "ai",
            text: "",
            isStreaming: true,
            actions: [],
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMsg, placeholderAiMsg]);
        setIsGenerating(true);

        try {
            const result = await generateKisanAiResponse({
                query: text,
                screenContext,
                conversationHistory: messages,
                onStreamChunk: (chunk) => {
                    setMessages(prev => prev.map(m =>
                        m.id === placeholderAiMsg.id ? { ...m, text: chunk } : m
                    ));
                }
            });

            setMessages(prev => prev.map(m =>
                m.id === placeholderAiMsg.id ? {
                    ...m,
                    text: result.text,
                    actions: result.actions,
                    isStreaming: false
                } : m
            ));
        } catch (error) {
            console.error("AI Generation Error:", error);
            setMessages(prev => prev.map(m =>
                m.id === placeholderAiMsg.id ? {
                    ...m,
                    text: "I encountered a momentary issue accessing data. Please try asking again!",
                    isStreaming: false
                } : m
            ));
        } finally {
            setIsGenerating(false);
        }
    };

    // Execute actions parsed from GenAI
    const executeAction = (action) => {
        if (!action) return;
        if (action.type === "NAVIGATE") {
            let roleSwitched = false;
            try {
                if (action.target.includes("role=")) {
                    const match = action.target.match(/role=([a-z]+)/i);
                    if (match && switchDemoRole) {
                        switchDemoRole(match[1].toLowerCase());
                        roleSwitched = true;
                    }
                }
            } catch (e) {
                console.warn(e);
            }
            navigate(action.target);
            if (!roleSwitched) {
                toast.dismiss();
                toast.success(`Navigating to ${action.label}`);
            }
            // Only auto-minimize on mobile screens so desktop users can keep referencing AI
            if (typeof window !== "undefined" && window.innerWidth < 768) {
                setIsMinimized(true);
            }
        } else if (action.type === "SWITCH_ROLE") {
            if (switchDemoRole) {
                switchDemoRole(action.target);
            }
            if (action.navigate) {
                navigate(action.navigate);
            }
            if (typeof window !== "undefined" && window.innerWidth < 768) {
                setIsMinimized(true);
            }
        }
    };

    const clearChat = () => {
        stopSpeaking();
        const welcome = {
            id: `msg-welcome-${Date.now()}`,
            sender: "ai",
            text: `Conversation restarted! What would you like to ask or analyze regarding **${screenContext.pageTitle}**?`,
            actions: [
                { type: "NAVIGATE", target: "/buyer/marketplace", label: "Live Mandi" },
                { type: "NAVIGATE", target: "/profile?tab=orders", label: "Orders & Bids" }
            ],
            timestamp: new Date().toISOString()
        };
        setMessages([welcome]);
        sessionStorage.removeItem("kisan_bazaar_ai_messages");
    };

    const openAi = (initialPrompt) => {
        setIsOpen(true);
        setIsMinimized(false);
        if (initialPrompt) {
            sendMessage(initialPrompt);
        }
    };

    const closeAi = () => {
        stopSpeaking();
        setIsOpen(false);
    };

    const toggleAi = () => {
        if (isOpen) {
            closeAi();
        } else {
            openAi();
        }
    };

    const toggleMinimize = () => {
        setIsMinimized(prev => !prev);
    };

    return (
        <AiContext.Provider value={{
            isOpen,
            isMinimized,
            openAi,
            closeAi,
            toggleAi,
            toggleMinimize,
            messages,
            isGenerating,
            isListening,
            isSpeaking,
            screenContext,
            sendMessage,
            executeAction,
            clearChat,
            startListening,
            stopListening,
            speakText,
            stopSpeaking
        }}>
            {children}
        </AiContext.Provider>
    );
};

export const useAi = () => {
    const context = useContext(AiContext);
    if (context === undefined) {
        throw new Error("useAi must be used within an AiProvider");
    }
    return context;
};
