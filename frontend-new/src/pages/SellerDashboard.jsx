import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function SellerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tiles, setTiles] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    price: "",
    description: "",
    size: "",
    stock: "",
    category: "Ceramic"
  });
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

  // Resize image helper - returns a File
  const resizeImage = (file, maxWidth = 800, maxHeight = 800, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (ev) => {
        img.src = ev.target.result;
      };

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        const aspect = width / height;

        if (width > maxWidth) {
          width = maxWidth;
          height = Math.round(width / aspect);
        }
        if (height > maxHeight) {
          height = maxHeight;
          width = Math.round(height * aspect);
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error('Image compression failed'));
            const resizedFile = new File([blob], file.name, { type: file.type });
            resolve(resizedFile);
          },
          file.type || 'image/jpeg',
          quality
        );
      };

      img.onerror = (err) => reject(err);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const uploadForm = new FormData();
    uploadForm.append('name', formData.name);
    uploadForm.append('price', String(formData.price));
    uploadForm.append('description', formData.description);
    uploadForm.append('size', formData.size);
    uploadForm.append('stock', String(formData.stock));
    uploadForm.append('category', formData.category);

    // Ensure numeric shopId
    const shopId = user?.shopId || (user?.shop && user.shop.id) || null;
    if (!shopId) {
      setError('Missing shop information. Please re-login.');
      return;
    }
    uploadForm.append('shopId', String(shopId));

    // Get image file from input and resize it
    const imageInput = document.getElementById('imageInput');
    if (!imageInput || !imageInput.files || !imageInput.files[0]) {
      setError('Please select an image');
      return;
    }

    try {
      const originalFile = imageInput.files[0];
      const resizedFile = await resizeImage(originalFile, 800, 800, 0.8);
      uploadForm.append('image', resizedFile, resizedFile.name);

      const res = await fetch('http://localhost:8080/api/tiles/seller-upload', {
        method: 'POST',
        body: uploadForm,
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        setError(`Upload failed: ${res.status} ${res.statusText}${text ? ' - ' + text : ''}`);
        return;
      }

      setSuccess('Tile uploaded successfully!');
      setFormData({ name: '', price: '', description: '', size: '', stock: '', category: 'Ceramic' });
      imageInput.value = '';
      setShowUploadForm(false);
      fetchTiles();
    } catch (err) {
      console.error('Upload error:', err);
      setError('Error uploading tile: ' + (err.message || err));
    }
  };

  const handleDeleteTile = async (tileId) => {
    if (!window.confirm('Are you sure you want to delete this tile?')) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/tiles/${tileId}?shopId=${user?.shopId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        setError('Failed to delete tile: ' + text);
        return;
      }

      setSuccess('Tile deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
      fetchTiles();
    } catch (err) {
      console.error('Delete error:', err);
      setError('Error deleting tile: ' + err.message);
    }
  };

  const handleEditTile = (tile) => {
    setEditingId(tile.id);
    setEditFormData({
      name: tile.name,
      price: String(tile.price),
      description: tile.description || '',
      size: tile.size || '',
      stock: String(tile.stock || 0),
      category: tile.category?.name || 'Ceramic'
    });
  };

  const handleUpdateTile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const params = new URLSearchParams({
        shopId: user?.shopId,
        name: editFormData.name,
        price: editFormData.price,
        description: editFormData.description,
        size: editFormData.size,
        stock: editFormData.stock,
        category: editFormData.category
      });

      const res = await fetch(`http://localhost:8080/api/tiles/${editingId}?${params}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        setError('Failed to update tile: ' + text);
        return;
      }

      setSuccess('Tile updated successfully!');
      setEditingId(null);
      setTimeout(() => setSuccess(''), 3000);
      fetchTiles();
    } catch (err) {
      console.error('Update error:', err);
      setError('Error updating tile: ' + err.message);
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
              <div key={tile.id} className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition flex flex-col">
                {tile.imagePath && (
                  <img
                    src={tile.imagePath.startsWith('/') ? `http://localhost:8080${tile.imagePath}` : `http://localhost:8080/${tile.imagePath}`}
                    alt={tile.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                )}
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-bold text-lg mb-2">{tile.name}</h3>
                  <p className="text-orange-600 font-bold text-lg mb-2">₹{tile.price}</p>
                  <p className="text-sm text-gray-600 mb-2">{tile.size}</p>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium">Stock: {tile.stock}</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{tile.category?.name}</span>
                  </div>
                  
                  {/* Edit and Delete Buttons */}
                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={() => handleEditTile(tile)}
                      className="flex-1 bg-blue-600 text-white py-1 rounded text-sm hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTile(tile.id)}
                      className="flex-1 bg-red-600 text-white py-1 rounded text-sm hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl mx-4 max-h-96 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Edit Tile</h2>
            <form onSubmit={handleUpdateTile}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tile Name</label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                    className="w-full border p-2 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={editFormData.price}
                    onChange={(e) => setEditFormData({...editFormData, price: e.target.value})}
                    className="w-full border p-2 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({...editFormData, category: e.target.value})}
                    className="w-full border p-2 rounded"
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
                    value={editFormData.size}
                    onChange={(e) => setEditFormData({...editFormData, size: e.target.value})}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={editFormData.stock}
                    onChange={(e) => setEditFormData({...editFormData, stock: e.target.value})}
                    className="w-full border p-2 rounded"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                  rows="3"
                  className="w-full border p-2 rounded"
                />
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 rounded font-medium hover:bg-green-700"
                >
                  Update Tile
                </button>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="flex-1 bg-gray-600 text-white py-2 rounded font-medium hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SellerDashboard;
