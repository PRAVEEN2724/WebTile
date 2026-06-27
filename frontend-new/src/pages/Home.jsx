import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Home() {
  const [tiles, setTiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8080/api/tiles")
      .then((res) => res.json())
      .then((data) => {
        setTiles(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredTiles = tiles.filter(tile => {
    if (!filter) return true;
    const searchLower = filter.toLowerCase();
    return (
      tile.name.toLowerCase().includes(searchLower) ||
      tile.category?.name?.toLowerCase().includes(searchLower) ||
      tile.shop?.name?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white rounded-3xl shadow-sm border border-gray-100 animate-fade-up">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50 opacity-90" />

        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary-100/50 mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-secondary-100/50 mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />

        <div className="relative px-8 py-20 lg:px-16 lg:py-28 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
              Transform Your Space With <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500">Premium Tiles</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed max-w-xl">
              Discover our exclusive collection of high-quality tiles for your next dream project. Elevate your home's aesthetics today.
            </p>

            {/* Search Bar in Hero */}
            <div className="relative max-w-xl group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search for marble, ceramic, shops..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="block w-full pl-12 pr-4 py-4 border-2 border-transparent bg-white shadow-lg rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all hover:shadow-xl text-lg"
              />
            </div>
          </div>

          <div className="hidden lg:block relative w-full max-w-md">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500 bg-white p-2">
              <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Beautiful tiled interior" className="w-full h-full object-cover rounded-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Seller Promo */}
      {(!user || user.role === "CUSTOMER") && (
        <div className="bg-secondary-50 border border-secondary-100 rounded-2xl p-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm animate-fade-up stagger-1">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Are you a tile manufacturer or seller?</h3>
            <p className="text-gray-600">Join thousands of sellers growing their business on Tiles Mart.</p>
          </div>
          <Link to="/seller-signup" className="btn-accent shrink-0">
            Start Selling Today
          </Link>
        </div>
      )}

      {/* Main Content Area */}
      <div className="animate-fade-up stagger-2">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Trending Collection</h2>
            <p className="text-gray-500 mt-2 font-medium">Explore {filteredTiles.length > 0 ? filteredTiles.length : ''} amazing designs</p>
          </div>
        </div>

        {/* Tiles Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="card-premium animate-pulse h-96">
                <div className="bg-gray-200 h-56 w-full" />
                <div className="p-5 space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-8 bg-gray-200 rounded w-1/3 mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredTiles.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 py-24 text-center px-6">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No tiles found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">We couldn't find any tiles matching your search. Try checking your spelling or using different keywords.</p>
            {filter && (
              <button onClick={() => setFilter("")} className="btn-secondary mx-auto">
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredTiles.map((tile, i) => (
              <Link
                key={tile.id}
                to={`/tile/${tile.id}`}
                className={`card-premium group block animate-fade-up`}
                style={{ animationDelay: `${(i % 8) * 50}ms` }}
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                  <img
                    src={`http://localhost:8080${tile.imagePath}`}
                    alt={tile.name}
                    className="img-premium"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1523413363574-c30aa1c2a516?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
                    }}
                  />

                  {/* Stock Badges */}
                  {tile.stock > 0 ? (
                    <div className="badge-stock text-green-700">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      In Stock
                    </div>
                  ) : (
                    <div className="badge-stock text-red-700">
                      Out of Stock
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-6">
                  {tile.category && (
                    <p className="text-xs font-bold tracking-wider text-secondary-600 uppercase mb-2">
                      {tile.category.name || tile.category}
                    </p>
                  )}

                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {tile.name}
                  </h3>

                  <div className="flex items-end gap-2 mb-4">
                    <span className="text-2xl font-extrabold text-gray-900">₹{tile.price}</span>
                    {tile.size && <span className="text-sm font-medium text-gray-500 mb-1">/ {tile.size}</span>}
                  </div>

                  {tile.shop && (
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                      <div className="w-6 h-6 rounded-full bg-primary-50 flex items-center justify-center text-xs">🏪</div>
                      <p className="text-sm font-medium text-gray-600 truncate">{tile.shop.name}</p>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
