import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Filter,
  RotateCcw,
  Sparkles,
  Package,
  Layers
} from 'lucide-react';
import { useAdminProducts } from '../context/AdminProductContext';
import { ProductCard } from '../components/common/ProductCard';
import { formatCurrency } from '../utils/formatters';

export const ShopPage = () => {
  const { products } = useAdminProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategory = searchParams.get('category') || 'All';
  const activeSearch = searchParams.get('search') || '';

  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'price-asc', 'price-desc', 'rating'
  const [priceRange, setPriceRange] = useState(1200);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const categories = [
    'All',
    'Stationery',
    'Academic Essentials',
    'Tech Accessories',
    'Daily Consumables',
    'Bundles & Kits',
  ];

  const handleCategoryClick = (cat) => {
    const params = new URLSearchParams(searchParams);
    if (cat === 'All') {
      params.delete('category');
    } else {
      params.set('category', cat);
    }
    setSearchParams(params);
  };

  const handleSearchChange = (val) => {
    const params = new URLSearchParams(searchParams);
    if (val.trim()) {
      params.set('search', val);
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  };

  const clearAllFilters = () => {
    setSearchParams({});
    setSortBy('featured');
    setPriceRange(1200);
    setOnlyInStock(false);
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => p.published)
      .filter((p) => {
        // Category filter
        if (activeCategory !== 'All' && p.category !== activeCategory) {
          return false;
        }
        // Search query
        if (activeSearch) {
          const q = activeSearch.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchCat = p.category.toLowerCase().includes(q);
          const matchDesc = p.description?.toLowerCase().includes(q);
          if (!matchName && !matchCat && !matchDesc) return false;
        }
        // Price filter
        if (p.price > priceRange) {
          return false;
        }
        // Stock filter
        if (onlyInStock && p.stock <= 0) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        return 0; // featured / default order
      });
  }, [products, activeCategory, activeSearch, sortBy, priceRange, onlyInStock]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-900 to-brand-700 rounded-3xl p-6 sm:p-10 text-white shadow-lg space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent-400">
          <Sparkles className="w-4 h-4" />
          <span>CampusKart Catalog</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Explore Campus Essentials & Academic Tools
        </h1>
        <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
          Search over 40+ syllabus-prescribed products with fast campus delivery and student discounts.
        </p>
      </div>

      {/* Top Controls: Search Bar & Sort Dropdown */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <input
            type="text"
            placeholder="Search by product name, drafter, calculator, files..."
            value={activeSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white text-slate-800"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium hidden sm:inline">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs cursor-pointer"
            >
              <option value="featured">Featured (Recommended)</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Shop Grid & Sidebar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Sidebar Filters */}
        <aside
          className={`md:col-span-3 space-y-6 ${
            mobileFilterOpen ? 'block' : 'hidden md:block'
          }`}
        >
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Filter className="w-4 h-4 text-brand-600" />
                Filters
              </h3>
              {(activeCategory !== 'All' || activeSearch || priceRange < 1200 || onlyInStock) && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-brand-600 hover:text-brand-800 font-semibold flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Categories
              </h4>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                      activeCategory === cat
                        ? 'bg-brand-50 text-brand-700 font-bold border border-brand-200 shadow-xs'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className="text-[10px] text-slate-400">
                      {cat === 'All'
                        ? products.length
                        : products.filter((p) => p.category === cat).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Max Price
                </h4>
                <span className="font-mono font-bold text-xs text-brand-700">
                  {formatCurrency(priceRange)}
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="1200"
                step="20"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-brand-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>₹30</span>
                <span>₹1,200</span>
              </div>
            </div>

            {/* Availability Checkbox */}
            <div className="pt-3 border-t border-slate-100">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
                />
                <span>In Stock Only</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="md:col-span-9 space-y-4">
          {/* Active Filter Badges & Count */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing <strong>{filteredProducts.length}</strong> products
            </span>
            {activeSearch && (
              <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                Searching for: "<strong>{activeSearch}</strong>"
              </span>
            )}
          </div>

          {/* Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <Package className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">No matching products found</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Try adjusting your search terms, changing the category filter, or resetting the price range.
                </p>
              </div>
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold shadow hover:bg-brand-700 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
