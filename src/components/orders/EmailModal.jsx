import React from 'react';
import { X, Mail, CheckCircle2, Package, MapPin, Phone, ShieldCheck, Download, Printer } from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

export const EmailModal = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Email Client Header Bar */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <Mail className="w-4 h-4 text-brand-400" />
            <span className="font-mono text-slate-300">
              Inbox &bull; order-update@campuskart.mcoe.edu
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Email Body Container (Styled like a modern HTML email template) */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6 bg-slate-50/50">
          {/* Email Template Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            {/* CampusKart Branded Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold">
                  <Package className="w-4 h-4" />
                </div>
                <span className="text-lg font-black text-slate-900">
                  Campus<span className="text-brand-600">Kart</span>
                </span>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {formatDateTime(order.date)}
              </span>
            </div>

            {/* Email Headline */}
            <div className="space-y-2 text-center py-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Your order {order.id} has been confirmed.
              </h2>
              <p className="text-xs text-slate-600">
                Thank you for your trust. Our campus runner is preparing your delivery.
              </p>
            </div>

            {/* Order Highlights Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Order Number</span>
                <span className="font-mono font-bold text-slate-900">{order.id}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Payment Status</span>
                <span className="font-bold text-emerald-600">{order.paymentStatus}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Payment Method</span>
                <span className="font-bold text-slate-900 truncate block">
                  {order.paymentMethod}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Total Paid</span>
                <span className="font-mono font-bold text-slate-900">
                  {formatCurrency(order.total)}
                </span>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Items in this shipment:
              </h4>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white text-xs">
                {order.items.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{item.product.name}</p>
                        {item.variant && (
                          <p className="text-[11px] text-slate-500">Variant: {item.variant}</p>
                        )}
                        <p className="text-[11px] text-slate-400">
                          Qty: {item.quantity} &times; {formatCurrency(item.product.price)}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-slate-900">
                      {formatCurrency(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Summary */}
            <div className="border-t border-slate-100 pt-3 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono">{formatCurrency(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Student Code Discount</span>
                  <span className="font-mono">-{formatCurrency(order.discount)}</span>
                </div>
              )}
              {order.upiDiscount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>UPI Instant Discount (5%)</span>
                  <span className="font-mono">-{formatCurrency(order.upiDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Campus Delivery</span>
                <span className="font-mono text-emerald-600">FREE (₹0.00)</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Grand Total</span>
                <span className="font-mono">{formatCurrency(order.total)}</span>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200/80 text-xs text-slate-700 space-y-1">
              <p className="font-bold text-blue-900 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                Delivery Address:
              </p>
              <p className="text-slate-800 font-semibold">{order.customer?.fullName}</p>
              <p className="text-slate-600">{order.customer?.hostelOrAddress}</p>
              <p className="text-slate-500">
                {order.customer?.city}, Maharashtra - {order.customer?.pincode} &bull; Phone:{' '}
                {order.customer?.phone}
              </p>
            </div>

            {/* Support Footer in Email */}
            <div className="text-center pt-4 border-t border-slate-100 text-[11px] text-slate-400 space-y-1">
              <p>CampusKart Student Help Desk &bull; PES Modern College of Engineering, Pune</p>
              <p>Need help? Call our campus runner at +91 98765 43210</p>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">
            Simulated Student Email Notification Modal
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors"
          >
            Close Email View
          </button>
        </div>
      </div>
    </div>
  );
};
