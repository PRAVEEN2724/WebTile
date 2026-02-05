// src/pages/Cart.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [tiles, setTiles] = useState([]);
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();
  const { user } = useAuth();

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
  const calculateTotal = () => {
    return tiles.reduce((sum, tile) => {
      return sum + (tile.price * (quantities[tile.id] || 1));
    }, 0).toFixed(2);
  };

  // Handle checkout
  const handleCheckout = () => {
    if (!user) {
      alert("Please login to checkout");
      navigate("/login");
      return;
    }

    // Here you would typically create an order in the backend
    alert(`Order placed! Total: ₹${calculateTotal()}`);
    
    // Clear cart
    setCartItems([]);
    setTiles([]);
    setQuantities({});
    localStorage.setItem('cart', JSON.stringify([]));
    navigate("/");
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">🛒 Your Shopping Cart</h1>

      {tiles.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="col-span-2">
            <div className="space-y-4">
              {tiles.map(tile => (
                <div key={tile.id} className="flex gap-4 border rounded-lg p-4 bg-white shadow">
                  <img
                    src={`http://localhost:8080${tile.imagePath}`}
                    alt={tile.name}
                    className="w-32 h-32 object-cover rounded"
                    onError={(e) => e.target.src = 'https://via.placeholder.com/128'}
                  />
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold mb-1">{tile.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{tile.size}</p>
                    <p className="text-gray-600 text-sm mb-3">{tile.description}</p>
                    <p className="text-orange-600 font-bold text-lg">₹{tile.price}</p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => handleRemove(tile.id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      ✕
                    </button>
                    <div className="flex items-center gap-2 border rounded">
                      <button
                        onClick={() => handleQuantityChange(tile.id, (quantities[tile.id] || 1) - 1)}
                        className="px-2 py-1 hover:bg-gray-200"
                      >
                        −
                      </button>
                      <span className="px-3 py-1">{quantities[tile.id] || 1}</span>
                      <button
                        onClick={() => handleQuantityChange(tile.id, (quantities[tile.id] || 1) + 1)}
                        className="px-2 py-1 hover:bg-gray-200"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 border rounded-lg p-6 h-fit sticky top-4">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6 pb-4 border-b">
              <div className="flex justify-between">
                <span>Subtotal ({tiles.length} items)</span>
                <span>₹{calculateTotal()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>₹0</span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-bold mb-6">
              <span>Total</span>
              <span className="text-orange-600">₹{calculateTotal()}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition mb-3"
            >
              Proceed to Checkout
            </button>

            <button
              onClick={() => navigate("/")}
              className="w-full border border-gray-400 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-100 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;

