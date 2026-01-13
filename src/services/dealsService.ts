import type { Deal, Coordinates } from '../types/deal';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Helper to calculate distance (kept for potential client-side use)
function getDistanceInMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 3959; // Earth's radius in miles
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
}

// Main function to fetch deals from backend API
export async function fetchDeals(userLocation: Coordinates): Promise<Deal[]> {
    try {
        console.log('🚀 Fetching deals from backend API...');
        console.log('📍 Location:', userLocation);

        const response = await fetch(`${API_BASE_URL}/api/deals`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                lat: userLocation.lat,
                lng: userLocation.lng,
            }),
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'Failed to fetch deals');
        }

        console.log(`✅ Received ${data.count} deals from API`);
        return data.deals || [];
    } catch (error) {
        console.error('❌ Error fetching deals from API:', error);
        throw error;
    }
}

export { getDistanceInMiles };
