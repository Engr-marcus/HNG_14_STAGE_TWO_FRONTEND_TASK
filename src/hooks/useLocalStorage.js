import { useState, useEffect } from "react";

/**
 * Persists state to localStorage.
 * @param {string} key - localStorage key
 * @param {*} initialValue - default value if key not found
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (err) {
      console.error(`useLocalStorage: failed to write key "${key}"`, err);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}