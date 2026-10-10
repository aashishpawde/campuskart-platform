import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Trash2,
  Bookmark,
  Plus,
  Minus,
  ArrowRight,
  Tag,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Truck,
  RotateCcw,
  Sparkles,
  QrCode
} from 'lucide-react';
import { useCartWishlist } from '../context/CartWishlistContext';
import { formatCurrency } from '../utils/formatters';

export const CartPage = () => {
  const navigate = useNavigate();
  const {
    cart,
    savedForLater,
    totalItemsCount,
    subtotal,
    couponCode,
    couponDiscountPercent,
    couponDiscountAmount,
    deliveryFee,
    finalTotal,
    couponMessage,
    updateQuantity,
    removeFromCart,
    moveToSavedLater,
    moveToCartFromSaved,
    removeSavedItem,
    applyCoupon,
    removeCoupon,
  } = useCartWishlist();

  const [inputCoupon, setInputCoupon] = useState('');

  const handleApplyCouponSubmit = (e) => {
    e.preventDefault();
    if (inputCoupon.trim()) {
      applyCoupon(inputCoupon);
      setInputCoupon('');
    }
  };

  if (cart.length === 0 && savedForLater.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <ShoppingCart className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900">Your Campus Cart is Empty</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You don't have any stationery or academic gear in your bag yet. Check out our curated kits or browse the store!
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/shop"
            className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow transition-all"
          >
            Explore Campus Store &rarr;
          </Link>
          <Link
            to="/shop?category=Bundles+%26+Kits"
            className="px-6 py-3 bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold text-xs sm:text-sm rounded-xl transition-all"
          >
            View Exam & Project Kits
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {totalItemsCount} item{totalItemsCount !== 1 ? 's' : ''} in your student basket
          </p>
        </div>
        <Link
          to="/shop"
          className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
        >
          &larr; Continue Shopping
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Cart Items List */}
        <div className="lg:col-span-8 space-y-6">
          {cart.length > 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm divide-y divide-slate-100 overflow-hidden">
              {cart.map((item, idx) => (
                <div
                  key={`${item.product.id}-${item.variant || 'default'}-${idx}`}
                  className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                >
                  {/* Thumbnail & Product Details */}
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-200 bg-slate-100 shrink-0"
                    />
                    <div className="min-w-0 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600">
                        {item.product.category}
                      </span>
                      <Link
                        to={`/product/${item.product.id}`}
                        className="font-bold text-slate-900 text-sm hover:text-brand-600 transition-colors block truncate"
                      >
                        {item.product.name}
                      </Link>
                      {item.variant && (
                        <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-700 text-[11px] font-semibold rounded-md border border-slate-200">
                          {item.product.variantType || 'Option'}: {item.variant}
                        </span>
                      )}
                      <div className="text-xs text-slate-500 font-medium">
                        Unit Price: <strong>{formatCurrency(item.product.price)}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-base font-black text-slate-900 block">
                        {formatCurrency(item.product.price * item.quantity)}
                      </span>
                    </div>

                    {/* Qty Selector */}
                    <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.product.id, item.variant, item.quantity - 1)
                        }
                        className="p-1.5 hover:bg-slate-200 text-slate-600 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold font-mono">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.product.id, item.variant, item.quantity + 1)
                        }
                        className="p-1.5 hover:bg-slate-200 text-slate-600 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Action Links */}
                    <div className="flex items-center gap-3 text-[11px] font-semibold">
                      <button
                        onClick={() => moveToSavedLater(item.product.id, item.variant)}
                        className="text-slate-500 hover:text-brand-600 flex items-center gap-1"
                      >
                        <Bookmark className="w-3 h-3" /> Save for later
                      </button>
                      <button
                        onClick={() => removeFromCart(item.product.id, item.variant)}
                        className="text-rose-500 hover:text-rose-700 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center text-xs text-slate-500">
              Your active cart is empty. Move items from Saved for Later below or continue shopping.
            </div>
          )}

          {/* Saved For Later Section */}
          {savedForLater.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-brand-600" />
                Saved For Later ({savedForLater.length})
              </h3>
              <div className="divide-y divide-slate-100">
                {savedForLater.map((savedItem, idx) => (
                  <div
                    key={idx}
                    className="py-3 flex items-center justify-between gap-4 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={savedItem.product.image}
                        alt={savedItem.product.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0 truncate">
                        <p className="font-bold text-slate-900 truncate">
                          {savedItem.product.name}
                        </p>
                        <p className="text-slate-500 font-mono">
                          {formatCurrency(savedItem.product.price)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() =>
                          moveToCartFromSaved(savedItem.product.id, savedItem.variant)
                        }
                        className="px-3 py-1.5 bg-brand-50 text-brand-700 hover:bg-brand-100 font-bold rounded-lg transition-colors text-xs"
                      >
                        Move to Cart
                      </button>
                      <button
                        onClick={() =>
                          removeSavedItem(savedItem.product.id, savedItem.variant)
                        }
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Box Right */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-6">
            <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3">
              Order Summary
            </h3>

            {/* Discount Code Input */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-brand-600" />
                Student Promo Code
              </span>

              {couponDiscountPercent > 0 ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="font-mono font-bold text-emerald-800">
                      {couponCode} (10% OFF)
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-slate-400 hover:text-rose-600 font-bold text-[11px]"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCouponSubmit} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter CAMPUS10"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 uppercase"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}

              {couponMessage && (
                <p
                  className={`text-[11px] font-medium ${
                    couponMessage.type === 'success'
                      ? 'text-emerald-600'
                      : couponMessage.type === 'error'
                      ? 'text-rose-600'
                      : 'text-slate-500'
                  }`}
                >
                  {couponMessage.text}
                </p>
              )}
            </div>

            {/* Financial Breakdown */}
            <div className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-4">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-mono font-semibold text-slate-900">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              {couponDiscountPercent > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Student Discount (CAMPUS10 - 10%)</span>
                  <span className="font-mono font-bold">
                    -{formatCurrency(couponDiscountAmount)}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="flex items-center gap-1 text-slate-600">
                  Campus Hostel Delivery
                </span>
                <span className="font-mono font-bold text-emerald-600">FREE (₹0.00)</span>
              </div>

              {/* UPI Extra Savings Notice */}
              <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-800 flex items-start gap-2">
                <QrCode className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  Select <strong>UPI Payment</strong> on checkout step 3 for an additional <strong>5% instant discount</strong>!
                </span>
              </div>

              <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline text-slate-900">
                <span className="font-bold text-sm">Estimated Total</span>
                <div className="text-right">
                  <span className="font-black text-xl text-slate-900 font-mono">
                    {formatCurrency(finalTotal)}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    (Before step 3 payment discounts)
                  </span>
                </div>
              </div>
            </div>

            {/* Proceed Button */}
            <button
              onClick={() => navigate('/checkout')}
              disabled={cart.length === 0}
              className={`w-full py-3.5 rounded-2xl font-bold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition-all ${
                cart.length === 0
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/25 active:scale-95'
              }`}
            >
              <span>Proceed to 3-Step Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
