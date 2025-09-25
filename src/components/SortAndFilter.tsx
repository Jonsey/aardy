'use client';

import { JellyBean } from '../lib/api';

interface SortAndFilterProps {
  jellyBeans: JellyBean[];
  onSort: (sortBy: string) => void;
  onFilter: (filterBy: string) => void;
  sortBy: string;
  filterBy: string;
}

export default function SortAndFilter({ 
  jellyBeans, 
  onSort, 
  onFilter, 
  sortBy, 
  filterBy 
}: SortAndFilterProps) {
  // Get unique flavor groups for filtering
  const flavorGroups = Array.from(
    new Set(jellyBeans.flatMap(bean => bean.groupName))
  ).sort();

  return (
    <section 
      className="bg-white p-4 rounded-lg shadow-md mb-6"
      aria-labelledby="filter-sort-heading"
      role="region"
    >
      <h2 
        id="filter-sort-heading" 
        className="sr-only"
      >
        Filter and Sort Controls
      </h2>
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Sorting */}
        <div className="flex-1">
          <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">
            Sort by:
          </label>
          <select
            id="sort"
            data-testid="sort-select"
            value={sortBy}
            onChange={(e) => onSort(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-describedby="sort-description"
          >
            <option value="name">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="flavorGroup">Flavor Group (A-Z)</option>
            <option value="flavorGroup-desc">Flavor Group (Z-A)</option>
            <option value="sugarFree">Sugar-Free First</option>
            <option value="sugarFree-desc">Regular First</option>
          </select>
          <div id="sort-description" className="sr-only">
            Choose how to sort the jelly bean results
          </div>
        </div>

        {/* Filtering */}
        <div className="flex-1">
          <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Flavor Group:
          </label>
          <select
            id="filter"
            data-testid="filter-input"
            value={filterBy}
            onChange={(e) => onFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-describedby="filter-description"
          >
            <option value="">All Flavor Groups</option>
            {flavorGroups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
          <div id="filter-description" className="sr-only">
            Filter jelly beans by their flavor group category
          </div>
        </div>
      </div>
    </section>
  );
}
