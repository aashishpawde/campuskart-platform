import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package,
  Sparkles,
  ArrowRight,
  Truck,
  ShieldCheck,
  Zap,
  BookOpen,
  Compass,
  Cpu,
  Coffee,
  Boxes,
  QrCode,
  Tag,
  CheckCircle2,
  BarChart3,
  Flame,
  Award,
  Star
} from 'lucide-react';
import { useAdminProducts } from '../context/AdminProductContext';
import { useCartWishlist } from '../context/CartWishlistContext';
import { ProductCard } from '../components/common/ProductCard';
import { formatCurrency } from '../utils/formatters';

export const HomePage = () => {
  const navigate = useNavigate();
  const { products } = useAdminProducts();
  const { addToCart } = useCartWishlist();
  const [copiedCode, setCopiedCode] = useState(false);

  // Bundle products for promo section
  const bundleKits = products.filter((p) => p.isBundle);
  
  // Trending products (mix of highest rated and high demand)
  const trendingProducts = products
    .filter((p) => !p.isBundle && p.published)
    .slice(0, 8);

  const categories = [
    {
      name: 'Stationery',
      icon: BookOpen,
      count: '20 Items',
      color: 'from-blue-500 to-indigo-600',
      bgLight: 'bg-blue-50',
      description: 'Notebooks, Record Sheets, Files & Pens',
    },
    {
      name: 'Academic Essentials',
      icon: Compass,
      count: '8 Items',
      color: 'from-amber-500 to-orange-600',
      bgLight: 'bg-amber-50',
      description: 'Drafters, Boards, Fx-991CW Calculator',
    },
    {
      name: 'Tech Accessories',
      icon: Cpu,
      count: '10 Items',
      color: 'from-cyan-500 to-blue-600',
      bgLight: 'bg-cyan-50',
      description: 'Fast Cables, Flash Drives, Hubs & Stands',
    },
    {
      name: 'Daily Consumables',
      icon: Coffee,
      count: '9 Items',
      color: 'from-emerald-500 to-teal-600',
      bgLight: 'bg-emerald-50',
      description: 'Energy Drinks, Sanitizers, Water Bottles',
    },
    {
      name: 'Bundles & Kits',
      icon: Boxes,
      count: '3 Kits',
      color: 'from-purple-500 to-pink-600',
      bgLight: 'bg-purple-50',
      description: 'Exam Kits, Project Kits, Starter Combos',
    },
  ];

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText('CAMPUS10');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-900 via-brand-800 to-slate-900 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        {/* Glow & Backdrop Shapes */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-10 w-72 h-72 bg-accent-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-brand-200">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span>Modern College of Engineering (MCOE) Campus Retail</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
              Everything a student needs.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-sky-200 to-accent-400">
                One place.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Skip the long walks to off-campus markets. Get engineering drafters, practical records, scientific calculators, cables, and daily hostel essentials delivered right to your campus gate in <strong>15 minutes</strong>.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/shop"
                className="px-6 py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
              >
                <span>Shop Academic Essentials</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/shop?category=Bundles+%26+Kits"
                className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 backdrop-blur-md flex items-center gap-2 transition-all"
              >
                <Boxes className="w-4 h-4 text-accent-400" />
                <span>Explore Bundle Kits (Save 20%)</span>
              </Link>
              <Link
                to="/analytics"
                className="px-5 py-3.5 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-emerald-400 font-bold text-xs sm:text-sm border border-emerald-500/30 flex items-center gap-1.5 transition-all"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Retail Analytics Hub &rarr;</span>
              </Link>
            </div>

            {/* Trust Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 text-center lg:text-left">
              <div>
                <p className="text-xl sm:text-2xl font-black text-white">15 Min</p>
                <p className="text-xs text-slate-400">Hostel Gate Drop</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-white">₹ en-IN</p>
                <p className="text-xs text-slate-400">Student-Budget Prices</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-white">5% Extra</p>
                <p className="text-xs text-slate-400">Instant UPI Discount</p>
              </div>
            </div>
          </div>

          {/* Hero Promo Card Right */}
          <div className="lg:col-span-5 relative">
            <div className="p-6 sm:p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl space-y-6 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="bg-accent-500 text-white font-extrabold text-xs uppercase px-3 py-1 rounded-full shadow-sm">
                  ⚡ Semester Bestseller
                </span>
                <span className="text-xs font-mono text-slate-300">Bundle S0001</span>
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-white">Academic Starter Kit</h3>
                <p className="text-xs text-slate-300 mt-1">
                  1st & 2nd Year Essential Combo: Mini Drafter + Sheet Container + Lab Coat + Register + Geometry Set.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/30 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 line-through">MRP ₹1,200</span>
                  <div className="text-2xl font-black text-yellow-400">₹999.00</div>
                </div>
                <button
                  onClick={() => {
                    const kit = products.find((p) => p.name === 'Academic Starter Kit');
                    if (kit) addToCart(kit, 1, 'M');
                    navigate('/cart');
                  }}
                  className="px-4 py-2.5 bg-accent-500 hover:bg-accent-600 text-white font-bold text-xs rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-1.5"
                >
                  <Boxes className="w-4 h-4" />
                  Quick Buy Kit
                </button>
              </div>

              {/* Verified Badge */}
              <div className="flex items-center gap-2 text-xs text-slate-300 bg-white/5 p-3 rounded-xl border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Verified university graphics syllabus standard & durable tools.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* UPI Offer & Coupon Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-accent-600 via-orange-500 to-amber-500 p-6 sm:p-8 text-white shadow-xl shadow-orange-500/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <QrCode className="w-6 h-6 text-yellow-200" />
              <span className="font-extrabold uppercase tracking-wider text-xs bg-white/20 px-2.5 py-0.5 rounded-full">
                Instant UPI Cashback
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black">
              Flat 5% Extra Off on All UPI Payments!
            </h3>
            <p className="text-xs sm:text-sm text-orange-100 max-w-xl">
              Pay using Google Pay, PhonePe, or Paytm at checkout. Combine with coupon code <strong className="text-white underline">CAMPUS10</strong> for a total of 15% student savings.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <div className="flex items-center bg-slate-900/90 text-white px-4 py-2.5 rounded-2xl border border-white/20 font-mono text-sm font-bold shadow-inner">
              <Tag className="w-4 h-4 text-accent-400 mr-2" />
              <span>CAMPUS10</span>
            </div>
            <button
              onClick={handleCopyCoupon}
              className="px-5 py-2.5 rounded-2xl bg-white text-accent-700 hover:bg-orange-50 font-bold text-xs shadow transition-all active:scale-95"
            >
              {copiedCode ? '✓ Code Copied!' : 'Copy 10% Code'}
            </button>
          </div>
        </div>
      </section>

      {/* Category Tiles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Explore Campus Categories
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Everything curated specifically for college syllabus and hostel life
            </p>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            View All Categories &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="group p-5 rounded-2xl border border-slate-200/80 bg-white hover:border-brand-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${cat.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-brand-600 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-tight">
                      {cat.description}
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-medium text-brand-600">{cat.count}</span>
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Promo Cards: Exam Kit, Project Kit, Academic Starter Kit */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 text-purple-700 rounded-xl">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Curated Student Kits & Combos
              </h2>
              <p className="text-xs text-slate-500">
                Pre-packaged survival kits with built-in bundle discounts
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full">
            Save Up to ₹200
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bundleKits.map((kit) => {
            const savings = kit.mrp - kit.price;
            return (
              <div
                key={kit.id}
                className="relative rounded-3xl border border-purple-200 bg-gradient-to-b from-white to-purple-50/40 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-purple-600 text-white font-extrabold text-[10px] uppercase tracking-wider">
                      Bundle Deal
                    </span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Save {formatCurrency(savings)}
                    </span>
                  </div>

                  <div className="aspect-video rounded-2xl overflow-hidden bg-slate-100 relative">
                    <img
                      src={kit.image}
                      alt={kit.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <div>
                    <h3 className="font-extrabold text-lg text-slate-900">{kit.name}</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {kit.description}
                    </p>
                  </div>

                  {/* Included Items Checklist */}
                  <div className="space-y-1.5 pt-2">
                    <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      What's Inside:
                    </p>
                    {kit.features?.slice(0, 4).map((f, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-purple-100 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs text-slate-400 line-through">
                      {formatCurrency(kit.mrp)}
                    </span>
                    <div className="text-xl font-black text-slate-900">
                      {formatCurrency(kit.price)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/product/${kit.id}`}
                      className="px-3 py-2 text-xs font-bold text-purple-700 bg-purple-100 hover:bg-purple-200 rounded-xl transition-colors"
                    >
                      Details
                    </Link>
                    <button
                      onClick={() => {
                        const defaultVar = kit.variants ? kit.variants[0] : null;
                        addToCart(kit, 1, defaultVar);
                        navigate('/cart');
                      }}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition-transform active:scale-95"
                    >
                      Buy Kit
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Trending Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-orange-100 text-accent-600 rounded-xl">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Trending on Campus
              </h2>
              <p className="text-xs text-slate-500">
                Most ordered practical supplies, electronics, and stationery this semester
              </p>
            </div>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold text-brand-600 hover:text-brand-700"
          >
            Explore Catalog &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Retail Analytics Hub Banner Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white relative overflow-hidden border border-slate-800 shadow-2xl">
          <div className="absolute right-0 bottom-0 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-bold">
                <BarChart3 className="w-4 h-4" />
                <span>E-Business & Retailing Activity 4 Module</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                Explore the Integrated Retail Analytics Hub
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Analyze student purchase patterns and class mall sales using <strong>Descriptive, Diagnostic, Predictive, and Prescriptive Analytics</strong>. Includes interactive Pivot Table Builder, Google Trends Market Validation, and regression forecasts.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <Link
                to="/analytics"
                className="px-6 py-3.5 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg text-center transition-all"
              >
                Open Analytics Dashboard &rarr;
              </Link>
              <Link
                to="/admin"
                className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm rounded-2xl border border-slate-700 text-center transition-all"
              >
                Admin Store Management
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
