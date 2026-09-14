/**
 * Kisan Bazaar AI - Floating Copilot Assistant Widget
 * Features live screen context display, voice input, speech playback,
 * context-sensitive suggestion chips, interactive platform actions,
 * and AI Model / Google Gemini API Key management.
 */

import React, { useState, useRef, useEffect } from "react";
import { useAi } from "@/context/AiContext";
import {
    getStoredApiKey,
    setStoredApiKey,
    isCloudGeminiActive
} from "@/lib/ai/kisanAiService";
import { toast } from "sonner";
import {
    Bot,
    Sparkles,
    Mic,
    MicOff,
    Volume2,
    VolumeX,
    Send,
    X,
    Minimize2,
    Maximize2,
    RotateCcw,
    Eye,
    ArrowRight,
    Wheat,
    CheckCircle2,
    Key,
    ExternalLink,
    Cpu,
    SlidersHorizontal,
    Check,
    Trash2
} from "lucide-react";

export const KisanBazaarAiWidget = () => {
    const {
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
    } = useAi();

    const [inputQuery, setInputQuery] = useState("");
    const [showSettings, setShowSettings] = useState(false);
    const [apiKeyInput, setApiKeyInput] = useState(() => getStoredApiKey());
    const [hasActiveGemini, setHasActiveGemini] = useState(() => isCloudGeminiActive());

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Auto-scroll to bottom of messages
    useEffect(() => {
        if (isOpen && !isMinimized && !showSettings) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isOpen, isMinimized, isGenerating, showSettings]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && !isMinimized && !showSettings) {
            setTimeout(() => inputRef.current?.focus(), 150);
        }
    }, [isOpen, isMinimized, showSettings]);

    const handleSend = (e) => {
        e?.preventDefault();
        if (!inputQuery.trim() || isGenerating) return;
        const text = inputQuery;
        setInputQuery("");
        sendMessage(text);
    };

    const handleVoiceClick = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening((transcript) => {
                setInputQuery(transcript);
                sendMessage(transcript);
            });
        }
    };

    const handleSuggestionClick = (suggestion) => {
        sendMessage(suggestion);
    };

    const handleSaveApiKey = () => {
        const key = apiKeyInput.trim();
        if (key && !key.startsWith("AIzaSy")) {
            toast.error("Please enter a valid Google Gemini API Key (starts with AIzaSy...)");
            return;
        }
        setStoredApiKey(key);
        setHasActiveGemini(Boolean(key));
        setShowSettings(false);
        if (key) {
            toast.success("Google Gemini 2.5 Flash activated successfully! 🚀");
        } else {
            toast.info("Switched to Built-in Smart Agricultural Engine.");
        }
    };

    const handleRemoveApiKey = () => {
        setStoredApiKey("");
        setApiKeyInput("");
        setHasActiveGemini(false);
        toast.info("Gemini API key removed. Using Built-in Smart Engine.");
    };

    // Render markdown-like text safely with paragraph/bullet formatting
    const formatMessageContent = (text) => {
        if (!text) return "";
        const lines = text.split("\n");
        return lines.map((line, idx) => {
            if (line.startsWith("### ")) {
                return <h4 key={idx} className="font-bold text-sm text-foreground mt-2 mb-1">{line.replace("### ", "")}</h4>;
            }
            if (line.startsWith("## ") || line.startsWith("# ")) {
                return <h3 key={idx} className="font-bold text-base text-foreground mt-2 mb-1">{line.replace(/^[#]+\s*/, "")}</h3>;
            }
            if (line.startsWith("- ") || line.startsWith("* ")) {
                const content = line.substring(2);
                return (
                    <li key={idx} className="ml-4 list-disc text-xs sm:text-sm text-muted-foreground my-0.5">
                        {renderBoldText(content)}
                    </li>
                );
            }
            if (/^\d+\.\s/.test(line)) {
                return (
                    <li key={idx} className="ml-4 list-decimal text-xs sm:text-sm text-muted-foreground my-0.5">
                        {renderBoldText(line.replace(/^\d+\.\s*/, ""))}
                    </li>
                );
            }
            if (!line.trim()) {
                return <div key={idx} className="h-1.5" />;
            }
            return <p key={idx} className="text-xs sm:text-sm leading-relaxed my-1">{renderBoldText(line)}</p>;
        });
    };

    const renderBoldText = (str) => {
        const parts = str.split(/(\*\*[^*]+\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith("**") && part.endsWith("**")) {
                return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    // 1. Minimized floating pill
    if (isOpen && isMinimized) {
        return (
            <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
                <button
                    onClick={toggleMinimize}
                    className="flex items-center gap-2.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-xl border border-emerald-400/30 backdrop-blur-md transition-all hover:scale-105 active:scale-95 group"
                >
                    <div className="relative">
                        <Bot className="h-5 w-5 animate-pulse" />
                        <span className="absolute -top-1 -right-1 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-200"></span>
                        </span>
                    </div>
                    <span className="text-xs font-semibold tracking-wide">Kisan Bazaar AI</span>
                    <span className="text-[11px] bg-emerald-800/60 px-2 py-0.5 rounded-full text-emerald-200 flex items-center gap-1">
                        <Eye className="h-3 w-3" /> {screenContext.pageTitle.split(":")[0]}
                    </span>
                    <Maximize2 className="h-4 w-4 ml-1 opacity-70 group-hover:opacity-100" />
                </button>
            </div>
        );
    }

    // 2. Closed resting state: Floating Action Button
    if (!isOpen) {
        return (
            <div className="fixed bottom-6 right-6 z-50">
                <div className="relative group">
                    {/* Pulsing glow ring */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-amber-500 rounded-full blur opacity-70 group-hover:opacity-100 transition duration-500 group-hover:scale-110 animate-pulse"></div>

                    {/* Tooltip badge */}
                    <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-2 px-3 py-1.5 bg-background/95 backdrop-blur-md border border-border shadow-xl rounded-xl text-xs font-medium text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none translate-x-2 group-hover:translate-x-0">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                        <Wheat className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Ask <strong>Kisan AI</strong> (मराठी / हिंदी / EN)</span>
                    </div>

                    <button
                        id="kisan-ai-fab-button"
                        onClick={toggleAi}
                        className="relative flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-700 to-emerald-500 text-white shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-emerald-500/30"
                        title="Open Kisan Bazaar AI Copilot"
                    >
                        <Bot className="h-7 w-7 text-white" />
                        <Sparkles className="h-4 w-4 text-amber-300 absolute -top-1 -right-1 animate-bounce" />
                    </button>
                </div>
            </div>
        );
    }

    // 3. Open full Copilot Drawer / Modal
    return (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[95vw] sm:w-[460px] h-[660px] max-h-[calc(100vh-32px)] flex flex-col bg-background/95 dark:bg-slate-950/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-emerald-500/20 dark:border-emerald-500/30 overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300">
            {/* Header */}
            <div className="px-4 py-3.5 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white flex items-center justify-between shadow-md">
                <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-inner">
                        <Bot className="h-5 w-5 text-emerald-100" />
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5">
                            <h3 className="font-bold text-sm tracking-wide">Kisan Bazaar AI</h3>
                            <span className="text-[10px] font-semibold bg-emerald-500/40 text-emerald-100 px-1.5 py-0.2 rounded border border-white/20">
                                {hasActiveGemini ? "Gemini 2.5 Flash 🟢" : "Smart Agri Engine 🟠"}
                            </span>
                        </div>
                        <p className="text-[11px] text-emerald-100/80 flex items-center gap-1 font-medium">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
                            मराठी • हिंदी • English Supported
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-1 text-white/80">
                    {/* Settings / API Key Button */}
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className={`p-1.5 rounded-xl transition ${showSettings ? "bg-white/30 text-white" : "hover:bg-white/20 hover:text-white"}`}
                        title="AI Model & Key Settings"
                    >
                        <SlidersHorizontal className="h-4 w-4" />
                    </button>

                    {/* Audio Stop Button */}
                    {isSpeaking && (
                        <button
                            onClick={stopSpeaking}
                            className="p-1.5 hover:bg-white/20 rounded-xl transition text-amber-300 animate-pulse"
                            title="Stop Audio Readout"
                        >
                            <VolumeX className="h-4 w-4" />
                        </button>
                    )}

                    {/* Reset Chat */}
                    <button
                        onClick={clearChat}
                        className="p-1.5 hover:bg-white/20 rounded-xl transition hover:text-white"
                        title="Restart Conversation"
                    >
                        <RotateCcw className="h-4 w-4" />
                    </button>

                    {/* Minimize */}
                    <button
                        onClick={toggleMinimize}
                        className="p-1.5 hover:bg-white/20 rounded-xl transition hover:text-white"
                        title="Minimize"
                    >
                        <Minimize2 className="h-4 w-4" />
                    </button>

                    {/* Close */}
                    <button
                        onClick={closeAi}
                        className="p-1.5 hover:bg-white/20 rounded-xl transition hover:text-white"
                        title="Close Assistant"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* AI Model & Key Configuration Panel */}
            {showSettings && (
                <div className="px-4 py-3 bg-muted/95 border-b border-border animate-in slide-in-from-top-3 duration-200">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5 font-semibold text-xs text-foreground">
                            <Cpu className="h-4 w-4 text-emerald-600" />
                            <span>GenAI Engine & Google Gemini Key</span>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${hasActiveGemini ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"}`}>
                            {hasActiveGemini ? "Gemini 2.5 Flash Active" : "Built-in Regional Engine"}
                        </span>
                    </div>

                    <p className="text-[11px] text-muted-foreground mb-2.5 leading-relaxed">
                        To unlock unlimited, human-grade conversational responses in Marathi, Hindi & English, paste your free Google Gemini API key.
                    </p>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <Key className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="password"
                                    value={apiKeyInput}
                                    onChange={(e) => setApiKeyInput(e.target.value)}
                                    placeholder="Paste Gemini API Key (AIzaSy...)"
                                    className="w-full bg-background border border-input rounded-xl pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                />
                            </div>
                            <button
                                onClick={handleSaveApiKey}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1 shrink-0"
                            >
                                <Check className="h-3.5 w-3.5" /> Save
                            </button>
                            {hasActiveGemini && (
                                <button
                                    onClick={handleRemoveApiKey}
                                    className="p-1.5 hover:bg-destructive/10 text-destructive rounded-xl transition"
                                    title="Remove Key"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1">
                            <a
                                href="https://aistudio.google.com/app/apikey"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1"
                            >
                                Get a Free Gemini Key at Google AI Studio <ExternalLink className="h-2.5 w-2.5" />
                            </a>
                            <button
                                onClick={() => setShowSettings(false)}
                                className="text-muted-foreground hover:text-foreground font-medium"
                            >
                                Close Settings
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Live Screen Awareness Ribbon */}
            <div className="px-3.5 py-2 bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-500/15 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 overflow-hidden text-emerald-800 dark:text-emerald-300 font-medium">
                    <Eye className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <span className="truncate">
                        <strong>स्क्रीन:</strong> {screenContext.screenSummary}
                    </span>
                </div>
                <span className="text-[10px] bg-emerald-200/70 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 px-2 py-0.5 rounded-full font-semibold shrink-0">
                    Live DOM Sync
                </span>
            </div>

            {/* Chat Messages Stream */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5 scrollbar-thin scrollbar-thumb-emerald-500/20">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                    >
                        <div
                            className={`max-w-[92%] rounded-2xl px-4 py-2.5 shadow-sm text-sm ${msg.sender === "user"
                                ? "bg-emerald-600 text-white rounded-br-none"
                                : "bg-muted/80 dark:bg-slate-900 border border-border/80 text-foreground rounded-bl-none"
                                }`}
                        >
                            {msg.sender === "ai" && (
                                <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-border/40 text-[11px] text-muted-foreground">
                                    <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                                        <Sparkles className="h-3 w-3" /> {hasActiveGemini ? "Kisan AI (Gemini 2.5 Flash)" : "Kisan AI (Smart Regional Engine)"}
                                    </span>
                                    {msg.text && (
                                        <button
                                            onClick={() => speakText(msg.text)}
                                            className="hover:text-emerald-600 dark:hover:text-emerald-400 transition flex items-center gap-1"
                                            title="Listen to audio readout"
                                        >
                                            <Volume2 className="h-3 w-3" /> Listen / ऐका
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Message text with markdown formatting */}
                            <div>{formatMessageContent(msg.text)}</div>

                            {/* Streaming loading indicator */}
                            {msg.isStreaming && !msg.text && (
                                <div className="flex items-center gap-1.5 py-1 text-muted-foreground text-xs">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-bounce"></span>
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]"></span>
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]"></span>
                                    <span className="ml-1">स्क्रीन व शेती नोंदींचे विश्लेषण चालू आहे...</span>
                                </div>
                            )}
                        </div>

                        {/* Interactive Action Buttons */}
                        {msg.actions && msg.actions.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-1.5 max-w-[92%]">
                                {msg.actions.map((act, aIdx) => (
                                    <button
                                        key={aIdx}
                                        onClick={() => executeAction(act)}
                                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100/90 dark:bg-emerald-950/60 hover:bg-emerald-200 dark:hover:bg-emerald-900 border border-emerald-500/30 text-emerald-900 dark:text-emerald-300 rounded-lg text-xs font-semibold transition hover:scale-[1.02] active:scale-[0.98] shadow-sm"
                                    >
                                        <span>{act.label}</span>
                                        <ArrowRight className="h-3 w-3" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Context-Sensitive Quick Suggestions Bar */}
            {screenContext.quickSuggestions && screenContext.quickSuggestions.length > 0 && (
                <div className="px-3 py-2 bg-muted/40 border-t border-border/50">
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground mb-1.5 px-1">
                        <Sparkles className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                        <span>या स्क्रीनसाठी सुचवलेले प्रश्न:</span>
                    </div>
                    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                        {screenContext.quickSuggestions.map((sugg, sIdx) => (
                            <button
                                key={sIdx}
                                onClick={() => handleSuggestionClick(sugg)}
                                className="whitespace-nowrap shrink-0 px-2.5 py-1 bg-background hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-border hover:border-emerald-500/40 rounded-full text-[11px] font-medium text-foreground transition-all hover:scale-102"
                            >
                                {sugg}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Bottom Input Area */}
            <form onSubmit={handleSend} className="p-3 bg-background border-t border-border">
                <div className="flex items-center gap-2 bg-muted/60 dark:bg-slate-900 border border-input rounded-2xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-all">
                    {/* Voice Input Button */}
                    <button
                        type="button"
                        onClick={handleVoiceClick}
                        className={`p-2 rounded-xl transition ${isListening
                            ? "bg-red-500 text-white animate-pulse"
                            : "text-muted-foreground hover:text-emerald-600 hover:bg-muted"
                            }`}
                        title={isListening ? "Stop listening" : "Voice input (मराठी / हिंदी / English)"}
                    >
                        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </button>

                    <input
                        ref={inputRef}
                        type="text"
                        value={inputQuery}
                        onChange={(e) => setInputQuery(e.target.value)}
                        placeholder={isListening ? "Listening... बोला..." : "पिके, भाव किंवा स्क्रीनबद्दल विचारा..."}
                        className="flex-1 bg-transparent border-none outline-none text-xs sm:text-sm text-foreground placeholder:text-muted-foreground"
                        disabled={isGenerating}
                    />

                    {/* Send Button */}
                    <button
                        type="submit"
                        disabled={!inputQuery.trim() || isGenerating}
                        className="h-8 w-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white flex items-center justify-center transition shadow-sm hover:scale-105 active:scale-95"
                    >
                        <Send className="h-4 w-4" />
                    </button>
                </div>

                <div className="flex items-center justify-between px-2 pt-1.5 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                        मराठी, हिंदी व इंग्रजी आवाज सपोर्ट
                    </span>
                    <span>{hasActiveGemini ? "Google Gemini 2.5 Flash" : "Smart Regional Engine"}</span>
                </div>
            </form>
        </div>
    );
};
