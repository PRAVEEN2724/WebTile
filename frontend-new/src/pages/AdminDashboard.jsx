import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Users, LayoutGrid, Trash2, ShieldCheck, Mail, Store, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [tiles, setTiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/login');
    } else {
      fetchData();
    }
  }, [navigate, user]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersRes, tilesRes] = await Promise.all([
        axios.get('http://localhost:8080/api/admin/users'),
        axios.get('http://localhost:8080/api/admin/tiles')
      ]);
      setUsers(usersRes.data);
      setTiles(tilesRes.data);
    } catch (err) {
      setError('Failed to fetch dashboard data. Please make sure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id, roleName) => {
    if (window.confirm(`Are you sure you want to remove this ${roleName.toLowerCase()}? If it's a seller, their shop and tiles will also be removed!`)) {
      try {
        await axios.delete(`http://localhost:8080/api/admin/users/${id}`);
        setUsers(users.filter(u => u.id !== id));
        // Refresh tiles if a seller was deleted, just in case
        if (roleName === 'SELLER') {
          const tilesRes = await axios.get('http://localhost:8080/api/admin/tiles');
          setTiles(tilesRes.data);
        }
      } catch (err) {
        console.error('Error deleting user:', err);
        alert('Failed to delete user.');
      }
    }
  };

  const deleteTile = async (id) => {
    if (window.confirm('Are you sure you want to remove this tile from the website?')) {
      try {
        await axios.delete(`http://localhost:8080/api/admin/tiles/${id}`);
        setTiles(tiles.filter(t => t.id !== id));
      } catch (err) {
        console.error('Error deleting tile:', err);
        alert('Failed to delete tile.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin text-blue-600">
          <LayoutGrid className="w-10 h-10" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 animate-fade-in">
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200">
        <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
          <ShieldCheck className="w-10 h-10" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600">
            Admin Dashboard
          </h1>
          <p className="text-gray-500 mt-1">Manage platform users and catalog smoothly.</p>
        </div>
      </div>

      {error ? (
        <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-xl mb-6 shadow-sm border border-red-100">
          <AlertCircle className="w-6 h-6 flex-shrink-0" />
          <p className="font-medium">{error}</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8">
          
          <div className="w-full md:w-64 flex flex-col gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-3 w-full px-5 py-4 rounded-xl transition-all duration-300 ${
                activeTab === 'users'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 translate-x-1'
                  : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm border border-gray-100'
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="font-semibold tracking-wide">Manage Users</span>
            </button>
            <button
              onClick={() => setActiveTab('tiles')}
              className={`flex items-center gap-3 w-full px-5 py-4 rounded-xl transition-all duration-300 ${
                activeTab === 'tiles'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 translate-x-1'
                  : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm border border-gray-100'
              }`}
            >
              <LayoutGrid className="w-5 h-5" />
              <span className="font-semibold tracking-wide">Manage Tiles</span>
            </button>
          </div>

          <div className="flex-1 bg-white rounded-3xl shadow-xl shadow-gray-100/50 border border-gray-100 overflow-hidden min-h-[500px]">
            {activeTab === 'users' ? (
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <Users className="w-6 h-6 text-blue-500" />
                  Platform Users
                </h2>
                {users.length === 0 ? (
                  <p className="text-gray-500 text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    No users found.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {users.map(user => (
                      <div key={user.id} className="flex flex-col sm:flex-row items-center justify-between p-5 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-100 group">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-900 text-lg">{user.name}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider ${
                              user.role === 'SELLER' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'
                            }`}>
                              {user.role}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 flex-wrap">
                            <span className="flex items-center gap-1">
                              <Mail className="w-4 h-4" /> {user.email}
                            </span>
                            {user.role === 'SELLER' && user.shop && (
                              <span className="flex items-center gap-1 font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                                <Store className="w-4 h-4" /> {user.shop.name}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => deleteUser(user.id, user.role)}
                          className="mt-4 sm:mt-0 p-3 text-red-500 bg-white rounded-xl shadow-sm border border-red-100 hover:bg-red-50 hover:border-red-200 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                          title={`Remove ${user.role.toLowerCase()}`}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <LayoutGrid className="w-6 h-6 text-blue-500" />
                  Website Tiles
                </h2>
                {tiles.length === 0 ? (
                  <p className="text-gray-500 text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    No tiles found on the website.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tiles.map(tile => (
                      <div key={tile.id} className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/50 overflow-hidden hover:shadow-xl transition-all group group-hover:-translate-y-1 block relative">
                        <div className="aspect-[4/3] bg-gray-100 overflow-hidden p-4 flex items-center justify-center">
                          {tile.imagePath ? (
                            <img
                              src={`http://localhost:8080${tile.imagePath}`}
                              alt={tile.name}
                              className="w-full h-full object-cover rounded-xl shadow-sm group-hover:scale-105 transition-transform duration-500"
                              onError={(e) => { e.target.src = 'https://placehold.co/400x300?text=Tile+Image+Not+Found' }}
                            />
                          ) : (
                            <div className="text-gray-400">No Image</div>
                          )}
                        </div>
                        <div className="p-5">
                          <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">{tile.name}</h3>
                          <div className="flex justify-between items-center mt-3">
                            <span className="text-xl font-extrabold text-blue-600">₹{tile.price}</span>
                            {tile.category && (
                                <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-600 rounded-lg">
                                  {tile.category.name}
                                </span>
                            )}
                          </div>
                          {tile.shopName && (
                              <p className="text-sm text-gray-500 mt-3 flex items-center gap-1.5 pt-3 border-t border-gray-100">
                                <Store className="w-4 h-4 text-indigo-400" />
                                <span className="truncate">{tile.shopName}</span>
                              </p>
                          )}
                        </div>
                        <button
                            onClick={() => deleteTile(tile.id)}
                            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur text-red-500 rounded-xl shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:text-red-600 hover:scale-105"
                            title="Delete Tile"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
