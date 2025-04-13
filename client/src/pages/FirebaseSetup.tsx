import React from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function FirebaseSetup() {
  return (
    <div className="container mx-auto my-10 max-w-3xl px-4">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Configuración de Firebase Authentication</CardTitle>
          <CardDescription>
            Para utilizar el sistema de autenticación, necesitas completar la configuración en Firebase Console
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
            <h3 className="text-lg font-semibold text-amber-700 mb-2">
              ⚠️ Error de Configuración Detectado
            </h3>
            <p className="text-amber-700">
              Se detectó un error de tipo "auth/configuration-not-found", lo que indica que hay pasos de configuración pendientes en tu proyecto de Firebase.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Pasos para completar la configuración:</h3>
            
            <div className="space-y-2">
              <h4 className="font-medium">1. Habilitar métodos de autenticación</h4>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Ve a la <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">consola de Firebase</a> y selecciona tu proyecto.</li>
                <li>En el menú lateral, haz clic en <strong>Authentication</strong>.</li>
                <li>Ve a la pestaña <strong>Sign-in method</strong>.</li>
                <li>Habilita los métodos de autenticación que deseas usar:
                  <ul className="list-disc pl-5 mt-1">
                    <li><strong>Correo electrónico/contraseña</strong> - Para inicios de sesión con email.</li>
                    <li><strong>Google</strong> - Para inicios de sesión con cuentas de Google.</li>
                  </ul>
                </li>
              </ol>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">2. Agregar dominio autorizado</h4>
              <ol className="list-decimal pl-5 space-y-2">
                <li>En la sección de Authentication, ve a la pestaña <strong>Settings</strong>.</li>
                <li>Baja hasta encontrar <strong>Authorized domains</strong>.</li>
                <li>Haz clic en <strong>Add domain</strong> y agrega la URL de tu aplicación Replit:
                  <div className="bg-gray-100 p-2 rounded my-1 text-sm font-mono">
                    {window.location.origin}
                  </div>
                </li>
                <li>Haz clic en <strong>Add</strong>.</li>
              </ol>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-md p-4 mt-4">
              <h3 className="text-green-700 font-semibold mb-2">💡 Consejo</h3>
              <p className="text-green-700">
                Una vez que hayas completado estos pasos, actualiza esta página e intenta registrarte o iniciar sesión nuevamente.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Button asChild variant="outline">
            <Link href="/login">Volver a Iniciar Sesión</Link>
          </Button>
          <Button asChild>
            <Link href="/">Ir a Inicio</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}