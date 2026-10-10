import React, { createContext, useContext, useState, useEffect } from 'react';
import seedProducts from '../data/campusProducts.json';

const AdminProductContext = createContext();

export const useAdminProducts = () => {
  const context = useContext(AdminProductContext);
  if (!context) {
    throw new Error('useAdminProducts must be used within AdminProductProvider');
  }
  return context;
};

export const AdminProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('campuskart_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return seedProducts;
    } catch (e) {
      return seedProducts;
    }
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('campuskart_admin_auth') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('campuskart_products', JSON.stringify(products));
  }, [products]);

  const loginAdmin = (username, password) => {
    if (username.trim() === 'admin' && password.trim() === 'admin123') {
      setIsAdminLoggedIn(true);
      localStorage.setItem('campuskart_admin_auth', 'true');
      return { success: true };
    }
    return { success: false, error: 'Invalid username or password (Use: admin / admin123)' };
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('campuskart_admin_auth');
  };

  const addProduct = (newProduct) => {
    const id = `ck-custom-${Date.now()}`;
    const productToAdd = {
      ...newProduct,
      id,
      rating: 5.0,
      reviewsCount: 1,
      published: newProduct.published ?? true,
      price: Number(newProduct.price),
      mrp: Number(newProduct.mrp || newProduct.price * 1.2),
      stock: Number(newProduct.stock || 20),
    };
    setProducts((prev) => [productToAdd, ...prev]);
    return productToAdd;
  };

  const updateProduct = (id, updatedFields) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              ...updatedFields,
              price: updatedFields.price !== undefined ? Number(updatedFields.price) : p.price,
              mrp: updatedFields.mrp !== undefined ? Number(updatedFields.mrp) : p.mrp,
              stock: updatedFields.stock !== undefined ? Number(updatedFields.stock) : p.stock,
            }
          : p
      )
    );
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const togglePublish = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, published: !p.published } : p))
    );
  };

  const restock = (id, quantityToAdd) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, stock: p.stock + Number(quantityToAdd) } : p
      )
    );
  };

  const resetToDefaultSeed = () => {
    setProducts(seedProducts);
    localStorage.setItem('campuskart_products', JSON.stringify(seedProducts));
  };

  const lowStockProducts = products.filter((p) => p.stock < 10);

  return (
    <AdminProductContext.Provider
      value={{
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
      }}
    >
      {children}
    </AdminProductContext.Provider>
  );
};
