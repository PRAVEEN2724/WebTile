import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function TileDetails() {
  const { id } = useParams();
  const [tile, setTile] = useState(null);
  const [isAdded, setIsAdded] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/tiles/${id}`)
      .then((res) => setTile(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleAddToCart = () => {
    if (!user || user.role === "SELLER") {
      navigate("/login");
      return;
    }
    const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
    if (!currentCart.includes(tile.id)) {
      currentCart.push(tile.id);
      localStorage.setItem("cart", JSON.stringify(currentCart));
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  if (!tile) return <p className="text-center mt-10">Loading...</p>;

  const imagePath = tile.imagePath ? `http://localhost:8080${tile.imagePath}` : "";

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-2 gap-8">
        <div>
          <img
            src={imagePath}
            alt={tile.name}
            className="w-full h-96 object-cover rounded-lg shadow-lg"
            onError={(e) => (e.target.src = 'https://via.placeholder.com/400')}
          />
        </div>
        <div>
          <h1 className="text-4xl font-bold mb-2">{tile.name}</h1>
          {tile.category && (
            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm font-medium mb-4">
              {tile.category.name || tile.category}
            </span>
          )}
          <div className="my-6">
            <p className="text-gray-600">Price</p>
            <p className="text-4xl font-bold text-orange-600">₹{tile.price}</p>
          </div>
          {tile.size && (
            <div className="flex justify-between">
              <span className="text-gray-700">Size:</span>
              <span className="font-semibold">{tile.size}</span>
            </div>
          )}
          {tile.description && (
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{tile.description}</p>
            </div>
          )}
          {tile.shop && (
            <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
              <h3 className="font-bold text-lg mb-3">📦 Sold By</h3>
              <p className="text-lg font-semibold text-gray-800">{tile.shop.name}</p>
              <p className="text-gray-600 mt-1">📍 {tile.shop.location}</p>
              <p className="text-gray-600 mt-1">📞 {tile.shop.contactNumber}</p>
            </div>
          )}
          <div className="space-y-3">
            {isAdded && (
              <div className="bg-green-100 text-green-800 p-3 rounded-lg text-center font-medium">
                ✓ Added to cart!
              </div>
            )}
            <button
              onClick={handleAddToCart}
              disabled={tile.stock === 0}
              className={`w-full py-3 rounded-lg font-bold text-lg transition ${
                tile.stock === 0
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-orange-600 text-white hover:bg-orange-700'
              }`}
            >
              {tile.stock === 0 ? 'Out of Stock' : isAdded ? '✓ Added to Cart' : 'Add to Cart 🛒'}
            </button>
            {isAdded && (
              <button
                onClick={() => navigate('/cart')}
                className="w-full py-3 rounded-lg font-bold text-lg bg-green-600 text-white hover:bg-green-700 transition"
              >
                Go to Cart →
              </button>
            )}
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 rounded-lg font-medium border-2 border-gray-400 text-gray-800 hover:bg-gray-50 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TileDetails;
