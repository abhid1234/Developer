import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code')?.toUpperCase();
    const type = searchParams.get('type'); // 'departure' or 'arrival'

    if (!code || !type) {
        return NextResponse.json({ error: 'Airport code and type (departure/arrival) are required' }, { status: 400 });
    }

    const API_KEY = process.env.AVIATIONSTACK_API_KEY;
    if (!API_KEY) {
        return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    try {
        const param = type === 'departure' ? 'dep_iata' : 'arr_iata';
        const apiUrl = `http://api.aviationstack.com/v1/flights?access_key=${API_KEY}&${param}=${code}&limit=100`;

        console.log(`Fetching airport data: ${apiUrl}`);
        const res = await fetch(apiUrl);
        const data = await res.json();

        if (!data.data) {
            return NextResponse.json([]);
        }

        // Filter for relevant flights (e.g., active, scheduled, landed recently)
        // We want a "Live Board" feel, so we prioritize active/scheduled/recent land
        const now = new Date();
        const sixHoursAgo = new Date(now.getTime() - (6 * 60 * 60 * 1000));
        const twentyFourHoursAhead = new Date(now.getTime() + (24 * 60 * 60 * 1000));

        const relevantFlights = data.data.filter((f: any) => {
            const timeStr = type === 'departure' ? f.departure.scheduled : f.arrival.scheduled;
            const time = new Date(timeStr);
            return time > sixHoursAgo && time < twentyFourHoursAhead;
        });

        // Map to simple interface
        const mappedFlights = relevantFlights.map((f: any) => ({
            flight: {
                iata: f.flight.iata,
                number: f.flight.number
            },
            airline: {
                name: f.airline.name,
                iata: f.airline.iata
            },
            status: f.flight_status,
            departure: {
                airport: f.departure.airport,
                iata: f.departure.iata,
                scheduled: f.departure.scheduled,
                terminal: f.departure.terminal,
                gate: f.departure.gate,
                delay: f.departure.delay
            },
            arrival: {
                airport: f.arrival.airport,
                iata: f.arrival.iata,
                scheduled: f.arrival.scheduled,
                terminal: f.arrival.terminal,
                gate: f.arrival.gate,
                delay: f.arrival.delay
            }
        }));

        // Sort by time
        mappedFlights.sort((a: any, b: any) => {
            const timeA = new Date(type === 'departure' ? a.departure.scheduled : a.arrival.scheduled).getTime();
            const timeB = new Date(type === 'departure' ? b.departure.scheduled : b.arrival.scheduled).getTime();
            return timeA - timeB;
        });

        return NextResponse.json({ flights: mappedFlights });

    } catch (error) {
        console.error('Airport API error:', error);
        return NextResponse.json({ error: 'Failed to fetch airport data' }, { status: 500 });
    }
}
