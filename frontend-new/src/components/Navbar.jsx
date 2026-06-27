// src/components/Navbar.jsx
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Navbar() {
  const { user, logout } = useAuth();
  const cartContext = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Safe fallback: use empty array if cartContext or cartItems is undefined
  const cartItems = cartContext?.cartItems ?? JSON.parse(localStorage.getItem('cart') || '[]');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isHome = location.pathname === '/';

  return (
    <nav className="glass-nav py-4 px-6 md:px-12 w-full">
      <div className="max-w-7xl mx-auto flex justify-between items-center">

        {/* Logo Area */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-md shadow-primary-500/20 group-hover:scale-105 transition-transform">
            <span className="text-white text-xl font-bold">TM</span>
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight">
            Tiles Mart
          </span>
        </Link>

        {/* Navigation & Actions */}
        <div className="flex items-center gap-6">

          {/* Main Links (Desktop) */}
          <div className="hidden md:flex items-center gap-6 mr-4">
            <Link to="/" className={`font-medium transition-colors ${isHome ? 'text-primary-600' : 'text-gray-600 hover:text-gray-900'}`}>Home</Link>
            {!user && (
              <Link to="/seller-signup" className="text-sm font-semibold text-secondary-600 bg-secondary-50 px-3 py-1.5 rounded-lg hover:bg-secondary-100 transition-colors border border-secondary-200">
                Become a Seller
              </Link>
            )}
          </div>

          {/* Cart icon - only show for customers or unauthenticated users */}
          {(!user || user.role === "CUSTOMER") && (
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors group">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 group-hover:scale-110 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm ring-2 ring-white transform scale-100 group-hover:scale-110 transition-transform">
                  {cartItems.length}
                </span>
              )}
            </Link>
          )}

          {/* Auth Section */}
          <div className="flex items-center gap-3 border-l border-gray-200 pl-6 ml-2">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-semibold text-gray-900">{user.name || user.email}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md mt-0.5">
                    {user.role}
                  </span>
                </div>

                {user.role === "SELLER" && (
                  <Link to="/seller-dashboard" className="btn-primary py-2 px-4 text-sm hidden md:flex">
                    Dashboard
                  </Link>
                )}

                {user.role === "ADMIN" && (
                  <Link to="/admin-dashboard" className="btn-primary py-2 px-4 text-sm hidden md:flex">
                    Admin Dashboard
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                  title="Logout"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                  </svg>
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">
                  Sign in
                </Link>
                <Link to="/signup" className="text-sm font-semibold bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-all active:scale-95 shadow-sm">
                  Register
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
