import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  FileText,
  Mail,
  Truck,
  RotateCcw,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { useCartWishlist } from '../context/CartWishlistContext';
import { InvoiceModal } from '../components/orders/InvoiceModal';
import { EmailModal } from '../components/orders/EmailModal';
import { formatCurrency, formatDateTime } from '../utils/formatters';

export const MyOrdersPage = () => {
  const { orders } = useOrders();
  const { addToCart } = useCartWishlist();
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState(null);
  const [selectedOrderForEmail, setSelectedOrderForEmail] = useState(null);

  const handleReorder = (order) => {
    order.items.forEach((item) => {
      addToCart(item.product, item.quantity, item.variant);
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My Orders & Invoices
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track your campus essentials deliveries and download official tax invoices
          </p>
        </div>
        <Link
          to="/shop"
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5"
        >
          <span>Shop More</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No past orders found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven't placed any orders yet. Start by browsing our catalog or bundle kits.
          </p>
          <Link
            to="/shop"
            className="px-5 py-2.5 bg-brand-600 text-white text-xs font-bold rounded-xl inline-block"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const isDelivered = order.orderStatus === 'Delivered';
            const isPaid = order.paymentStatus === 'PAID';
            const isFailed = order.paymentStatus === 'FAILED';

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 hover:border-slate-300 transition-all"
              >
                {/* Order Top Summary Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-brand-50 text-brand-700 border border-brand-200">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-sm text-slate-900">
                          {order.id}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            isDelivered
                              ? 'bg-emerald-100 text-emerald-800'
                              : isFailed
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {order.orderStatus || order.paymentStatus}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Placed on {formatDateTime(order.date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase block">Total</span>
                      <span className="font-mono font-black text-base text-slate-900">
                        {formatCurrency(order.total)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedOrderForEmail(order)}
                        className="p-2 text-slate-600 hover:text-brand-600 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
                        title="Simulate Confirmation Email"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setSelectedOrderForInvoice(order)}
                        className="px-3 py-2 bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-xs rounded-xl border border-brand-200 transition-colors flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Tax Invoice</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div className="divide-y divide-slate-100 text-xs">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate">
                            {item.product.name}
                          </p>
                          {item.variant && (
                            <p className="text-[11px] text-slate-500">
                              Option: {item.variant}
                            </p>
                          )}
                          <p className="text-[11px] text-slate-400">
                            Qty: {item.quantity} &times; {formatCurrency(item.product.price)}
                          </p>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-slate-900 shrink-0">
                        {formatCurrency(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer status & re-order */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-brand-600" />
                    <span>
                      Delivered to: <strong>{order.customer?.hostelOrAddress}</strong>
                    </span>
                  </div>

                  <Link
                    to="/cart"
                    onClick={() => handleReorder(order)}
                    className="text-xs font-bold text-brand-600 hover:text-brand-800 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reorder Items
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Invoices & Email Modals */}
      <InvoiceModal
        order={selectedOrderForInvoice}
        isOpen={!!selectedOrderForInvoice}
        onClose={() => setSelectedOrderForInvoice(null)}
      />
      <EmailModal
        order={selectedOrderForEmail}
        isOpen={!!selectedOrderForEmail}
        onClose={() => setSelectedOrderForEmail(null)}
      />
    </div>
  );
};
