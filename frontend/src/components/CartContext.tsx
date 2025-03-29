import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book } from '../types/books';

// Define types for cart items and context
interface CartItem {
  book: Book;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (book: Book) => void;
  removeFromCart: (bookId: number) => void;
  updateQuantity: (bookId: number, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  total: number;
  lastViewedPage: string;
  setLastViewedPage: (page: string) => void;
}

// Create context with default values
const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  itemCount: 0,
  total: 0,
  lastViewedPage: '/',
  setLastViewedPage: () => {},
});

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext);

// Provider component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Load cart from sessionStorage with error handling
  const loadFromSession = (key: string) => {
    try {
      const data = sessionStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error loading ${key} from sessionStorage`, error);
      return null;
    }
  };

  // Initialize state with saved data if available
  const [cartItems, setCartItems] = useState<CartItem[]>(
    () => loadFromSession('cart') || []
  );
  const [lastViewedPage, setLastViewedPage] = useState<string>(
    () => loadFromSession('lastViewedPage') || '/'
  );

  // Calculate total and item count
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const total = cartItems.reduce(
    (sum, item) => sum + item.book.price * item.quantity,
    0
  );

  // Save cart to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Save last viewed page to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('lastViewedPage', lastViewedPage);
  }, [lastViewedPage]);

  // Add an item to the cart (increase quantity if already added)
  const addToCart = (book: Book) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.book.bookId === book.bookId
      );
      if (existingItem) {
        return prevItems.map((item) =>
          item.book.bookId === book.bookId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { book, quantity: 1 }];
    });
  };

  // Remove an item completely from the cart
  const removeFromCart = (bookId: number) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.book.bookId !== bookId)
    );
  };

  // Update item quantity in the cart
  const updateQuantity = (bookId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
    } else {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.book.bookId === bookId ? { ...item, quantity } : item
        )
      );
    }
  };

  // Clear the entire cart and session storage
  const clearCart = () => {
    setCartItems([]);
    sessionStorage.removeItem('cart');
  };

  // Provide context value
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    itemCount,
    total,
    lastViewedPage,
    setLastViewedPage,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
