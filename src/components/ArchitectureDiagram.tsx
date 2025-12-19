'use client';

import React from 'react';
import { ArrowRight, ArrowDown, Globe, Server, Database, Code, Map as MapIcon, Layout } from 'lucide-react';

export default function ArchitectureDiagram() {
    return (
        <div className="w-full bg-white p-8 rounded-xl shadow-2xl overflow-hidden flex flex-col items-center">
            {/* Header */}
            <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-blue-500 mb-2">FlightTracker Architecture</h3>
                <p className="text-slate-500 font-medium">Next.js 14 (App Router) • Google Cloud Run • Aviationstack</p>
            </div>

            {/* Main Flow Container */}
            <div className="flex flex-col md:flex-row items-stretch justify-center gap-8 w-full max-w-6xl relative">

                {/* 1. Frontend Layer */}
                <div className="flex-1 min-w-[300px] bg-slate-50 border-2 border-slate-300 rounded-xl p-6 flex flex-col gap-4 relative">
                    <div className="absolute -top-3 left-4 bg-slate-50 px-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Frontend (User Device)
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex-1 flex flex-col gap-4">
                        <div className="flex items-center gap-2 text-blue-900 font-bold border-b border-blue-200 pb-2 mb-2">
                            <Globe className="w-4 h-4" /> Browser Client
                        </div>

                        {/* Page Node */}
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-lg shadow-md flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Code className="w-4 h-4" />
                                <div className="text-sm font-bold">Page.tsx</div>
                            </div>
                            <div className="text-[10px] opacity-80">Client Component</div>
                        </div>

                        {/* Components Group */}
                        <div className="flex gap-2">
                            <div className="flex-1 bg-blue-100 border border-blue-300 p-2 rounded-lg text-center">
                                <div className="text-xs font-bold text-blue-900">FlightCard</div>
                                <div className="text-[10px] text-blue-700">Display Details</div>
                            </div>
                            <div className="flex-1 bg-green-100 border border-green-300 p-2 rounded-lg text-center">
                                <div className="text-xs font-bold text-green-900">FlightMap</div>
                                <div className="text-[10px] text-green-700">React Leaflet</div>
                            </div>
                        </div>

                        {/* Styling Node */}
                        <div className="bg-slate-100 border border-slate-300 p-2 rounded-lg flex items-center justify-center gap-2">
                            <Layout className="w-3 h-3 text-slate-500" />
                            <div className="text-xs font-bold text-slate-600">Tailwind CSS</div>
                        </div>
                    </div>
                </div>

                {/* Connector Arrow (Desktop) */}
                <div className="hidden md:flex flex-col justify-center items-center gap-2 z-10">
                    <div className="bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg whitespace-nowrap">
                        HTTPS / DNS
                    </div>
                    <ArrowRight className="w-6 h-6 text-slate-400 animate-pulse" />
                </div>

                {/* Connector Arrow (Mobile) */}
                <div className="md:hidden flex flex-col items-center gap-2">
                    <ArrowDown className="w-6 h-6 text-slate-400" />
                    <div className="bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                        HTTPS / DNS
                    </div>
                    <ArrowDown className="w-6 h-6 text-slate-400" />
                </div>

                {/* Right Column: Cloud & External */}
                <div className="flex-1 flex flex-col gap-8 min-w-[300px]">

                    {/* 2. Cloud Layer */}
                    <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6 relative">
                        <div className="absolute -top-3 left-4 bg-orange-50 px-2 text-xs font-bold text-orange-600 uppercase tracking-wider">
                            Google Cloud Platform
                        </div>

                        <div className="bg-white border border-orange-300 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-orange-900 font-bold border-b border-orange-100 pb-2 mb-4">
                                <Server className="w-4 h-4" /> Cloud Run Service
                            </div>

                            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg shadow-md text-center">
                                <div className="font-bold">API Route</div>
                                <div className="text-xs opacity-90 font-mono mt-1">/api/flights</div>
                            </div>
                        </div>
                    </div>

                    {/* Vertical Arrow */}
                    <div className="flex justify-center">
                        <ArrowDown className="w-6 h-6 text-slate-400" />
                    </div>

                    {/* 3. External Layer */}
                    <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6 relative">
                        <div className="absolute -top-3 left-4 bg-purple-50 px-2 text-xs font-bold text-purple-600 uppercase tracking-wider">
                            External Services
                        </div>

                        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg shadow-md flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Database className="w-5 h-5" />
                                <div className="text-left">
                                    <div className="font-bold">Aviationstack API</div>
                                    <div className="text-xs opacity-90">Real-time Flight Data</div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
