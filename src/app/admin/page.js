'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Lock, ArrowLeft, Plus, Trash2, CheckCircle2 } from 'lucide-react';

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

  // Inventory State
  const [products, setProducts] = useState([]);
  const [uploading, setUploading] = useState(false);

  const availableSizes = ['S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', 'Free Size'];
  const categoriesList = [
    'T-Shirts', 'Shirts', 'Jeans', 'Trousers', 'Shorts', 
    'Jackets', 'Hoodies', 'Watches', 'Shoes', 'Innerwear', 
    'Belts', 'Sunglasses', 'Perfumes', 'Caps', 'Accessories'
  ];

  const API_BASE_URL = 'https://menswear-backend-f2fo.onrender.com';

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/products`);
      const data = await res.json();
      if (Array.isArray(data)) setProducts(data);
    } catch (err) {
      console.error('Error fetching inventory:', err);
    }
  };

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

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      const uploadedUrl = data.url || data.imageUrl;
      if (uploadedUrl) {
        setImageUrl(uploadedUrl);
      } else {
        alert('Could not retrieve image URL. Please paste a web link directly in Option B.');
      }
    } catch (err) {
      alert('Upload failed. Please paste direct image web link in Option B.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !price || !imageUrl) {
      alert('Please fill in Title, Price, and provide an Image URL!');
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
        alert('Product published successfully!');
        setTitle('');
        setPrice('');
        setImageUrl('');
        fetchProducts();
      } else {
        alert('Failed to publish product.');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to backend.');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
      } else {
        alert('Failed to delete product.');
      }
    } catch (err) {
      console.error(err);
    }
  };

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

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-xl font-bold text-amber-400">MODERN WALK Admin Portal</h1>
            <p className="text-xs text-slate-400">Add, edit, or delete store products</p>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg text-slate-300 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Store
          </Link>
        </div>

        {/* Add Product Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h2 className="text-base font-bold flex items-center gap-2">
            <Plus className="w-5 h-5 text-amber-400" /> Add New Product
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs outline-none focus:border-amber-400 text-white"
                >
                  {categoriesList.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
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

        {/* Live Inventory List */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white">Live Store Inventory ({products.length} Products)</h2>

          {products.length === 0 ? (
            <p className="text-xs text-slate-500">No products available in the database.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((p) => (
                <div key={p.id} className="bg-slate-800 border border-slate-700 p-3 rounded-xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={p.image_url || p.images?.[0]} alt={p.title} className="w-12 h-12 object-cover rounded-lg flex-shrink-0" />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{p.title}</h4>
                      <p className="text-[10px] text-amber-400 font-semibold">₹{p.base_price} • {p.category}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteProduct(p.id)}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition flex-shrink-0"
                    title="Delete Product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}