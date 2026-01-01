"use client";

import Script from "next/script";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Server, Database, Globe } from "lucide-react";
import ArchitectureDiagram from "@/components/ArchitectureDiagram";
import Image from "next/image";

export default function ArchitecturePage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <main className="min-h-screen bg-gray-900 text-white p-4 sm:p-24 relative overflow-hidden">


            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[100px]" />
            </div>

            {/* Logo in upper left corner */}
            <div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-20">
                <div className="p-2 sm:p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl backdrop-blur-md border border-white/10 shadow-2xl hover:border-white/20 transition-all duration-300">
                    <Image
                        src="/logo.png"
                        alt="Flight Tracker Logo"
                        width={511}
                        height={595}
                        className="w-10 h-auto sm:w-16 hover:scale-105 transition-transform duration-300"
                    />
                </div>
            </div>

            <div className="max-w-4xl mx-auto z-10">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to Flight Tracker
                </Link>

                <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-6">
                    System Architecture
                </h1>

                <p className="text-xl text-gray-300 mb-12">
                    Technical overview of the Flight Tracker application structure and data flow.
                </p>

                {/* Architecture Details */}
                <div className="grid gap-8 mb-12">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-blue-500/20 rounded-xl">
                                <Globe className="w-8 h-8 text-blue-400" />
                            </div>
                            <h2 className="text-2xl font-semibold">Frontend Layer</h2>
                        </div>
                        <p className="text-gray-400 leading-relaxed mb-4">
                            <strong>Framework:</strong> Next.js 14 (App Router)<br />
                            <strong>UI Library:</strong> React 18 with Tailwind CSS<br />
                            <strong>Maps:</strong> React Leaflet integration
                        </p>
                        <p className="text-gray-400 leading-relaxed">
                            The frontend is a responsive client-side application that handles user interactions,
                            displays real-time flight data using FlightCard components, and visualizes routes on an interactive map.
                        </p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-purple-500/20 rounded-xl">
                                <Server className="w-8 h-8 text-purple-400" />
                            </div>
                            <h2 className="text-2xl font-semibold">Cloud Infrastructure</h2>
                        </div>
                        <p className="text-gray-400 leading-relaxed mb-4">
                            <strong>Hosting:</strong> Google Cloud Run (Serverless)<br />
                            <strong>Domain:</strong> GoDaddy (DNS Management)<br />
                            <strong>Routing:</strong> Custom domain pointing to Cloud Run service
                        </p>
                        <p className="text-gray-400 leading-relaxed">
                            The application runs in a serverless container environment on Google Cloud Platform,
                            ensuring automatic scaling and high availability.
                        </p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-green-500/20 rounded-xl">
                                <Database className="w-8 h-8 text-green-400" />
                            </div>
                            <h2 className="text-2xl font-semibold">Data Flow & API</h2>
                        </div>
                        <div className="text-gray-400 leading-relaxed">
                            <p className="mb-4"><strong>External Service:</strong> Aviationstack API</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>User initiates search request from Browser Client</li>
                                <li>Request routed via HTTPS/DNS to Cloud Run</li>
                                <li>Next.js API Route (<code>/api/flights</code>) acts as a proxy</li>
                                <li>Server fetches real-time data from Aviationstack</li>
                                <li>Response is normalized and sent back to the UI</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Architecture Diagram */}
                <div className="mt-12 mb-12 flex justify-center w-full">
                    <div className="w-full">
                        <h2 className="text-2xl font-semibold mb-6 text-left">System Diagram</h2>
                        <ArchitectureDiagram />
                    </div>
                </div>
            </div>
        </main>
    );
}
