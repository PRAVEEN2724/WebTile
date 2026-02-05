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
    return (
      tile.name.toLowerCase().includes(filter.toLowerCase()) ||
      tile.category?.name.toLowerCase().includes(filter.toLowerCase()) ||
      tile.shop?.name.toLowerCase().includes(filter.toLowerCase())
    );
  });

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-lg mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome to Tiles Mart</h1>
        <p className="text-lg">Discover premium tiles for your home and business</p>
      </div>

      {/* Seller Promo */}
      {!user || user.role === "CUSTOMER" ? (
        <div className="bg-orange-50 border-l-4 border-orange-600 p-4 mb-6 rounded">
          <p className="text-orange-900 font-medium">Are you a seller? <Link to="/seller-signup" className="text-orange-700 font-bold hover:underline">Join our platform</Link> and start selling tiles today!</p>
        </div>
      ) : null}

      {/* Search and Filter */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search by name, category, or shop..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
        />
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">Loading tiles...</p>
        </div>
      ) : filteredTiles.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-lg text-gray-600 mb-4">No tiles found</p>
          {filter && (
            <button
              onClick={() => setFilter("")}
              className="text-blue-600 hover:underline font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-6">
            Available Tiles ({filteredTiles.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {filteredTiles.map((tile) => (
              <Link
                key={tile.id}
                to={`/tile/${tile.id}`}
                className="group bg-white rounded-lg shadow hover:shadow-xl transition-all overflow-hidden"
              >
                {/* Image */}
                <div className="relative overflow-hidden bg-gray-100 h-48">
                  <img
                    src={`http://localhost:8080${tile.imagePath}`}
                    alt={tile.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => e.target.src = 'https://via.placeholder.com/200'}
                  />
                  {tile.stock > 0 ? (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                      In Stock
                    </div>
                  ) : (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      Out of Stock
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition line-clamp-2">
                    {tile.name}
                  </h3>

                  {tile.category && (
                    <p className="text-xs text-gray-500 mb-2">{tile.category.name}</p>
                  )}

                  <div className="flex items-baseline gap-2 mb-3">
                    <p className="text-2xl font-bold text-orange-600">₹{tile.price}</p>
                    {tile.size && <p className="text-xs text-gray-600">{tile.size}</p>}
                  </div>

                  {tile.shop && (
                    <p className="text-xs text-gray-600 font-medium mb-2">🏪 {tile.shop.name}</p>
                  )}

                  <button className="w-full mt-3 bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 transition">
                    View Details
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
