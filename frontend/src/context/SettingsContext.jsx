import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const SettingsContext = createContext(null);
const CART_CACHE = 'peacock_cart_enabled';

// Read the last-known value synchronously so a fresh tab renders the correct
// nav immediately (no flash of the cart/login before /api/settings resolves).
function cachedCart() {
  const v = localStorage.getItem(CART_CACHE);
  if (v === 'true')  return true;
  if (v === 'false') return false;
  return true; // optimistic default on the very first visit only
}

export function SettingsProvider({ children }) {
  const [cartEnabled, setCartEnabledState] = useState(cachedCart);
  const [loading, setLoading]              = useState(true);

  const applyCart = (val) => {
    setCartEnabledState(val);
    try { localStorage.setItem(CART_CACHE, String(val)); } catch { /* ignore */ }
  };

  const refresh = () =>
    api.getSettings()
      .then(s => applyCart(s.cart_enabled !== false))
      .catch(() => {});

  useEffect(() => { refresh().finally(() => setLoading(false)); }, []);

  return (
    <SettingsContext.Provider value={{ cartEnabled, setCartEnabled: applyCart, loading, refresh }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
