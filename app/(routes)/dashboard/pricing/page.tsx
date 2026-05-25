import { PricingTable } from "@clerk/nextjs";
import React from "react";

const Pricing = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white px-6 py-16">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="text-center mb-14">
                    <div className="inline-block px-4 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-sm text-zinc-300 mb-5">
                        🚀 Simple & Transparent Pricing
                    </div>

                    <h1 className="text-5xl font-bold tracking-tight">
                        Choose the Perfect Plan
                    </h1>

                    <p className="text-zinc-400 mt-5 text-lg max-w-2xl mx-auto">
                        Track visitors, monitor analytics, and grow your website with
                        powerful insights using WebTracker.
                    </p>
                </div>

                {/* Pricing Card Wrapper */}
                <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-6 md:p-10 shadow-2xl backdrop-blur">
                    <PricingTable />
                </div>

                {/* Bottom Features */}
                <div className="grid md:grid-cols-3 gap-6 mt-14">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                        <h3 className="text-xl font-semibold mb-2">
                            Real-Time Analytics
                        </h3>
                        <p className="text-zinc-400 text-sm">
                            Monitor visitors, devices, locations, and page views instantly.
                        </p>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                        <h3 className="text-xl font-semibold mb-2">
                            Easy Integration
                        </h3>
                        <p className="text-zinc-400 text-sm">
                            Add one tracking script to your website and start collecting data.
                        </p>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                        <h3 className="text-xl font-semibold mb-2">
                            Secure & Fast
                        </h3>
                        <p className="text-zinc-400 text-sm">
                            Built with modern infrastructure for speed, security, and scale.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pricing;