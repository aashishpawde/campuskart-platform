import React from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Zap,
  Truck,
  RotateCcw,
  BarChart3,
  Heart
} from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      {/* Trust & Guarantee Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 border-b border-slate-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
            <div className="p-2.5 rounded-lg bg-brand-500/10 text-brand-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">15-Min Campus Delivery</h4>
              <p className="text-xs text-slate-400 mt-0.5">Direct to hostel gates & academic labs</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
            <div className="p-2.5 rounded-lg bg-accent-500/10 text-accent-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Student-Pocket Pricing</h4>
              <p className="text-xs text-slate-400 mt-0.5">Up to 25% cheaper than off-campus shops</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">100% Genuine Academic Gear</h4>
              <p className="text-xs text-slate-400 mt-0.5">Faculty recommended tools & calculators</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
            <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">48-Hr Easy Exchange</h4>
              <p className="text-xs text-slate-400 mt-0.5">Hassle-free replacement at student desk</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold">
                <Package className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Campus<span className="text-brand-400">Kart</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              CampusKart is a student-centric retail marketplace providing rapid, affordable access to essential stationery, academic gear, electronics, and daily consumables on campus.
            </p>
            <div className="p-3 bg-slate-800/60 rounded-lg border border-slate-700/60 text-xs space-y-1">
              <p className="text-white font-semibold flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-accent-400" />
                College Project Submission
              </p>
              <p className="text-slate-400 text-[11px]">
                E-Business and Retailing (OEL11201A) &bull; PES Modern College of Engineering (MCOE), Pune.
              </p>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-3">Categories</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/shop?category=Stationery" className="hover:text-white transition-colors">
                  Stationery & Records
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Academic+Essentials" className="hover:text-white transition-colors">
                  Academic Essentials & Drafters
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Tech+Accessories" className="hover:text-white transition-colors">
                  Tech Accessories & Cables
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Daily+Consumables" className="hover:text-white transition-colors">
                  Daily Consumables & Hygiene
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Bundles+%26+Kits" className="hover:text-white transition-colors font-semibold text-accent-400">
                  Exam & Project Kits &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-3">Quick Access</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/orders" className="hover:text-white transition-colors">
                  My Orders & Invoices
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-white transition-colors">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="text-brand-400 hover:text-brand-300 transition-colors font-semibold flex items-center gap-1">
                  <BarChart3 className="w-3.5 h-3.5" />
                  Retail Analytics Hub
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition-colors">
                  Admin Login (admin123)
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Help Desk & FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Campus Location */}
          <div>
            <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-3">Campus Desk</h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span>Student Co-op Center, Gate 2, MCOE Campus, Shivajinagar, Pune - 411005</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent-400 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>support@campuskart.mcoe.edu</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Sub-bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-slate-800 text-center sm:flex sm:justify-between text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} CampusKart &bull; Built for MCOE Pune Coursework Activity 3 & 4.</p>
        <p className="mt-2 sm:mt-0 flex items-center justify-center gap-1">
          Simulated E-Commerce & Retail Analytics Engine &bull; Pure Client-Side
        </p>
      </div>
    </footer>
  );
};
