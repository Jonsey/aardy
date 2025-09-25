// Static metadata that can be prerendered at build time
export default function StaticMetadata() {
  return (
    <header role="banner">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Jelly Belly Collection
        </h1>
        <p className="text-sm text-gray-600" role="doc-subtitle">
          Explore our complete collection of premium jelly bean flavors
        </p>
      </div>
      
      <nav className="mb-4 text-center" aria-label="Product categories">
        <div 
          className="inline-flex flex-wrap gap-1 text-xs text-gray-600"
          role="list"
          aria-label="Available flavor categories"
        >
          <span className="px-2 py-1 bg-gray-100 rounded-full" role="listitem">
            <span role="img" aria-label="fruit">🍎</span> Fruit
          </span>
          <span className="px-2 py-1 bg-gray-100 rounded-full" role="listitem">
            <span role="img" aria-label="dessert">🍫</span> Dessert
          </span>
          <span className="px-2 py-1 bg-gray-100 rounded-full" role="listitem">
            <span role="img" aria-label="spice">🌶️</span> Spice
          </span>
          <span className="px-2 py-1 bg-gray-100 rounded-full" role="listitem">
            <span role="img" aria-label="sugar-free option">🚫</span> Sugar-Free
          </span>
        </div>
      </nav>
    </header>
  );
}
