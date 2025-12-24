import React from 'react';
import { Plane, Clock, MapPin, Calendar } from 'lucide-react';

interface Flight {
    flightNumber: string;
    origin: {
        code: string;
        city: string;
        time: string;
        timezone: string;
        terminal?: string;
        gate?: string;
    };
    destination: {
        code: string;
        city: string;
        time: string;
        timezone: string;
        terminal?: string;
        gate?: string;
    };
    status: string;
    live?: {
        latitude: number;
        longitude: number;
        altitude: number;
        speed_horizontal: number;
        direction: number;
        is_ground: boolean;
    };
}

interface FlightCardProps {
    flight: Flight;
}

export function FlightCard({ flight }: FlightCardProps) {
    // Helper to extract local time parts from API string
    const getLocalTimeParts = (timeStr: string) => {
        // API returns local time but formatted with +00:00 (e.g., 21:30+00:00 for 9:30PM Local).
        // We must ignore the offset and treat it as the "face value" time at the airport.
        const cleanStr = timeStr.replace(/[Zz]|[+-]\d{2}:?\d{2}$/, '');
        return new Date(cleanStr);
    };

    const formatTime = (timeStr: string, timezone: string) => {
        try {
            // Create a date object that represents the standard LOCAL time components
            const date = getLocalTimeParts(timeStr);

            // Format "as is" - effectively treating the components as the intended display time
            const time = date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });

            // For TZ abbreviation, we need the real absolute instant
            // But getting abbreviation is tricky if we don't assume the timeStr is absolute.
            // Let's rely on Intl for the abbreviation of the *intended* timezone
            const tz = new Intl.DateTimeFormat('en-US', {
                timeZoneName: 'short',
                timeZone: timezone
            }).formatToParts(new Date()).find(part => part.type === 'timeZoneName')?.value || '';

            return { time, tz };
        } catch (e) {
            return { time: timeStr, tz: '' };
        }
    };

    const formatDate = (timeStr: string) => {
        try {
            const date = getLocalTimeParts(timeStr);
            return date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
            });
        } catch (e) {
            return new Date(timeStr).toLocaleDateString();
        }
    };

    // Helper to calculate duration
    const getDuration = (start: string, end: string) => {
        // Simple diff for now as robust timezone diffing requires library
        const diff = new Date(end).getTime() - new Date(start).getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    };

    const originTime = formatTime(flight.origin.time, flight.origin.timezone);
    const destTime = formatTime(flight.destination.time, flight.destination.timezone);

    return (
        <div className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl text-white my-4 hover:bg-white/15 transition-all duration-300">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <Plane className="w-5 h-5 text-blue-400" />
                    <span className="font-bold text-xl tracking-wider">{flight.flightNumber}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${flight.status === 'Active' ? 'bg-green-500/20 text-green-300' :
                    flight.status === 'Delayed' ? 'bg-red-500/20 text-red-300' :
                        'bg-blue-500/20 text-blue-300'
                    }`}>
                    {flight.status.toUpperCase()}
                </span>
            </div>

            <div className="flex justify-between items-center relative">
                {/* Origin */}
                <div className="text-left w-1/3">
                    <div className="text-3xl font-bold mb-1">{flight.origin.code}</div>
                    <div className="text-sm text-gray-400 mb-2 truncate">{flight.origin.city.split('/')[0]}</div>
                    {(flight.origin.terminal || flight.origin.gate) && (
                        <div className="text-xs text-blue-200 mb-2 bg-blue-500/10 px-2 py-0.5 rounded-md inline-block border border-blue-500/20">
                            {flight.origin.terminal && `T${flight.origin.terminal}`}
                            {flight.origin.terminal && flight.origin.gate && <span className="mx-1">•</span>}
                            {flight.origin.gate && `G${flight.origin.gate}`}
                        </div>
                    )}
                    <div className="flex flex-col">
                        <div className="text-3xl font-bold text-white">
                            {originTime.time}
                        </div>
                        <div className="text-sm font-medium text-blue-400">{originTime.tz}</div>
                    </div>
                </div>

                {/* Flight Path Visual */}
                <div className="flex-1 px-4 flex flex-col items-center">
                    <div className="text-gray-400 text-sm font-medium mb-2">{getDuration(flight.origin.time, flight.destination.time)}</div>
                    <div className="relative w-full flex items-center justify-center">
                        <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
                        <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent relative">
                            <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-blue-400 fill-blue-400/20 rotate-90" />
                        </div>
                    </div>
                </div>

                {/* Destination */}
                <div className="text-right w-1/3">
                    <div className="text-3xl font-bold mb-1">{flight.destination.code}</div>
                    <div className="text-sm text-gray-400 mb-2 truncate">{flight.destination.city.split('/')[0]}</div>
                    {(flight.destination.terminal || flight.destination.gate) && (
                        <div className="text-xs text-blue-200 mb-2 bg-blue-500/10 px-2 py-0.5 rounded-md inline-block border border-blue-500/20">
                            {flight.destination.terminal && `T${flight.destination.terminal}`}
                            {flight.destination.terminal && flight.destination.gate && <span className="mx-1">•</span>}
                            {flight.destination.gate && `G${flight.destination.gate}`}
                        </div>
                    )}
                    <div className="flex flex-col items-end">
                        <div className="text-3xl font-bold text-white">
                            {destTime.time}
                        </div>
                        <div className="text-sm font-medium text-purple-400">{destTime.tz}</div>
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex justify-between text-sm text-gray-400">
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatDate(flight.origin.time)}
                </div>
                <div>
                    {flight.origin.timezone} → {flight.destination.timezone}
                </div>
            </div>

            {/* Telemetry Section */}
            {flight.live && (
                <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
                    <div className="bg-black/20 rounded-lg p-3 text-center">
                        <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Altitude</div>
                        <div className="text-xl font-mono font-bold text-blue-300">
                            {Math.round(flight.live.altitude).toLocaleString()} <span className="text-sm font-normal text-gray-500">ft</span>
                        </div>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3 text-center">
                        <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Ground Speed</div>
                        <div className="text-xl font-mono font-bold text-blue-300">
                            {Math.round(flight.live.speed_horizontal).toLocaleString()} <span className="text-sm font-normal text-gray-500">km/h</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
