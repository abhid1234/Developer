"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Plane } from "lucide-react";

interface AirportFlight {
    flight: { iata: string; number: string };
    airline: { name: string; iata: string };
    status: string;
    departure: { scheduled: string; terminal: string; gate: string; delay: number; iata: string; airport: string };
    arrival: { scheduled: string; terminal: string; gate: string; delay: number; iata: string; airport: string };
}

export default function AirportDashboard() {
    const [airportCode, setAirportCode] = useState("");
    const [searchedCode, setSearchedCode] = useState("");
    const [mode, setMode] = useState<'departure' | 'arrival'>('departure');
    const [flights, setFlights] = useState<AirportFlight[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchFlights = async (code: string, type: 'departure' | 'arrival') => {
        if (!code) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/airports?code=${code}&type=${type}`);
            const data = await res.json();
            if (data.flights) {
                setFlights(data.flights);
                setSearchedCode(code);
            } else {
                setFlights([]);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchFlights(airportCode, mode);
    };

    // Auto-refresh when tabs switch if we have a code
    useEffect(() => {
        if (searchedCode) {
            fetchFlights(searchedCode, mode);
        }
    }, [mode]);

    const formatTime = (timeStr: string) => {
        const cleanStr = timeStr.replace(/[Zz]|[+-]\d{2}:?\d{2}$/, '');
        const date = new Date(cleanStr);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    return (
        <main className="min-h-screen bg-gray-900 text-white p-4 sm:p-12 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[100px]" />
            </div>

            {/* Header */}
            <div className="max-w-6xl mx-auto flex flex-col gap-8">
                <div className="flex items-center gap-4">
                    <Link href="/" className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors backdrop-blur-md">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        Airport Dashboard
                    </h1>
                </div>

                {/* Search & Controls */}
                <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md shadow-xl">
                    <form onSubmit={handleSearch} className="relative w-full md:w-96">
                        <input
                            type="text"
                            value={airportCode}
                            onChange={(e) => setAirportCode(e.target.value.toUpperCase())}
                            placeholder="Airport Code (e.g. JFK, LHR)"
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 pl-11 focus:outline-none focus:border-blue-500/50 transition-colors uppercase tracking-wider font-bold placeholder:font-normal placeholder:capitalize"
                            maxLength={4}
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </form>

                    <div className="flex bg-black/20 p-1 rounded-xl border border-white/5">
                        <button
                            onClick={() => setMode('departure')}
                            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${mode === 'departure' ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Plane className="w-4 h-4 -rotate-45" />
                            Departures
                        </button>
                        <button
                            onClick={() => setMode('arrival')}
                            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${mode === 'arrival' ? 'bg-purple-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Plane className="w-4 h-4 rotate-135" />
                            Arrivals
                        </button>
                    </div>
                </div>

                {/* Flight Board */}
                {searchedCode && (
                    <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <h2 className="text-2xl font-bold tracking-tight">
                                {mode === 'departure' ? 'Departures' : 'Arrivals'}
                                <span className="text-gray-500 ml-2 font-normal text-lg">at {searchedCode}</span>
                            </h2>
                            <div className="text-sm text-gray-400 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                Live Data
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-black/20 text-gray-400 text-sm uppercase tracking-wider">
                                    <tr>
                                        <th className="p-4 font-medium">Time</th>
                                        <th className="p-4 font-medium">Flight</th>
                                        <th className="p-4 font-medium">Airline</th>
                                        <th className="p-4 font-medium">{mode === 'departure' ? 'Destination' : 'Origin'}</th>
                                        <th className="p-4 font-medium">Gate</th>
                                        <th className="p-4 font-medium text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-sm">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={6} className="p-8 text-center text-gray-500 animate-pulse">Loading Flight Board...</td>
                                        </tr>
                                    ) : flights.length > 0 ? (
                                        flights.map((flight, i) => (
                                            <tr key={i} className="hover:bg-white/5 transition-colors group">
                                                <td className="p-4 font-mono text-blue-300 font-bold">
                                                    {formatTime(mode === 'departure' ? flight.departure.scheduled : flight.arrival.scheduled)}
                                                </td>
                                                <td className="p-4 font-bold text-white">{flight.flight.iata}</td>
                                                <td className="p-4 text-gray-300">{flight.airline.name}</td>
                                                <td className="p-4 text-gray-300">
                                                    <div className="flex flex-col">
                                                        <span className="text-white font-bold">
                                                            {mode === 'departure' ? flight.arrival.iata : flight.departure.iata}
                                                        </span>
                                                        <span className="text-xs text-gray-500 truncate max-w-[150px]">
                                                            {mode === 'departure' ? flight.arrival.airport : flight.departure.airport}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-4 font-mono text-yellow-500">
                                                    {(mode === 'departure' ? flight.departure.gate : flight.arrival.gate) || '-'}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${flight.status === 'active' || flight.status === 'landed' ? 'bg-green-500/20 text-green-400' :
                                                            flight.status === 'scheduled' ? 'bg-blue-500/20 text-blue-400' :
                                                                'bg-gray-500/20 text-gray-400'
                                                        }`}>
                                                        {flight.status.toUpperCase()}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="p-12 text-center text-gray-500">
                                                No flights found for this time window.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
