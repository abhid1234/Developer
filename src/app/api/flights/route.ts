import { NextResponse } from 'next/server';

interface Flight {
    flightNumber: string;
    origin: {
        code: string;
        city: string;
        time: string;
        timezone: string;
    };
    destination: {
        code: string;
        city: string;
        time: string;
        timezone: string;
    };
    status: string;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) {
        return NextResponse.json({ error: 'Flight number is required' }, { status: 400 });
    }

    const API_KEY = process.env.AVIATIONSTACK_API_KEY;

    if (!API_KEY) {
        // Fallback to mock data if no key is present, or return error
        console.error("No API key found");
        return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    try {
        const res = await fetch(
            `http://api.aviationstack.com/v1/flights?access_key=${API_KEY}&flight_iata=${query}`
        );

        const data = await res.json();

        if (!data.data || data.data.length === 0) {
            return NextResponse.json([]);
        }

        // Map Aviationstack data to our Flight interface
        const flights: Flight[] = data.data.map((item: any) => ({
            flightNumber: item.flight.iata,
            origin: {
                code: item.departure.iata,
                city: item.departure.airport,
                time: item.departure.scheduled,
                timezone: item.departure.timezone,
            },
            destination: {
                code: item.arrival.iata,
                city: item.arrival.airport,
                time: item.arrival.scheduled,
                timezone: item.arrival.timezone,
            },
            status: item.flight_status ? (item.flight_status.charAt(0).toUpperCase() + item.flight_status.slice(1)) : 'Unknown',
        }));

        return NextResponse.json(flights);
    } catch (error) {
        console.error('Aviationstack API error:', error);
        return NextResponse.json({ error: 'Failed to fetch flight data' }, { status: 500 });
    }
}
