import React from 'react';
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

interface SliderImageProps {
  imageUrl: string;
  title: string;
  buttonLink: string;
}

export function SliderImage({ 
  imageUrl, 
  title, 
  buttonLink 
}: SliderImageProps) {
  return (
    <div className="relative h-full w-full group">
      <div className="h-full cursor-pointer">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover rounded-lg"
        />
        
        {/* Overlay con gradiente sutil - solo aparece en hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Botón centrado - solo aparece en hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <Button 
            asChild
            size="lg"
            className="bg-white/90 hover:bg-white text-primary font-medium px-8 py-7 text-lg rounded-full shadow-lg backdrop-blur-sm border-0 transform transition-transform hover:scale-105"
          >
            <Link href={buttonLink}>Ver colección</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}