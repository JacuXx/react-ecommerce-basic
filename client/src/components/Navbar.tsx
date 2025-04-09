import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Search, Menu } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

interface NavbarProps {
  onSearch?: (query: string) => void;
  searchQuery?: string;
}

export function Navbar({ onSearch, searchQuery = "" }: NavbarProps) {
  const [location] = useLocation();
  const { toggleCart, cartCount } = useCart();
  const [search, setSearch] = useState(searchQuery);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  const isActiveLink = (path: string) => {
    return location === path ? "text-primary" : "text-gray-700 hover:text-primary";
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-30">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-2xl font-bold text-primary flex items-center space-x-2">
            <ShoppingBag />
            <span>ShopEase</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className={`transition-colors ${isActiveLink("/")}`}>
              Inicio
            </Link>
            <Link href="/products" className={`transition-colors ${isActiveLink("/products")}`}>
              Productos
            </Link>
            <Link href="/offers" className="text-gray-700 hover:text-primary transition-colors">
              Ofertas
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-primary transition-colors">
              Contacto
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <Input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Buscar productos..."
              className="w-64 pl-10 pr-4"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleCart}
            className="relative p-2 text-gray-700 hover:text-primary"
          >
            <ShoppingBag className="h-6 w-6" />
            {cartCount() > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount()}
              </span>
            )}
          </Button>
          
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="py-4 space-y-4">
                <div className="mb-8">
                  <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-bold text-primary flex items-center space-x-2">
                    <ShoppingBag />
                    <span>ShopEase</span>
                  </Link>
                </div>
                <div className="relative mb-6">
                  <Input
                    type="text"
                    value={search}
                    onChange={handleSearchChange}
                    placeholder="Buscar productos..."
                    className="w-full pl-10 pr-4"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                </div>
                <nav className="flex flex-col space-y-4">
                  <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className={`transition-colors ${isActiveLink("/")}`}>
                    Inicio
                  </Link>
                  <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className={`transition-colors ${isActiveLink("/products")}`}>
                    Productos
                  </Link>
                  <Link href="/offers" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 hover:text-primary transition-colors">
                    Ofertas
                  </Link>
                  <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 hover:text-primary transition-colors">
                    Contacto
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
