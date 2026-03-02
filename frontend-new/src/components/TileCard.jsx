// src/components/TileCard.jsx
import { Link } from "react-router-dom";

export default function TileCard({ tile }) {
  // Handle image path consistently with backend
  const imagePath = tile.imagePath
    ? (tile.imagePath.startsWith('/') ? `http://localhost:8080${tile.imagePath}` : `http://localhost:8080/${tile.imagePath}`)
    : '';

  return (
    <Link to={`/tile/${tile.id}`} className="tile-link group">
      <div className="tile-card rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white">
        {/* Image Container */}
        <div className="relative overflow-hidden bg-gradient-to-b from-gray-200 to-gray-100 h-56 flex items-center justify-center">
          {imagePath ? (
            <img
              src={imagePath}
              alt={tile.name}
              className="tile-image object-contain w-full h-full transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
              🏗️
            </div>
          )}
          
          {/* Badge */}
          <div className="absolute top-3 right-3 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            {tile.category?.name || 'Tile'}
          </div>
        </div>

        {/* Info Section */}
        <div className="tile-info p-4 bg-white">
          <h2 className="tile-name text-lg font-bold text-gray-800 mb-2 truncate">
            {tile.name}
          </h2>
          
          <p className="tile-price text-2xl font-black bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
            ₹{tile.price?.toLocaleString('en-IN') || 0}
          </p>

          {tile.size && (
            <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
              <span>📏</span> {tile.size}
            </p>
          )}

          {tile.stock !== undefined && (
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <span className={`text-xs font-semibold ${tile.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {tile.stock > 0 ? `In Stock (${tile.stock})` : 'Out of Stock'}
              </span>
              <span className="text-lg">⭐</span>
            </div>
          )}
        </div>

        {/* Hover Action Button */}
        <div className="px-4 pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition shadow-md">
            View Details
          </button>
        </div>
      </div>
    </Link>
  );
}






/*import { Link } from 'react-router-dom';

function TileCard({ tile }) {
  const imagePath = tile.imagePath?.startsWith('/uploads/')
    ? `http://localhost:8080${tile.imagePath}`
    : `http://localhost:8080/uploads/${tile.imagePath}`;

  return (
    <Link to={`/tile/${tile.id}`} className="border rounded shadow hover:shadow-lg transition p-2">
      <img src={imagePath} alt={tile.name} className="h-40 w-full object-cover" />
      <h3 className="text-lg font-semibold mt-2">{tile.name}</h3>
      <p className="text-gray-600">₹{tile.price}</p>
    </Link>
  );
}

export default TileCard;*/
