import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Package,
  ShoppingCart,
  AlertTriangle,
  BarChart3,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle2,
  Lock,
  LogOut,
  RefreshCw,
  Search,
  FileText,
  Boxes,
  X
} from 'lucide-react';
import { useAdminProducts } from '../context/AdminProductContext';
import { useOrders } from '../context/OrderContext';
import { InvoiceModal } from '../components/orders/InvoiceModal';
import { formatCurrency, formatDateTime } from '../utils/formatters';

export const AdminPage = () => {
  const {
    products,
    isAdminLoggedIn,
    loginAdmin,
    logoutAdmin,
    addProduct,
    updateProduct,
    deleteProduct,
    togglePublish,
    restock,
    resetToDefaultSeed,
    lowStockProducts,
  } = useAdminProducts();

  const { orders, updateOrderStatus } = useOrders();

  // Admin tabs: 'products', 'orders', 'stock', 'analytics'
  const [activeTab, setActiveTab] = useState('products');

  // Login form
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loginError, setLoginError] = useState('');

  // Product Add / Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Stationery',
    price: '',
    mrp: '',
    stock: 20,
    image: '',
    description: '',
    variants: '',
    variantType: 'Option',
    published: true,
  });

  // Selected Order for Invoice view
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);

  // Search filter in admin
  const [adminSearch, setAdminSearch] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const res = loginAdmin(username, password);
    if (!res.success) {
      setLoginError(res.error);
    } else {
      setLoginError('');
    }
  };

  const openAddProductModal = () => {
    setEditingProductId(null);
    setProductForm({
      name: '',
      category: 'Stationery',
      price: '',
      mrp: '',
      stock: 25,
      image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&auto=format&fit=crop&q=80',
      description: '',
      variants: '',
      variantType: 'Color',
      published: true,
    });
    setIsEditModalOpen(true);
  };

  const openEditProductModal = (product) => {
    setEditingProductId(product.id);
    setProductForm({
      name: product.name,
      category: product.category,
      price: product.price,
      mrp: product.mrp || '',
      stock: product.stock,
      image: product.image,
      description: product.description || '',
      variants: product.variants ? product.variants.join(', ') : '',
      variantType: product.variantType || 'Option',
      published: product.published !== false,
    });
    setIsEditModalOpen(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    const variantArray = productForm.variants
      ? productForm.variants.split(',').map((v) => v.trim()).filter(Boolean)
      : null;

    const payload = {
      ...productForm,
      price: Number(productForm.price),
      mrp: productForm.mrp ? Number(productForm.mrp) : Number(productForm.price) * 1.2,
      stock: Number(productForm.stock),
      variants: variantArray && variantArray.length > 0 ? variantArray : null,
    };

    if (editingProductId) {
      updateProduct(editingProductId, payload);
    } else {
      addProduct(payload);
    }

    setIsEditModalOpen(false);
  };

  // If not logged in, render authentication gate
  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white flex items-center justify-center mx-auto shadow-md shadow-brand-500/20">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">CampusKart Admin Portal</h2>
            <p className="text-xs text-slate-500">
              Authorized access for store management & retail analytics
            </p>
          </div>

          {/* Quick Demo Credential Banner */}
          <div className="p-3 bg-brand-50 rounded-xl border border-brand-200 text-xs text-brand-900 flex items-center justify-between">
            <div>
              <p className="font-bold">Demo Login Credentials:</p>
              <p className="font-mono text-[11px] text-brand-700">
                admin / admin123
              </p>
            </div>
            <button
              onClick={() => {
                setUsername('admin');
                setPassword('admin123');
              }}
              className="px-2.5 py-1 bg-brand-600 hover:bg-brand-700 text-white text-[10px] font-bold rounded-lg transition-colors"
            >
              Fill Details
            </button>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Admin Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 text-slate-900"
                placeholder="admin"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 text-slate-900"
                placeholder="••••••••"
              />
            </div>

            {loginError && (
              <p className="text-rose-600 text-[11px] font-semibold">{loginError}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow transition-transform active:scale-95"
            >
              Sign In to Admin Hub
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Filter products for admin search
  const filteredAdminProducts = products.filter((p) =>
    p.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(adminSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Top Dashboard Bar */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-wrap items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
              ADMIN CONTROL PANEL
            </span>
            <span className="text-xs text-slate-400">MCOE Pune</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            CampusKart Storefront & Inventory Manager
          </h1>
          <p className="text-xs text-slate-400">
            Activity 3 & 4 Management: Manage products, track orders, monitor low stock & analytics
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/analytics"
            className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Launch Retail Analytics Hub</span>
          </Link>
          <button
            onClick={logoutAdmin}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Admin Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
              Total Products
            </span>
            <span className="text-2xl font-black text-slate-900">{products.length}</span>
          </div>
          <div className="p-3 bg-brand-50 text-brand-600 rounded-xl">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
              Total Orders Placed
            </span>
            <span className="text-2xl font-black text-slate-900">{orders.length}</span>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <ShoppingCart className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
              Low Stock Alerts (&lt;10)
            </span>
            <span className="text-2xl font-black text-amber-600">
              {lowStockProducts.length}
            </span>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
              Catalog Bundles
            </span>
            <span className="text-2xl font-black text-emerald-600">
              {products.filter((p) => p.isBundle).length} Kits
            </span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Boxes className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 px-2 flex items-center gap-1.5 transition-all border-b-2 ${
            activeTab === 'products'
              ? 'border-brand-600 text-brand-600 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Product Catalog Management ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-2 flex items-center gap-1.5 transition-all border-b-2 ${
            activeTab === 'orders'
              ? 'border-brand-600 text-brand-600 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Customer Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('stock')}
          className={`pb-3 px-2 flex items-center gap-1.5 transition-all border-b-2 ${
            activeTab === 'stock'
              ? 'border-brand-600 text-brand-600 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span>Low-Stock Alerts ({lowStockProducts.length})</span>
        </button>
      </div>

      {/* TAB 1: PRODUCT MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Filter catalog products..."
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 text-slate-900"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={resetToDefaultSeed}
                className="px-3 py-2 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold transition-colors flex items-center gap-1"
                title="Reset to 40+ seed products catalog"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reset Seed
              </button>
              <button
                onClick={openAddProductModal}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4 text-right">Price (₹)</th>
                    <th className="py-3 px-4 text-center">Stock</th>
                    <th className="py-3 px-4 text-center">Variants</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAdminProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate max-w-xs">
                            {p.name}
                          </p>
                          {p.isBundle && (
                            <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.2 rounded">
                              Bundle Kit
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        {formatCurrency(p.price)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`font-mono font-bold px-2 py-0.5 rounded-full text-xs ${
                            p.stock < 10
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {p.stock}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {p.variants ? (
                          <span className="text-[11px] text-slate-600 font-medium">
                            {p.variants.length} ({p.variants.join(', ')})
                          </span>
                        ) : (
                          <span className="text-slate-400">&mdash;</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => togglePublish(p.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase transition-colors flex items-center gap-1 mx-auto ${
                            p.published !== false
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                          }`}
                        >
                          {p.published !== false ? (
                            <>
                              <Eye className="w-3 h-3" /> Published
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" /> Draft
                            </>
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditProductModal(p)}
                            className="p-1.5 text-slate-600 hover:text-brand-600 hover:bg-slate-100 rounded-lg"
                            title="Edit Product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4 text-right">Total (₹)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-brand-700">
                      {o.id}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{o.customer?.fullName}</p>
                      <p className="text-[11px] text-slate-400 truncate max-w-xs">
                        {o.customer?.hostelOrAddress}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {formatDateTime(o.date)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-700">
                        {o.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      {formatCurrency(o.total)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <select
                        value={o.orderStatus || 'Paid'}
                        onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                        className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 cursor-pointer"
                      >
                        <option value="New">New</option>
                        <option value="Paid">Paid</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedInvoiceOrder(o)}
                        className="px-2.5 py-1 bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-[11px] rounded-lg border border-brand-200 transition-colors inline-flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Invoice</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: LOW STOCK MANAGEMENT & ALERTS */}
      {activeTab === 'stock' && (
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span>
                <strong>Low Stock Alert:</strong> The following {lowStockProducts.length} items have fewer than 10 units in campus storage. Restock to prevent out-of-stock cancellations.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-brand-600">
                    {p.category}
                  </span>
                  <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-xs font-mono font-bold rounded-full">
                    Only {p.stock} units
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-xs text-slate-900 truncate">{p.name}</p>
                    <p className="text-xs text-slate-500 font-mono">
                      {formatCurrency(p.price)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs">
                  <button
                    onClick={() => restock(p.id, 10)}
                    className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg transition-colors"
                  >
                    +10 Units
                  </button>
                  <button
                    onClick={() => restock(p.id, 50)}
                    className="flex-1 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold rounded-lg transition-colors"
                  >
                    +50 Units
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Add / Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {editingProductId ? 'Edit Product' : 'Add New Campus Product'}
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Product Name *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  placeholder="e.g. Spiral Drawing Journal"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  >
                    <option>Stationery</option>
                    <option>Academic Essentials</option>
                    <option>Tech Accessories</option>
                    <option>Daily Consumables</option>
                    <option>Bundles & Kits</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Stock Units</label>
                  <input
                    type="number"
                    min="0"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono"
                    placeholder="120"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">MRP (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.mrp}
                    onChange={(e) => setProductForm({ ...productForm, mrp: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono"
                    placeholder="150"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Image URL</label>
                <input
                  type="url"
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Variants (Comma separated)</label>
                <input
                  type="text"
                  value={productForm.variants}
                  onChange={(e) => setProductForm({ ...productForm, variants: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  placeholder="e.g. S, M, L, XL or Black, Blue, Green"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Description</label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  placeholder="Short student-friendly product summary..."
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice View Modal */}
      <InvoiceModal
        order={selectedInvoiceOrder}
        isOpen={!!selectedInvoiceOrder}
        onClose={() => setSelectedInvoiceOrder(null)}
      />
    </div>
  );
};
