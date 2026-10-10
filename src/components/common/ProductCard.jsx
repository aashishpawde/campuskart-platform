import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Check, AlertTriangle, Eye } from 'lucide-react';
import { useCartWishlist } from '../../context/CartWishlistContext';
import { formatCurrency } from '../../utils/formatters';

export const ProductCard = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCartWishlist();
  const [addedAnimation, setAddedAnimation] = useState(false);

  const isWishlisted = isInWishlist(product.id);
  const discountPercent = product.mrp
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultVariant = product.variants ? product.variants[0] : null;
    addToCart(product, 1, defaultVariant);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1400);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const isLowStock = product.stock > 0 && product.stock <= 10;
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-brand-300 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Product Image Container */}
      <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-2.5 left-2.5 bg-accent-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            {discountPercent}% OFF
          </div>
        )}

        {/* Bundle Tag */}
        {product.isBundle && (
          <div className="absolute bottom-2.5 left-2.5 bg-brand-700 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded shadow-sm">
            Bundle Kit
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all shadow-sm ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 border border-rose-200'
              : 'bg-white/80 text-slate-600 hover:text-rose-600 hover:bg-white'
          }`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Low Stock Banner */}
        {isLowStock && (
          <div className="absolute bottom-0 inset-x-0 bg-amber-500/90 text-white text-[10px] font-bold text-center py-0.5 flex items-center justify-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Only {product.stock} units left!
          </div>
        )}
      </Link>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between gap-2 text-xs mb-1.5">
            <span className="text-brand-600 font-semibold text-[11px] uppercase tracking-wider">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold text-xs bg-amber-50 px-1.5 py-0.5 rounded">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating || '4.8'}</span>
              <span className="text-slate-400 text-[10px] font-normal">
                ({product.reviewsCount || 24})
              </span>
            </div>
          </div>

          {/* Product Title */}
          <Link
            to={`/product/${product.id}`}
            className="block font-bold text-slate-900 text-sm hover:text-brand-600 transition-colors line-clamp-2 leading-snug"
          >
            {product.name}
          </Link>

          {/* Variants info pill */}
          {product.variants && (
            <div className="mt-1.5 flex items-center gap-1 text-[11px] text-slate-500">
              <span className="font-medium">Variants:</span>
              <div className="flex items-center gap-1">
                {product.variants.slice(0, 4).map((v) => (
                  <span
                    key={v}
                    className="px-1.5 py-0.2 bg-slate-100 border border-slate-200 rounded text-[10px] text-slate-700"
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Price & Action Button */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-slate-900">
                {formatCurrency(product.price)}
              </span>
              {product.mrp && product.mrp > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  {formatCurrency(product.mrp)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-600 font-medium block">
              Free campus drop
            </span>
          </div>

          {/* Add to Cart button */}
          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
              addedAnimation
                ? 'bg-emerald-600 text-white scale-95'
                : isOutOfStock
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-brand-600 hover:bg-brand-700 text-white hover:shadow-brand-500/20 active:scale-95'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-3.5 h-3.5" /> Added
              </>
            ) : isOutOfStock ? (
              'Sold Out'
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
