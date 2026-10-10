import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home, ShoppingBag } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
        <AlertTriangle className="w-10 h-10" />
      </div>
      <div className="space-y-2">
        <span className="font-mono text-xs font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
          404 - Page Not Found
        </span>
        <h1 className="text-3xl font-black text-slate-900">Looks like you're off-campus!</h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
          The page or product link you clicked does not exist or has been moved.
        </p>
      </div>
      <div className="flex justify-center gap-3">
        <Link
          to="/"
          className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
        >
          <Home className="w-4 h-4" /> Home
        </Link>
        <Link
          to="/shop"
          className="px-5 py-2.5 bg-brand-600 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
        >
          <ShoppingBag className="w-4 h-4" /> Shop Catalog
        </Link>
      </div>
    </div>
  );
};
