import React from 'react';
import { X, Printer, Download, Package, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const InvoiceModal = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[94vh] flex flex-col overflow-hidden">
        {/* Modal Top Control Bar (Hidden during print) */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-400" />
            <span className="font-bold text-sm">Tax Invoice / Bill — {order.id}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Download PDF / Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Tax Invoice Document */}
        <div id="printable-invoice" className="p-8 sm:p-10 overflow-y-auto flex-1 space-y-8 bg-white text-slate-900 font-sans">
          {/* Invoice Header: Company details & Invoice details */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b-2 border-slate-900 pb-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-black text-sm">
                  CK
                </div>
                <span className="text-2xl font-black tracking-tight text-slate-900">
                  Campus<span className="text-brand-600">Kart</span>
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Modern Education Society's College Store Co-operative
              </p>
              <p className="text-xs text-slate-500">
                PES Modern College of Engineering (MCOE)
                <br />
                1186/A, Off J.M. Road, Shivajinagar, Pune - 411005
                <br />
                GSTIN: 27AABCM4920F1Z4 &bull; Reg: MH-PUN-STU-2026
              </p>
            </div>

            <div className="sm:text-right space-y-1">
              <span className="text-xl font-black text-slate-900 uppercase tracking-wide block">
                TAX INVOICE
              </span>
              <div className="text-xs space-y-0.5 text-slate-600">
                <p>
                  <strong>Invoice No:</strong>{' '}
                  <span className="font-mono text-slate-900 font-bold">{order.id}</span>
                </p>
                <p>
                  <strong>Date:</strong> {order.invoiceDate || formatDate(order.date)}
                </p>
                <p>
                  <strong>Payment Terms:</strong> Immediate Payment
                </p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span className="text-emerald-700 font-bold">{order.paymentStatus}</span>
                </p>
                <p>
                  <strong>Txn ID:</strong>{' '}
                  <span className="font-mono text-[11px] text-slate-700">
                    {order.transactionId || 'UPI-782910472'}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Invoicing and Shipping Address Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            {/* Invoicing Address */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">
                Invoicing Address:
              </span>
              <p className="font-bold text-sm text-slate-900">{order.customer?.fullName}</p>
              <p className="text-slate-600">{order.customer?.email}</p>
              <p className="text-slate-600">{order.customer?.phone}</p>
              <p className="text-slate-600">{order.customer?.college}</p>
            </div>

            {/* Shipping Address */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">
                Shipping Address (Campus Drop):
              </span>
              <p className="font-bold text-sm text-slate-900">{order.customer?.fullName}</p>
              <p className="text-slate-600">{order.customer?.hostelOrAddress}</p>
              <p className="text-slate-600">
                {order.customer?.city}, Maharashtra - {order.customer?.pincode}
              </p>
              {order.customer?.deliveryNotes && (
                <p className="text-[11px] text-slate-500 italic">
                  Note: {order.customer.deliveryNotes}
                </p>
              )}
            </div>
          </div>

          {/* Line Items Table */}
          <div className="space-y-2">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-y-2 border-slate-900 bg-slate-100/80 text-slate-900 font-bold uppercase text-[11px]">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Description & Variant</th>
                  <th className="py-2.5 px-3 text-center">HSN Code</th>
                  <th className="py-2.5 px-3 text-right">Unit Price</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-3 px-3 text-slate-500">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-900">{item.product.name}</p>
                      {item.variant && (
                        <p className="text-[10px] text-slate-500">Option: {item.variant}</p>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-slate-500">
                      {item.product.hsn || '48201090'}
                    </td>
                    <td className="py-3 px-3 text-right font-mono">
                      {formatCurrency(item.product.price)}
                    </td>
                    <td className="py-3 px-3 text-center font-bold font-mono">
                      {item.quantity}
                    </td>
                    <td className="py-3 px-3 text-right font-bold font-mono text-slate-900">
                      {formatCurrency(item.product.price * item.quantity)}
                    </td>
                  </tr>
                ))}

                {/* Delivery Charge Line (Explicitly ₹0 as required) */}
                <tr className="bg-slate-50/50">
                  <td className="py-2 px-3 text-slate-400">&bull;</td>
                  <td className="py-2 px-3 text-slate-700 font-medium">
                    Campus Hostel Gate Delivery Charge
                  </td>
                  <td className="py-2 px-3 text-center font-mono text-slate-400">996812</td>
                  <td className="py-2 px-3 text-right font-mono">₹0.00</td>
                  <td className="py-2 px-3 text-center font-mono">1</td>
                  <td className="py-2 px-3 text-right font-mono text-emerald-600 font-bold">
                    ₹0.00
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals & Tax Calculation Breakdown */}
          <div className="flex justify-end pt-2">
            <div className="w-full sm:w-72 space-y-2 text-xs border-t border-slate-300 pt-3">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono font-semibold text-slate-900">
                  {formatCurrency(order.subtotal)}
                </span>
              </div>

              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Student Discount (CAMPUS10):</span>
                  <span className="font-mono font-bold">
                    -{formatCurrency(order.discount)}
                  </span>
                </div>
              )}

              {order.upiDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>UPI Instant Discount (5%):</span>
                  <span className="font-mono font-bold">
                    -{formatCurrency(order.upiDiscount)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Delivery Charge:</span>
                <span className="font-mono text-emerald-600 font-bold">FREE (₹0.00)</span>
              </div>

              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>CGST / SGST (0% Student Grant):</span>
                <span className="font-mono">₹0.00</span>
              </div>

              <div className="border-t-2 border-slate-900 pt-2 flex justify-between items-baseline text-slate-900">
                <span className="text-sm font-black uppercase">Grand Total:</span>
                <span className="text-xl font-black font-mono">
                  {formatCurrency(order.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Terms & Conditions & Signatures */}
          <div className="border-t border-slate-200 pt-6 space-y-4 text-[11px] text-slate-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <h5 className="font-bold uppercase text-slate-900 text-[10px]">
                  Terms & Conditions
                </h5>
                <ul className="list-disc pl-4 space-y-0.5 leading-relaxed">
                  <li>Payment terms: Immediate Payment via UPI / Card / COD.</li>
                  <li>Exchange valid within 48 hours for defective academic instruments.</li>
                  <li>Subject to Pune judicial jurisdiction only.</li>
                  <li>This is a computer generated tax invoice for course Activity 3.</li>
                </ul>
              </div>

              <div className="sm:text-right space-y-8 flex flex-col justify-between">
                <div>
                  <span className="font-bold text-slate-900">For CampusKart Student Co-op</span>
                  <p className="text-[10px] text-slate-400">Authorized Signatory & Stamp</p>
                </div>
                <div className="font-mono text-slate-400 text-[10px]">
                  [DIGITALLY VERIFIED - MCOE PUNE]
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
