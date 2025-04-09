import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product, useCart } from "@/context/CartContext";
import { Star, ShoppingCart, Plus } from "lucide-react";
import { Link, useLocation } from "wouter";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [, navigate] = useLocation();

  // Format price as currency in Mexican Pesos
  const formatPrice = (price: string | number) => {
    return new Intl.NumberFormat('es-MX', { 
      style: 'currency', 
      currency: 'MXN' 
    }).format(typeof price === 'string' ? parseFloat(price) : price);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    // Prevent navigating to product detail when clicking add to cart button
    e.stopPropagation();
    addToCart(product);
  };

  const goToProductDetail = () => {
    navigate(`/products/${product.id}`);
  };

  return (
    <Card 
      className="overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow group cursor-pointer"
      onClick={goToProductDetail}
    >
      <div className="relative aspect-square bg-gray-100 p-4">
        <img 
          src={product.image} 
          alt={product.title}
          className="w-full h-full object-contain mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
          <Button 
            onClick={handleAddToCart}
            className="bg-white text-primary rounded-full p-3 shadow-md hover:bg-primary hover:text-white transition transform translate-y-2 group-hover:translate-y-0"
            variant="ghost"
            size="icon"
          >
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium text-gray-800 mb-2 line-clamp-2 min-h-[50px]">
          {product.title}
        </h3>
        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${star <= Math.round(product.rating.rate) ? 'fill-current' : ''}`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">
            ({product.rating.count})
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg">{formatPrice(product.price)}</span>
          <Button 
            onClick={handleAddToCart}
            className="bg-primary text-white rounded-lg px-3 py-2 text-sm hover:bg-primary/90 transition"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            Añadir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
