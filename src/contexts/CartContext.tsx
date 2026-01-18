import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product } from '../types';
import { cartApi } from '../api/client';

interface CartContextType {
  items: CartItem[];
  total: number;
  itemCount: number;
  loading: boolean;
  addItem: (product: Product, quantity?: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartApi.getCart();
      setItems(response.data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const itemCount = items.reduce(
    (count, item) => count + item.quantity,
    0
  );

  const addItem = async (product: Product, quantity: number = 1) => {
    try {
      await cartApi.addToCart(product.id, quantity);
      await fetchCart();
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      throw error;
    }
  };

  const removeItem = async (productId: number) => {
    try {
      await cartApi.removeFromCart(productId);
      setItems(prev => prev.filter(item => item.product.id !== productId));
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
      throw error;
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    try {
      if (quantity < 1) {
        await removeItem(productId);
        return;
      }
      await cartApi.updateCartItem(productId, quantity);
      setItems(prev =>
        prev.map(item =>
          item.product.id === productId
            ? { ...item, quantity }
            : item
        )
      );
    } catch (error) {
      console.error('Failed to update item quantity:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await cartApi.clearCart();
      setItems([]);
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    }
  };

  const value = {
    items,
    total,
    itemCount,
    loading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};