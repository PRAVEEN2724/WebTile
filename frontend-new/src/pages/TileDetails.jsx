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

      // Dispatch event to update Navbar cart count
      window.dispatchEvent(new Event("storage"));
    }
  };

  if (!tile) return (
    <div className="flex justify-center items-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );

  const imagePath = tile.imagePath ? `http://localhost:8080${tile.imagePath}` : "";

  return (
    <div className="animate-fade-up max-w-6xl mx-auto">
      {/* Breadcrumb Navigation */}
      <nav className="flex text-sm text-gray-500 mb-8 font-medium">
        <button onClick={() => navigate(-1)} className="hover:text-primary-600 transition-colors flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
          </svg>
          Back
        </button>
        <span className="mx-3 text-gray-300">|</span>
        <button onClick={() => navigate('/')} className="hover:text-primary-600 transition-colors">Home</button>
        <span className="mx-3 text-gray-300">/</span>
        <span className="text-gray-900 truncate max-wxs">{tile.name}</span>
      </nav>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8">

          {/* Enhanced Image Display */}
          <div className="relative bg-gray-50 flex items-center justify-center p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-gray-100 min-h-[500px]">
            {tile.stock === 0 && (
              <div className="absolute top-6 right-6 bg-red-100 text-red-700 px-4 py-2 rounded-full font-bold shadow-sm z-10 border border-red-200">
                Out of Stock
              </div>
            )}

            <div className="relative w-full aspect-square max-w-md rounded-2xl overflow-hidden shadow-2xl transition-transform duration-500 hover:scale-105">
              {imagePath && (
                <img
                  src={imagePath}
                  alt={tile.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1523413363574-c30aa1c2a516?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                  }}
                />
              )}
            </div>

            {/* Ambient decorative lighting */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/5 to-transparent pointer-events-none" />
          </div>

          {/* Product Info Section */}
          <div className="p-8 lg:p-12 flex flex-col justify-between">
            <div>
              {tile.category && (
                <span className="inline-block bg-primary-50 text-primary-700 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider mb-4 border border-primary-100">
                  {tile.category.name || tile.category}
                </span>
              )}

              <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4">
                {tile.name}
              </h1>

              <div className="flex items-end gap-3 mb-8 pb-8 border-b border-gray-100">
                <span className="text-4xl font-extrabold text-gray-900 tracking-tight">₹{tile.price}</span>
                {tile.size && <span className="text-lg text-gray-500 font-medium mb-1 line-through">MRP: ₹{Math.round(tile.price * 1.25)}</span>}
                <span className="text-sm font-bold text-green-600 mb-2 ml-2 bg-green-50 px-2 py-0.5 rounded text-green-700">20% OFF</span>
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                {tile.size && (
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Dimensions</p>
                    <p className="font-semibold text-gray-900">{tile.size}</p>
                  </div>
                )}
                {tile.stock !== undefined && (
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Availability</p>
                    <p className={`font-semibold ${tile.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {tile.stock > 0 ? `${tile.stock} units left` : 'Out of Stock'}
                    </p>
                  </div>
                )}
              </div>

              {tile.description && (
                <div className="mb-10">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Product Description</h3>
                  <p className="text-gray-600 leading-relaxed text-base">
                    {tile.description}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Seller Info */}
              {tile.shop && (
                <div className="bg-white border-2 border-primary-50 rounded-2xl p-5 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xl shadow-inner">
                      🏪
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-0.5">Sold By</p>
                      <p className="font-bold text-gray-900">{tile.shop.name}</p>
                    </div>
                  </div>
                  {tile.shop.location && (
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-gray-500 font-medium mb-0.5">Location</p>
                      <p className="font-semibold text-gray-700">{tile.shop.location}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Action Area */}
              <div className="pt-6 border-t border-gray-100 space-y-4">
                {isAdded ? (
                  <button
                    onClick={() => navigate('/cart')}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-md shadow-green-500/20 active:scale-[0.98] flex justify-center items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                    Added! Go to Checkout
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    disabled={tile.stock === 0}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-md active:scale-[0.98] flex justify-center items-center gap-2 ${tile.stock === 0
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                        : 'bg-primary-600 text-white hover:bg-primary-700 shadow-primary-600/20'
                      }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                    {tile.stock === 0 ? 'Out of Stock' : 'Add to Bag'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TileDetails;
