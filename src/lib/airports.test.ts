import { calculateFlightEmissions } from './airports';

describe('calculateFlightEmissions', () => {
    it('calculates emissions for a long-haul flight correctly (JFK -> LHR)', () => {
        // JFK to LHR is > 4000km, so factor is 0.100
        const result = calculateFlightEmissions('JFK', 'LHR');
        
        expect(result).not.toBeNull();
        expect(result?.distanceKm).toBeGreaterThan(5000);
        expect(result?.distanceKm).toBeLessThan(6000);
        
        // precise check: distance * 0.1
        if (result) {
            expect(result.co2Kg).toBe(Math.round(result.distanceKm * 0.100));
        }
    });

    it('calculates emissions for a short-haul flight correctly (LHR -> CDG)', () => {
        // LHR to CDG is < 1500km, so factor is 0.150
        const result = calculateFlightEmissions('LHR', 'CDG');
        
        expect(result).not.toBeNull();
        expect(result?.distanceKm).toBeLessThan(500); // It's very close
        expect(result?.distanceKm).toBeGreaterThan(300);

        if (result) {
            expect(result.co2Kg).toBe(Math.round(result.distanceKm * 0.150));
        }
    });

    it('calculates emissions for a medium-haul flight correctly (JFK -> MIA)', () => {
        // JFK to MIA is approx 1700km (medium haul 1500-4000), factor 0.115
        const result = calculateFlightEmissions('JFK', 'MIA');
        
        expect(result).not.toBeNull();
        expect(result?.distanceKm).toBeGreaterThan(1500);
        expect(result?.distanceKm).toBeLessThan(4000);

        if (result) {
            expect(result.co2Kg).toBe(Math.round(result.distanceKm * 0.115));
        }
    });

    it('returns null for invalid origin airport code', () => {
        const result = calculateFlightEmissions('XXX', 'LHR');
        expect(result).toBeNull();
    });

    it('returns null for invalid destination airport code', () => {
        const result = calculateFlightEmissions('JFK', 'XXX');
        expect(result).toBeNull();
    });
});
