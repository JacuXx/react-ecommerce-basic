import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Profile() {
  const [_, setLocation] = useLocation();
  const { currentUser, logout } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!currentUser) {
      setLocation('/login');
    }
  }, [currentUser, setLocation]);

  async function handleLogout() {
    try {
      await logout();
      toast({
        title: 'Sesión cerrada',
        description: 'Has cerrado sesión correctamente.',
      });
      setLocation('/');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Ocurrió un error al cerrar sesión.',
        variant: 'destructive',
      });
    }
  }

  if (!currentUser) {
    return null;
  }

  const initials = currentUser.displayName
    ? currentUser.displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <div className="container mx-auto mt-10 max-w-md">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Mi Perfil</CardTitle>
          <CardDescription className="text-center">
            Información de tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 flex flex-col items-center">
          <Avatar className="h-24 w-24">
            <AvatarImage src={currentUser.photoURL || ''} alt={currentUser.displayName || ''} />
            <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
          </Avatar>

          <div className="w-full space-y-2">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-500">Nombre</h3>
              <p className="text-lg font-medium">{currentUser.displayName || 'Usuario'}</p>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-500">Correo electrónico</h3>
              <p className="text-lg font-medium">{currentUser.email}</p>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-500">Cuenta verificada</h3>
              <p className="text-lg font-medium">
                {currentUser.emailVerified ? 'Sí' : 'No'}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button 
            variant="default"
            className="w-full" 
            onClick={() => setLocation('/')}
          >
            Ir a la Tienda
          </Button>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleLogout}
          >
            Cerrar Sesión
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}