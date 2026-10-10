import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  XCircle,
  FileText,
  Mail,
  Truck,
  MapPin,
  Package,
  Calendar,
  CreditCard,
  ArrowRight,
  Printer,
  Sparkles
} from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { InvoiceModal } from '../components/orders/InvoiceModal';
import { EmailModal } from '../components/orders/EmailModal';
import { formatCurrency, formatDateTime } from '../utils/formatters';

export const OrderConfirmationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getOrderById, orders } = useOrders();

  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  const order = getOrderById(id) || orders[0];

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Order not found</h2>
        <Link to="/orders" className="text-brand-600 font-bold underline text-sm">
          View All Past Orders
        </Link>
      </div>
    );
  }

  const isFailed = order.paymentStatus === 'FAILED';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Celebration Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 text-center space-y-4 shadow-sm relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-24 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none"></div>

        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
            isFailed
              ? 'bg-rose-100 text-rose-600'
              : 'bg-emerald-100 text-emerald-600 shadow-lg shadow-emerald-500/20 animate-bounce'
          }`}
        >
          {isFailed ? <XCircle className="w-10 h-10" /> : <CheckCircle2 className="w-10 h-10" />}
        </div>

        <div>
          <span className="text-xs font-mono font-bold text-brand-600 uppercase tracking-wider">
            Order Reference #{order.id}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
            {isFailed ? 'Payment Failed' : 'Thank you for your order! 🎉'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1.5">
            {isFailed
              ? 'Your simulated sandbox card transaction was declined. You can retry with UPI or COD.'
              : 'Your order has been placed successfully and dispatched for campus delivery.'}
          </p>
        </div>

        {/* Payment Processed Banner */}
        <div
          className={`p-4 rounded-2xl flex items-center justify-between text-xs font-semibold ${
            isFailed
              ? 'bg-rose-50 text-rose-800 border border-rose-200'
              : 'bg-emerald-50 text-emerald-900 border border-emerald-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {isFailed ? (
              <XCircle className="w-4 h-4 text-rose-600" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            )}
            <span>
              {isFailed
                ? 'Payment Transaction Failed'
                : 'Your payment has been processed successfully!'}
            </span>
          </div>
          <span className="font-mono text-[11px] text-slate-500 hidden sm:inline">
            Txn: {order.transactionId || 'UPI-782910472'}
          </span>
        </div>

        {/* Action Buttons: Invoice & Email */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setShowEmailModal(true)}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow transition-all flex items-center gap-2"
          >
            <Mail className="w-4 h-4 text-brand-400" />
            <span>Simulate Confirmation Email</span>
          </button>
          <button
            onClick={() => setShowInvoiceModal(true)}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow transition-all flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>View & Download Tax Invoice (Bill)</span>
          </button>
        </div>
      </div>

      {/* Itemised Order Summary Details */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <Package className="w-4 h-4 text-brand-600" />
            Itemised Summary
          </h3>
          <span className="font-mono text-xs text-slate-500">
            {formatDateTime(order.date)}
          </span>
        </div>

        {/* Items List */}
        <div className="divide-y divide-slate-100 text-xs">
          {order.items?.map((item, idx) => (
            <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div className="min-w-0 space-y-0.5">
                  <p className="font-bold text-slate-900 truncate">{item.product.name}</p>
                  {item.variant && (
                    <p className="text-[11px] text-slate-500">Option: {item.variant}</p>
                  )}
                  <p className="text-[11px] text-slate-400">
                    Qty: {item.quantity} &times; {formatCurrency(item.product.price)}
                  </p>
                </div>
              </div>
              <div className="font-bold font-mono text-slate-900 text-sm shrink-0">
                {formatCurrency(item.product.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Subtotals */}
        <div className="border-t border-slate-100 pt-4 space-y-2 text-xs text-slate-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-mono">{formatCurrency(order.subtotal)}</span>
          </div>

          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-600">
              <span>Student Promo Discount</span>
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
            <span className="font-mono text-emerald-600 font-bold">FREE (₹0.00)</span>
          </div>

          <div className="flex justify-between text-base font-black text-slate-900 border-t border-slate-200 pt-2.5">
            <span>Total Paid</span>
            <span className="font-mono">{formatCurrency(order.total)}</span>
          </div>
        </div>

        {/* Addresses & Payment Method Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">
              Delivery Address:
            </span>
            <p className="font-bold text-slate-900">{order.customer?.fullName}</p>
            <p className="text-slate-600">{order.customer?.hostelOrAddress}</p>
            <p className="text-slate-500">
              {order.customer?.city}, {order.customer?.pincode} &bull; {order.customer?.phone}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">
              Payment Information:
            </span>
            <p className="font-bold text-slate-900">{order.paymentMethodDisplay || order.paymentMethod}</p>
            <p className="text-emerald-700 font-semibold">Payment Status: {order.paymentStatus}</p>
            <p className="text-slate-500 font-mono text-[11px]">
              Ref: {order.transactionId || 'UPI-782910472'}
            </p>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-slate-100 text-xs">
          <Link
            to="/orders"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-colors"
          >
            View All My Orders
          </Link>
          <Link
            to="/shop"
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Modals */}
      <InvoiceModal
        order={order}
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
      />
      <EmailModal
        order={order}
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
      />
    </div>
  );
};
