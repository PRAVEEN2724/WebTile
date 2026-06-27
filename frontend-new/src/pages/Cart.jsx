// src/pages/Cart.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [tiles, setTiles] = useState([]);
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);

    // Initialize quantities
    const initialQuantities = {};
    storedCart.forEach(id => {
      initialQuantities[id] = 1;
    });
    setQuantities(initialQuantities);
  }, []);

  // Fetch tile details for IDs in the cart
  useEffect(() => {
    const fetchTiles = async () => {
      try {
        const tileDetails = await Promise.all(
          cartItems.map(id =>
            axios.get(`http://localhost:8080/api/tiles/${id}`).then(res => res.data)
          )
        );
        setTiles(tileDetails);
      } catch (error) {
        console.error("Error fetching tile details:", error);
      }
    };

    if (cartItems.length > 0) {
      fetchTiles();
    } else {
      setTiles([]);
    }
  }, [cartItems]);

  // Remove item from cart
  const handleRemove = (id) => {
    const updatedCart = cartItems.filter(itemId => itemId !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    // Remove quantity entry
    const newQuantities = { ...quantities };
    delete newQuantities[id];
    setQuantities(newQuantities);

    // Update global cart icon
    window.dispatchEvent(new Event("storage"));
  };

  // Update quantity
  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setQuantities(prev => ({
      ...prev,
      [id]: newQuantity
    }));
  };

  // Calculate total
  const calculateSubtotal = () => {
    return tiles.reduce((sum, tile) => {
      return sum + (tile.price * (quantities[tile.id] || 1));
    }, 0);
  };

  const tax = calculateSubtotal() * 0.18; // Assuming 18% GST typical for tiles
  const total = calculateSubtotal() + tax;

  // Handle checkout
  const handleCheckout = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setIsProcessing(true);

    // Simulate API call for checkout processing
    setTimeout(() => {
      setCartItems([]);
      setTiles([]);
      setQuantities({});
      localStorage.setItem('cart', JSON.stringify([]));
      window.dispatchEvent(new Event("storage"));

      setIsProcessing(false);
      alert(`Order placed successfully! Order ID: #TM${Math.floor(Math.random() * 100000)}`);
      navigate("/");
    }, 1500);
  };

  return (
    <div className="animate-fade-up max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Shopping Bag</h1>
        <p className="text-gray-500 font-medium">{tiles.length} {tiles.length === 1 ? 'item' : 'items'} in your cart</p>
      </div>

      {tiles.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 py-24 text-center px-6 max-w-3xl mx-auto mt-12 animate-fade-up">
          <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🛒</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">Looks like you haven't added any premium tiles to your cart yet.</p>

          <button
            onClick={() => navigate("/")}
            className="btn-primary mx-auto w-full sm:w-auto px-10"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Cart Items Column (Left) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hidden sm:grid grid-cols-12 gap-4 p-4 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50">
              <div className="col-span-6 pl-4">Product Details</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-3 text-right pr-4">Subtotal</div>
            </div>

            <div className="space-y-4">
              {tiles.map((tile, i) => (
                <div
                  key={tile.id}
                  className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6 transition-all hover:shadow-md animate-fade-up flex flex-col sm:grid sm:grid-cols-12 gap-6 items-center"
                  style={{ animationDelay: `${i * 100}ms` }}
                >

                  {/* Product Details (Image + Title) */}
                  <div className="col-span-6 flex items-center gap-4 w-full">
                    <Link to={`/tile/${tile.id}`} className="shrink-0 relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-gray-100 group">
                      <img
                        src={`http://localhost:8080${tile.imagePath}`}
                        alt={tile.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1523413363574-c30aa1c2a516?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
                        }}
                      />
                    </Link>

                    <div className="flex flex-col justify-center py-2 h-full gap-1.5 w-full">
                      {tile.category && <span className="text-[10px] font-bold uppercase tracking-wider text-secondary-500">{tile.category.name || tile.category}</span>}
                      <Link to={`/tile/${tile.id}`} className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 leading-tight">
                        {tile.name}
                      </Link>
                      <p className="text-gray-500 text-sm font-medium">₹{tile.price} {tile.size ? `/ ${tile.size}` : ''}</p>

                      {tile.shop && (
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                          <span>Sold by</span> <span className="font-semibold text-gray-700">{tile.shop.name}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Controls Container (Mobile View) */}
                  <div className="w-full flex sm:hidden items-center justify-between border-t border-gray-100 pt-4 mt-2">
                    <p className="font-extrabold text-gray-900 text-lg">₹{tile.price * (quantities[tile.id] || 1)}</p>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 p-1">
                        <button
                          onClick={() => handleQuantityChange(tile.id, (quantities[tile.id] || 1) - 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-md text-gray-500 hover:bg-white hover:shadow-sm hover:text-gray-900 transition-all font-medium"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-bold text-gray-900 text-sm">{quantities[tile.id] || 1}</span>
                        <button
                          onClick={() => handleQuantityChange(tile.id, (quantities[tile.id] || 1) + 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-md text-gray-500 hover:bg-white hover:shadow-sm hover:text-gray-900 transition-all font-medium"
                        >
                          +
                        </button>
                      </div>
                      <button onClick={() => handleRemove(tile.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Desktop Quantity */}
                  <div className="hidden sm:flex col-span-3 justify-center items-center">
                    <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200 p-1">
                      <button
                        onClick={() => handleQuantityChange(tile.id, (quantities[tile.id] || 1) - 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-white hover:shadow-sm hover:text-gray-900 transition-all font-medium"
                      >
                        −
                      </button>
                      <span className="w-10 text-center font-bold text-gray-900">{quantities[tile.id] || 1}</span>
                      <button
                        onClick={() => handleQuantityChange(tile.id, (quantities[tile.id] || 1) + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-white hover:shadow-sm hover:text-gray-900 transition-all font-medium"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Desktop Subtotal & Remove */}
                  <div className="hidden sm:flex col-span-3 items-center justify-end gap-6 pr-2">
                    <p className="font-extrabold text-gray-900 text-lg">
                      ₹{tile.price * (quantities[tile.id] || 1)}
                    </p>
                    <button
                      onClick={() => handleRemove(tile.id)}
                      className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all group"
                      title="Remove item"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 group-hover:scale-110 transition-transform">
                        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                      </svg>
                    </button>
                  </div>

                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-between items-center sm:hidden">
              <button
                onClick={() => navigate("/")}
                className="text-primary-600 font-bold text-sm tracking-wide hover:text-primary-800 transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
                </svg>
                Back to Shop
              </button>
            </div>
          </div>

          {/* Order Summary Column (Right) */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sticky top-28">
              <h2 className="text-xl font-extrabold text-gray-900 mb-6 pb-6 border-b border-gray-100">Order Summary</h2>

              <div className="space-y-4 mb-6 text-sm">
                <div className="flex justify-between items-center text-gray-600 font-medium">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">₹{calculateSubtotal().toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center text-gray-600 font-medium">
                  <span>Estimated Tax (18%)</span>
                  <span className="font-bold text-gray-900">₹{tax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center text-gray-600 font-medium pb-6 border-b border-gray-100">
                  <span className="flex items-center gap-1">
                    Shipping
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                    </svg>
                  </span>
                  <span className="font-bold text-green-600 uppercase tracking-wider text-xs bg-green-50 px-2 py-1 rounded">Free</span>
                </div>

                <div className="flex justify-between items-end pt-2">
                  <span className="text-base font-bold text-gray-900">Estimated Total</span>
                  <div className="text-right">
                    <span className="block text-3xl font-extrabold text-gray-900 leading-none">
                      ₹{total.toFixed(2)}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">Includes taxes</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full flex justify-center items-center h-14 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold text-lg transition-all shadow-md active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 disabled:cursor-not-allowed group"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 w-full relative">
                      Secure Checkout
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 absolute right-4 group-hover:translate-x-1 transition-transform">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-xs font-semibold text-gray-500 bg-gray-50 py-3 rounded-lg border border-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-green-500">
                    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                  </svg>
                  Secure encrypted checkout
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
