import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Deal, Coordinates } from '../types/deal';
import { Navigation, Star } from 'lucide-react';

interface MapViewProps {
    deals: Deal[];
    userLocation: Coordinates;
}

const UserIcon = L.divIcon({
    className: 'custom-user-icon',
    html: `<div class="bg-blue-600 w-4 h-4 rounded-full border-2 border-white shadow-lg animate-pulse"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
});

const DealIcon = (discount: number) => L.divIcon({
    className: 'custom-deal-icon',
    html: `
        <div class="relative flex items-center justify-center">
            <div class="bg-orange-600 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-xl border-2 border-white font-black text-[10px] transform hover:scale-110 transition-transform">
                ${discount}%
            </div>
            <div class="absolute -bottom-1 w-2 h-2 bg-orange-600 rotate-45 border-r border-b border-white"></div>
        </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
});

// Component to auto-center map when location changes
const ChangeView = ({ center }: { center: [number, number] }) => {
    const map = useMap();
    map.setView(center, 13);
    return null;
};

const MapView: React.FC<MapViewProps> = ({ deals, userLocation }) => {
    const center: [number, number] = [userLocation.lat, userLocation.lng];

    return (
        <div className="h-[calc(100vh-280px)] min-h-[500px] w-full rounded-3xl overflow-hidden shadow-inner border border-slate-200 relative">
            <MapContainer
                center={center}
                zoom={13}
                scrollWheelZoom={true}
                className="h-full w-full z-0"
            >
                <ChangeView center={center} />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* User Location Marker */}
                <Marker position={center} icon={UserIcon}>
                    <Popup className="rounded-xl overflow-hidden">
                        <div className="p-2 font-bold text-slate-800">You are here</div>
                    </Popup>
                </Marker>

                {/* Deal Markers */}
                {deals.map((deal) => (
                    <Marker
                        key={deal.id}
                        position={[deal.coordinates.lat, deal.coordinates.lng]}
                        icon={DealIcon(deal.discountPercentage)}
                    >
                        <Popup className="rounded-2xl overflow-hidden min-w-[240px]">
                            <div className="flex flex-col gap-3">
                                <img
                                    src={deal.imageUrl}
                                    alt={deal.restaurantName}
                                    className="w-full h-24 object-cover rounded-xl"
                                />
                                <div>
                                    <h3 className="font-black text-slate-900 leading-tight mb-1">{deal.restaurantName}</h3>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-orange-600 font-black text-lg">${deal.discountedPrice.toFixed(2)}</span>
                                        <span className="text-slate-400 line-through text-xs">${deal.originalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-3">
                                        <span className="flex items-center gap-1">
                                            <Star size={12} className="text-orange-400 fill-orange-400" />
                                            {deal.rating} ({deal.reviewCount})
                                        </span>
                                        <span>{deal.distance?.toFixed(1)} mi away</span>
                                    </div>
                                    <a
                                        href={`https://www.google.com/maps/dir/?api=1&destination=${deal.coordinates.lat},${deal.coordinates.lng}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 bg-slate-900 text-white py-2 rounded-xl text-sm font-black hover:bg-orange-600 transition-colors"
                                    >
                                        <Navigation size={14} />
                                        Get Directions
                                    </a>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default MapView;
