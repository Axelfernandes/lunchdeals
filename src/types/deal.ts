export interface Coordinates {
    lat: number;
    lng: number;
}

export interface Deal {
    id: string;
    title: string;
    restaurantName: string;
    originalPrice: number;
    discountedPrice: number;
    discountPercentage: number;
    description: string;
    cuisine: string | string[];
    dietaryTags: string[];
    rating: number;
    reviewCount: number;
    imageUrl: string;
    coordinates: Coordinates;
    address: string;
    distance?: number;
    source: string;
}

