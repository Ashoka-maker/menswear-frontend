'use client';
import { useState, useEffect } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import { 
  ShoppingBag, ShoppingCart, Star, X, Plus, Trash2, CheckCircle, 
  Heart, MapPin, ShieldCheck, Truck, RefreshCw, Eye, Mail, Lock 
} from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [activeModalProduct, setActiveModalProduct] = useState(null);
  
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState('');

  const [customer, setCustomer] = useState({ name: '', phone: '', address: '', pincode: '' });

  const API_BASE_URL = 'https://menswear-backend-f2fo.onrender.com';
  const ADMIN_WHATSAPP_NUMBER = '919655872121'; 

  const categories = ['All', 'T-Shirts', 'Shirts', 'Jeans', 'Pants', 'Shorts', 'Jackets', 'Shoes', 'Sleepers', 'Watches', 'Ethnic'];

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
          setFilteredProducts(data);
        }
      })
      .catch((err) => console.error('Backend connection failed:', err));
  }, []);

  useEffect(() => {
    let result = products;
    if (selectedCategory !== 'All') {
      result = result.filter((item) =>
        item.category === selectedCategory ||
        item.title.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        (item.brand && item.brand.toLowerCase().includes(selectedCategory.toLowerCase()))
      );
    }
    if (searchQuery.trim() !== '') {
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.brand && item.brand.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    setFilteredProducts(result);
  }, [selectedCategory, searchQuery, products]);

  const toggleWishlist = (product) => {
    if (wishlist.some(w => w.id === product.id)) {
      setWishlist(wishlist.filter(w => w.id !== product.id));
    } else {
      setWishlist([...wishlist, product]);
    }
  };

  const checkPincode = () => {
    if (pincode.length === 6) {
      setPincodeStatus('Eligible for Fast Express Delivery (2-3 Days)');
    } else {
      setPincodeStatus('Please enter a valid 6-digit Indian Pin Code.');
    }
  };

  const handleSizeSelect = (productId, size) => {
    setSelectedSizes({ ...selectedSizes, [productId]: size });
  };

  const addToCart = (product) => {
    const chosenSize = selectedSizes[product.id] || (product.sizes ? product.sizes[0] : 'M');
    setCart([...cart, { ...product, chosenSize, cartId: Date.now() }]);
    setIsCartOpen(true);
  };

  const removeFromCart = (cartId) => {
    setCart(cart.filter((item) => item.cartId !== cartId));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + parseFloat(item.base_price), 0).toFixed(2);
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();

    if (paymentMethod === 'UPI') {
      try {
        const res = await fetch(`${API_BASE_URL}/api/create-upi-order`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: calculateTotal() })
        });
        const orderData = await res.json();

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_YourKeyHere',
          amount: orderData.amount,
          currency: 'INR',
          name: 'MODERN WALK',
          description: 'Payment for Menswear Order',
          order_id: orderData.id,
          handler: function (response) {
            alert(`UPI Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
            setIsCheckingOut(false);
            setOrderComplete(true);
            setCart([]);
          },
          prefill: { name: customer.name, contact: customer.phone },
          theme: { color: '#0F172A' }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (err) {
        alert('UPI gateway error. Falling back to WhatsApp checkout.');
        sendWhatsAppOrder();
      }
    } else {
      sendWhatsAppOrder();
    }
  };

  const sendWhatsAppOrder = async () => {
    const itemDetails = cart.map((i, idx) => `${idx + 1}. ${i.title} (Size: ${i.chosenSize}) - ₹${i.base_price}`).join('\n');
    
    const whatsappMessage = 
      `🛍️ *NEW ORDER - MODERN WALK*\n\n` +
      `*Customer Name:* ${customer.name}\n` +
      `*Phone Number:* ${customer.phone}\n` +
      `*Address:* ${customer.address} (PIN: ${customer.pincode})\n\n` +
      `*Items Ordered:*\n${itemDetails}\n\n` +
      `*Total Amount:* ₹${calculateTotal()}\n` +
      `*Payment:* Cash on Delivery`;

    try {
      await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customer.name,
          phone: customer.phone,
          address: `${customer.address} - PIN: ${customer.pincode}`,
          items: cart,
          totalAmount: calculateTotal(),
        }),
      });
    } catch (err) {
      console.error(err);
    }

    const whatsappUrl = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');

    setIsCheckingOut(false);
    setOrderComplete(true);
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 relative font-sans">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      {/* Top Banner Bar */}
      <div className="bg-amber-400 text-slate-950 text-xs font-bold py-1.5 px-4 text-center flex justify-between items-center max-w-7xl mx-auto">
        <span className="hidden sm:inline">📍 Pillar No. A1191, Lakdikapul, Hyderabad</span>
        <div className="flex gap-4 mx-auto sm:mx-0">
          <a href="https://instagram.com/modernwalk1" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg> @modernwalk1
          </a>
          <a href="mailto:modernwalk206@gmail.com" className="flex items-center gap-1 hover:underline">
            <Mail className="w-3.5 h-3.5" /> modernwalk206@gmail.com
          </a>
        </div>
      </div>

      {/* Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-amber-400" />
            <div>
              <h1 className="text-xl font-black tracking-wider">MODERN WALK</h1>
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest block -mt-1">MENS WEAR</span>
            </div>
          </div>

          <div className="flex-1 max-w-xl mx-4 hidden md:block">
            <input
              type="text"
              placeholder="Search shirts, shoes, watches, jackets, jeans..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2 text-xs outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/admin" 
              className="flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 border border-amber-400/30 px-3 py-1.5 rounded-lg transition"
            >
              <Lock className="w-3.5 h-3.5" /> Owner Admin
            </Link>

            <button onClick={() => setIsCartOpen(true)} className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-900 px-4 py-2 rounded-lg font-bold transition text-xs">
              <ShoppingCart className="w-4 h-4" /> Cart
              <span className="bg-slate-900 text-white px-1.5 py-0.5 rounded-full text-[10px]">{cart.length}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner & Express Delivery Check */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-12 px-6 border-b border-slate-700">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-4">
            <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">Big Billion Festive Deals</span>
            <h2 className="text-3xl sm:text-5xl font-black leading-tight">PREMIUM MENSWEAR <br/><span className="text-amber-400">UP TO 60% OFF</span></h2>
            <p className="text-slate-300 text-sm">Elevate your daily wardrobe with shoes, watches, modern fits, ethnic wear, and western essentials.</p>
          </div>
          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
              <MapPin className="w-4 h-4" /> Check Express Delivery
            </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                maxLength={6}
                placeholder="Enter 6-digit Pincode" 
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-white text-xs px-3 py-2 rounded-lg outline-none w-full"
              />
              <button onClick={checkPincode} className="bg-amber-400 text-slate-900 text-xs font-bold px-3 py-2 rounded-lg hover:bg-amber-500">Check</button>
            </div>
            {pincodeStatus && <p className="text-[11px] font-semibold text-emerald-400">{pincodeStatus}</p>}
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <div className="bg-white border-b border-slate-200 py-3 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-bold text-slate-700">
          <div className="flex items-center gap-2 justify-center"><Truck className="w-4 h-4 text-amber-500" /> Free Shipping Across India</div>
          <div className="flex items-center gap-2 justify-center"><ShieldCheck className="w-4 h-4 text-emerald-500" /> 100% Original Products</div>
          <div className="flex items-center gap-2 justify-center"><RefreshCw className="w-4 h-4 text-blue-500" /> Easy 7-Day Returns</div>
          <div className="flex items-center gap-2 justify-center"><CheckCircle className="w-4 h-4 text-indigo-500" /> Instant UPI & COD Available</div>
        </div>
      </div>

      {/* Category Tabs */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex overflow-x-auto gap-3 pb-4 mb-6 border-b border-slate-200 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-extrabold whitespace-nowrap transition ${
                selectedCategory === cat 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {cat === 'All' ? 'All Inventory' : cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const isWishlisted = wishlist.some(w => w.id === product.id);
            return (
              <div key={product.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition flex flex-col group relative">
                <button 
                  onClick={() => toggleWishlist(product)} 
                  className="absolute top-3 right-3 z-10 bg-white/90 p-2 rounded-full border border-slate-200 shadow-sm"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
                </button>

                <div className="relative overflow-hidden cursor-pointer" onClick={() => setActiveModalProduct(product)}>
                  <img src={product.image_url} alt={product.title} className="w-full h-64 object-cover group-hover:scale-105 transition duration-300" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <span className="bg-white text-slate-900 font-bold text-xs px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                      <Eye className="w-3.5 h-3.5" /> Quick View
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">{product.brand || 'MODERN WALK'}</span>
                    <h4 className="font-bold text-sm text-slate-900 truncate">{product.title}</h4>
                    
                    <div className="flex items-center gap-1 my-1">
                      <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        4.3 <Star className="w-2.5 h-2.5 fill-white" />
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">(128 reviews)</span>
                    </div>

                    <div className="mt-3">
                      <span className="text-[10px] font-bold text-slate-500 block mb-1">Select Size:</span>
                      <div className="flex gap-1.5 flex-wrap">
                        {(product.sizes || ['S', 'M', 'L', 'XL', '7', '8', '9']).map((size) => (
                          <button
                            key={size}
                            onClick={() => handleSizeSelect(product.id, size)}
                            className={`px-2 py-0.5 text-[11px] rounded border font-bold ${
                              (selectedSizes[product.id] || product.sizes?.[0] || 'M') === size
                                ? 'bg-slate-900 text-white border-slate-900'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-200'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-lg font-black text-slate-900">₹{product.base_price}</span>
                      <span className="text-[10px] text-slate-400 line-through ml-1.5">₹{Math.round(product.base_price * 1.4)}</span>
                    </div>
                    <button 
                      onClick={() => addToCart(product)} 
                      className="bg-amber-400 hover:bg-amber-500 text-slate-900 text-xs font-extrabold px-3 py-2 rounded-lg transition flex items-center gap-1 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Quick View Modal */}
      {activeModalProduct && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row">
            <button onClick={() => setActiveModalProduct(null)} className="absolute top-3 right-3 z-10 bg-slate-100 p-1.5 rounded-full text-slate-600 hover:bg-slate-200">
              <X className="w-5 h-5" />
            </button>
            <img src={activeModalProduct.image_url} alt={activeModalProduct.title} className="w-full md:w-1/2 h-72 md:h-auto object-cover" />
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs font-black text-amber-600 uppercase tracking-widest">{activeModalProduct.brand}</span>
                <h3 className="text-xl font-bold text-slate-900">{activeModalProduct.title}</h3>
                <p className="text-xs text-slate-500 mt-2">{activeModalProduct.description || 'Premium quality tailored for comfort and modern style.'}</p>
                <div className="mt-4">
                  <span className="text-2xl font-black text-slate-900">₹{activeModalProduct.base_price}</span>
                  <span className="text-xs text-slate-400 line-through ml-2">₹{Math.round(activeModalProduct.base_price * 1.4)}</span>
                  <span className="text-xs font-bold text-emerald-600 ml-2">30% OFF</span>
                </div>
              </div>
              <button 
                onClick={() => { addToCart(activeModalProduct); setActiveModalProduct(null); }} 
                className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition"
              >
                Add To Cart Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex justify-between items-center pb-4 border-b">
                <h3 className="text-lg font-bold">Shopping Cart ({cart.length})</h3>
                <button onClick={() => setIsCartOpen(false)}><X className="w-6 h-6" /></button>
              </div>
              <div className="divide-y my-4">
                {cart.map((item) => (
                  <div key={item.cartId} className="py-3 flex justify-between items-center">
                    <div>
                      <h5 className="font-bold text-sm">{item.title}</h5>
                      <p className="text-xs text-slate-500">Size: {item.chosenSize}</p>
                      <p className="text-sm font-bold mt-1">₹{item.base_price}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.cartId)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
            {cart.length > 0 && (
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-lg mb-4">
                  <span>Total Payable:</span>
                  <span>₹{calculateTotal()}</span>
                </div>
                <button onClick={() => { setIsCartOpen(false); setIsCheckingOut(true); }} className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition">
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Order Checkout Modal */}
      {isCheckingOut && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl relative">
            <button onClick={() => setIsCheckingOut(false)} className="absolute top-4 right-4 text-slate-400"><X className="w-5 h-5" /></button>
            <h3 className="text-xl font-bold mb-1">Delivery & Payment Details</h3>
            <p className="text-xs text-slate-500 mb-6">Total payable amount: <span className="font-extrabold text-slate-900">₹{calculateTotal()}</span></p>
            <form onSubmit={handleOrderSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Full Name</label>
                <input required type="text" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} className="w-full border rounded-lg p-2.5 text-sm outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Phone Number</label>
                <input required type="text" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} placeholder="+91 9655872121" className="w-full border rounded-lg p-2.5 text-sm outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Pincode</label>
                  <input required type="text" maxLength={6} value={customer.pincode} onChange={(e) => setCustomer({ ...customer, pincode: e.target.value })} className="w-full border rounded-lg p-2.5 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Payment Method</label>
                  <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full border rounded-lg p-2.5 text-sm outline-none bg-white">
                    <option value="UPI">Pay Online via UPI (GPay / PhonePe / Paytm)</option>
                    <option value="COD">Cash on Delivery (WhatsApp Confirmation)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Full Address</label>
                <textarea required rows="2" value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} className="w-full border rounded-lg p-2.5 text-sm outline-none"></textarea>
              </div>
              <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition">
                {paymentMethod === 'UPI' ? `Pay ₹${calculateTotal()} via Online UPI` : 'Confirm & Send Order via WhatsApp'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {orderComplete && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full rounded-2xl p-6 text-center shadow-2xl">
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Order Confirmed!</h3>
            <p className="text-slate-500 text-sm mb-6">Thank you for shopping with Modern Walk Mens Wear.</p>
            <button onClick={() => setOrderComplete(false)} className="bg-slate-900 text-white font-bold px-6 py-2.5 rounded-xl text-sm">
              Back to Store
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-white mt-16 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-black text-amber-400">MODERN WALK MENS WEAR</h3>
            <p className="text-sm text-slate-300">Visit our store in Lakdikapul or contact us directly for orders, custom sizes, and local store pickups.</p>
            
            <div className="text-xs space-y-3 text-slate-300 pt-1">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" /> 
                <span>
                  <strong>Address:</strong> Pillar no A1191, MODERN WALK MENS WEAR, Near Panasonic services center, 6-2-967, Chintal Basti Main Rd, P & T Officers Colony, Veer Nagar, Lakdikapul, Hyderabad, Telangana 500004
                </span>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" /> 
                <span><strong>Email:</strong> modernwalk206@gmail.com</span>
              </p>
              <p className="flex items-center gap-2.5">
                <svg className="w-4 h-4 fill-amber-400 shrink-0" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg> 
                <span><strong>Instagram:</strong> <a href="https://instagram.com/modernwalk1" target="_blank" rel="noreferrer" className="text-amber-400 hover:underline">@modernwalk1</a></span>
              </p>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border border-slate-700 h-64 shadow-lg">
            <iframe 
              title="Modern Walk Store Location Map"
              width="100%" 
              height="100%" 
              frameBorder="0" 
              scrolling="no" 
              src="https://maps.google.com/maps?q=6-2-967,+Chintal+Basti+Main+Rd,+Lakdikapul,+Hyderabad,+Telangana+500004&t=&z=16&ie=UTF8&iwloc=&output=embed"
            ></iframe>
          </div>
        </div>
      </footer>
    </div>
  );
}