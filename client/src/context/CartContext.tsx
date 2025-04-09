import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Define types
export interface Product {
  id: number;
  title: string;
  price: string;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  isLoading: boolean;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleCart: () => void;
  closeCart: () => void;
  cartTotal: () => number;
  cartCount: () => number;
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Define provider component
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Temporary user ID for demo purposes (in a real app would come from auth)
  const userId = 1;

  // Fetch cart items on mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/cart/${userId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch cart');
        }
        
        const data = await response.json();
        setCart(data);
      } catch (error) {
        console.error('Error fetching cart:', error);
        toast({
          title: "Error",
          description: "Failed to load your shopping cart",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, [toast]);

  // Add to cart
  const addToCart = async (product: Product, quantity = 1) => {
    try {
      setIsLoading(true);
      
      const response = await apiRequest("POST", `/api/cart/${userId}/add`, {
        productId: product.id,
        quantity,
      });
      
      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }
      
      // Refresh cart after adding item
      const cartResponse = await fetch(`/api/cart/${userId}`);
      const updatedCart = await cartResponse.json();
      setCart(updatedCart);
      
      toast({
        title: "Added to cart",
        description: `${product.title} has been added to your cart`,
      });
      
      // Open cart drawer after adding item
      setIsCartOpen(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Remove from cart
  const removeFromCart = async (itemId: number) => {
    try {
      setIsLoading(true);
      
      const response = await apiRequest("DELETE", `/api/cart/remove/${itemId}`, undefined);
      
      if (!response.ok) {
        throw new Error('Failed to remove item from cart');
      }
      
      // Update local cart state
      setCart(prevCart => prevCart.filter(item => item.id !== itemId));
      
      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart",
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update quantity
  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      setIsLoading(true);
      
      if (quantity <= 0) {
        // If quantity is 0 or negative, remove the item
        await removeFromCart(itemId);
        return;
      }
      
      const response = await apiRequest("PUT", `/api/cart/update/${itemId}`, {
        quantity,
      });
      
      if (!response.ok) {
        throw new Error('Failed to update cart');
      }
      
      // Refresh cart after updating
      const cartResponse = await fetch(`/api/cart/${userId}`);
      const updatedCart = await cartResponse.json();
      setCart(updatedCart);
    } catch (error) {
      console.error('Error updating cart:', error);
      toast({
        title: "Error",
        description: "Failed to update cart",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      setIsLoading(true);
      
      // Remove each item from the cart
      for (const item of cart) {
        await apiRequest("DELETE", `/api/cart/remove/${item.id}`, undefined);
      }
      
      // Update local state
      setCart([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast({
        title: "Error",
        description: "Failed to clear cart",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCart = () => {
    setIsCartOpen(prev => !prev);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  // Calculate cart total
  const cartTotal = () => {
    return cart.reduce((total, item) => {
      return total + (parseFloat(item.product.price) * item.quantity);
    }, 0);
  };

  // Calculate total number of items in cart
  const cartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleCart,
        closeCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Hook for using the cart context
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
