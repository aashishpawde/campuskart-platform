import React, { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within OrderProvider');
  }
  return context;
};

const SAMPLE_ORDER_S00001 = {
  id: 'S00001',
  orderNumber: 'S00001',
  date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  invoiceDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }),
  customer: {
    fullName: 'Aarav Sharma',
    email: 'aarav.sharma@mcoe.edu.in',
    phone: '+91 98230 45678',
    college: 'PES Modern College of Engineering (MCOE), Pune',
    address: 'Hostel Wing-B, Room 304, Modern College Campus, Shivajinagar',
    city: 'Pune',
    pincode: '411005',
    notes: 'Please drop at Hostel Reception Gate 2 desk before 6:00 PM.',
  },
  items: [
    {
      product: {
        id: 'ck-acad-03',
        name: 'Scientific Calculator (Fx-991CW)',
        category: 'Academic Essentials',
        price: 950,
        mrp: 1195,
        image: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600&auto=format&fit=crop&q=80',
        hsn: '84702900',
      },
      quantity: 2,
      variant: null,
    },
  ],
  subtotal: 1900,
  couponCode: 'CAMPUS10',
  discount: 190,
  upiDiscount: 85.5,
  totalDiscount: 275.5,
  shippingFee: 0,
  total: 1624.5,
  paymentMethod: 'UPI',
  paymentMethodDisplay: 'UPI (campuskart@okaxis)',
  paymentStatus: 'PAID',
  paymentTerms: 'Immediate Payment',
  orderStatus: 'Delivered',
  transactionId: 'UPI-MCOE-782910472',
};

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('campuskart_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return [SAMPLE_ORDER_S00001];
    } catch (e) {
      return [SAMPLE_ORDER_S00001];
    }
  });

  const [activeOrder, setActiveOrder] = useState(null);

  // Keep localStorage updated
  useEffect(() => {
    localStorage.setItem('campuskart_orders', JSON.stringify(orders));
  }, [orders]);

  // Generate sequential order ID: S00001, S00002, ...
  const generateNextOrderId = () => {
    const existingIds = orders
      .map((o) => {
        const match = o.id.match(/S(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter((n) => !isNaN(n));
    const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
    const nextNum = maxId + 1;
    return `S${String(nextNum).padStart(5, '0')}`;
  };

  const createOrder = (orderData) => {
    const newOrderId = generateNextOrderId();
    const newOrder = {
      ...orderData,
      id: newOrderId,
      orderNumber: newOrderId,
      date: new Date().toISOString(),
      invoiceDate: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      orderStatus: orderData.paymentStatus === 'FAILED' ? 'Cancelled' : 'Paid',
      paymentTerms: 'Immediate Payment',
      transactionId:
        orderData.paymentMethod === 'UPI'
          ? `UPI-TXN-${Date.now().toString().slice(-8)}`
          : orderData.paymentMethod === 'Demo / Test Payment'
          ? `SANDBOX-${Date.now().toString().slice(-8)}`
          : `COD-VERIFIED-${Date.now().toString().slice(-6)}`,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    return newOrder;
  };

  const getOrderById = (id) => {
    return orders.find((o) => o.id === id) || null;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
    );
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        activeOrder,
        setActiveOrder,
        createOrder,
        getOrderById,
        updateOrderStatus,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
