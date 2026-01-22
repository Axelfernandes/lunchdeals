import type { Deal, Coordinates } from '../types/deal';

// Helper to calculate distance in miles
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

// Generate high-quality mock deals for Los Angeles (Frontend-only for PoC)
function generateLAMockDeals(): Deal[] {
    const hotspots = [
        { name: 'Santa Monica', lat: 34.0195, lng: -118.4912 },
        { name: 'DTLA', lat: 34.0407, lng: -118.2468 },
        { name: 'Hollywood', lat: 34.0928, lng: -118.3287 },
        { name: 'Westwood/UCLA', lat: 34.0689, lng: -118.4452 },
        { name: 'Silver Lake', lat: 34.0869, lng: -118.2702 },
        { name: 'Venice', lat: 33.9850, lng: -118.4695 },
        { name: 'Beverly Hills', lat: 34.0736, lng: -118.4004 },
        { name: 'Koreatown', lat: 34.0618, lng: -118.2995 }
    ];

    const laRestaurants = [
        { name: 'Bay Cities Italian Deli', neighborhood: 'Santa Monica', cuisine: 'Italian', image: 'photo-1550507992-eb63ffee0847', dietary: [], priceRange: [12, 18] },
        { name: 'The Misfit Bar', neighborhood: 'Santa Monica', cuisine: 'American', image: 'photo-1514362545857-3bc16c4c7d1b', dietary: ['vegetarian'], priceRange: [15, 25] },
        { name: 'Gjusta', neighborhood: 'Venice', cuisine: 'Bakery/Cafe', image: 'photo-1509440159596-0249088772ff', dietary: ['vegetarian', 'vegan'], priceRange: [14, 22] },
        { name: 'Night + Market Sahm', neighborhood: 'Venice', cuisine: 'Thai', image: 'photo-1559314809-0d155014e29e', dietary: ['vegan'], priceRange: [16, 28] },
        { name: 'Grand Central Market', neighborhood: 'DTLA', cuisine: 'Various', image: 'photo-1555396273-367ea4eb4db5', dietary: ['vegetarian', 'vegan'], priceRange: [10, 15] },
        { name: 'Bestia', neighborhood: 'DTLA', cuisine: 'Italian', image: 'photo-1551183053-bf91a1d81141', dietary: [], priceRange: [25, 45] },
        { name: 'Daikokuya Ramen', neighborhood: 'Little Tokyo', cuisine: 'Japanese', image: 'photo-1569718212165-3a8278d5f624', dietary: [], priceRange: [13, 19] },
        { name: 'Badmaash', neighborhood: 'DTLA', cuisine: 'Indian', image: 'photo-1585937421612-70a008356fbe', dietary: ['vegetarian'], priceRange: [15, 25] },
        { name: 'Musso & Frank Grill', neighborhood: 'Hollywood', cuisine: 'American', image: 'photo-1544025162-d76694265947', dietary: [], priceRange: [30, 60] },
        { name: 'Luv2Eat Thai', neighborhood: 'Hollywood', cuisine: 'Thai', image: 'photo-1562565652-a0d8f0c59eb4', dietary: ['vegetarian'], priceRange: [12, 20] },
        { name: 'Silver Lake Ramen', neighborhood: 'Silver Lake', cuisine: 'Japanese', image: 'photo-1557872943-16a5ac26437e', dietary: ['vegetarian'], priceRange: [14, 18] },
        { name: 'Pine & Crane', neighborhood: 'Silver Lake', cuisine: 'Taiwanese', image: 'photo-1512058564366-18510be2db19', dietary: ['vegetarian', 'vegan'], priceRange: [12, 18] },
        { name: 'Tito\'s Tacos', neighborhood: 'Culver City', cuisine: 'Mexican', image: 'photo-1565299585323-38d6b0865b47', dietary: [], priceRange: [8, 14] },
        { name: 'Spago', neighborhood: 'Beverly Hills', cuisine: 'California', image: 'photo-1504674900247-0877df9cc836', dietary: ['vegetarian'], priceRange: [40, 100] },
        { name: 'Sugarfish', neighborhood: 'Beverly Hills', cuisine: 'Japanese', image: 'photo-1579584425555-c3ce17fd4351', dietary: [], priceRange: [30, 55] },
        { name: 'Fundamental LA', neighborhood: 'Westwood', cuisine: 'Sandwiches', image: 'photo-1521390188846-e2a39973e5bf', dietary: ['vegetarian'], priceRange: [14, 20] },
        { name: 'Park\'s BBQ', neighborhood: 'Koreatown', cuisine: 'Korean', image: 'photo-1590301157890-4810ed352733', dietary: [], priceRange: [35, 70] },
        { name: 'Sun Nong Dan', neighborhood: 'Koreatown', cuisine: 'Korean', image: 'photo-1547592166-73f8451f2c28', dietary: [], priceRange: [18, 28] }
    ];

    const allDeals: Deal[] = [];

    for (let i = 0; i < 50; i++) {
        const base = laRestaurants[i % laRestaurants.length];
        const hotspot = hotspots.find(h => h.name === base.neighborhood) || hotspots[Math.floor(Math.random() * hotspots.length)];

        const lat = hotspot.lat + (Math.random() - 0.5) * 0.04;
        const lng = hotspot.lng + (Math.random() - 0.5) * 0.04;

        const originalPrice = base.priceRange[0] + Math.random() * (base.priceRange[1] - base.priceRange[0]);
        const discountPercentage = 15 + Math.floor(Math.random() * 50);
        const discountedPrice = originalPrice * (1 - discountPercentage / 100);

        allDeals.push({
            id: `la-poc-${i}`,
            title: `Exclusive Lunch Deal: ${base.name}`,
            restaurantName: base.name,
            originalPrice: parseFloat(originalPrice.toFixed(2)),
            discountedPrice: parseFloat(discountedPrice.toFixed(2)),
            discountPercentage,
            description: `Enjoy a special lunch at ${base.name} in ${base.neighborhood}. Famous for their authentic ${base.cuisine} flavors.`,
            cuisine: base.cuisine,
            dietaryTags: base.dietary,
            rating: parseFloat((4.0 + Math.random() * 1.0).toFixed(1)),
            reviewCount: Math.floor(Math.random() * 2000) + 100,
            imageUrl: `https://images.unsplash.com/${base.image}?w=400&h=300&fit=crop`,
            coordinates: { lat, lng },
            address: `${Math.floor(Math.random() * 5000) + 1} Main St, Los Angeles, CA`,
            distance: 0,
            source: 'PoC Mockup',
        });
    }

    return allDeals;
}

// Main function to fetch deals (Mocked for PoC to ensure online deployment works)
export async function fetchDeals(userLocation: Coordinates): Promise<Deal[]> {
    try {
        console.log('🚀 PoC Mode: Generating LA deals in frontend for location:', userLocation);

        // Simulating a slight delay for realism
        await new Promise(resolve => setTimeout(resolve, 800));

        const deals = generateLAMockDeals();

        const dealsWithDistance = deals
            .map(deal => ({
                ...deal,
                distance: getDistanceInMiles(
                    userLocation.lat,
                    userLocation.lng,
                    deal.coordinates.lat,
                    deal.coordinates.lng
                ),
            }))
            .sort((a, b) => (a.distance || 0) - (b.distance || 0));

        console.log(`✅ Total LA deals generated in frontend: ${dealsWithDistance.length}`);
        return dealsWithDistance;
    } catch (error) {
        console.error('❌ Error generating deals:', error);
        throw error;
    }
}

export { getDistanceInMiles };
