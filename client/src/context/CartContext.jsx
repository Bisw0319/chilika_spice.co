import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('chilika_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [coupon, setCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem('chilika_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [storeSettings, setStoreSettings] = useState({
    standardShippingFee: 49,
    freeShippingThreshold: 499,
    expressShippingFee: 99,
    codExtraFee: 0,
    shippingNotice: 'Free standard shipping on orders above ₹499'
  });

  const refreshSettings = async () => {
    try {
      const res = await api.getStoreSettings();
      if (res.success && res.settings) {
        setStoreSettings(res.settings);
      }
    } catch (e) {
      // Keep defaults
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('chilika_cart', JSON.stringify(cartItems));
    } catch {
      // Storage error fallback
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      if (coupon) {
        localStorage.setItem('chilika_coupon', JSON.stringify(coupon));
      } else {
        localStorage.removeItem('chilika_coupon');
      }
    } catch {
      // Storage error fallback
    }
  }, [coupon]);

  const addToCart = (product, selectedSize = '100g', quantity = 1) => {
    // Find variant if exists to get proper price
    let itemPrice = product.price;
    if (product.variants && product.variants.length > 0) {
      const variant = product.variants.find((v) => v.size === selectedSize);
      if (variant) itemPrice = variant.price;
    }

    const itemImage = (product.productImages && product.productImages[0]) || '/images/products/turmeric.jpg';

    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product._id && item.size === selectedSize
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prev,
          {
            productId: product._id,
            name: product.name,
            slug: product.slug,
            image: itemImage,
            size: selectedSize,
            price: itemPrice,
            quantity: quantity,
            category: product.category?.name || 'Spices'
          }
        ];
      }
    });
  };

  const removeFromCart = (productId, size) => {
    setCartItems((prev) => prev.filter((item) => !(item.productId === productId && item.size === size)));
  };

  const updateQuantity = (productId, size, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.productId === productId && item.size === size) {
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setCoupon(null);
    setCouponSuccess('');
    setCouponError('');
  };

  // Calculations with live store settings
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const freeThreshold = Number(storeSettings?.freeShippingThreshold ?? 499);
  const standardFee = Number(storeSettings?.standardShippingFee ?? 49);
  const shippingFee = (subtotal >= freeThreshold || subtotal === 0) ? 0 : standardFee;

  let discount = 0;
  if (coupon) {
    if (coupon.discountType === 'percentage') {
      discount = Math.round((subtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscountAmount && coupon.maxDiscountAmount > 0) {
        discount = Math.min(discount, coupon.maxDiscountAmount);
      }
    } else {
      discount = coupon.discountValue;
    }
    discount = Math.min(discount, subtotal);
  }

  const finalTotal = Math.max(0, subtotal + shippingFee - discount);

  const applyCoupon = async (code) => {
    try {
      setCouponError('');
      setCouponSuccess('');
      if (!code.trim()) {
        setCouponError('Please enter a coupon code');
        return false;
      }
      const res = await api.applyCoupon(code, subtotal);
      if (res.success && res.coupon) {
        setCoupon(res.coupon);
        setCouponSuccess(res.message);
        return true;
      }
    } catch (err) {
      setCouponError(err.message || 'Invalid coupon code');
      setCoupon(null);
      return false;
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponSuccess('');
    setCouponError('');
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        itemCount,
        shippingFee,
        discount,
        finalTotal,
        coupon,
        couponError,
        couponSuccess,
        applyCoupon,
        removeCoupon,
        storeSettings,
        refreshSettings,
        freeShippingThreshold: freeThreshold,
        standardShippingFee: standardFee
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
