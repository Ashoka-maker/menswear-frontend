'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft, Plus, Trash2, CheckCircle2, Upload, AlertCircle } from 'lucide-react';

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    title: '',
    brand: '',
    description: '',
    base_price: '',
    image_url: '',
    sizes: ['S', 'M', 'L', 'XL'],
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const API_URL = 'https://menswear-backend-f2fo.onrender.com/api/products';
  const availableSizes = ['S', 'M', 'L', 'XL', 'XXL', '30', '32', '34', '36'];

  const fetchProducts = () => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProducts(data);
        else setProducts([]);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setProducts([]);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image_url: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleSize = (size) => {
    const currentSizes = newProduct.sizes;
    if (currentSizes.includes(size)) {
      setNewProduct({ ...newProduct, sizes: currentSizes.filter((s) => s !== size) });
    } else {
      setNewProduct({ ...newProduct, sizes: [...currentSizes, size] });
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!newProduct.image_url) {
      alert('Please upload a product photo first!');
      return;
    }

    if (newProduct.sizes.length === 0) {
      alert('Please select at least one size!');
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: 'Product added successfully!' });
        setNewProduct({
          title: '',
          brand: '',
          description: '',
          base_price: '',
          image_url: '',
          sizes: ['S', 'M', 'L', 'XL'],
        });
        fetchProducts();
      } else {
        setMessage({
          type: 'error',
          text: `Error: ${data.details || data.error || 'Failed to add product.'}`,
        });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Backend server connection error.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans">
      <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-7 h-7 text-amber-400" />
            <h1 className="text-xl font-black tracking-wider">
              MODERN WALK <span className="text-xs text-amber-400 font-semibold block">Admin Management Panel</span>
            </h1>
          </div>
          <Link href="/" className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2 rounded-lg border border-slate-700 transition">
            <ArrowLeft className="w-4 h-4" /> Back to Storefront
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-amber-500" /> Add New Product
          </h2>

          {message.text && (
            <div className={`mb-4 p-3 text-xs font-bold rounded-lg border flex items-center gap-2 ${
              message.type === 'success' 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-red-50 text-red-700 border-red-200'
            }`}>
              {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleAddProduct} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Product Title</label>
              <input
                required
                type="text"
                placeholder="e.g. Cotton T-Shirt, Denim Jeans"
                value={newProduct.title}
                onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                className="w-full border rounded-lg p-2.5 text-xs outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Brand Name</label>
              <input
                required
                type="text"
                placeholder="e.g. Jockey / Modern Walk"
                value={newProduct.brand}
                onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                className="w-full border rounded-lg p-2.5 text-xs outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Price (₹)</label>
              <input
                required
                type="number"
                placeholder="e.g. 999"
                value={newProduct.base_price}
                onChange={(e) => setNewProduct({ ...newProduct, base_price: e.target.value })}
                className="w-full border rounded-lg p-2.5 text-xs outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Available Sizes</label>
              <div className="flex flex-wrap gap-1.5">
                {availableSizes.map((size) => {
                  const isSelected = newProduct.sizes.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`px-3 py-1 text-xs font-bold rounded-lg border transition ${
                        isSelected 
                          ? 'bg-slate-900 text-white border-slate-900' 
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Upload Product Photo</label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center cursor-pointer hover:border-amber-400 transition relative bg-slate-50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {newProduct.image_url ? (
                  <div className="space-y-2">
                    <img src={newProduct.image_url} alt="Preview" className="w-24 h-24 object-cover mx-auto rounded-lg border shadow-sm" />
                    <p className="text-[11px] font-bold text-emerald-600">Photo loaded! Click to change.</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                    <p className="text-xs font-bold text-slate-600">Click or drag photo here</p>
                    <p className="text-[10px] text-slate-400">Supports JPG, PNG, WEBP</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Description</label>
              <textarea
                rows="3"
                placeholder="Nice wear for classy look."
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="w-full border rounded-lg p-2.5 text-xs outline-none focus:border-slate-900"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white text-xs font-bold py-3 rounded-xl hover:bg-slate-800 transition shadow-md"
            >
              {loading ? 'Publishing...' : 'Publish Product'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center justify-between">
            <span>Product Inventory ({Array.isArray(products) ? products.length : 0})</span>
          </h2>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {!Array.isArray(products) || products.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">No products found in database.</p>
            ) : (
              products.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-xl hover:bg-slate-50 transition">
                  <div className="flex items-center gap-3">
                    <img src={item.image_url} alt={item.title} className="w-12 h-12 object-cover rounded-lg border" />
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{item.title}</h4>
                      <p className="text-[10px] text-amber-600 font-bold uppercase">{item.brand || 'MODERN WALK'}</p>
                      <p className="text-xs font-black text-slate-800 mt-0.5">₹{item.base_price}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteProduct(item.id)}
                    className="p-2 text-slate-400 hover:text-red-500 transition"
                    title="Delete Product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}