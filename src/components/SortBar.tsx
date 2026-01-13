import React from 'react';

export type SortOption = 'distance' | 'discount' | 'rating' | 'price';

interface SortBarProps {
    selectedSort: SortOption;
    onSortChange: (sort: SortOption) => void;
    resultCount: number;
}

const SortBar: React.FC<SortBarProps> = ({ selectedSort, onSortChange, resultCount }) => {
    return (
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 px-1">
            <h2 className="text-xl font-bold text-slate-800">
                {resultCount} {resultCount === 1 ? 'Deal' : 'Deals'} Found
            </h2>

            <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-500">Sort by:</span>
                <select
                    value={selectedSort}
                    onChange={(e) => onSortChange(e.target.value as SortOption)}
                    className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all cursor-pointer"
                >
                    <option value="distance">Nearest Distance</option>
                    <option value="discount">Highest Discount %</option>
                    <option value="rating">Top Rated</option>
                    <option value="price">Lowest Price</option>
                </select>
            </div>
        </div>
    );
};

export default SortBar;
