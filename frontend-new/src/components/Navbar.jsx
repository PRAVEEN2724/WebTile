// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Navbar() {
  const { user, logout } = useAuth();
  const cartContext = useCart();
  const navigate = useNavigate();

  // Safe fallback: use empty array if cartContext or cartItems is undefined
  const cartItems = cartContext?.cartItems ?? [];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">Tiles Mart</Link>
      
      <div className="flex items-center gap-4">
        {/* Cart icon - only show for customers */}
        {!user || user.role === "CUSTOMER" ? (
          <Link to="/cart" className="relative hover:text-blue-200">
            🛒
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {cartItems.length}
              </span>
            )}
          </Link>
        ) : null}

        {user ? (
          <>
            <div className="flex items-center gap-2">
              <span className="text-sm">
                {user.role === "SELLER" ? "🏪" : "👤"} {user.name || user.email}
              </span>
              {user.role === "SELLER" && (
                <Link to="/seller-dashboard" className="text-sm px-2 py-1 bg-orange-500 rounded hover:bg-orange-600">
                  Dashboard
                </Link>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-blue-200 transition">Login</Link>
            <span className="text-gray-300">|</span>
            <Link to="/signup" className="hover:text-blue-200 transition">Signup</Link>
            <span className="text-gray-300">|</span>
            <Link to="/seller-signup" className="text-orange-300 hover:text-orange-200 transition font-medium">
              Become Seller
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
