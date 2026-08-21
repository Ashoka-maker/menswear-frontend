'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, ShoppingCart, User, Heart, ChevronRight, 
  Shirt, Watch, Sparkles, Tag, ShieldCheck, Truck, RefreshCw,
  X, Plus, Minus, Trash2, Eye, Check
} from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Interactive States
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');

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
  const addToCart = (product, size = null) => {
    const chosenSize = size || (product.sizes && product.sizes[0]) || 'M';
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

  const cartTotal = cart.reduce((sum, item) => sum + item.base_price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Filter Logic
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans relative">
      
      {/* 1. AMAZON/FLIPKART HEADER */}
      <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1">
            <span className="text-xl font-black tracking-wider text-amber-400">MODERN WALK</span>
          </Link>

          {/* Search Bar */}
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

          {/* Header Action Items */}
          <div className="flex items-center gap-6 text-sm font-semibold">
            <Link href="/admin" className="hover:text-amber-400 text-xs bg-slate-800 px-3 py-1.5 rounded-md transition">
              Admin Portal
            </Link>
            <button className="flex items-center gap-1 hover:text-amber-400">
              <User className="w-5 h-5" /> Login
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-1 hover:text-amber-400 relative"
            >
              <ShoppingCart className="w-5 h-5" /> Cart
              {cartItemCount > 0 && (
                <span className="bg-amber-400 text-slate-950 font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center -mt-3 -ml-2">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* 2. CATEGORY BAR */}
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

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">

        {/* 3. HERO / FESTIVAL BANNER */}
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

        {/* 4. AMAZON-STYLE 4-BOX PROMO GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-sm text-slate-900 mb-2">Starting ₹99 | Daily Wear</h3>
            <div className="h-40 bg-slate-100 rounded-lg overflow-hidden mb-2">
              <img src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500" alt="Casual Wear" className="w-full h-full object-cover" />
            </div>
            <span className="text-xs font-bold text-amber-600 flex items-center cursor-pointer">
              Shop Now <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-sm text-slate-900 mb-2">Under ₹699 | Trending Shoes</h3>
            <div className="h-40 bg-slate-100 rounded-lg overflow-hidden mb-2">
              <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500" alt="Shoes" className="w-full h-full object-cover" />
            </div>
            <span className="text-xs font-bold text-amber-600 flex items-center cursor-pointer">
              Explore Footwear <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-sm text-slate-900 mb-2">Up to 60% Off | Premium Watches</h3>
            <div className="h-40 bg-slate-100 rounded-lg overflow-hidden mb-2">
              <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500" alt="Watches" className="w-full h-full object-cover" />
            </div>
            <span className="text-xs font-bold text-amber-600 flex items-center cursor-pointer">
              See All Watches <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-sm text-slate-900 mb-2">Up to 50% Off | New Arrivals</h3>
            <div className="h-40 bg-slate-100 rounded-lg overflow-hidden mb-2">
              <img src="https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500" alt="New Shirts" className="w-full h-full object-cover" />
            </div>
            <span className="text-xs font-bold text-amber-600 flex items-center cursor-pointer">
              View Collection <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* 5. LIVE INVENTORY PRODUCT GRID */}
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
                      <button 
                        onClick={() => {
                          setQuickViewProduct(p);
                          setSelectedSize(p.sizes ? p.sizes[0] : 'M');
                        }}
                        className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full text-slate-700 hover:text-amber-500 transition shadow-sm"
                        title="Quick View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
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

        {/* 6. TRUST BADGES */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-6 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-3">
            <Truck className="w-8 h-8 text-amber-500" />
            <div>
              <h4 className="text-xs font-bold">Fast Delivery</h4>
              <p className="text-[11px] text-slate-500">Dispatched within 24 hours</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-amber-500" />
            <div>
              <h4 className="text-xs font-bold">100% Original Products</h4>
              <p className="text-[11px] text-slate-500">Sourced directly from brands</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RefreshCw className="w-8 h-8 text-amber-500" />
            <div>
              <h4 className="text-xs font-bold">Easy Returns</h4>
              <p className="text-[11px] text-slate-500">7 Days hassle-free return policy</p>
            </div>
          </div>
        </div>

      </main>

      {/* 7. SLIDE-OUT CART DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />

          {/* Drawer Sidebar */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between z-10 p-6 overflow-y-auto">
            <div>
              <div className="flex justify-between items-center border-b pb-4 mb-4">
                <h2 className="text-base font-bold flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-amber-500" /> Your Shopping Cart ({cartItemCount})
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
                      <img 
                        src={item.image_url || (item.images && item.images[0])} 
                        alt={item.title} 
                        className="w-16 h-16 object-cover rounded-lg"
                      />
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
                <button 
                  onClick={() => alert('Proceeding to Checkout...')}
                  className="w-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold py-3 rounded-xl shadow-md text-xs transition"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 8. QUICK VIEW MODAL */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setQuickViewProduct(null)} />
          <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl z-10 overflow-hidden space-y-4">
            <button 
              onClick={() => setQuickViewProduct(null)} 
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex gap-4">
              <img 
                src={quickViewProduct.image_url || (quickViewProduct.images && quickViewProduct.images[0])} 
                alt={quickViewProduct.title}
                className="w-36 h-36 object-cover rounded-xl border border-slate-100" 
              />
              <div className="flex-1 space-y-1">
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded uppercase">
                  {quickViewProduct.brand || 'MODERN WALK'}
                </span>
                <h3 className="text-sm font-bold text-slate-900">{quickViewProduct.title}</h3>
                <p className="text-lg font-black text-slate-900 mt-2">₹{quickViewProduct.base_price}</p>
              </div>
            </div>

            {/* Sizes Selection */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">Select Size</label>
              <div className="flex gap-2 flex-wrap">
                {(quickViewProduct.sizes || ['S', 'M', 'L', 'XL']).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                      selectedSize === sz
                        ? 'bg-amber-400 border-amber-400 text-slate-950'
                        : 'border-slate-200 text-slate-600 hover:border-slate-400'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                addToCart(quickViewProduct, selectedSize);
                setQuickViewProduct(null);
              }}
              className="w-full bg-slate-900 hover:bg-amber-400 hover:text-slate-950 text-white font-bold py-3 rounded-xl text-xs transition"
            >
              Add To Cart
            </button>
          </div>
        </div>
      )}

      {/* 9. FOOTER */}
      <footer className="bg-slate-900 text-slate-300 mt-12 border-t border-slate-800">
        <div 
          className="bg-slate-800 py-3 text-center text-xs font-semibold hover:bg-slate-700 cursor-pointer text-slate-200" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          Back to top
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">
          <div>
            <h4 className="font-bold text-white mb-3 text-sm">Get to Know Us</h4>
            <ul className="space-y-2 text-slate-400">
              <li className="hover:text-white cursor-pointer">About Us</li>
              <li className="hover:text-white cursor-pointer">Careers</li>
              <li className="hover:text-white cursor-pointer">Press Releases</li>
              <li className="hover:text-white cursor-pointer">Modern Walk Science</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-sm">Connect with Us</h4>
            <ul className="space-y-2 text-slate-400">
              <li className="hover:text-white cursor-pointer">Facebook</li>
              <li className="hover:text-white cursor-pointer">Twitter</li>
              <li className="hover:text-white cursor-pointer">Instagram</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-sm">Make Money with Us</h4>
            <ul className="space-y-2 text-slate-400">
              <li className="hover:text-white cursor-pointer">Sell on Modern Walk</li>
              <li className="hover:text-white cursor-pointer">Become an Affiliate</li>
              <li className="hover:text-white cursor-pointer">Fulfillment by Modern Walk</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-sm">Let Us Help You</h4>
            <ul className="space-y-2 text-slate-400">
              <li className="hover:text-white cursor-pointer">Your Account</li>
              <li className="hover:text-white cursor-pointer">Returns Centre</li>
              <li className="hover:text-white cursor-pointer">100% Purchase Protection</li>
              <li className="hover:text-white cursor-pointer">Help</li>
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