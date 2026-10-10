import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingCart,
  Heart,
  Search,
  Phone,
  BarChart3,
  ShieldCheck,
  Package,
  Layers,
  Sparkles,
  Menu,
  X,
  User,
  GraduationCap
} from 'lucide-react';
import { useCartWishlist } from '../../context/CartWishlistContext';
import { useAdminProducts } from '../../context/AdminProductContext';

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItemsCount, wishlist } = useCartWishlist();
  const { isAdminLoggedIn } = useAdminProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop All', path: '/shop' },
    { name: 'Kits & Bundles', path: '/shop?category=Bundles+%26+Kits' },
    { name: 'My Orders', path: '/orders' },
    { name: 'Analytics Hub', path: '/analytics', badge: 'Activity 4' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      {/* Top Campus Announcement Bar */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-700 to-brand-800 text-white text-xs sm:text-sm py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-accent-500 text-white font-bold px-2 py-0.5 rounded text-[11px] uppercase tracking-wider animate-pulse">
              Campus Offer
            </span>
            <span className="font-medium hidden sm:inline">
              Use code <strong className="text-yellow-300 font-mono">CAMPUS10</strong> for 10% off + Flat 5% extra on UPI!
            </span>
            <span className="font-medium sm:hidden">
              Use code <strong className="text-yellow-300 font-mono">CAMPUS10</strong>
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-200 text-xs">
            <span className="flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-accent-400" />
              MCOE Pune Campus Desk
            </span>
            <span className="hidden md:flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-accent-400" />
              +91 98765 43210
            </span>
            <Link
              to="/contact"
              className="hover:text-white transition-colors underline decoration-slate-400"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Campus<span className="text-brand-600">Kart</span>
                </span>
                <span className="bg-brand-100 text-brand-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  MCOE
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide">
                Smart Student Retail & Hub
              </p>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-md relative mx-4"
          >
            <input
              type="text"
              placeholder="Search drafter, notebooks, calculator, lab coat, cables..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-24 py-2 text-sm bg-slate-100 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <button
              type="submit"
              className="absolute right-1.5 top-1 bottom-1 px-3 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-full transition-colors flex items-center gap-1"
            >
              Search
            </button>
          </form>

          {/* Nav & Action Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Analytics Hub Shortcut Link */}
            <Link
              to="/analytics"
              className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                location.pathname === '/analytics'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-brand-50 text-brand-700 hover:bg-brand-100 border border-brand-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Retail Analytics Hub
              <span className="bg-accent-500 text-white text-[9px] px-1.5 py-0.2 rounded-full uppercase">
                Activity 4
              </span>
            </Link>

            {/* Admin Badge/Link */}
            <Link
              to="/admin"
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                isAdminLoggedIn
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              title="Admin Portal (admin / admin123)"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
              <span className="hidden sm:inline">Admin</span>
            </Link>

            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="relative p-2 text-slate-700 hover:text-brand-600 hover:bg-slate-100 rounded-full transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-3.5 py-2 rounded-full font-semibold text-xs sm:text-sm shadow-sm hover:shadow transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              <span className="bg-white text-brand-600 text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {totalItemsCount}
              </span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="md:hidden mt-3 relative"
        >
          <input
            type="text"
            placeholder="Search campus supplies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-20 py-2 text-sm bg-slate-100 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <button
            type="submit"
            className="absolute right-1 top-1 bottom-1 px-3 bg-brand-600 text-white text-xs font-medium rounded-full"
          >
            Go
          </button>
        </form>
      </div>

      {/* Desktop Secondary Navigation Links */}
      <nav className="hidden md:block bg-slate-50 border-t border-slate-200/60 py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-medium text-slate-600">
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`transition-colors py-1 flex items-center gap-1.5 ${
                  location.pathname === link.path
                    ? 'text-brand-600 font-bold border-b-2 border-brand-600'
                    : 'hover:text-brand-600'
                }`}
              >
                {link.name}
                {link.badge && (
                  <span className="bg-brand-100 text-brand-700 text-[9px] px-1 rounded font-bold">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Fast 15-Min Hostel Gate Delivery Active
            </span>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-semibold ${
                  location.pathname === link.path
                    ? 'bg-brand-50 text-brand-600'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="bg-brand-600 text-white text-[10px] px-2 py-0.5 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
          <div className="pt-3 border-t border-slate-200 space-y-2">
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg"
            >
              Contact Support (+91 98765 43210)
            </Link>
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm text-brand-600 font-semibold bg-brand-50 rounded-lg"
            >
              Admin Dashboard (Login: admin / admin123)
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
