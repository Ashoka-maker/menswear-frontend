'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Upload, Plus, Trash2, ArrowLeft, Image as ImageIcon } from 'lucide-react';

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [uploading, setUploading] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('T-Shirts');
  const [basePrice, setBasePrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const API_BASE_URL = 'https://menswear-backend-f2fo.onrender.com';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/products`);
      const data = await res.json();
      if (Array.isArray(data)) setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Direct File Upload to Backend -> Cloudinary
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setImageUrl(data.url);
      } else {
        alert('Upload failed. Check backend Cloudinary configuration.');
      }
    } catch (err) {
      alert('Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!title || !basePrice || !imageUrl) {
      alert('Please fill out all required fields and upload an image.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          brand,
          category,
          base_price: parseFloat(basePrice),
          image_url: imageUrl
        }),
      });

      if (res.ok) {
        setTitle('');
        setBrand('');
        setBasePrice('');
        setImageUrl('');
        fetchProducts();
        alert('Product added successfully!');
      }
    } catch (err) {
      alert('Failed to add product');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <h1 className="text-xl font-bold text-amber-400">Admin Control Center</h1>
          <Link href="/" className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg text-white">
            <ArrowLeft className="w-4 h-4" /> Back to Store
          </Link>
        </div>

        {/* Upload Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-amber-400" /> Upload New Product
          </h2>

          <form onSubmit={handleAddProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Product Title</label>
              <input 
                type="text" 
                required 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="e.g. Slim Fit Cotton Shirt" 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-amber-400" 
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Brand Name</label>
              <input 
                type="text" 
                value={brand} 
                onChange={(e) => setBrand(e.target.value)} 
                placeholder="e.g. MODERN WALK" 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-amber-400" 
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Category</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-amber-400"
              >
                <option value="T-Shirts">T-Shirts</option>
                <option value="Shirts">Shirts</option>
                <option value="Watches">Watches</option>
                <option value="Shoes">Shoes</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Price (₹)</label>
              <input 
                type="number" 
                required 
                value={basePrice} 
                onChange={(e) => setBasePrice(e.target.value)} 
                placeholder="e.g. 799" 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-amber-400" 
              />
            </div>

            {/* Direct File Upload Control */}
            <div className="sm:col-span-2 border-2 border-dashed border-slate-800 rounded-xl p-4 text-center space-y-2">
              <label className="cursor-pointer inline-flex flex-col items-center gap-1">
                <Upload className="w-6 h-6 text-amber-400" />
                <span className="font-bold text-slate-300">
                  {uploading ? 'Uploading image...' : 'Click to Upload Product Photo from Computer'}
                </span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>

              {imageUrl && (
                <div className="mt-2 flex items-center justify-center gap-2 text-green-400 text-xs">
                  <ImageIcon className="w-4 h-4" /> Photo Uploaded Successfully!
                </div>
              )}
            </div>

            <button type="submit" className="sm:col-span-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold py-3 rounded-xl transition">
              Save & Publish Product
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}