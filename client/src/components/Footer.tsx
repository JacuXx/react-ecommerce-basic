import { Facebook, Twitter, Instagram, Send, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <ShoppingBagIcon className="mr-2" /> ShopEase
            </h3>
            <p className="mb-4">Tu tienda online de confianza con los mejores productos al mejor precio.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition">
                <Facebook />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <Twitter />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <Instagram />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Enlaces</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-white transition">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition">
                  Productos
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-white transition">
                  Categorías
                </Link>
              </li>
              <li>
                <Link href="/offers" className="hover:text-white transition">
                  Ofertas
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Atención al cliente</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-white transition">
                  Devoluciones
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition">
                  Preguntas frecuentes
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-white transition">
                  Envíos
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Boletín</h4>
            <p className="mb-4">Suscríbete para recibir ofertas exclusivas.</p>
            <div className="flex">
              <Input 
                type="email" 
                placeholder="Tu email" 
                className="rounded-r-none focus-visible:ring-0"
              />
              <Button className="rounded-l-none bg-primary hover:bg-primary/90">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p>© 2023 ShopEase. Todos los derechos reservados.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/privacy" className="text-gray-400 hover:text-white transition">
              Privacidad
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white transition">
              Términos
            </Link>
            <Link href="/cookies" className="text-gray-400 hover:text-white transition">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Helper icon for ShoppingBag because it's used in the footer
function ShoppingBagIcon({ className }: { className?: string }) {
  return <Mail className={className} />;
}
