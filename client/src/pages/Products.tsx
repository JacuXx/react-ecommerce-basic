import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ProductCard } from "@/components/ProductCard";
import { Navbar } from "@/components/Navbar";
import { Product } from "@/context/CartContext";
import { 
  Search, 
  AlertCircle, 
  Star,
  Frown
} from "lucide-react";

export default function Products() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([500]);

  // Get URL query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get("category");
    if (category) {
      setSelectedCategory(category);
    }
  }, [location]);

  // Fetch all products
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

  // Filter products
  const filteredProducts = products?.filter(product => {
    // Filter by category
    if (selectedCategory && product.category !== selectedCategory) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        product.title.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query)
      );
    }
    
    // Filter by price range
    const price = parseFloat(product.price);
    if (price > priceRange[0]) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Nuestros Productos</h1>
        <p className="text-gray-600">Explora nuestra amplia gama de productos de alta calidad</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar - Categories & Filters */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 mb-6 sticky top-24">
            <h2 className="font-semibold text-lg mb-4">Categorías</h2>
            <ul className="space-y-2">
              <li>
                <Button 
                  variant="ghost"
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left justify-start py-1 px-0 h-auto font-normal ${
                    selectedCategory === null ? 'font-medium text-primary' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Todas las categorías
                </Button>
              </li>
              {categories.map(category => (
                <li key={category}>
                  <Button 
                    variant="ghost"
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left justify-start py-1 px-0 h-auto font-normal ${
                      selectedCategory === category ? 'font-medium text-primary' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Button>
                </li>
              ))}
            </ul>

            <hr className="my-5 border-gray-200" />

            <h2 className="font-semibold text-lg mb-4">Filtros</h2>
            
            {/* Price Range Filter */}
            <div className="mb-4">
              <h3 className="font-medium text-sm text-gray-700 mb-2">Rango de precio</h3>
              <Slider
                defaultValue={[500]}
                max={1000}
                step={1}
                value={priceRange}
                onValueChange={setPriceRange}
              />
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>0€</span>
                <span>1000€</span>
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <h3 className="font-medium text-sm text-gray-700 mb-2">Valoración</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="rating5" />
                  <Label htmlFor="rating5" className="flex text-yellow-400">
                    <Star className="fill-current h-4 w-4" />
                    <Star className="fill-current h-4 w-4" />
                    <Star className="fill-current h-4 w-4" />
                    <Star className="fill-current h-4 w-4" />
                    <Star className="fill-current h-4 w-4" />
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="rating4" />
                  <Label htmlFor="rating4" className="flex items-center">
                    <div className="flex text-yellow-400">
                      <Star className="fill-current h-4 w-4" />
                      <Star className="fill-current h-4 w-4" />
                      <Star className="fill-current h-4 w-4" />
                      <Star className="fill-current h-4 w-4" />
                      <Star className="h-4 w-4" />
                    </div>
                    <span className="text-gray-500 text-sm ml-1">y más</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="rating3" />
                  <Label htmlFor="rating3" className="flex items-center">
                    <div className="flex text-yellow-400">
                      <Star className="fill-current h-4 w-4" />
                      <Star className="fill-current h-4 w-4" />
                      <Star className="fill-current h-4 w-4" />
                      <Star className="h-4 w-4" />
                      <Star className="h-4 w-4" />
                    </div>
                    <span className="text-gray-500 text-sm ml-1">y más</span>
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Search & Sorting */}
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-auto">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar productos..."
                className="w-full sm:w-64 pl-10 pr-4 py-2"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
            <div className="flex items-center w-full sm:w-auto">
              <label htmlFor="sort" className="text-sm text-gray-600 mr-2">Ordenar por:</label>
              <select id="sort" className="border border-gray-300 rounded-lg py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary flex-1">
                <option value="popularity">Popularidad</option>
                <option value="price_asc">Precio: Menor a Mayor</option>
                <option value="price_desc">Precio: Mayor a Menor</option>
                <option value="rating">Mejor valorados</option>
              </select>
            </div>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-white rounded-lg p-4 shadow-sm h-80 animate-pulse">
                  <div className="bg-gray-200 h-40 rounded mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded mb-4 w-3/4"></div>
                  <div className="flex justify-between mt-4">
                    <div className="bg-gray-200 h-6 rounded w-1/4"></div>
                    <div className="bg-gray-200 h-8 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No products found */}
          {!isLoading && filteredProducts?.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-100 text-center">
              <Frown className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">No se encontraron productos</h3>
              <p className="text-gray-500 mb-6">Intenta con otra búsqueda o categoría</p>
              <Button 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory(null);
                }}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
              >
                Ver todos los productos
              </Button>
            </div>
          )}

          {/* Products grid */}
          {!isLoading && filteredProducts && filteredProducts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
