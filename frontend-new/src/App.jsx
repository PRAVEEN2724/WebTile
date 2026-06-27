// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/signUp';
import SellerLogin from './pages/SellerLogin';
import SellerSignup from './pages/SellerSignup';
import SellerDashboard from './pages/SellerDashboard';
import Cart from './pages/Cart';
import TileDetails from './pages/TileDetails';
import AdminDashboard from './pages/AdminDashboard';


function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 font-sans selection:bg-blue-500 selection:text-white">
      <Navbar />
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-up">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tile/:id" element={<TileDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/seller-login" element={<SellerLogin />} />
          <Route path="/seller-signup" element={<SellerSignup />} />
          <Route path="/seller-dashboard" element={<SellerDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;


