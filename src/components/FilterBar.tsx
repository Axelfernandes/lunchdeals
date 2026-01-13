import React from 'react';

interface FilterBarProps {
    onCuisineChange: (cuisine: string) => void;
    onPriceChange: (priceRange: string) => void;
    onDietaryChange: (tag: string) => void;
    onRatingChange: (minRating: number) => void;
    selectedCuisine: string;
    selectedPriceRange: string;
    selectedDietary: string[];
    minRating: number;
    cuisines: string[];
}

const FilterBar: React.FC<FilterBarProps> = ({
    onCuisineChange,
    onPriceChange,
    onDietaryChange,
    onRatingChange,
    selectedCuisine,
    selectedPriceRange,
    selectedDietary,
    minRating,
    cuisines
}) => {
    const dietaryOptions = ['vegetarian', 'vegan', 'gluten-free'];

    return (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200 p-4 mb-6 sticky top-20 z-10">
            <div className="flex flex-wrap gap-6 items-end">
                {/* Cuisine Filter */}
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Cuisine</label>
                    <select
                        value={selectedCuisine}
                        onChange={(e) => onCuisineChange(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all cursor-pointer"
                    >
                        <option value="All">All Cuisines</option>
                        {cuisines.map(cuisine => (
                            <option key={cuisine} value={cuisine}>{cuisine}</option>
                        ))}
                    </select>
                </div>

                {/* Price Filter */}
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Price Range</label>
                    <div className="flex gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
                        {['All', '<$10', '$10-$15', '$15+'].map((range) => (
                            <button
                                key={range}
                                onClick={() => onPriceChange(range)}
                                className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedPriceRange === range
                                        ? 'bg-white text-orange-600 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Dietary Filter */}
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Dietary Needs</label>
                    <div className="flex flex-wrap gap-2">
                        {dietaryOptions.map(tag => (
                            <button
                                key={tag}
                                onClick={() => onDietaryChange(tag)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${selectedDietary.includes(tag)
                                        ? 'bg-green-50 border-green-200 text-green-700'
                                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'
                                    }`}
                            >
                                {tag.charAt(0).toUpperCase() + tag.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Rating Filter */}
                <div className="min-w-[120px]">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Min Rating</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="range"
                            min="0"
                            max="5"
                            step="0.5"
                            value={minRating}
                            onChange={(e) => onRatingChange(parseFloat(e.target.value))}
                            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                        />
                        <span className="text-sm font-bold text-orange-600 min-w-[28px]">{minRating}★</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
