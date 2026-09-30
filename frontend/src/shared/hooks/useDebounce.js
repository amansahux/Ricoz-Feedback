import { useState, useEffect } from "react";

/**
 * useDebounce Hook: Delays updating the debounced value until after delay milliseconds
 * have elapsed since the last time the value changed.
 *
 * @param {any} value - Value to debounce
 * @param {number} delay - Delay in milliseconds (default: 1000ms / 1 second)
 * @returns {any} Debounced value
 */
export function useDebounce(value, delay = 1000) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
