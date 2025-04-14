import React, { useState, useEffect } from 'react';
import { SliderImage } from './SliderImage';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Datos de las diapositivas
const slides = [
  {
    id: 1,
    imageUrl: "/assets/images/5092428.jpg",
    title: "Ofertas exclusivas",
    buttonLink: "/products"
  },
  {
    id: 2,
    imageUrl: "/assets/images/6957588.jpg",
    title: "Boutique exclusiva",
    buttonLink: "/products"
  }
];

export function HeroSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 para izquierda, 1 para derecha, 0 para inicial
  const [isAnimating, setIsAnimating] = useState(false);

  // Función para ir al slide anterior
  const prevSlide = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setDirection(-1);
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setTimeout(() => {
        setIsAnimating(false);
      }, 50);
    }, 300);
  };

  // Función para ir al siguiente slide
  const nextSlide = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setDirection(1);
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setTimeout(() => {
        setIsAnimating(false);
      }, 50);
    }, 300);
  };

  // Cambio automático de slides cada 6 segundos
  useEffect(() => {
    const slideInterval = setInterval(() => {
      if (!isAnimating) {
        nextSlide();
      }
    }, 6000);

    return () => clearInterval(slideInterval);
  }, [currentIndex, isAnimating]);

  // Función para ir a un slide específico
  const goToSlide = (slideIndex: number) => {
    if (isAnimating || slideIndex === currentIndex) return;
    
    setDirection(slideIndex > currentIndex ? 1 : -1);
    setIsAnimating(true);
    
    setTimeout(() => {
      setCurrentIndex(slideIndex);
      setTimeout(() => {
        setIsAnimating(false);
      }, 50);
    }, 300);
  };

  // Determinar la clase de animación basada en la dirección
  const getSlideAnimation = () => {
    if (!isAnimating) return '';
    return direction > 0 
      ? 'translate-x-[-100%] opacity-0' 
      : 'translate-x-[100%] opacity-0';
  };

  return (
    <div className="relative h-[400px] md:h-[500px] w-full mx-auto mb-10 group overflow-hidden rounded-lg">
      {/* Slide actual */}
      <div 
        className={`h-full w-full transition-all duration-300 ease-out ${getSlideAnimation()}`}
      >
        <SliderImage
          imageUrl={slides[currentIndex].imageUrl}
          title={slides[currentIndex].title}
          buttonLink={slides[currentIndex].buttonLink}
        />
      </div>

      {/* Botón izquierdo */}
      <Button
        variant="outline"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full w-10 h-10 flex items-center justify-center bg-white/80 hover:bg-white shadow-lg backdrop-blur-sm border-0"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-5 w-5 text-primary" />
      </Button>
      
      {/* Botón derecho */}
      <Button
        variant="outline"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full w-10 h-10 flex items-center justify-center bg-white/80 hover:bg-white shadow-lg backdrop-blur-sm border-0"
        onClick={nextSlide}
      >
        <ChevronRight className="h-5 w-5 text-primary" />
      </Button>

      {/* Indicadores de posición */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {slides.map((_, slideIndex) => (
          <div
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className={`cursor-pointer w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              currentIndex === slideIndex 
                ? 'bg-white shadow-lg scale-125' 
                : 'bg-white/60 hover:bg-white/80'
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
}