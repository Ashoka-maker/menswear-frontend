'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trash2, ArrowLeft, Lock, ShoppingBag, Plus } from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState([]);
  
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('T-Shirts');
  const [imageUrl, setImageUrl] = useState('');

  const API_BASE_URL = 'https://menswear-backend-f2fo.onrender.com';
  const categories = ['T-Shirts', 'Shirts', 'Jeans', 'Pants', 'Shorts', 'Jackets', 'Shoes', 'Sleepers', 'Watches', 'Ethnic'];

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/products`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (err) {
      console.error('Failed to fetch inventory:', err);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'owner123') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect Password! Access Denied.');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!title || !price) return alert('Please enter product title and price.');

    const newProd = {
      title,
      brand: brand || 'MODERN WALK',
      base_price: parseFloat(price),
      category,
      image_url: imageUrl || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&q=80',
      sizes: ['S', 'M', 'L', 'XL']
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProd)
      });

      if (res.ok) {
        alert('Product added successfully!');
        setTitle('');
        setBrand('');
        setPrice('');
        setImageUrl('');
        fetchProducts();
      } else {
        setProducts([...products, { ...newProd, id: Date.now() }]);
        setTitle('');
        setBrand('');
        setPrice('');
        setImageUrl('');
      }
    } catch (err) {
      setProducts([...products, { ...newProd, id: Date.now() }]);
      setTitle('');
      setBrand('');
      setPrice('');
      setImageUrl('');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await fetch(`${API_BASE_URL}/api/products/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error(err);
    }
    setProducts(products.filter((p) => p.id !== id));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-slate-900 p-8 rounded-2xl border border-slate-800 max-w-md w-full space-y-5 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="bg-amber-400/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto text-amber-400">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-amber-400">Owner Portal Access</h2>
            <p className="text-xs text-slate-400">Enter your store password to manage products</p>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Store Password</label>
            <input
              type="password"
              placeholder="Enter Password (e.g. owner123)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-800 text-white border border-slate-700 outline-none focus:border-amber-400 text-sm"
            />
          </div>

          <button type="submit" className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-xl transition text-sm">
            Unlock Admin Panel
          </button>

          <div className="text-center pt-2">
            <Link href="/" className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Storefront
            </Link>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 max-w-7xl mx-auto space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-7 h-7 text-amber-400" />
            <h1 className="text-2xl font-black text-white">MODERN WALK OWNER DASHBOARD</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">Add new items or remove existing items from inventory.</p>
        </div>

        <div className="flex gap-3">
          <Link href="/" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5">
            <ArrowLeft className="w-4 h-4" /> View Store
          </Link>
          <button onClick={() => setIsAuthenticated(false)} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-xl text-xs font-bold transition">
            Logout
          </button>
        </div>
      </div>

      <form onSubmit={handleAddProduct} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
        <h2 className="text-lg font-bold text-amber-400 flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add New Product
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Title / Item Name</label>
            <input
              required
              type="text"
              placeholder="e.g. Premium Cotton Casual Shirt"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 bg-slate-800 rounded-lg border border-slate-700 text-white outline-none focus:border-amber-400"
            />
          </div>
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Brand Name</label>
            <input
              type="text"
              placeholder="e.g. JOCKEY / MODERN WALK"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full p-2.5 bg-slate-800 rounded-lg border border-slate-700 text-white outline-none focus:border-amber-400"
            />
          </div>
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Price (₹)</label>
            <input
              required
              type="number"
              placeholder="e.g. 799"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-2.5 bg-slate-800 rounded-lg border border-slate-700 text-white outline-none focus:border-amber-400"
            />
          </div>
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2.5 bg-slate-800 rounded-lg border border-slate-700 text-white outline-none focus:border-amber-400"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-slate-400 font-semibold mb-1">Product Image URL</label>
            <input
              type="text"
              placeholder="https://images.unsplash.com/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full p-2.5 bg-slate-800 rounded-lg border border-slate-700 text-white outline-none focus:border-amber-400"
            />
          </div>
        </div>
        <button type="submit" className="px-6 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black rounded-lg transition shadow-md">
          Save Product
        </button>
      </form>

      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
        <h2 className="text-lg font-bold text-white">Live Store Inventory ({products.length} Items)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((item) => (
            <div key={item.id} className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 flex items-center justify-between gap-3">
              <img src={item.image_url} alt={item.title} className="w-14 h-14 object-cover rounded-lg bg-slate-900" />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-xs text-white truncate">{item.title}</h4>
                <p className="text-[10px] text-amber-400 font-semibold uppercase">{item.brand || 'MODERN WALK'} • {item.category}</p>
                <p className="text-xs font-black text-white mt-1">₹{item.base_price}</p>
              </div>
              <button
                onClick={() => handleDeleteProduct(item.id)}
                className="p-2 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}