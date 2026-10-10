import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { useCartWishlist } from '../context/CartWishlistContext';
import { formatCurrency } from '../utils/formatters';

export const WishlistPage = () => {
  const { wishlist, toggleWishlist, addToCart } = useCartWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <Heart className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900">Your Wishlist is Empty</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Save stationery, calculators, and exam kits by clicking the heart icon on any product.
          </p>
        </div>
        <Link
          to="/shop"
          className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow inline-flex items-center gap-2"
        >
          <span>Explore Campus Store</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My Saved Wishlist
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved for later
          </p>
        </div>
        <Link
          to="/shop"
          className="text-xs font-bold text-brand-600 hover:text-brand-700"
        >
          &larr; Back to Shop
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-2 right-2 p-1.5 bg-white/90 text-rose-600 rounded-full shadow hover:bg-white"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-brand-600">
                  {product.category}
                </span>
                <Link
                  to={`/product/${product.id}`}
                  className="font-bold text-sm text-slate-900 hover:text-brand-600 block line-clamp-2"
                >
                  {product.name}
                </Link>
                <span className="text-base font-black text-slate-900 block mt-1">
                  {formatCurrency(product.price)}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                const v = product.variants ? product.variants[0] : null;
                addToCart(product, 1, v);
                toggleWishlist(product);
              }}
              className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Move to Cart</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
