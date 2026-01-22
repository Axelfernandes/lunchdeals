import { useState, useEffect, useMemo } from 'react';
import { MapPin, Loader2, RefreshCw, LayoutGrid, Map as MapIcon, Linkedin, Github } from 'lucide-react';
import { fetchDeals } from './services/dealsService';
import type { Deal, Coordinates } from './types/deal';
import FilterBar from './components/FilterBar';
import SortBar from './components/SortBar';
import type { SortOption } from './components/SortBar';
import MapView from './components/MapView';
import './index.css';

function App() {
  const [allDeals, setAllDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Filter States
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('All');
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [selectedSort, setSelectedSort] = useState<SortOption>('distance');

  useEffect(() => {
    // Get user location
    if ('geolocation' in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords: Coordinates = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(coords);

          try {
            console.log('🚀 Fetching deals...');
            const fetchedDeals = await fetchDeals(coords);
            setAllDeals(fetchedDeals);
            setError(null);
          } catch (err) {
            console.error('Error fetching deals:', err);
            setError('Failed to fetch deals. Please try again.');
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          console.error('Geolocation error:', err);
          setError('Location access denied. Using default location.');
          const defaultCoords: Coordinates = { lat: 34.0522, lng: -118.2437 }; // Los Angeles City Center
          setUserLocation(defaultCoords);
          fetchDeals(defaultCoords).then(setAllDeals).catch(() => setError('Failed to fetch deals.')).finally(() => setLoading(false));
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setError('Geolocation not supported');
      setLoading(false);
    }
  }, [refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleDietaryToggle = (tag: string) => {
    setSelectedDietary(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // Get unique cuisines
  const cuisines = useMemo(() => {
    const set = new Set<string>();
    allDeals.forEach(deal => {
      if (Array.isArray(deal.cuisine)) {
        deal.cuisine.forEach((c: string) => set.add(c));
      } else if (deal.cuisine) {
        set.add(deal.cuisine);
      }
    });
    return Array.from(set).sort();
  }, [allDeals]);

  // Apply filters and sorting
  const filteredAndSortedDeals = useMemo(() => {
    let result = [...allDeals];

    // Filter by Cuisine
    if (selectedCuisine !== 'All') {
      result = result.filter(deal =>
        Array.isArray(deal.cuisine)
          ? deal.cuisine.includes(selectedCuisine)
          : deal.cuisine === selectedCuisine
      );
    }

    // Filter by Price Range
    if (selectedPriceRange !== 'All') {
      result = result.filter(deal => {
        if (selectedPriceRange === '<$10') return deal.discountedPrice < 10;
        if (selectedPriceRange === '$10-$15') return deal.discountedPrice >= 10 && deal.discountedPrice <= 15;
        if (selectedPriceRange === '$15+') return deal.discountedPrice > 15;
        return true;
      });
    }

    // Filter by Dietary
    if (selectedDietary.length > 0) {
      result = result.filter(deal =>
        selectedDietary.every(tag => deal.dietaryTags?.includes(tag))
      );
    }

    // Filter by Rating
    if (minRating > 0) {
      result = result.filter(deal => (deal.rating || 0) >= minRating);
    }

    // Sort
    result.sort((a, b) => {
      switch (selectedSort) {
        case 'distance':
          return (a.distance || 0) - (b.distance || 0);
        case 'discount':
          return (b.discountPercentage || 0) - (a.discountPercentage || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'price':
          return (a.discountedPrice || 0) - (b.discountedPrice || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [allDeals, selectedCuisine, selectedPriceRange, selectedDietary, minRating, selectedSort]);

  if (loading && allDeals.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-500 to-red-600">
        <div className="text-center text-white">
          <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Finding LA Lunch Deals...</h1>
          <p className="text-white/80">Curating the best specials in Los Angeles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-lg shadow-sm border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-orange-600 text-white p-1.5 rounded-lg shadow-inner">
              <MapPin size={20} fill="currentColor" />
            </div>
            <h1 className="text-xl font-black tracking-tight">
              Lunch<span className="text-orange-600">Deals</span>
            </h1>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'list'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-slate-400 hover:text-slate-600'
                }`}
              title="List View"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'map'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-slate-400 hover:text-slate-600'
                }`}
              title="Map View"
            >
              <MapIcon size={18} />
            </button>
          </div>

          <div className="flex items-center gap-4">
            {userLocation && (
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Location</span>
                <span className="text-sm font-semibold text-slate-700">
                  {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                </span>
              </div>
            )}
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="p-2 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all disabled:opacity-50"
              title="Refresh Deals"
            >
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-2xl flex items-center gap-3">
            <span className="text-lg">⚠️</span>
            <span className="font-medium text-sm">{error}</span>
          </div>
        )}

        {/* Filter Bar */}
        <FilterBar
          cuisines={cuisines}
          selectedCuisine={selectedCuisine}
          selectedPriceRange={selectedPriceRange}
          selectedDietary={selectedDietary}
          minRating={minRating}
          onCuisineChange={setSelectedCuisine}
          onPriceChange={setSelectedPriceRange}
          onDietaryChange={handleDietaryToggle}
          onRatingChange={setMinRating}
        />

        {/* Sort Bar */}
        <SortBar
          selectedSort={selectedSort}
          onSortChange={setSelectedSort}
          resultCount={filteredAndSortedDeals.length}
        />

        {/* Deals Grid or Map View */}
        {filteredAndSortedDeals.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No matching deals</h3>
            <p className="text-slate-500">Try adjusting your filters to find more options.</p>
            <button
              onClick={() => {
                setSelectedCuisine('All');
                setSelectedPriceRange('All');
                setSelectedDietary([]);
                setMinRating(0);
              }}
              className="mt-6 text-orange-600 font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : viewMode === 'map' && userLocation ? (
          <MapView deals={filteredAndSortedDeals} userLocation={userLocation} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedDeals.map((deal) => (
              <div
                key={deal.id}
                className="group bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative h-56">
                  <img
                    src={deal.imageUrl}
                    alt={deal.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1.5 rounded-2xl font-black text-xs shadow-lg">
                    {deal.discountPercentage}% OFF
                  </div>
                  {deal.dietaryTags && deal.dietaryTags.length > 0 && (
                    <div className="absolute bottom-4 left-4 flex gap-1">
                      {deal.dietaryTags.map(tag => (
                        <span key={tag} className="bg-white/90 backdrop-blur-md text-slate-800 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm">
                          {tag === 'vegetarian' ? 'Veg' : tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-black text-xl text-slate-900 group-hover:text-orange-600 transition-colors leading-tight">{deal.restaurantName}</h3>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
                        {Array.isArray(deal.cuisine) ? deal.cuisine.join(' • ') : deal.cuisine}
                      </p>
                    </div>
                    {deal.rating && (
                      <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-lg">
                        <span className="text-orange-600 font-bold text-sm">{deal.rating}</span>
                        <span className="text-orange-400 text-[10px]">★</span>
                      </div>
                    )}
                  </div>

                  <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed">{deal.description}</p>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-slate-900 leading-none">
                          ${deal.discountedPrice.toFixed(2)}
                        </span>
                        <span className="text-slate-300 line-through text-lg font-bold">
                          ${deal.originalPrice.toFixed(2)}
                        </span>
                      </div>
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">Limited Time Offer</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-black text-slate-800">{deal.distance?.toFixed(1)} mi</span>
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Distance</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-20 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-2xl font-black tracking-tight mb-4 text-slate-300">
            Lunch<span className="">Deals</span>
          </div>
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
            Find the best lunch specials and discounts near you.
            Scraped in real-time from top deal platforms.
          </p>

          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="text-slate-800 font-bold">Made by Axel Joaquim Fernandes</div>
            <a
              href="mailto:axe.coleslaw322@passinbox.com"
              className="text-orange-600 font-medium hover:underline transition-all"
            >
              axe.coleslaw322@passinbox.com
            </a>

            <div className="flex items-center gap-6 mt-2">
              <a
                href="https://www.linkedin.com/in/axelfernandes/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-blue-600 transition-colors"
                title="LinkedIn"
              >
                <Linkedin size={24} />
              </a>
              <a
                href="https://github.com/Axelfernandes"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-slate-900 transition-colors"
                title="GitHub"
              >
                <Github size={24} />
              </a>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-50 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
            © 2026 LunchDeals LA • Proof of Concept
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
