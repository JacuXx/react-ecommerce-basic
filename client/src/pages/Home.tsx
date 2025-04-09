import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { Product } from "@/context/CartContext";
import { 
  Truck, 
  RefreshCw, 
  Headphones, 
  ArrowRight, 
  Shirt, 
  Camera, 
  Gem, 
  UserCheck, 
  User
} from "lucide-react";

export default function Home() {
  const [categories, setCategories] = useState<string[]>([]);

  // Fetch products
  const { data: products, isLoading } = useQuery<Product[]>({ 
    queryKey: ['/api/products'], 
  });

  // Extract categories
  useEffect(() => {
    if (products && products.length > 0) {
      const categorySet = new Set(products.map(product => product.category));
      setCategories(Array.from(categorySet));
    }
  }, [products]);

  // Get icon for category
  const getCategoryIcon = (category: string) => {
    const iconClass = "text-4xl text-primary mb-3";
    
    if (category.includes("clothing")) {
      return <Shirt className={iconClass} />;
    } else if (category.includes("electronics")) {
      return <Camera className={iconClass} />;
    } else if (category.includes("jewelery")) {
      return <Gem className={iconClass} />;
    } else if (category.includes("men")) {
      return <User className={iconClass} />;
    } else if (category.includes("women")) {
      return <UserCheck className={iconClass} />;
    } else {
      return <Gem className={iconClass} />;
    }
  };

  return (
    <main className="flex-1">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Tu tienda online favorita</h1>
            <p className="text-lg md:text-xl opacity-90 mb-8">
              Descubre los mejores productos al mejor precio. Envíos gratis a partir de $1000 MXN.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products">
                <Button className="px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition text-center w-full sm:w-auto">
                  Ver productos
                </Button>
              </Link>
              <Button variant="outline" className="px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition text-center w-full sm:w-auto">
                Nuestras ofertas
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Highlights */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8 text-center">Nuestras categorías</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link key={category} href={`/products?category=${category}`}>
              <Button variant="outline" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center aspect-square w-full h-full">
                {getCategoryIcon(category)}
                <h3 className="font-medium">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </h3>
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Productos destacados</h2>
            <Link href="/products" className="text-primary font-medium hover:underline flex items-center">
              Ver todos <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg p-4 shadow-sm h-96 animate-pulse">
                  <div className="bg-gray-200 h-48 rounded mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded mb-4 w-3/4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2 w-1/4"></div>
                  <div className="flex justify-between mt-4">
                    <div className="bg-gray-200 h-6 rounded w-1/4"></div>
                    <div className="bg-gray-200 h-8 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products?.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Truck className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Envío gratuito</h3>
            <p className="text-gray-600">En todos los pedidos superiores a $1000 MXN</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <RefreshCw className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Devoluciones fáciles</h3>
            <p className="text-gray-600">30 días para cambios y devoluciones</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Headphones className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Atención al cliente</h3>
            <p className="text-gray-600">Soporte 24/7 para todas tus dudas</p>
          </div>
        </div>
      </div>
    </main>
  );
}
