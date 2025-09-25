// Optimized skeleton loader that matches the fixed filter layout
export default function JellyBeanListSkeleton() {
  return (
    <div className="h-screen flex flex-col">
      {/* Fixed Filter Header Skeleton */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          {/* Skeleton for SortAndFilter */}
          <div className="mb-2 space-y-2 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              <div className="h-8 w-28 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 w-40 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>

          {/* Skeleton for count display */}
          <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Scrollable Results Area Skeleton */}
      <div className="flex-1 overflow-hidden scrollbar-hide">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Skeleton for infinite scroll grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse min-h-[470px] flex flex-col">
                <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded mb-4 flex-shrink-0 flex items-center justify-center">
                  <div className="w-36 h-36 bg-gray-100 rounded-full shadow-inner flex items-center justify-center">
                    <div className="w-28 h-28 bg-gray-200 rounded-full animate-pulse" />
                  </div>
                </div>
                <div className="flex-grow flex flex-col">
                  <div className="h-6 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
                  <div className="h-4 bg-gray-200 rounded mb-3 flex-grow" />
                  <div className="mt-auto">
                    <div className="flex gap-2 mb-1">
                      <div className="h-3 w-16 bg-gray-200 rounded" />
                      <div className="h-3 w-16 bg-gray-200 rounded" />
                    </div>
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Skeleton for loading indicator */}
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-300"></div>
            <div className="ml-3 h-4 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
