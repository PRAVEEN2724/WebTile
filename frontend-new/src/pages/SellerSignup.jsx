import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function SellerSignup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [shopName, setShopName] = useState("");
  const [shopLocation, setShopLocation] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!shopName || !shopLocation || !contactNumber) {
      setError("Please fill in all shop details");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          userType: "SELLER",
          shopName,
          shopLocation,
          contactNumber
        }),
      });

      if (!res.ok) {
        const message = await res.text();
        setError(message || "Signup failed");
        return;
      }

      // Store user data
      login({
        name,
        email,
        role: "SELLER",
        shopName,
        token: "temp-token"
      });

      alert("Seller account created! Please login now.");
      navigate("/seller-login");
    } catch (err) {
      setError("Error: " + err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 border rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Seller Signup</h2>
      
      {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}
      
      <form onSubmit={handleSignup}>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <hr className="my-4" />

        <h3 className="text-lg font-semibold mb-3">Shop Information</h3>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Shop Name</label>
          <input
            type="text"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            placeholder="Your shop name"
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Shop Location</label>
          <input
            type="text"
            value={shopLocation}
            onChange={(e) => setShopLocation(e.target.value)}
            placeholder="City/Address"
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Contact Number</label>
          <input
            type="tel"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            placeholder="+91 XXXXX XXXXX"
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-orange-600 text-white py-2 rounded font-medium hover:bg-orange-700"
        >
          Create Seller Account
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm">Are you a customer? <Link to="/signup" className="text-blue-600 hover:underline">Signup here</Link></p>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm">Already have an account? <Link to="/seller-login" className="text-blue-600 hover:underline">Login</Link></p>
      </div>
    </div>
  );
}

export default SellerSignup;
