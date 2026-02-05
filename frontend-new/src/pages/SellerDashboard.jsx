import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function SellerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tiles, setTiles] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    size: "",
    stock: "",
    category: "Ceramic"
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Check if user is logged in and is a seller
  useEffect(() => {
    if (!user || user.role !== "SELLER") {
      navigate("/seller-login");
    }
  }, [user, navigate]);

  // Fetch seller's tiles
  useEffect(() => {
    if (user?.shopId) {
      fetchTiles();
    }
  }, [user?.shopId]);

  const fetchTiles = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/tiles");
      const data = await res.json();
      // Filter tiles for this shop
      const sellerTiles = data.filter(tile => tile.shop?.id === user?.shopId);
      setTiles(sellerTiles);
    } catch (err) {
      console.error("Error fetching tiles:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const uploadForm = new FormData();
    uploadForm.append("name", formData.name);
    uploadForm.append("price", formData.price);
    uploadForm.append("description", formData.description);
    uploadForm.append("size", formData.size);
    uploadForm.append("stock", formData.stock);
    uploadForm.append("category", formData.category);
    uploadForm.append("shopId", user.shopId);

    // Get image file from input
    const imageInput = document.getElementById("imageInput");
    if (!imageInput.files[0]) {
      setError("Please select an image");
      return;
    }
    uploadForm.append("image", imageInput.files[0]);

    try {
      const res = await fetch("http://localhost:8080/api/tiles/seller-upload", {
        method: "POST",
        body: uploadForm,
        headers: {
          "Authorization": `Bearer ${user?.token}`
        }
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      setSuccess("Tile uploaded successfully!");
      setFormData({
        name: "",
        price: "",
        description: "",
        size: "",
        stock: "",
        category: "Ceramic"
      });
      imageInput.value = "";
      setShowUploadForm(false);
      
      // Refresh tiles list
      fetchTiles();
    } catch (err) {
      setError("Error uploading tile: " + err.message);
    }
  };

  if (!user || user.role !== "SELLER") {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Seller Dashboard</h1>
      
      <div className="bg-blue-50 p-4 rounded mb-6">
        <h2 className="text-xl font-semibold mb-2">Welcome, {user?.name}!</h2>
        <p className="text-gray-700">Manage your tiles and inventory here</p>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-3 mb-4 rounded">{success}</div>}

      <button
        onClick={() => setShowUploadForm(!showUploadForm)}
        className="mb-6 bg-orange-600 text-white px-4 py-2 rounded font-medium hover:bg-orange-700"
      >
        {showUploadForm ? "Cancel" : "Upload New Tile"}
      </button>

      {showUploadForm && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6 border-l-4 border-orange-600">
          <h2 className="text-2xl font-bold mb-4">Upload Tile</h2>
          <form onSubmit={handleUpload}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tile Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Premium Ceramic Tile"
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="150"
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                  required
                >
                  <option>Ceramic</option>
                  <option>Vitrified</option>
                  <option>Marble</option>
                  <option>Granite</option>
                  <option>Porcelain</option>
                  <option>Glass</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Size</label>
                <input
                  type="text"
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  placeholder="600x600 mm"
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Stock Quantity</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="100"
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Product Image</label>
                <input
                  type="file"
                  id="imageInput"
                  accept="image/*"
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Detailed description of the tile"
                  rows="3"
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-4 w-full bg-green-600 text-white py-2 rounded font-medium hover:bg-green-700"
            >
              Upload Tile
            </button>
          </form>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-4">Your Tiles ({tiles.length})</h2>
        
        {tiles.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded">
            <p className="text-gray-600">No tiles uploaded yet. Click "Upload New Tile" to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tiles.map(tile => (
              <div key={tile.id} className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition">
                {tile.imagePath && (
                  <img
                    src={`http://localhost:8080${tile.imagePath}`}
                    alt={tile.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{tile.name}</h3>
                  <p className="text-orange-600 font-bold text-lg mb-2">₹{tile.price}</p>
                  <p className="text-sm text-gray-600 mb-2">{tile.size}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Stock: {tile.stock}</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{tile.category?.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SellerDashboard;
