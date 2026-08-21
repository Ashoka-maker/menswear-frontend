'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, Phone, Mail, MapPin, Instagram, 
  X, MapPinOff, Locate, Trash2, CheckCircle, ExternalLink 
} from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Cart State
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Checkout Modal State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD'); // 'COD' | 'ONLINE'
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [liveLocation, setLiveLocation] = useState(null);
  const [gettingLocation, setGettingLocation] = useState(false);

  const STORE_PHONE = '+919655872121';
  const STORE_EMAIL = 'modernwalk206@gmail.com';
  const STORE_INSTA = 'https://instagram.com/modernwalk1';
  const STORE_ADDRESS_QUERY = encodeURIComponent(
    'Pillar no A1191, MODERN WALK MENS WEAR, Panasonic services center, 6-2-967, Chintal Basti Main Rd, Hyderabad, Telangana 500004'
  );
  const UPI_ID = '9483326024@ybl';

  const categories = [
    'All', 'T-Shirts', 'Shirts', 'Jeans', 'Trousers', 'Shorts', 
    'Jackets', 'Hoodies', 'Watches', 'Shoes', 'Innerwear', 
    'Belts', 'Sunglasses', 'Perfumes', 'Caps', 'Accessories'
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('https://menswear-backend-f2fo.onrender.com/api/products');
      const data = await res.json();
      if (Array.isArray(data)) setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };

  // Cart Handlers
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1, selectedSize: product.sizes?.[0] || 'M' }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  // GPS Live Location
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const mapsUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
        setLiveLocation({ lat: latitude, lng: longitude, url: mapsUrl });
        setGettingLocation(false);
      },
      (error) => {
        alert('Unable to retrieve location. Please check location permissions.');
        setGettingLocation(false);
      }
    );
  };

  // WhatsApp Order Submission
  const handleSendWhatsAppOrder = (itemToOrder = null) => {
    const item = itemToOrder || selectedProduct;
    if (!item || !customerName || !customerPhone) {
      alert('Please fill in your Name and Mobile Number!');
      return;
    }

    const size = selectedSize || item.selectedSize || 'Standard';
    const locationText = liveLocation ? `\n📍 Live Location: ${liveLocation.url}` : '';
    const addressText = deliveryAddress ? `\n🏠 Address: ${deliveryAddress}` : '';
    const paymentText = paymentMethod === 'ONLINE' ? `\n💳 Payment: Online UPI (Paid to ${UPI_ID})` : '\n💵 Payment: Cash on Delivery';

    const message = 
`*NEW ORDER REQUEST - MODERN WALK*
----------------------------------
*Product:* ${item.title}
*Size:* ${size}
*Price:* ₹${item.base_price || item.price}
----------------------------------
*Customer Details:*
👤 *Name:* ${customerName}
📞 *Phone:* ${customerPhone}${addressText}${locationText}${paymentText}
----------------------------------
Please confirm my order!`;

    const whatsappUrl = `https://wa.me/919655872121?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category?.toLowerCase() === selectedCategory.toLowerCase());

  const cartTotal = cart.reduce((sum, item) => sum + (item.base_price || item.price || 0) * item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col justify-between">
      <div>
        {/* Navigation Bar */}
        <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-lg font-black tracking-wider text-amber-400">
            MODERN WALK
          </Link>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition text-slate-200"
            >
              <ShoppingBag className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cart.reduce((a, b) => a + b.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Category Filter */}
        <nav className="bg-slate-900 border-b border-slate-800 px-4 py-3 overflow-x-auto flex items-center gap-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat 
                  ? 'bg-amber-400 text-slate-950' 
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </nav>

        {/* Product Grid */}
        <main className="max-w-6xl mx-auto p-4 sm:p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between group">
                <div className="relative aspect-square overflow-hidden bg-slate-800">
                  <img 
                    src={product.image_url || product.images?.[0] || 'https://via.placeholder.com/300'} 
                    alt={product.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">{product.brand || 'MODERN WALK'}</p>
                    <h3 className="text-xs font-bold text-slate-100 line-clamp-1">{product.title}</h3>
                    <p className="text-xs font-bold text-amber-400 mt-1">₹{product.base_price || product.price}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 pt-2">
                    <button 
                      onClick={() => addToCart(product)}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold py-1.5 rounded-lg transition"
                    >
                      + Cart
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedProduct(product);
                        setSelectedSize(product.sizes?.[0] || 'M');
                      }}
                      className="w-full bg-amber-400 hover:bg-amber-500 text-slate-950 text-[11px] font-bold py-1.5 rounded-lg transition"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-slate-900 h-full p-6 flex flex-col justify-between border-l border-slate-800 shadow-2xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h2 className="text-base font-bold flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-amber-400" /> Your Shopping Cart
                </h2>
                <button onClick={() => setIsCartOpen(false)} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cart.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-12">Your cart is empty.</p>
              ) : (
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="bg-slate-800 p-3 rounded-xl flex items-center justify-between gap-3 border border-slate-700">
                      <img src={item.image_url || item.images?.[0]} alt={item.title} className="w-12 h-12 object-cover rounded-lg" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-100 truncate">{item.title}</h4>
                        <p className="text-xs font-semibold text-amber-400">₹{item.base_price || item.price}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <button onClick={() => updateQuantity(item.id, -1)} className="px-2 py-0.5 bg-slate-700 text-slate-200 rounded text-xs">-</button>
                          <span className="text-xs font-bold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="px-2 py-0.5 bg-slate-700 text-slate-200 rounded text-xs">+</button>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-slate-800 pt-4 space-y-3">
                <div className="flex justify-between text-sm font-bold">
                  <span>Total Amount:</span>
                  <span className="text-amber-400">₹{cartTotal}</span>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setSelectedProduct(cart[0]); 
                  }}
                  className="w-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold py-3 rounded-xl text-xs transition"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-amber-400">Place Order via WhatsApp</h3>
              <button onClick={() => setSelectedProduct(null)} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Product Summary */}
            <div className="flex items-center gap-3 bg-slate-800 p-3 rounded-xl border border-slate-700">
              <img src={selectedProduct.image_url || selectedProduct.images?.[0]} alt="" className="w-12 h-12 object-cover rounded-lg" />
              <div>
                <h4 className="text-xs font-bold">{selectedProduct.title}</h4>
                <p className="text-xs font-bold text-amber-400">₹{selectedProduct.base_price || selectedProduct.price}</p>
              </div>
            </div>

            {/* Size Selector */}
            {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1.5">Select Size</label>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProduct.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-2.5 py-1 rounded-md text-xs font-bold transition ${
                        selectedSize === sz ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Payment Method Option */}
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1.5">Payment Method</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('COD')}
                  className={`py-2 rounded-xl text-xs font-bold border transition ${
                    paymentMethod === 'COD' ? 'bg-amber-400 text-slate-950 border-amber-400' : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  Cash on Delivery
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('ONLINE')}
                  className={`py-2 rounded-xl text-xs font-bold border transition ${
                    paymentMethod === 'ONLINE' ? 'bg-amber-400 text-slate-950 border-amber-400' : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  Online Payment
                </button>
              </div>
            </div>

            {/* UPI Info Box for Online Payment */}
            {paymentMethod === 'ONLINE' && (
              <div className="bg-amber-400/10 border border-amber-400/30 p-3 rounded-xl space-y-1">
                <p className="text-[11px] text-amber-300 font-semibold">Pay via UPI App (GPay/PhonePe/Paytm):</p>
                <div className="flex items-center justify-between bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                  <span className="text-xs font-mono font-bold text-amber-400">{UPI_ID}</span>
                  <a
                    href={`upi://pay?pa=${UPI_ID}&pn=MODERN%20WALK&cu=INR`}
                    className="text-[10px] bg-amber-400 text-slate-950 font-bold px-2 py-1 rounded flex items-center gap-1"
                  >
                    Pay Now <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}

            {/* Customer Details Form */}
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-300">Your Name *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300">Mobile Number *</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Enter mobile number"
                  className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300">Delivery Address</label>
                <textarea
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Street, Landmark, City, Pincode"
                  rows={2}
                  className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-amber-400"
                />
              </div>

              {/* Share Live Location */}
              <div>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={gettingLocation}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-semibold text-slate-300 flex items-center justify-center gap-2 transition"
                >
                  <Locate className="w-4 h-4 text-amber-400" />
                  {gettingLocation ? 'Fetching GPS Location...' : liveLocation ? 'Live Location Attached ✓' : 'Share Current Live Location'}
                </button>
              </div>
            </div>

            <button
              onClick={() => handleSendWhatsAppOrder()}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3 rounded-xl text-xs transition flex items-center justify-center gap-2"
            >
              Send Order to WhatsApp ({STORE_PHONE})
            </button>
          </div>
        </div>
      )}

      {/* Footer Contact Details */}
      <footer className="bg-slate-900 border-t border-slate-800 mt-12 py-8 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Store Info */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">MODERN WALK STORE</h3>
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${STORE_ADDRESS_QUERY}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2.5 text-xs text-slate-400 hover:text-amber-400 transition group"
            >
              <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5 group-hover:scale-110 transition" />
              <span>
                Pillar no A1191, MODERN WALK MENS WEAR, Panasonic services center, 6-2-967, Chintal Basti Main Rd, P & T Officers Colony, Veer Nagar, Lakdikapul, Hyderabad, Telangana 500004
              </span>
            </a>
          </div>

          {/* Connect With Us */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-200">Connect With Us</h3>
            <div className="space-y-2">
              <a 
                href={STORE_INSTA}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-xs text-slate-400 hover:text-pink-400 transition"
              >
                <Instagram className="w-4 h-4 text-pink-500" />
                <span>@modernwalk1</span>
              </a>

              <a 
                href={`mailto:${STORE_EMAIL}`}
                className="flex items-center gap-2.5 text-xs text-slate-400 hover:text-amber-400 transition"
              >
                <Mail className="w-4 h-4 text-amber-400" />
                <span>{STORE_EMAIL}</span>
              </a>

              <a 
                href={`tel:${STORE_PHONE}`}
                className="flex items-center gap-2.5 text-xs text-slate-400 hover:text-emerald-400 transition"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>{STORE_PHONE}</span>
              </a>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}