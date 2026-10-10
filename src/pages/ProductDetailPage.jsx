import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  Heart,
  ShoppingCart,
  Check,
  Truck,
  ShieldCheck,
  RotateCcw,
  Zap,
  Plus,
  Minus,
  CheckCircle2,
  AlertTriangle,
  Boxes,
  ArrowLeft
} from 'lucide-react';
import { useAdminProducts } from '../context/AdminProductContext';
import { useCartWishlist } from '../context/CartWishlistContext';
import { formatCurrency } from '../utils/formatters';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useAdminProducts();
  const { addToCart, toggleWishlist, isInWishlist } = useCartWishlist();

  const product = products.find((p) => p.id === id) || products[0];

  const [selectedVariant, setSelectedVariant] = useState(
    product?.variants ? product.variants[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);
  const [activeTab, setActiveTab] = useState('description'); // 'description', 'specs', 'reviews'

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Product not found</h2>
        <Link to="/shop" className="text-brand-600 font-bold text-sm underline">
          &larr; Return to Shop Catalog
        </Link>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);
  const discountPercent = product.mrp
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariant);
    navigate('/cart');
  };

  // Find frequently bought together companion items
  const frequentlyBought = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 2);

  const freqBundleTotal =
    product.price + frequentlyBought.reduce((s, i) => s + i.price, 0);
  const freqBundleDiscounted = Math.round(freqBundleTotal * 0.9); // 10% combo discount

  const handleAddBundleToCart = () => {
    addToCart(product, 1, selectedVariant);
    frequentlyBought.forEach((item) => {
      const v = item.variants ? item.variants[0] : null;
      addToCart(item, 1, v);
    });
    navigate('/cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-brand-600 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link
          to={`/shop?category=${encodeURIComponent(product.category)}`}
          className="hover:text-brand-600 transition-colors"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold truncate max-w-xs">
          {product.name}
        </span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Product Image Section */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-md">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-accent-500 text-white font-extrabold text-xs px-3 py-1 rounded-full shadow">
                {discountPercent}% OFF
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product)}
              className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md shadow-md transition-all ${
                isWishlisted
                  ? 'bg-rose-50 text-rose-600 border border-rose-200'
                  : 'bg-white/90 text-slate-600 hover:text-rose-600'
              }`}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-600' : ''}`} />
            </button>
          </div>

          {/* Quick Assurance Badges */}
          <div className="grid grid-cols-3 gap-3 text-center text-[11px] text-slate-600">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center gap-1">
              <Truck className="w-4 h-4 text-brand-600" />
              <span className="font-semibold text-slate-900">15-Min Delivery</span>
              <span className="text-[10px] text-slate-400">Hostel Desk Gate 2</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold text-slate-900">Genuine Gear</span>
              <span className="text-[10px] text-slate-400">MCOE Approved</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center gap-1">
              <RotateCcw className="w-4 h-4 text-purple-600" />
              <span className="font-semibold text-slate-900">48-Hr Exchange</span>
              <span className="text-[10px] text-slate-400">Easy Campus Swap</span>
            </div>
          </div>
        </div>

        {/* Product Buy Box & Details */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-brand-200">
                {product.category}
              </span>
              {product.isBundle && (
                <span className="bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-purple-200">
                  Curated Kit
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {product.name}
            </h1>

            {/* Rating Stars */}
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded-md">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating || '4.8'}</span>
              </div>
              <span className="text-slate-400">&bull;</span>
              <span className="text-slate-500 font-medium">
                {product.reviewsCount || 42} Student Ratings & Verified Reviews
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-slate-900">
                {formatCurrency(product.price)}
              </span>
              {product.mrp && product.mrp > product.price && (
                <span className="text-base text-slate-400 line-through">
                  MRP {formatCurrency(product.mrp)}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  Save {discountPercent}%
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Inclusive of all student subsidies & university cooperative pricing.
            </p>
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2 text-xs">
            {product.stock > 10 ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" /> In Stock on Campus ({product.stock} units)
              </span>
            ) : product.stock > 0 ? (
              <span className="text-amber-700 font-bold flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                <AlertTriangle className="w-3.5 h-3.5" /> Low Stock! Only {product.stock} units remaining
              </span>
            ) : (
              <span className="text-rose-700 font-bold bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                Out of Stock
              </span>
            )}
          </div>

          {/* Variant Selector (if product has variants like Water bottle colors, lab coat sizes) */}
          {product.variants && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">
                  Select {product.variantType || 'Option'}:
                </span>
                <span className="font-semibold text-brand-600">{selectedVariant}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <label
                    key={v}
                    className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                      selectedVariant === v
                        ? 'border-brand-600 bg-brand-50 text-brand-700 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="product-variant"
                      value={v}
                      checked={selectedVariant === v}
                      onChange={() => setSelectedVariant(v)}
                      className="sr-only"
                    />
                    <span>{v}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-900">Quantity:</span>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 hover:bg-slate-200 text-slate-600 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center text-xs font-bold font-mono">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock || 10, q + 1))}
                  className="p-2 hover:bg-slate-200 text-slate-600 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-xs text-slate-500">
                Subtotal: <strong>{formatCurrency(product.price * quantity)}</strong>
              </span>
            </div>
          </div>

          {/* Action Buttons: Add to Cart & Buy Now */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className={`flex-1 py-3.5 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                addedToast
                  ? 'bg-emerald-600 text-white'
                  : 'bg-brand-600 hover:bg-brand-700 text-white hover:shadow-brand-500/25 active:scale-95'
              }`}
            >
              {addedToast ? (
                <>
                  <Check className="w-4 h-4" /> Added to Cart!
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" /> Add to Cart
                </>
              )}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              className="flex-1 py-3.5 rounded-2xl bg-accent-500 hover:bg-accent-600 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Zap className="w-4 h-4" /> Buy Now
            </button>
          </div>

          {/* UPI Instant Discount Reminder */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Get flat <strong>5% extra discount</strong> automatically on checkout by selecting UPI payment!
            </span>
          </div>
        </div>
      </div>

      {/* Frequently Bought Together Widget */}
      {frequentlyBought.length > 0 && (
        <section className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Boxes className="w-5 h-5 text-brand-600" />
              <h3 className="text-lg font-extrabold text-slate-900">
                Frequently Bought Together
              </h3>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
              Save 10% on Combo
            </span>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Items List */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 w-64">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-14 h-14 object-cover rounded-xl shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{product.name}</p>
                  <p className="text-xs font-bold text-brand-600">
                    {formatCurrency(product.price)}
                  </p>
                </div>
              </div>

              {frequentlyBought.map((item) => (
                <React.Fragment key={item.id}>
                  <span className="text-xl font-bold text-slate-400">+</span>
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 w-64">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded-xl shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{item.name}</p>
                      <p className="text-xs font-bold text-brand-600">
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>

            {/* Total Price & Combo Button */}
            <div className="text-center lg:text-right space-y-2 shrink-0">
              <div className="flex items-baseline justify-center lg:justify-end gap-2">
                <span className="text-xs text-slate-400 line-through">
                  {formatCurrency(freqBundleTotal)}
                </span>
                <span className="text-2xl font-black text-slate-900">
                  {formatCurrency(freqBundleDiscounted)}
                </span>
              </div>
              <button
                onClick={handleAddBundleToCart}
                className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow transition-transform active:scale-95"
              >
                Add All 3 to Cart (Save ₹{freqBundleTotal - freqBundleDiscounted})
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Tabs: Description, Specs, Reviews */}
      <section className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50/50">
          <button
            onClick={() => setActiveTab('description')}
            className={`px-6 py-3.5 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'description'
                ? 'border-brand-600 text-brand-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Description & Usage
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`px-6 py-3.5 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'specs'
                ? 'border-brand-600 text-brand-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Technical Specifications
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-3.5 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'reviews'
                ? 'border-brand-600 text-brand-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Student Reviews ({product.reviewsCount || 34})
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {activeTab === 'description' && (
            <div className="space-y-4 max-w-3xl">
              <p className="text-sm text-slate-700 leading-relaxed">{product.description}</p>
              {product.features && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Key Highlights:
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                    {product.features.map((f, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="space-y-3 max-w-2xl text-xs">
              <div className="grid grid-cols-2 py-2 border-b border-slate-100">
                <span className="text-slate-500">Category</span>
                <span className="font-semibold text-slate-900">{product.category}</span>
              </div>
              <div className="grid grid-cols-2 py-2 border-b border-slate-100">
                <span className="text-slate-500">Campus Delivery Speed</span>
                <span className="font-semibold text-slate-900">15-20 Minutes</span>
              </div>
              <div className="grid grid-cols-2 py-2 border-b border-slate-100">
                <span className="text-slate-500">Quality Standard</span>
                <span className="font-semibold text-slate-900">MCOE Syllabus Grade</span>
              </div>
              <div className="grid grid-cols-2 py-2 border-b border-slate-100">
                <span className="text-slate-500">Return Policy</span>
                <span className="font-semibold text-slate-900">48 Hours Free Exchange</span>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6 max-w-3xl">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
                <div className="text-center">
                  <div className="text-3xl font-black text-amber-600">{product.rating || '4.8'}</div>
                  <div className="flex text-amber-400 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <div className="text-xs text-slate-600">
                  <p className="font-bold text-slate-900">98% Recommended by MCOE Students</p>
                  <p className="text-[11px] text-slate-500">
                    Based on verified hostel campus deliveries across Computer, Mechanical, Civil & ENTC branches.
                  </p>
                </div>
              </div>

              {/* Sample Reviews */}
              <div className="space-y-4 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Rohan K. (2nd Year ENTC)</span>
                    <span className="text-[11px] text-slate-400">2 days ago</span>
                  </div>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-600">
                    Delivered right to Hostel Gate in 12 mins when I urgently needed it before the submission deadline! Genuine quality.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Pooja S. (1st Year Civil)</span>
                    <span className="text-[11px] text-slate-400">1 week ago</span>
                  </div>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-600">
                    Much cheaper than the stationery shops outside campus and the UPI 5% cashback makes it even better.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
