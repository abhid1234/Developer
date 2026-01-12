import React from 'react';
import { render, screen } from '@testing-library/react';
import { FlightCard } from './FlightCard';

// Mock the flight data
const mockFlight = {
    flightNumber: 'AA123',
    origin: {
        code: 'JFK',
        city: 'New York',
        time: '2023-10-27T10:00:00', // Local time
        timezone: 'America/New_York',
        terminal: '8',
        gate: '14'
    },
    destination: {
        code: 'LHR',
        city: 'London',
        time: '2023-10-27T22:00:00', // Local time
        timezone: 'Europe/London',
        terminal: '5',
        gate: 'A10'
    },
    status: 'Active',
    aircraft: {
        model: 'Boeing 777'
    },
    live: {
        latitude: 50.0,
        longitude: -30.0,
        altitude: 35000,
        speed_horizontal: 900,
        direction: 90,
        is_ground: false
    }
};

describe('FlightCard', () => {
    it('renders flight information correctly', () => {
        render(<FlightCard flight={mockFlight} />);

        // Check Flight Number
        expect(screen.getByText('AA123')).toBeInTheDocument();

        // Check Status
        expect(screen.getByText('ACTIVE')).toBeInTheDocument();

        // Check Aircraft Model
        expect(screen.getByText('Boeing 777')).toBeInTheDocument();
    });

    it('renders origin and destination details', () => {
        render(<FlightCard flight={mockFlight} />);

        // Check Codes
        expect(screen.getByText('JFK')).toBeInTheDocument();
        expect(screen.getByText('LHR')).toBeInTheDocument();

        // Check Terminal info
        expect(screen.getByText(/T8/)).toBeInTheDocument();
        expect(screen.getByText(/G14/)).toBeInTheDocument();
        expect(screen.getByText(/T5/)).toBeInTheDocument();
        expect(screen.getByText(/GA10/)).toBeInTheDocument();
    });

    it('renders telemetry data when live data is present', () => {
        render(<FlightCard flight={mockFlight} />);

        // Check Altitude
        expect(screen.getByText(/35,000/)).toBeInTheDocument();
        expect(screen.getByText('ft')).toBeInTheDocument();

        // Check Speed
        expect(screen.getByText(/900/)).toBeInTheDocument();
        expect(screen.getByText('km/h')).toBeInTheDocument();
    });

    it('calculates and displays emissions', () => {
        render(<FlightCard flight={mockFlight} />);
        
        // JFK -> LHR generates emissions. checking for the text "kg CO₂"
        expect(screen.getByText(/kg CO₂/)).toBeInTheDocument();
    });
});
