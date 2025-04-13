import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const signupSchema = z.object({
  name: z.string().min(2, {
    message: 'El nombre debe tener al menos 2 caracteres',
  }),
  email: z.string().email({
    message: 'Ingresa un correo electrónico válido',
  }),
  password: z.string().min(6, {
    message: 'La contraseña debe tener al menos 6 caracteres',
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function Signup() {
  const [_, setLocation] = useLocation();
  const { signup, loginWithGoogle } = useAuth();
  const { toast } = useToast();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(data: SignupFormValues) {
    try {
      await signup(data.email, data.password, data.name);
      toast({
        title: '¡Registro exitoso!',
        description: 'Tu cuenta ha sido creada correctamente.',
      });
      setLocation('/login');
    } catch (error: any) {
      console.error('Error en registro:', error);
      
      // Si es un error de configuración, redirigir a la página de configuración
      if (error.message && error.message.includes('configuración en Firebase')) {
        toast({
          title: 'Error de configuración',
          description: 'Es necesario completar la configuración de Firebase.',
          variant: 'destructive',
        });
        setLocation('/firebase-setup');
      } else {
        toast({
          title: 'Error al registrarse',
          description: error.message || 'Ha ocurrido un error. Intenta nuevamente.',
          variant: 'destructive',
        });
      }
    }
  }

  async function handleGoogleLogin() {
    try {
      await loginWithGoogle();
      toast({
        title: '¡Registro exitoso!',
        description: 'Te has registrado con Google correctamente.',
      });
      setLocation('/');
    } catch (error: any) {
      console.error('Error en registro con Google:', error);
      
      // Si es un error de configuración, redirigir a la página de configuración
      if (error.message && error.message.includes('configuración en Firebase')) {
        toast({
          title: 'Error de configuración',
          description: 'Es necesario completar la configuración de Firebase.',
          variant: 'destructive',
        });
        setLocation('/firebase-setup');
      } else {
        toast({
          title: 'Error al registrarse con Google',
          description: error.message || 'Ha ocurrido un error. Intenta nuevamente.',
          variant: 'destructive',
        });
      }
    }
  }

  return (
    <div className="container mx-auto mt-10 max-w-md">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Crear Cuenta</CardTitle>
          <CardDescription className="text-center">
            Ingresa tus datos para crear una nueva cuenta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Tu nombre" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico</FormLabel>
                    <FormControl>
                      <Input placeholder="correo@ejemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar Contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Registrarse
              </Button>
            </form>
          </Form>

          <div className="flex items-center gap-2 py-2">
            <Separator className="flex-1" />
            <span className="text-sm text-gray-500">O</span>
            <Separator className="flex-1" />
          </div>

          <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 48 48"
              className="mr-2"
            >
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              />
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              />
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              />
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              />
            </svg>
            Registrarse con Google
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            ¿Ya tienes una cuenta?{' '}
            <Button variant="link" className="p-0" onClick={() => setLocation('/login')}>
              Iniciar Sesión
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}