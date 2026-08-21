'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Lock, ArrowLeft, Upload, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('T-Shirts');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [brand, setBrand] = useState('MODERN WALK');
  const [selectedSizes, setSelectedSizes] = useState(['M', 'L', 'XL']);
  
  const [uploading, setUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const availableSizes = ['S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36'];
  const API_BASE_URL = 'https://menswear-backend-f2fo.onrender.com';

  // Password Gate
  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === 'Mwalk123') {
      setIsAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const toggleSize = (size) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  // Image Upload Handler
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setStatusMessage('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      setImageUrl(data.url || data.imageUrl);
      setStatusMessage('Image uploaded successfully!');
    } catch (err) {
      alert('Upload error. You can also paste an image web link directly into the Image URL field below.');
    } finally {
      setUploading(false);
    }
  };

  // Publish Product
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !price || !imageUrl) {
      alert('Please fill in Title, Price, and provide an Image!');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          base_price: Number(price),
          image_url: imageUrl,
          brand,
          sizes: selectedSizes,
        }),
      });

      if (res.ok) {
        alert('Product published to store successfully!');
        setTitle('');
        setPrice('');
        setImageUrl('');
        setStatusMessage('Product Published!');
      } else {
        alert('Failed to publish product. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to backend server.');
    }
  };

  // LOGIN SCREEN IF UNAUTHENTICATED
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-md w-full text-white shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-amber-400/10 text-amber-400 rounded-full flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold">Admin Portal Login</h1>
            <p className="text-xs text-slate-400">Enter store password to manage inventory</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300">Store Password</label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password"
                className="w-full mt-1.5 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm outline-none focus:border-amber-400 text-white"
              />
              {passwordError && (
                <p className="text-xs text-red-400 mt-1">Incorrect password. Please try again.</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition"
            >
              Access Dashboard
            </button>
          </form>

          <div className="text-center">
            <Link href="/" className="text-xs text-slate-500 hover:text-slate-300">
              ← Return to Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // DASHBOARD WHEN LOGGED IN
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Bar */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-xl font-bold text-amber-400">MODERN WALK Admin Portal</h1>
            <p className="text-xs text-slate-400">Add & Manage Store Inventory</p>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg text-slate-300 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Store
          </Link>
        </div>

        {/* Product Add Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h2 className="text-base font-bold flex items-center gap-2">
            <Plus className="w-5 h-5 text-amber-400" /> Upload New Product
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Title & Brand */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300">Product Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Slim Fit Cotton Shirt"
                  className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs outline-none focus:border-amber-400 text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Brand Name</label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="MODERN WALK"
                  className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs outline-none focus:border-amber-400 text-white"
                />
              </div>
            </div>

            {/* Category & Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs outline-none focus:border-amber-400 text-white"
                >
                  <option value="T-Shirts">T-Shirts</option>
                  <option value="Shirts">Shirts</option>
                  <option value="Watches">Watches</option>
                  <option value="Shoes">Shoes</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Price (₹)</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 799"
                  className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs outline-none focus:border-amber-400 text-white"
                />
              </div>
            </div>

            {/* Sizes Selection */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">Available Sizes</label>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((sz) => {
                  const isSelected = selectedSizes.includes(sz);
                  return (
                    <button
                      type="button"
                      key={sz}
                      onClick={() => toggleSize(sz)}
                      className={`px-3 py-1 rounded-md text-xs font-bold transition ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Image Upload Option 1: File Upload */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Option A: Upload Image File</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-amber-400 hover:file:bg-slate-700 cursor-pointer"
              />
              {uploading && <p className="text-xs text-amber-400 mt-1">Uploading image...</p>}
            </div>

            {/* Image Upload Option 2: Direct URL */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Option B: Image Web URL (Recommended)</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs outline-none focus:border-amber-400 text-white"
              />
            </div>

            {/* Image Preview */}
            {imageUrl && (
              <div className="p-3 bg-slate-800 rounded-xl flex items-center gap-4">
                <img src={imageUrl} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-slate-700" />
                <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-4 h-4" /> Ready to publish
                </span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold py-3 rounded-xl text-xs transition"
            >
              Save & Publish Product
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}