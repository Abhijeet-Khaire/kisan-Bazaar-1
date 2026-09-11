import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Navigation } from 'lucide-react';

const roles = [
    { id: 'farmer', label: 'Farmer' },
    { id: 'buyer', label: 'Buyer' },
    { id: 'logistics', label: 'Logistics' },
    { id: 'storage', label: 'Storage' }
];

export const AuthLayout = ({
    title,
    subtitle,
    activeRole,
    onRoleChange,
    onSubmit,
    isLoading,
    submitText,
    footerPrompt,
    footerLinkText,
    footerLinkHref,
    children
}) => {
    return (
        <div className="min-h-screen w-full bg-[#f8fafc] flex items-center justify-center p-3 sm:p-6 lg:p-8 font-sans">
            <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl shadow-gray-200/60 overflow-hidden border border-gray-100 grid grid-cols-1 lg:grid-cols-12 min-h-[660px]">
                
                {/* Left Side Banner (Emerald Gradient Hero) */}
                <div className="lg:col-span-5 bg-gradient-to-b from-[#16855b] via-[#10744f] to-[#0c4a34] p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden text-white min-h-[380px] lg:min-h-[640px]">
                    {/* Subtle decorative background circles */}
                    <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-white/5 blur-2xl pointer-events-none" />
                    <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />

                    {/* Top Logo Header */}
                    <div className="relative z-10">
                        <Link to="/" className="inline-flex items-center gap-2 group focus:outline-none">
                            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md group-hover:bg-white/20 transition-all">
                                <Navigation className="w-6 h-6 text-white fill-white transform -rotate-45" />
                            </div>
                            <span className="font-semibold text-xl tracking-tight text-white">KisanBazaar</span>
                        </Link>
                    </div>

                    {/* Middle Hero Content */}
                    <div className="relative z-10 my-auto py-8">
                        <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-white leading-[1.15] tracking-tight">
                            Empowering the Agricultural Future.
                        </h1>
                        <p className="mt-4 text-emerald-100/90 text-sm sm:text-base leading-relaxed font-normal max-w-md">
                            Connect directly with markets, manage your harvest, and grow your farming business with KisanBazaar's digital ecosystem.
                        </p>
                    </div>

                    {/* Bottom Social Proof Badge */}
                    <div className="relative z-10 pt-4 flex items-center gap-3">
                        <div className="flex -space-x-2 overflow-hidden">
                            <img
                                className="inline-block h-9 w-9 rounded-full ring-2 ring-[#10744f] object-cover"
                                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                                alt="User avatar"
                            />
                            <img
                                className="inline-block h-9 w-9 rounded-full ring-2 ring-[#10744f] object-cover"
                                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                                alt="User avatar"
                            />
                            <img
                                className="inline-block h-9 w-9 rounded-full ring-2 ring-[#10744f] object-cover"
                                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
                                alt="User avatar"
                            />
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-emerald-50">
                            Join 10,000+ farmers nationwide
                        </span>
                    </div>
                </div>

                {/* Right Side Form */}
                <div className="lg:col-span-7 p-6 sm:p-10 lg:p-14 flex flex-col justify-between bg-white min-h-[500px]">
                    <div>
                        {/* Title & Subtitle */}
                        <div>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
                                {title}
                            </h2>
                            <p className="mt-2 text-sm sm:text-base text-gray-500 font-normal">
                                {subtitle}
                            </p>
                        </div>

                        {/* Role Selector Tabs */}
                        <div className="mt-6 sm:mt-8">
                            <div className="bg-[#f3f4f6] p-1.5 rounded-full flex items-center justify-between gap-1 border border-gray-100">
                                {roles.map((role) => {
                                    const isActive = activeRole === role.id;
                                    return (
                                        <button
                                            key={role.id}
                                            type="button"
                                            onClick={() => onRoleChange(role.id)}
                                            className={`relative flex-1 py-2.5 px-3 sm:px-4 text-xs sm:text-sm font-medium transition-colors duration-200 rounded-full focus:outline-none ${
                                                isActive ? 'text-[#0b7a55]' : 'text-gray-500 hover:text-gray-900'
                                            }`}
                                        >
                                            {isActive && (
                                                <motion.div
                                                    layoutId="activeRoleIndicator"
                                                    className="absolute inset-0 bg-white rounded-full shadow-sm"
                                                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                                                />
                                            )}
                                            <span className="relative z-10 block text-center font-semibold">
                                                {role.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Main Form Fields */}
                        <form onSubmit={onSubmit} className="mt-6 sm:mt-8 space-y-4">
                            {children}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-12 mt-2 bg-[#0b7a55] hover:bg-[#086244] active:bg-[#064e36] disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-900/10 transition-all duration-200 text-sm sm:text-base"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>{submitText}</span>
                                        <ArrowRight className="w-4 h-4 ml-0.5" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Footer prompt & link */}
                        <div className="mt-6 text-center text-sm text-gray-500 font-medium">
                            <span>{footerPrompt} </span>
                            <Link
                                to={footerLinkHref}
                                className="font-bold text-[#0b7a55] hover:underline focus:outline-none transition-all ml-1"
                            >
                                {footerLinkText}
                            </Link>
                        </div>
                    </div>

                    {/* Footer Copyright */}
                    <div className="mt-8 pt-4 text-right text-xs text-gray-400 font-normal">
                        © {new Date().getFullYear()} KisanBazaar. All rights reserved.
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AuthLayout;
