import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signup: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Función para registrar nuevos usuarios
  async function signup(email: string, password: string, name: string) {
    try {
      console.log("Intentando registrar usuario con:", { email, name });
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Usuario registrado correctamente:", userCredential.user);
      
      // Actualizar el perfil del usuario con su nombre
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: name
        });
        console.log("Perfil actualizado correctamente");
      }
    } catch (error: any) {
      console.error("Error al registrar usuario:", error);
      let message = "Error al registrar usuario";
      
      if (error.code === 'auth/email-already-in-use') {
        message = "Este correo electrónico ya está en uso";
      } else if (error.code === 'auth/invalid-email') {
        message = "Correo electrónico inválido";
      } else if (error.code === 'auth/weak-password') {
        message = "La contraseña es demasiado débil";
      } else if (error.code === 'auth/configuration-not-found') {
        message = "Error de configuración en Firebase. Verifica que hayas habilitado la autenticación con correo y contraseña en la consola de Firebase.";
      }
      
      throw new Error(message);
    }
  }

  // Función para iniciar sesión
  async function login(email: string, password: string) {
    try {
      console.log("Intentando iniciar sesión con:", email);
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Inicio de sesión exitoso");
    } catch (error: any) {
      console.error("Error al iniciar sesión:", error);
      let message = "Error al iniciar sesión";
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        message = "Correo electrónico o contraseña incorrectos";
      } else if (error.code === 'auth/invalid-email') {
        message = "Correo electrónico inválido";
      } else if (error.code === 'auth/user-disabled') {
        message = "Usuario deshabilitado";
      } else if (error.code === 'auth/configuration-not-found') {
        message = "Error de configuración en Firebase. Verifica que hayas habilitado la autenticación con correo y contraseña en la consola de Firebase.";
      }
      
      throw new Error(message);
    }
  }

  // Función para iniciar sesión con Google
  async function loginWithGoogle() {
    try {
      console.log("Intentando iniciar sesión con Google");
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Inicio de sesión con Google exitoso:", result.user);
    } catch (error: any) {
      console.error("Error al iniciar sesión con Google:", error);
      let message = "Error al iniciar sesión con Google";
      
      if (error.code === 'auth/popup-closed-by-user') {
        message = "Ventana emergente cerrada antes de completar la autenticación";
      } else if (error.code === 'auth/popup-blocked') {
        message = "La ventana emergente fue bloqueada por el navegador";
      } else if (error.code === 'auth/cancelled-popup-request') {
        message = "La solicitud de ventana emergente fue cancelada";
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        message = "Ya existe una cuenta con el mismo correo electrónico pero con diferentes credenciales";
      } else if (error.code === 'auth/configuration-not-found') {
        message = "Error de configuración en Firebase. Verifica que hayas habilitado la autenticación con Google en la consola de Firebase.";
      }
      
      throw new Error(message);
    }
  }

  // Función para cerrar sesión
  async function logout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      throw error;
    }
  }

  const value = {
    currentUser,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}