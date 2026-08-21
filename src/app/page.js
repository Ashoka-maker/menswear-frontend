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

  // WhatsApp Order Modal State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderSize, setOrderSize] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

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
    { name: 'Jeans', icon: Tag },
    { name: 'Trousers', icon: Tag },
    { name: 'Shorts', icon: Tag },
    { name: 'Jackets', icon: Tag },
    { name: 'Hoodies', icon: Tag },
    { name: 'Watches', icon: Watch },
    { name: 'Shoes', icon: Tag },
    { name: 'Innerwear', icon: Tag },
    { name: 'Belts', icon: Tag },
    { name: 'Sunglasses', icon: Tag },
    { name: 'Perfumes', icon: Tag },
    { name: 'Caps', icon: Tag },
    { name: 'Accessories', icon: Tag },
  ];

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

  const handleOpenOrderModal = (product) => {
    setSelectedProduct(product);
    setOrderSize((product.sizes && product.sizes[0]) || 'M');
  };

  const handleSendWhatsAppOrder = (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const message = `Hello MODERN WALK team,%0A%0AI would like to place an order:%0A*Product:* ${selectedProduct.title}%0A*Price:* ₹${selectedProduct.base_price}%0A*Size:* ${orderSize}%0A*Payment Method:* ${paymentMethod}%0A*Customer Name:* ${customerName}%0A*Delivery Address:* ${customerAddress}`;
    const whatsappUrl = `https://wa.me/919655872121?text=${message}`;

    window.open(whatsappUrl, '_blank');
    setSelectedProduct(null);
  };

  const handleTrackOrder = (e) => {
    e.preventDefault();
    if (!trackOrderId.trim()) return;
    setTrackResult({
      id: trackOrderId,
      status: 'In Transit 🚚',
      expectedDelivery: 'Tomorrow by 8 PM',
      location: 'Lakdikapul Warehouse'
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
          <div className="max-w-7xl mx-auto px-4 flex gap-3 text-xs font-medium text-slate-300">
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
            <p className="text-sm text-amber-100">Shirts, T-Shirts, Jeans, Shoes & Accessories Added Today!</p>
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
              <p className="text-slate-400 text-sm">No products found in this category.</p>
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

                    {p.sizes && p.sizes.length > 0 && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {p.sizes.map((s) => (
                          <span key={s} className="text-[9px] bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-600 font-bold">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-sm font-black text-slate-900">₹{p.base_price}</span>
                      <span className="text-[10px] text-slate-400 line-through">₹{Math.round(p.base_price * 1.3)}</span>
                    </div>
                  </div>

                  <div className="space-y-2 mt-3">
                    <button 
                      onClick={() => handleOpenOrderModal(p)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-lg transition flex items-center justify-center gap-1"
                    >
                      Buy / Order on WhatsApp
                    </button>
                    <button 
                      onClick={() => addToCart(p)}
                      className="w-full bg-slate-900 hover:bg-amber-400 hover:text-slate-950 text-white text-xs font-bold py-2 rounded-lg transition"
                    >
                      Add To Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>

      {/* WHATSAPP ORDER / BUY NOW MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-800">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-slate-900">Place Order via WhatsApp</h3>
            
            <div className="flex gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <img src={selectedProduct.image_url || selectedProduct.images?.[0]} alt={selectedProduct.title} className="w-16 h-16 object-cover rounded-lg" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">{selectedProduct.title}</h4>
                <p className="text-xs font-extrabold text-amber-600 mt-1">₹{selectedProduct.base_price}</p>
              </div>
            </div>

            <form onSubmit={handleSendWhatsAppOrder} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Size</label>
                <select 
                  value={orderSize} 
                  onChange={(e) => setOrderSize(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg outline-none"
                >
                  {(selectedProduct.sizes || ['S', 'M', 'L', 'XL']).map((sz) => (
                    <option key={sz} value={sz}>{sz}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Online Payment (UPI/GPay)')}
                    className={`p-2 border rounded-lg font-bold text-center ${paymentMethod.includes('Online') ? 'bg-amber-400 border-amber-500 text-slate-950' : 'bg-slate-50 text-slate-600'}`}
                  >
                    Online Payment
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Cash on Delivery')}
                    className={`p-2 border rounded-lg font-bold text-center ${paymentMethod.includes('Cash') ? 'bg-amber-400 border-amber-500 text-slate-950' : 'bg-slate-50 text-slate-600'}`}
                  >
                    Cash on Delivery
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Your Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Enter full name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Delivery Address</label>
                <textarea 
                  required 
                  rows={2}
                  placeholder="Street, Landmark, City, Pincode"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg outline-none"
                />
              </div>

              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs transition">
                Send Order to WhatsApp (+91 96558 72121)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-300 mt-12 border-t border-slate-800">
        <div className="bg-slate-800 py-3 text-center text-xs font-semibold hover:bg-slate-700 cursor-pointer text-slate-200" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          Back to top
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
          
          <div className="space-y-3">
            <h4 className="font-bold text-amber-400 text-sm">MODERN WALK STORE</h4>
            <div className="space-y-2 text-slate-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>Pillar no A1191, MODERN WALK MENS WEAR, Panasonic services center, 6-2-967, Chintal Basti Main Rd, P & T Officers Colony, Veer Nagar, Lakdikapul, Hyderabad, Telangana 500004</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>+91 96558 72121</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>modernwalk206@gmail.com</span>
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-sm">Connect With Us</h4>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-center gap-2 hover:text-white cursor-pointer">
                <svg className="w-4 h-4 fill-current text-pink-500" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>@modernwalk1</span>
              </li>
              <li className="flex items-center gap-2 hover:text-white cursor-pointer">
                <Mail className="w-4 h-4 text-amber-400" /> modernwalk206@gmail.com
              </li>
              <li className="flex items-center gap-2 hover:text-white cursor-pointer">
                <Phone className="w-4 h-4 text-amber-400" /> +91 96558 72121
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-sm">Store Pages</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/about" className="hover:text-amber-400">About Our Brand</Link></li>
              <li><Link href="/contact" className="hover:text-amber-400">Contact Us</Link></li>
            </ul>
          </div>

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