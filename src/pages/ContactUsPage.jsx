import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  GraduationCap
} from 'lucide-react';

export const ContactUsPage = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: 'How fast is the campus hostel delivery?',
      a: 'We deliver within 15 to 20 minutes directly to your hostel gate or department lab desk during campus hours (8:00 AM to 9:00 PM).',
    },
    {
      q: 'What is the Cash on Delivery (COD) eligibility rule?',
      a: 'Following our retail operations policy (mirrored from our Odoo Activity 3), Cash on Delivery is available for all orders between ₹99 and ₹2,000.',
    },
    {
      q: 'How do I claim the UPI 5% extra discount?',
      a: 'Simply select UPI as your payment method on Checkout Step 3. The 5% instant cashback deduction is automatically calculated and subtracted from your final bill.',
    },
    {
      q: 'Can I exchange drawing instruments or drafters?',
      a: 'Yes! All academic tools, drafters, and calculators carry a 48-hour no-questions-asked replacement guarantee at our Campus Co-op desk at Gate 2.',
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
          Student Help Desk
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Contact CampusKart Support
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Have an urgent exam stationery requirement or question about your hostel delivery? Reach out to our campus student coordinators!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-3">
              Campus Location & Contacts
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-brand-50 text-brand-600 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Student Store & Dispatch Hub</p>
                  <p className="text-slate-600 leading-relaxed">
                    PES Modern College of Engineering (MCOE)
                    <br />
                    Co-op Store, Gate 2, Shivajinagar, Pune - 411005
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-accent-50 text-accent-600 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Urgent Exam Hotline</p>
                  <p className="text-slate-600 font-mono">+91 98765 43210 / +91 98230 45678</p>
                  <span className="text-[10px] text-emerald-600 font-semibold">
                    (Available 8:00 AM - 9:30 PM Daily)
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Support Email</p>
                  <p className="text-slate-600 font-mono">support@campuskart.mcoe.edu</p>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Course Badge */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-brand-900 to-slate-900 text-white space-y-2 text-xs">
            <div className="flex items-center gap-2 text-accent-400 font-bold">
              <GraduationCap className="w-4 h-4" />
              <span>Course Project Information</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Course: <strong>E-Business and Retailing (OEL11201A)</strong>
              <br />
              Activity 3: E-commerce Storefront Simulation
              <br />
              Activity 4: Retail Analytics Hub (Descriptive, Diagnostic, Predictive & Prescriptive)
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
            <h3 className="font-extrabold text-base text-slate-900">
              Send an Inquiry / Feedback
            </h3>

            {formSubmitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-emerald-900 text-sm">
                  Message Sent to Campus Desk!
                </h4>
                <p className="text-xs text-emerald-700">
                  Our student coordinator will respond to your room/WhatsApp shortly.
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="mt-2 text-xs font-bold text-brand-600 underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Student Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya Patil"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 text-slate-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Phone / WhatsApp</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98220..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Hostel / Branch</label>
                    <input
                      type="text"
                      placeholder="e.g. Girls Hostel / 2nd Year Computer"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 text-slate-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Subject</label>
                    <select className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 text-slate-900">
                      <option>Urgent Exam Kit Delivery Request</option>
                      <option>Special Drawing Tool Inquiry</option>
                      <option>48-Hour Product Exchange</option>
                      <option>Retail Analytics Data Feedback</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Message / Request</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us what stationery or lab equipment you need..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 text-slate-900"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Inquiry to Campus Desk</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
        <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-brand-600" />
          Frequently Asked Questions (Campus Shopping)
        </h3>

        <div className="divide-y divide-slate-100">
          {faqs.map((faq, idx) => (
            <div key={idx} className="py-3">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between text-left text-xs font-bold text-slate-900 hover:text-brand-600 py-1"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    openFaq === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <p className="mt-2 text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
