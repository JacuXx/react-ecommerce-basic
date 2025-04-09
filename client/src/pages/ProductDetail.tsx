import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useCart, Product } from "@/context/CartContext";
import { 
  ArrowLeft, 
  ShoppingCart, 
  Star, 
  Plus, 
  Minus, 
  Check 
} from "lucide-react";

export default function ProductDetail() {
  const [location] = useLocation();
  const [, navigate] = useLocation();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  // Extract product ID from URL
  const productId = location.split('/')[2];

  // Fetch product details
  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ['/api/products', productId],
    queryFn: async () => {
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) {
        throw new Error('Error fetching product details');
      }
      return response.json();
    },
  });

  // Reset quantity and added state when product changes
  useEffect(() => {
    setQuantity(1);
    setAddedToCart(false);
  }, [productId]);

  // Format price as currency in Mexican Pesos
  const formatPrice = (price: string | number) => {
    return new Intl.NumberFormat('es-MX', { 
      style: 'currency', 
      currency: 'MXN' 
    }).format(typeof price === 'string' ? parseFloat(price) : price);
  };

  const handleQuantityChange = (value: number) => {
    const newQuantity = Math.max(1, Math.min(10, quantity + value));
    setQuantity(newQuantity);
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    await addToCart(product, quantity);
    setAddedToCart(true);
    
    // Reset added state after 2 seconds
    setTimeout(() => {
      setAddedToCart(false);
    }, 2000);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm border border-gray-100 p-8">
          <div className="flex flex-col md:flex-row gap-8 animate-pulse">
            <div className="md:w-1/2 bg-gray-200 rounded-lg h-96"></div>
            <div className="md:w-1/2 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-12 bg-gray-200 rounded w-1/2 mt-8"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Producto no encontrado</h2>
          <p className="text-gray-600 mb-6">Lo sentimos, no pudimos encontrar el producto que estás buscando.</p>
          <Button 
            onClick={() => navigate('/products')}
            className="bg-primary text-white"
          >
            Volver a productos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link href="/products" className="text-gray-600 hover:text-primary flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Volver a productos
        </Link>
      </div>
      
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Image */}
          <div className="md:w-1/2">
            <div className="bg-gray-50 rounded-lg p-8 flex items-center justify-center">
              <img 
                src={product.image} 
                alt={product.title} 
                className="max-h-96 object-contain mix-blend-multiply"
              />
            </div>
          </div>
          
          {/* Product Details */}
          <div className="md:w-1/2">
            <h1 className="text-2xl md:text-3xl font-bold mb-3">{product.title}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${star <= Math.round(product.rating.rate) ? 'fill-current' : ''}`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">
                ({product.rating.count} reseñas)
              </span>
            </div>
            
            <div className="text-2xl font-bold text-primary mb-6">
              {formatPrice(product.price)}
            </div>
            
            <p className="text-gray-600 mb-8">{product.description}</p>
            
            <div className="flex items-center mb-6">
              <span className="text-gray-700 font-medium mr-4">Cantidad:</span>
              <div className="flex items-center border rounded-md">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 font-medium">{quantity}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= 10}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Button 
              onClick={handleAddToCart}
              className={`px-8 py-6 text-lg font-medium rounded-lg w-full transition flex items-center justify-center
                ${addedToCart 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-primary hover:bg-primary/90 text-white'
                }`}
            >
              {addedToCart ? (
                <>
                  <Check className="mr-2 h-5 w-5" />
                  Añadido al carrito
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Añadir al carrito
                </>
              )}
            </Button>
            
            <div className="mt-8 border-t border-gray-100 pt-6">
              <div className="flex items-center text-sm text-gray-500">
                <span className="font-medium text-gray-700 mr-2">Categoría:</span>
                {product.category}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}