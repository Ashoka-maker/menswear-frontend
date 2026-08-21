'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, ShoppingCart, User, Heart, ChevronRight, 
  Shirt, Watch, Sparkles, Tag, ShieldCheck, Truck, RefreshCw,
  X, Plus, Minus, Trash2, Eye, MapPin, Mail, Phone, Package 
} from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Interactive States
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Modals State
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isTrackOpen, setIsTrackOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [trackOrderId, setTrackOrderId] = useState('');
  const [trackResult, setTrackResult] = useState(null);

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
      console.error('Failed to fetch products:', err);
    }
  };

  const categories = [
    { name: 'All', icon: Sparkles },
    { name: 'T-Shirts', icon: Shirt },
    { name: 'Shirts', icon: Shirt },
    { name: 'Watches', icon: Watch },
    { name: 'Shoes', icon: Tag },
  ];

  // Cart Functions
  const addToCart = (product) => {
    const chosenSize = (product.sizes && product.sizes[0]) || 'M';
    const cartItemId = `${product.id}-${chosenSize}`;

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.cartItemId === cartItemId);
      if (existingItem) {
        return prevCart.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, cartItemId, selectedSize: chosenSize, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (cartItemId, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (cartItemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.cartItemId !== cartItemId));
  };

  const handleTrackOrder = (e) => {
    e.preventDefault();
    if (!trackOrderId.trim()) return;
    setTrackResult({
      id: trackOrderId,
      status: 'In Transit 🚚',
      expectedDelivery: 'Tomorrow by 8 PM',
      location: 'Regional Logistics Hub'
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.base_price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans relative">
      
      {/* HEADER */}
      <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          
          <Link href="/" className="flex items-center gap-1">
            <span className="text-xl font-black tracking-wider text-amber-400">MODERN WALK</span>
          </Link>

          <div className="flex-1 max-w-2xl flex items-center bg-white rounded-lg overflow-hidden border border-slate-300">
            <input
              type="text"
              placeholder="Search for Products, Brands and More..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 text-sm text-slate-900 outline-none"
            />
            <button className="bg-amber-400 hover:bg-amber-500 px-4 py-2 text-slate-950 transition">
              <Search className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 text-sm font-semibold">
            <Link href="/admin" className="hover:text-amber-400 text-xs bg-slate-800 px-3 py-1.5 rounded-md transition">
              Admin Portal
            </Link>
            
            <button onClick={() => setIsTrackOpen(true)} className="hidden md:flex items-center gap-1 hover:text-amber-400 text-xs">
              <Package className="w-4 h-4 text-amber-400" /> Track Order
            </button>

            <button onClick={() => setIsLoginOpen(true)} className="flex items-center gap-1 hover:text-amber-400">
              <User className="w-5 h-5" /> Login
            </button>
            
            <button onClick={() => setIsCartOpen(true)} className="flex items-center gap-1 hover:text-amber-400 relative">
              <ShoppingCart className="w-5 h-5" /> Cart
              {cartItemCount > 0 && (
                <span className="bg-amber-400 text-slate-950 font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center -mt-3 -ml-2">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* CATEGORY NAV */}
        <div className="bg-slate-800 border-t border-slate-700 py-2.5 overflow-x-auto">
          <div className="max-w-7xl mx-auto px-4 flex gap-6 text-xs font-medium text-slate-300">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full whitespace-nowrap transition ${
                    isActive ? 'bg-amber-400 text-slate-950 font-bold' : 'hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">

        {/* BANNER */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white rounded-2xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="bg-white/20 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              Festive Season Offer
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold">Min 40% - 80% Off On Men's Fashion</h1>
            <p className="text-sm text-amber-100">Latest T-Shirts, Shirts, Accessories & Shoes Added Today!</p>
          </div>
          <button className="bg-slate-950 hover:bg-slate-900 text-amber-400 font-bold px-6 py-3 rounded-xl shadow-md text-sm transition">
            Explore Deals
          </button>
        </div>

        {/* PRODUCT GRID */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Featured Inventory</h2>
              <p className="text-xs text-slate-500">Live products managed directly via Admin Dashboard</p>
            </div>
            <span className="text-xs text-slate-500 font-semibold">{filteredProducts.length} Items Found</span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 text-sm">No products found. Add items from the Admin page!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredProducts.map((p) => (
                <div key={p.id} className="group border border-slate-200 rounded-xl p-3 bg-white hover:shadow-lg transition flex flex-col justify-between">
                  <div>
                    <div className="h-44 rounded-lg bg-slate-100 overflow-hidden relative mb-3">
                      <img
                        src={p.image_url || (p.images && p.images[0]) || 'https://via.placeholder.com/300'}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>

                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded uppercase">
                      {p.brand || 'MODERN WALK'}
                    </span>
                    
                    <h3 className="text-xs font-bold text-slate-800 line-clamp-1 mt-1">{p.title}</h3>

                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-sm font-black text-slate-900">₹{p.base_price}</span>
                      <span className="text-[10px] text-slate-400 line-through">₹{Math.round(p.base_price * 1.3)}</span>
                      <span className="text-[10px] text-green-600 font-bold">25% OFF</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => addToCart(p)}
                    className="w-full mt-3 bg-slate-900 hover:bg-amber-400 hover:text-slate-950 text-white text-xs font-bold py-2 rounded-lg transition"
                  >
                    Add To Cart
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>

      {/* LOGIN MODAL */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <button onClick={() => setIsLoginOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-800">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-900">Login to Your Account</h3>
            <form onSubmit={(e) => { e.preventDefault(); alert('Logged in successfully!'); setIsLoginOpen(false); }} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Email Address / Phone Number</label>
                <input 
                  type="text" 
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@example.com or +91 9876543210" 
                  className="w-full mt-1 border border-slate-300 rounded-lg p-2.5 text-xs outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700">Password</label>
                <input 
                  type="password" 
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full mt-1 border border-slate-300 rounded-lg p-2.5 text-xs outline-none focus:border-amber-400"
                />
              </div>
              <button type="submit" className="w-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold py-2.5 rounded-lg text-xs transition">
                Sign In
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TRACK ORDER MODAL */}
      {isTrackOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <button onClick={() => { setIsTrackOpen(false); setTrackResult(null); }} className="absolute top-4 right-4 text-slate-400 hover:text-slate-800">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-900">Track Order Status</h3>
            <form onSubmit={handleTrackOrder} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Enter Order ID</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. MW-102938" 
                  value={trackOrderId}
                  onChange={(e) => setTrackOrderId(e.target.value)}
                  className="w-full mt-1 border border-slate-300 rounded-lg p-2.5 text-xs outline-none focus:border-amber-400"
                />
              </div>
              <button type="submit" className="w-full bg-slate-900 hover:bg-amber-400 hover:text-slate-950 text-white font-bold py-2.5 rounded-lg text-xs transition">
                Check Status
              </button>
            </form>

            {trackResult && (
              <div className="border border-amber-200 bg-amber-50 p-4 rounded-xl text-xs space-y-2">
                <p><strong>Order ID:</strong> {trackResult.id}</p>
                <p><strong>Status:</strong> <span className="text-amber-700 font-bold">{trackResult.status}</span></p>
                <p><strong>Location:</strong> {trackResult.location}</p>
                <p><strong>Estimated Delivery:</strong> {trackResult.expectedDelivery}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SLIDE-OUT CART */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between z-10 p-6 overflow-y-auto">
            <div>
              <div className="flex justify-between items-center border-b pb-4 mb-4">
                <h2 className="text-base font-bold flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-amber-500" /> Your Cart ({cartItemCount})
                </h2>
                <button onClick={() => setIsCartOpen(false)} className="p-1 text-slate-400 hover:text-slate-800">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-sm font-semibold text-slate-500">Your cart is empty.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.cartItemId} className="flex gap-3 border border-slate-100 p-3 rounded-xl bg-slate-50">
                      <img src={item.image_url || (item.images && item.images[0])} alt={item.title} className="w-16 h-16 object-cover rounded-lg" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold truncate">{item.title}</h4>
                        <p className="text-[10px] text-slate-400">Size: <span className="font-bold text-slate-700">{item.selectedSize}</span></p>
                        <p className="text-xs font-black text-slate-900 mt-1">₹{item.base_price}</p>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <button onClick={() => updateQuantity(item.cartItemId, -1)} className="p-1 bg-white border border-slate-200 rounded">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold px-1">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.cartItemId, 1)} className="p-1 bg-white border border-slate-200 rounded">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(item.cartItemId)} className="text-slate-400 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t pt-4 mt-6 space-y-3">
                <div className="flex justify-between items-center text-sm font-bold">
                  <span>Total Amount</span>
                  <span className="text-base text-amber-600">₹{cartTotal}</span>
                </div>
                <button onClick={() => alert('Order Placed Successfully!')} className="w-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold py-3 rounded-xl text-xs transition">
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-300 mt-12 border-t border-slate-800">
        <div className="bg-slate-800 py-3 text-center text-xs font-semibold hover:bg-slate-700 cursor-pointer text-slate-200" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          Back to top
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
          
          {/* Store Address & Info */}
          <div className="space-y-3">
            <h4 className="font-bold text-amber-400 text-sm">MODERN WALK STORE</h4>
            <div className="space-y-2 text-slate-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>Plot 42, Silicon Valley High Street, Hyderabad, Telangana - 500081</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>support@modernwalk.com</span>
              </p>
            </div>
          </div>

          {/* Connect With Us */}
          <div>
            <h4 className="font-bold text-white mb-3 text-sm">Connect With Us</h4>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-center gap-2 hover:text-white cursor-pointer">
                <svg className="w-4 h-4 fill-current text-pink-500" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>@modernwalk_fashion</span>
              </li>
              <li className="flex items-center gap-2 hover:text-white cursor-pointer">
                <Mail className="w-4 h-4 text-amber-400" /> support@modernwalk.com
              </li>
              <li className="flex items-center gap-2 hover:text-white cursor-pointer">
                <Phone className="w-4 h-4 text-amber-400" /> +91 98765 43210
              </li>
            </ul>
          </div>

          {/* Quick Subpages */}
          <div>
            <h4 className="font-bold text-white mb-3 text-sm">Store Pages</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/about" className="hover:text-amber-400">About Our Brand</Link></li>
              <li><Link href="/contact" className="hover:text-amber-400">Contact Us</Link></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className="font-bold text-white mb-3 text-sm">Customer Care</h4>
            <ul className="space-y-2 text-slate-400">
              <li onClick={() => setIsTrackOpen(true)} className="hover:text-amber-400 cursor-pointer">Track Your Package</li>
              <li className="hover:text-amber-400 cursor-pointer">Return & Replacement Centre</li>
              <li className="hover:text-amber-400 cursor-pointer">100% Purchase Protection</li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800 py-6 text-center text-[11px] text-slate-500">
          © 2026 Modern Walk E-Commerce. All rights reserved.
        </div>
      </footer>

    </div>
  );
}