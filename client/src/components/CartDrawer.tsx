import { useCart, CartItem } from "@/context/CartContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  X, 
  ShoppingBag,
  ArrowRight 
} from "lucide-react";

export function CartDrawer() {
  const { 
    cart, 
    isCartOpen, 
    closeCart, 
    removeFromCart, 
    updateQuantity, 
    cartTotal
  } = useCart();
  const [, navigate] = useLocation();

  // Format price as currency in Mexican Pesos
  const formatPrice = (price: string | number) => {
    return new Intl.NumberFormat('es-MX', { 
      style: 'currency', 
      currency: 'MXN' 
    }).format(typeof price === 'string' ? parseFloat(price) : price);
  };

  const handleQuantityChange = (item: CartItem, newQuantity: number) => {
    updateQuantity(item.id, newQuantity);
  };

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    closeCart();
    navigate('/products');
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={closeCart}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col h-full">
        <SheetHeader className="p-4 border-b border-gray-200 bg-gray-50">
          <SheetTitle className="text-xl font-semibold">Tu Carrito</SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-gray-500 mb-6">Tu carrito está vacío</p>
              <Button 
                onClick={handleContinueShopping}
                className="bg-primary text-white"
              >
                Ver productos
              </Button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 py-4 border-b border-gray-100">
                <img 
                  src={item.product.image} 
                  alt={item.product.title} 
                  className="w-20 h-20 object-contain rounded-md bg-gray-50"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-sm line-clamp-2">{item.product.title}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <div className="font-semibold">{formatPrice(item.product.price)}</div>
                    <div className="flex items-center border rounded-md">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 p-0"
                        onClick={() => handleQuantityChange(item, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="px-2 text-sm">{item.quantity}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 p-0"
                        onClick={() => handleQuantityChange(item, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-right text-gray-700">
                    {formatPrice(parseFloat(item.product.price) * item.quantity)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {cart.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between mb-4">
              <span className="font-medium">Subtotal:</span>
              <span className="font-semibold">{formatPrice(cartTotal())}</span>
            </div>
            <Button 
              onClick={handleCheckout}
              className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-medium flex items-center justify-center"
            >
              Proceder al pago
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              variant="outline"
              onClick={closeCart}
              className="w-full mt-2 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
            >
              Continuar comprando
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
