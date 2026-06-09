import { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import { addToCartAPI, getCart, updateCartAPI, deleteCartAPI, replaceCartAPI } from '../services/api';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('cart_items', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = useCallback((product, selectedUnit) => {
    const unitId = selectedUnit?.id || product.units?.[0]?.id || product.unit_id;
    const price = selectedUnit?.selling_price || selectedUnit?.price || product.units?.[0]?.selling_price || product.units?.[0]?.price || product.price || product.sale_price || 0;
    const cartKey = `${product.id}_${unitId}`;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.cartKey === cartKey);
      if (existing) {
        return prev.map((item) =>
          item.cartKey === cartKey
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, {
        cartKey,
        id: product.id,
        product_id: product.id,
        title: product.name || product.title,
        price: parseFloat(price),
        image: product.image || product.photo || product.images?.[0]?.url || product.images?.[0] || '',
        unit_id: unitId,
        unit_name: selectedUnit?.name || product.units?.[0]?.name || '',
        quantity: 1,
      }];
    });

    // If logged in, also add to server
    const token = localStorage.getItem('auth_token');
    if (token) {
      addToCartAPI(product.id, unitId, price, 1).catch(() => {});
    }
  }, []);

  const removeFromCart = useCallback((cartKey) => {
    setCartItems((prev) => prev.filter((item) => item.cartKey !== cartKey));
  }, []);

  const updateQuantity = useCallback((cartKey, quantity) => {
    if (quantity < 1) {
      setCartItems((prev) => prev.filter((item) => item.cartKey !== cartKey));
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.cartKey === cartKey ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    const token = localStorage.getItem('auth_token');
    if (token) {
      deleteCartAPI('empty').catch(() => {});
    }
  }, []);

  // Sync local cart to server on login
  const syncCartToServer = useCallback(async () => {
    setSyncing(true);
    try {
      if (cartItems.length > 0) {
        const items = cartItems.map(item => ({
          product_id: item.product_id || item.id,
          unit_id: item.unit_id,
          quantity: item.quantity,
          price: item.price,
        }));
        await replaceCartAPI(items);
      }
      // Fetch server cart
      const response = await getCart();
      const serverCart = response.data?.data || response.data || [];
      if (Array.isArray(serverCart) && serverCart.length > 0) {
        setCartItems(serverCart.map(item => ({
          cartKey: `${item.product_id}_${item.unit_id}`,
          id: item.id,
          product_id: item.product_id,
          title: item.product?.name || item.name || item.title || `Product ${item.product_id}`,
          price: parseFloat(item.price) || 0,
          image: item.product?.image || item.product?.photo || '',
          unit_id: item.unit_id,
          unit_name: item.unit?.name || '',
          quantity: item.quantity || 1,
        })));
      }
    } catch (err) {
      console.error('Cart sync failed:', err);
    } finally {
      setSyncing(false);
    }
  }, [cartItems]);

  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);
  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const cartCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );

  const cartTotal = useMemo(
    () => cartItems.reduce((total, item) => total + (item.price || 0) * item.quantity, 0),
    [cartItems]
  );

  const value = useMemo(
    () => ({
      cartItems, cartCount, cartTotal, isCartOpen, syncing,
      addToCart, removeFromCart, updateQuantity, clearCart,
      toggleCart, openCart, closeCart, syncCartToServer,
    }),
    [cartItems, cartCount, cartTotal, isCartOpen, syncing, addToCart, removeFromCart, updateQuantity, clearCart, toggleCart, openCart, closeCart, syncCartToServer]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
