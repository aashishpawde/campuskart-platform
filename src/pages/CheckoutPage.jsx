import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  QrCode,
  CreditCard,
  Banknote,
  ShieldCheck,
  Truck,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  Lock,
  Sparkles,
  Info,
  Layers,
  ChevronRight,
  Package
} from 'lucide-react';
import { useCartWishlist } from '../context/CartWishlistContext';
import { useOrders } from '../context/OrderContext';
import { formatCurrency } from '../utils/formatters';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const {
    cart,
    subtotal,
    couponCode,
    couponDiscountPercent,
    couponDiscountAmount,
    clearCart,
  } = useCartWishlist();
  const { createOrder } = useOrders();

  const [currentStep, setCurrentStep] = useState(1); // 1: Review, 2: Address, 3: Payment

  // Address Form State
  const [addressData, setAddressData] = useState({
    fullName: 'Rahul Deshmukh',
    email: 'rahul.deshmukh@mcoe.edu.in',
    phone: '+91 98221 34567',
    college: 'PES Modern College of Engineering (MCOE), Pune',
    hostelOrAddress: 'Boys Hostel Wing-A, Room 214, MCOE Campus',
    city: 'Pune',
    pincode: '411005',
    deliveryNotes: 'Please call when arriving at Gate 2 security cabin.',
  });

  const [addressErrors, setAddressErrors] = useState({});

  // Payment State
  // Options: 'UPI', 'Cash on Delivery', 'Demo / Test Payment'
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [upiIdInput, setUpiIdInput] = useState('rahul@okaxis');
  const [testCardNumber, setTestCardNumber] = useState('4242 •••• •••• 4242');
  const [testCardExpiry, setTestCardExpiry] = useState('12/28');
  const [testCardCvv, setTestCardCvv] = useState('888');
  const [testPaymentStatus, setTestPaymentStatus] = useState('Successful'); // 'Successful', 'Pending', 'Failed'
  const [isProcessing, setIsProcessing] = useState(false);

  // Financial Calculations with dynamic Payment Selection
  const isUpi = paymentMethod === 'UPI';
  const baseDiscount = couponDiscountAmount;
  const upiDiscount = isUpi ? (subtotal - baseDiscount) * 0.05 : 0;
  const totalDiscounts = baseDiscount + upiDiscount;
  const finalPayable = Math.max(0, subtotal - totalDiscounts);

  // COD Rule: Only between ₹99 and ₹2,000 (Odoo activity requirement)
  const isCodAllowed = finalPayable >= 99 && finalPayable <= 2000;

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  // Validation for Step 2
  const validateAddress = () => {
    const errs = {};
    if (!addressData.fullName.trim()) errs.fullName = 'Full Name is required';
    if (!addressData.email.trim() || !addressData.email.includes('@'))
      errs.email = 'Valid college or personal email required';
    if (!addressData.phone.trim() || addressData.phone.length < 10)
      errs.phone = 'Valid 10-digit phone number required';
    if (!addressData.hostelOrAddress.trim())
      errs.hostelOrAddress = 'Hostel Wing / Room or Address is required';
    if (!addressData.pincode.trim()) errs.pincode = 'Pincode is required';

    setAddressErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextFromAddress = (e) => {
    e.preventDefault();
    if (validateAddress()) {
      setCurrentStep(3);
    }
  };

  const handlePlaceOrder = () => {
    setIsProcessing(true);

    setTimeout(() => {
      let finalStatus = 'PAID';
      let methodDisplay = paymentMethod;

      if (paymentMethod === 'UPI') {
        finalStatus = 'PAID';
        methodDisplay = `UPI (${upiIdInput || 'campuskart@okaxis'})`;
      } else if (paymentMethod === 'Cash on Delivery') {
        finalStatus = 'PENDING';
        methodDisplay = 'Cash on Delivery (Pay at Hostel Gate)';
      } else if (paymentMethod === 'Demo / Test Payment') {
        if (testPaymentStatus === 'Successful') finalStatus = 'PAID';
        else if (testPaymentStatus === 'Pending') finalStatus = 'PENDING';
        else finalStatus = 'FAILED';
        methodDisplay = `Demo Card (Simulated - ${testPaymentStatus})`;
      }

      const orderPayload = {
        customer: addressData,
        items: cart,
        subtotal,
        couponCode: couponDiscountPercent > 0 ? couponCode : null,
        discount: baseDiscount,
        upiDiscount,
        totalDiscount: totalDiscounts,
        shippingFee: 0,
        total: finalPayable,
        paymentMethod,
        paymentMethodDisplay: methodDisplay,
        paymentStatus: finalStatus,
      };

      const newOrder = createOrder(orderPayload);
      clearCart();
      setIsProcessing(false);

      if (finalStatus !== 'FAILED') {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
        });
      }

      navigate(`/order-confirmation/${newOrder.id}`);
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 3-Step Breadcrumb Progress Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {/* Step 1 */}
          <button
            onClick={() => setCurrentStep(1)}
            className={`flex items-center gap-2 text-xs sm:text-sm font-bold transition-colors ${
              currentStep >= 1 ? 'text-brand-600' : 'text-slate-400'
            }`}
          >
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                currentStep > 1
                  ? 'bg-emerald-600 text-white'
                  : currentStep === 1
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {currentStep > 1 ? '✓' : '1'}
            </span>
            <span className="hidden sm:inline">Order Review</span>
          </button>

          <div
            className={`flex-1 h-0.5 mx-3 sm:mx-4 ${
              currentStep > 1 ? 'bg-brand-600' : 'bg-slate-200'
            }`}
          ></div>

          {/* Step 2 */}
          <button
            onClick={() => currentStep > 2 && setCurrentStep(2)}
            className={`flex items-center gap-2 text-xs sm:text-sm font-bold transition-colors ${
              currentStep >= 2 ? 'text-brand-600' : 'text-slate-400'
            }`}
          >
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                currentStep > 2
                  ? 'bg-emerald-600 text-white'
                  : currentStep === 2
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {currentStep > 2 ? '✓' : '2'}
            </span>
            <span className="hidden sm:inline">Hostel & Address</span>
          </button>

          <div
            className={`flex-1 h-0.5 mx-3 sm:mx-4 ${
              currentStep > 2 ? 'bg-brand-600' : 'bg-slate-200'
            }`}
          ></div>

          {/* Step 3 */}
          <div
            className={`flex items-center gap-2 text-xs sm:text-sm font-bold ${
              currentStep === 3 ? 'text-brand-600' : 'text-slate-400'
            }`}
          >
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                currentStep === 3
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              3
            </span>
            <span className="hidden sm:inline">Payment & Verification</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Step Content Area (Left 8 cols) */}
        <div className="lg:col-span-8">
          {/* STEP 1: ORDER REVIEW */}
          {currentStep === 1 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">
                    Step 1: Review Your Items
                  </h2>
                  <p className="text-xs text-slate-500">
                    Verify all stationery and quantities before adding delivery location
                  </p>
                </div>
                <span className="bg-brand-50 text-brand-700 text-xs font-bold px-3 py-1 rounded-full">
                  {cart.length} Product Line{cart.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {cart.map((item, idx) => (
                  <div
                    key={idx}
                    className="py-4 flex items-center justify-between gap-4 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0 space-y-0.5">
                        <p className="font-bold text-slate-900 truncate">
                          {item.product.name}
                        </p>
                        {item.variant && (
                          <p className="text-[11px] text-slate-500">
                            Option: <strong>{item.variant}</strong>
                          </p>
                        )}
                        <p className="text-[11px] text-slate-400">
                          Qty: {item.quantity} &times; {formatCurrency(item.product.price)}
                        </p>
                      </div>
                    </div>
                    <div className="font-bold font-mono text-sm text-slate-900 shrink-0">
                      {formatCurrency(item.product.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex justify-between items-center border-t border-slate-100">
                <Link
                  to="/cart"
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Edit Cart
                </Link>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow transition-transform active:scale-95 flex items-center gap-1.5"
                >
                  <span>Continue to Address</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: ADDRESS & CAMPUS LOCATION */}
          {currentStep === 2 && (
            <form
              onSubmit={handleNextFromAddress}
              className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm"
            >
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-extrabold text-slate-900">
                  Step 2: Campus Delivery & Hostel Address
                </h2>
                <p className="text-xs text-slate-500">
                  Where should our campus runner drop your supplies?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Full Name *</label>
                  <input
                    type="text"
                    value={addressData.fullName}
                    onChange={(e) =>
                      setAddressData({ ...addressData, fullName: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 text-slate-900"
                    placeholder="Student Name"
                  />
                  {addressErrors.fullName && (
                    <p className="text-[11px] text-rose-600">{addressErrors.fullName}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">College / Personal Email *</label>
                  <input
                    type="email"
                    value={addressData.email}
                    onChange={(e) =>
                      setAddressData({ ...addressData, email: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 text-slate-900"
                    placeholder="student@mcoe.edu.in"
                  />
                  {addressErrors.email && (
                    <p className="text-[11px] text-rose-600">{addressErrors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Contact Phone Number *</label>
                  <input
                    type="tel"
                    value={addressData.phone}
                    onChange={(e) =>
                      setAddressData({ ...addressData, phone: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 text-slate-900"
                    placeholder="+91 98765 43210"
                  />
                  {addressErrors.phone && (
                    <p className="text-[11px] text-rose-600">{addressErrors.phone}</p>
                  )}
                </div>

                {/* College */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">College / Institute</label>
                  <input
                    type="text"
                    value={addressData.college}
                    onChange={(e) =>
                      setAddressData({ ...addressData, college: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-700"
                  />
                </div>

                {/* Hostel Wing / Room No */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-slate-700">
                    Hostel Wing & Room No. OR Off-Campus Address *
                  </label>
                  <input
                    type="text"
                    value={addressData.hostelOrAddress}
                    onChange={(e) =>
                      setAddressData({ ...addressData, hostelOrAddress: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 text-slate-900"
                    placeholder="e.g. Boys Hostel Wing-B Room 304, or Flat 402 Shivajinagar"
                  />
                  {addressErrors.hostelOrAddress && (
                    <p className="text-[11px] text-rose-600">
                      {addressErrors.hostelOrAddress}
                    </p>
                  )}
                </div>

                {/* City & Pincode */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">City</label>
                  <input
                    type="text"
                    value={addressData.city}
                    disabled
                    className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Pincode</label>
                  <input
                    type="text"
                    value={addressData.pincode}
                    onChange={(e) =>
                      setAddressData({ ...addressData, pincode: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>

                {/* Delivery Notes */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-slate-700">Delivery Instructions</label>
                  <textarea
                    rows={2}
                    value={addressData.deliveryNotes}
                    onChange={(e) =>
                      setAddressData({ ...addressData, deliveryNotes: e.target.value })
                    }
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-brand-500"
                    placeholder="e.g. Leave at hostel reception desk if in class"
                  ></textarea>
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Review
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow transition-transform active:scale-95 flex items-center gap-1.5"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: PAYMENT OPTIONS */}
          {currentStep === 3 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">
                    Step 3: Select Payment Method
                  </h2>
                  <p className="text-xs text-slate-500">
                    Instant UPI discount, Cash on Delivery, or Sandbox Test Payment
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Secure 256-bit</span>
                </div>
              </div>

              {/* Payment Methods Tabs */}
              <div className="space-y-4">
                {/* 1. UPI Payment Option */}
                <label
                  className={`block p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                    paymentMethod === 'UPI'
                      ? 'border-brand-600 bg-brand-50/40 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment-method"
                        value="UPI"
                        checked={paymentMethod === 'UPI'}
                        onChange={() => setPaymentMethod('UPI')}
                        className="text-brand-600 focus:ring-brand-500 mt-1"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-slate-900">
                            Instant UPI Payment
                          </span>
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-full uppercase">
                            ⚡ Flat 5% Off
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Google Pay, PhonePe, Paytm, BHIM UPI
                        </p>
                      </div>
                    </div>
                    <QrCode className="w-6 h-6 text-brand-600" />
                  </div>

                  {paymentMethod === 'UPI' && (
                    <div className="mt-4 pt-4 border-t border-brand-200/60 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-white p-4 rounded-xl border border-brand-100">
                      {/* Simulated QR Box */}
                      <div className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                        <div className="w-28 h-28 bg-white p-2 rounded-lg border border-slate-300 flex items-center justify-center shadow-inner">
                          <QrCode className="w-24 h-24 text-slate-900" />
                        </div>
                        <span className="text-[10px] font-mono text-slate-600 mt-1.5 font-bold">
                          campuskart@okaxis
                        </span>
                        <span className="text-[9px] text-emerald-600 font-semibold">
                          Scan to pay with any UPI App
                        </span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <label className="font-bold text-slate-700">Enter Your UPI ID (VPA)</label>
                        <input
                          type="text"
                          value={upiIdInput}
                          onChange={(e) => setUpiIdInput(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-900 focus:ring-2 focus:ring-brand-500"
                          placeholder="yourname@okhdfcbank"
                        />
                        <p className="text-[11px] text-slate-500">
                          Automatic 5% UPI discount of <strong>{formatCurrency(upiDiscount)}</strong> is applied to your total!
                        </p>
                      </div>
                    </div>
                  )}
                </label>

                {/* 2. Cash on Delivery Option */}
                <label
                  className={`block p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                    !isCodAllowed
                      ? 'border-slate-200 bg-slate-50/80 opacity-70 cursor-not-allowed'
                      : paymentMethod === 'Cash on Delivery'
                      ? 'border-brand-600 bg-brand-50/40 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment-method"
                        value="Cash on Delivery"
                        disabled={!isCodAllowed}
                        checked={paymentMethod === 'Cash on Delivery'}
                        onChange={() => setPaymentMethod('Cash on Delivery')}
                        className="text-brand-600 focus:ring-brand-500 mt-1"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-slate-900">
                            Cash on Delivery (COD)
                          </span>
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md">
                            ₹99 - ₹2,000 only
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Pay cash to runner at hostel gate upon delivery
                        </p>
                      </div>
                    </div>
                    <Banknote className="w-6 h-6 text-slate-600" />
                  </div>

                  {!isCodAllowed && (
                    <div className="mt-3 p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>
                        COD is only available for orders between <strong>₹99 and ₹2,000</strong> (Odoo Activity Rule). Please choose UPI or Demo Payment.
                      </span>
                    </div>
                  )}
                </label>

                {/* 3. Demo / Test Payment (Sandbox with Ribbon) */}
                <label
                  className={`block p-5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden ${
                    paymentMethod === 'Demo / Test Payment'
                      ? 'border-purple-600 bg-purple-50/40 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  {/* Glowing TEST MODE Ribbon */}
                  <div className="absolute top-3 right-[-32px] bg-purple-600 text-white text-[9px] font-extrabold uppercase tracking-widest px-10 py-0.5 rotate-45 shadow">
                    SANDBOX
                  </div>

                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment-method"
                        value="Demo / Test Payment"
                        checked={paymentMethod === 'Demo / Test Payment'}
                        onChange={() => setPaymentMethod('Demo / Test Payment')}
                        className="text-purple-600 focus:ring-purple-500 mt-1"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-slate-900">
                            Demo / Test Payment Simulation
                          </span>
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-mono font-bold rounded-md">
                            TEST MODE
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Simulate test cards with custom status (Successful / Pending / Failed)
                        </p>
                      </div>
                    </div>
                    <CreditCard className="w-6 h-6 text-purple-600 mr-6" />
                  </div>

                  {paymentMethod === 'Demo / Test Payment' && (
                    <div className="mt-4 pt-4 border-t border-purple-200 space-y-3 bg-white p-4 rounded-xl border border-purple-100 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2 space-y-1">
                          <label className="font-bold text-slate-700">Simulated Card</label>
                          <input
                            type="text"
                            value={testCardNumber}
                            onChange={(e) => setTestCardNumber(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-slate-700">Expiry / CVV</label>
                          <div className="flex gap-1 font-mono">
                            <input
                              type="text"
                              value={testCardExpiry}
                              onChange={(e) => setTestCardExpiry(e.target.value)}
                              className="w-1/2 px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs"
                            />
                            <input
                              type="text"
                              value={testCardCvv}
                              onChange={(e) => setTestCardCvv(e.target.value)}
                              className="w-1/2 px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Payment Status Dropdown Selector */}
                      <div className="space-y-1 pt-2 border-t border-slate-100">
                        <label className="font-bold text-slate-900 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                          Simulate Payment Response Status:
                        </label>
                        <select
                          value={testPaymentStatus}
                          onChange={(e) => setTestPaymentStatus(e.target.value)}
                          className="w-full px-3 py-2 bg-purple-50 border border-purple-200 rounded-xl font-bold text-xs text-purple-900 focus:ring-2 focus:ring-purple-500 cursor-pointer"
                        >
                          <option value="Successful">Successful (Completes Order & Generates Invoice)</option>
                          <option value="Pending">Pending (Awaiting Bank Authorization)</option>
                          <option value="Failed">Failed (Simulates Insufficient Balance / Card Decline)</option>
                        </select>
                      </div>
                    </div>
                  )}
                </label>
              </div>

              {/* Navigation and Order Placement */}
              <div className="pt-4 flex justify-between items-center border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Address
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className={`px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg shadow-emerald-600/25 transition-all flex items-center gap-2 active:scale-95 ${
                    isProcessing ? 'opacity-80 cursor-wait' : ''
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Verifying & Placing Order...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm & Place Order ({formatCurrency(finalPayable)})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar Right */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-5">
            <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-3">
              Payment Summary
            </h3>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Items Total ({cart.length} items)</span>
                <span className="font-mono font-semibold text-slate-900">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              {couponDiscountPercent > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Student Code ({couponCode})</span>
                  <span className="font-mono font-bold">
                    -{formatCurrency(baseDiscount)}
                  </span>
                </div>
              )}

              {isUpi && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>UPI Instant Discount (5%)</span>
                  <span className="font-mono font-bold">
                    -{formatCurrency(upiDiscount)}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Hostel Gate Delivery</span>
                <span className="font-mono font-bold text-emerald-600">FREE</span>
              </div>

              <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline text-slate-900">
                <span className="font-bold text-sm">Final Payable</span>
                <span className="font-black text-2xl text-slate-900 font-mono">
                  {formatCurrency(finalPayable)}
                </span>
              </div>
            </div>

            {/* Delivery Destination Snippet */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
              <p className="font-bold text-slate-900 flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-brand-600" />
                Delivering to:
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                {addressData.fullName} &bull; {addressData.hostelOrAddress}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
