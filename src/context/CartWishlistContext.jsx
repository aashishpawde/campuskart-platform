import React, { createContext, useContext, useState, useEffect } from 'react';

const CartWishlistContext = createContext();

export const useCartWishlist = () => {
  const context = useContext(CartWishlistContext);
  if (!context) {
    throw new Error('useCartWishlist must be used within CartWishlistProvider');
  }
  return context;
};

export const CartWishlistProvider = ({ children }) => {
  // Cart items: [{ product, quantity, variant }]
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('campuskart_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Saved for later items
  const [savedForLater, setSavedForLater] = useState(() => {
    try {
      const saved = localStorage.getItem('campuskart_saved_later');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Wishlist items: [product]
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('campuskart_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Coupon code: CAMPUS10 = 10% off
  const [couponCode, setCouponCode] = useState(() => {
    return localStorage.getItem('campuskart_coupon') || '';
  });
  const [couponDiscountPercent, setCouponDiscountPercent] = useState(() => {
    return localStorage.getItem('campuskart_coupon') === 'CAMPUS10' ? 10 : 0;
  });
  const [couponMessage, setCouponMessage] = useState(null);

  // Selected payment method for checkout discount calculation
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('UPI');

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('campuskart_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('campuskart_saved_later', JSON.stringify(savedForLater));
  }, [savedForLater]);

  useEffect(() => {
    localStorage.setItem('campuskart_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Cart operations
  const addToCart = (product, quantity = 1, variant = null) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.variant === variant
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, { product, quantity, variant }];
      }
    });
  };

  const removeFromCart = (productId, variant = null) => {
    setCart((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.variant === variant))
    );
  };

  const updateQuantity = (productId, variant = null, newQty = 1) => {
    if (newQty <= 0) {
      removeFromCart(productId, variant);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId && item.variant === variant) {
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const moveToSavedLater = (productId, variant = null) => {
    const itemToSave = cart.find(
      (item) => item.product.id === productId && item.variant === variant
    );
    if (itemToSave) {
      removeFromCart(productId, variant);
      setSavedForLater((prev) => [...prev, itemToSave]);
    }
  };

  const moveToCartFromSaved = (productId, variant = null) => {
    const itemToMove = savedForLater.find(
      (item) => item.product.id === productId && item.variant === variant
    );
    if (itemToMove) {
      setSavedForLater((prev) =>
        prev.filter((item) => !(item.product.id === productId && item.variant === variant))
      );
      addToCart(itemToMove.product, itemToMove.quantity, itemToMove.variant);
    }
  };

  const removeSavedItem = (productId, variant = null) => {
    setSavedForLater((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.variant === variant))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Coupon handling
  const applyCoupon = (code) => {
    const cleanCode = (code || '').trim().toUpperCase();
    if (cleanCode === 'CAMPUS10') {
      setCouponCode('CAMPUS10');
      setCouponDiscountPercent(10);
      localStorage.setItem('campuskart_coupon', 'CAMPUS10');
      setCouponMessage({ type: 'success', text: 'Coupon CAMPUS10 applied! 10% student discount applied.' });
      return true;
    } else {
      setCouponMessage({ type: 'error', text: 'Invalid coupon code. Try CAMPUS10 for 10% off.' });
      return false;
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setCouponDiscountPercent(0);
    localStorage.removeItem('campuskart_coupon');
    setCouponMessage({ type: 'info', text: 'Coupon removed.' });
  };

  // Wishlist operations
  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  // Cart financial calculations
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  
  // Coupon Discount
  const couponDiscountAmount = (subtotal * couponDiscountPercent) / 100;
  
  // UPI Discount (5% if UPI is selected)
  const isUpiPayment = selectedPaymentMethod === 'UPI';
  const upiDiscountAmount = isUpiPayment ? ((subtotal - couponDiscountAmount) * 0.05) : 0;
  
  // Total discounts
  const totalDiscount = couponDiscountAmount + upiDiscountAmount;
  
  // Delivery charges: Always ₹0 on campus
  const deliveryFee = 0;
  
  // Final Grand Total
  const finalTotal = Math.max(0, subtotal - totalDiscount + deliveryFee);

  return (
    <CartWishlistContext.Provider
      value={{
        cart,
        savedForLater,
        wishlist,
        totalItemsCount,
        subtotal,
        couponCode,
        couponDiscountPercent,
        couponDiscountAmount,
        upiDiscountAmount,
        totalDiscount,
        deliveryFee,
        finalTotal,
        selectedPaymentMethod,
        setSelectedPaymentMethod,
        couponMessage,
        addToCart,
        removeFromCart,
        updateQuantity,
        moveToSavedLater,
        moveToCartFromSaved,
        removeSavedItem,
        clearCart,
        applyCoupon,
        removeCoupon,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </CartWishlistContext.Provider>
  );
};
