'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { JellyBean, paginateAndFilterJellyBeans, PaginationParams } from '../lib/api';
import JellyBeanCard from './JellyBeanCard';
import SortAndFilter from './SortAndFilter';

interface InfiniteJellyBeanListProps {
  jellyBeans: JellyBean[];
  initialPageSize?: number;
}

function InfiniteScrollLoader() {
  return (
    <div 
      className="flex justify-center items-center py-8"
      role="status"
      aria-live="polite"
      aria-label="Loading more jelly beans"
    >
      <div 
        className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
        aria-hidden="true"
      ></div>
      <span className="ml-3 text-gray-600">Loading more jelly beans...</span>
    </div>
  );
}

function EndMessage({ total }: { total: number }) {
  return (
    <div 
      className="text-center py-8"
      role="status"
      aria-live="polite"
      aria-label={`All ${total} jelly bean flavors have been loaded`}
    >
      <p className="text-gray-500 text-lg">
        <span role="img" aria-label="celebration">🎉</span> You&apos;ve seen all {total} jelly bean flavors!
      </p>
      <p className="text-gray-400 text-sm mt-2">
        Try changing your filters to explore different combinations
      </p>
    </div>
  );
}

export default function InfiniteJellyBeanList({ 
  jellyBeans, 
  initialPageSize = 12 
}: InfiniteJellyBeanListProps) {
  const [sortBy, setSortBy] = useState('name');
  const [filterBy, setFilterBy] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedItems, setDisplayedItems] = useState<JellyBean[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [totalFiltered, setTotalFiltered] = useState(0);

  const getCurrentPageData = useCallback((page: number, resetItems = false) => {
    const params: PaginationParams = {
      page,
      pageSize: initialPageSize,
      sortBy,
      filterBy
    };

    const result = paginateAndFilterJellyBeans(jellyBeans, params);
    
    if (resetItems || page === 1) {
      setDisplayedItems(result.items);
    } else {
      setDisplayedItems(prev => [...prev, ...result.items]);
    }
    
    setHasMore(result.hasMore);
    setTotalFiltered(result.total);
    
    return result;
  }, [jellyBeans, sortBy, filterBy, initialPageSize]);

  useEffect(() => {
    setCurrentPage(1);
    getCurrentPageData(1, true);
  }, [getCurrentPageData]);

  const loadMore = useCallback(() => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    getCurrentPageData(nextPage, false);
  }, [currentPage, getCurrentPageData]);

  const scrollToTop = useCallback(() => {
    const scrollContainer = document.getElementById('infinite-scroll-container');
    if (scrollContainer && typeof scrollContainer.scrollTo === 'function') {
      scrollContainer.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else if (scrollContainer) {
      // Fallback for environments where scrollTo is not available (like tests)
      scrollContainer.scrollTop = 0;
    }
  }, []);

  // Handle sort change
  const handleSortChange = useCallback((newSortBy: string) => {
    setSortBy(newSortBy);
    scrollToTop();
  }, [scrollToTop]);

  // Handle filter change
  const handleFilterChange = useCallback((newFilterBy: string) => {
    setFilterBy(newFilterBy);
    scrollToTop();
  }, [scrollToTop]);

  const scrollableTarget = useMemo(() => 'infinite-scroll-container', []);

  return (
    <main className="h-screen flex flex-col" role="main">
      {/* Fixed Filter Header */}
      <header className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <SortAndFilter
            jellyBeans={jellyBeans}
            onSort={handleSortChange}
            onFilter={handleFilterChange}
            sortBy={sortBy}
            filterBy={filterBy}
          />
          
          <div 
            className="text-xs text-gray-600 mt-2"
            aria-live="polite"
            aria-atomic="true"
            role="status"
            aria-label="Results count"
          >
            Showing {displayedItems.length} of {totalFiltered} jelly beans
            {totalFiltered !== jellyBeans.length && (
              <span className="text-gray-400"> (filtered from {jellyBeans.length} total)</span>
            )}
          </div>
        </div>
      </header>

      {/* Scrollable Results Area */}
      <section 
        id={scrollableTarget} 
        className="flex-1 overflow-auto scrollbar-hide"
        style={{
          scrollbarWidth: 'none', /* Firefox */
          msOverflowStyle: 'none', /* Internet Explorer 10+ */
        }}
        role="region"
        aria-label="Jelly bean products"
        aria-describedby="results-description"
      >
        <div id="results-description" className="sr-only">
          Grid of jelly bean products. Use arrow keys to navigate between items. 
          Sorting and filtering controls are available above this section.
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <InfiniteScroll
            dataLength={displayedItems.length}
            next={loadMore}
            hasMore={hasMore}
            loader={<InfiniteScrollLoader />}
            endMessage={<EndMessage total={totalFiltered} />}
            scrollableTarget={scrollableTarget}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            style={{ overflow: 'visible' }} // Prevent double scrollbars
          >
            {displayedItems.map((jellyBean, index) => (
              <div key={`${jellyBean.beanId}-${index}`} className="w-full">
                <JellyBeanCard jellyBean={jellyBean} />
              </div>
            ))}
          </InfiniteScroll>

          {displayedItems.length === 0 && (
            <div 
              className="text-center py-12"
              role="status"
              aria-live="polite"
              aria-label="No results found"
            >
              <p className="text-gray-500 text-lg">
                No jelly beans found matching your criteria.
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Try adjusting your filters or search terms
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
