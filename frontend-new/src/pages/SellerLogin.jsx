import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function SellerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        setError("Invalid email or password");
        return;
      }

      const data = await res.json();
      
      // Verify the user is a seller
      if (data.role !== "SELLER") {
        setError("This account is not a seller account");
        return;
      }

      // Store user data
      login({
        email,
        role: data.role,
        token: data.token,
        userId: data.userId,
        shopId: data.shopId
      });

      navigate("/seller-dashboard");
    } catch (err) {
      setError("Error: " + err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 border rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Seller Login</h2>
      
      {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}
      
      <form onSubmit={handleLogin}>
        <div className="mb-4">
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

        <div className="mb-6">
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

        <button
          type="submit"
          className="w-full bg-orange-600 text-white py-2 rounded font-medium hover:bg-orange-700"
        >
          Login as Seller
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm">Are you a customer? <Link to="/login" className="text-blue-600 hover:underline">Login here</Link></p>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm">Don't have a seller account? <Link to="/seller-signup" className="text-blue-600 hover:underline">Signup</Link></p>
      </div>
    </div>
  );
}

export default SellerLogin;
