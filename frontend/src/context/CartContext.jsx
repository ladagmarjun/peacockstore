import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);
const CART_KEY = 'peacock_cart';

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const addItem = (product, color = null) => {
    setCart(prev => {
      const existing = prev.find(i => i.product_id === product.id && i.color === color);
      if (existing) {
        return prev.map(i =>
          i.product_id === product.id && i.color === color
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, {
        product_id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        glyph: product.glyph,
        quantity: 1,
        color,
      }];
    });
  };

  const removeItem = (product_id, color) => {
    setCart(prev => prev.filter(i => !(i.product_id === product_id && i.color === color)));
  };

  const updateQty = (product_id, color, qty) => {
    if (qty < 1) return removeItem(product_id, color);
    setCart(prev => prev.map(i =>
      i.product_id === product_id && i.color === color ? { ...i, quantity: qty } : i
    ));
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQty, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
