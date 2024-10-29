// src/context/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User, getAuth } from "firebase/auth";
import { app } from "@/firebase"; 
import { useRouter } from "next/navigation";
import { Spinner, VStack, Text } from "@chakra-ui/react";

interface AuthContextProps {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const auth = getAuth(app);

  useEffect(() => {
    // Écoute les changements d'état de connexion de Firebase
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      if (!firebaseUser) {
        router.push("/auth"); // Redirige les utilisateurs non connectés vers /login
      }
    });

    // Nettoyage de l'abonnement lors de la déconnexion
    return () => unsubscribe();
  }, [auth, router]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {loading ? <VStack colorPalette="teal">
      <Spinner color="colorPalette.600" />
      <Text color="colorPalette.600">Chargement...</Text>
    </VStack> : children}
    </AuthContext.Provider>
  );
};

// Hook pour utiliser l'authentification dans les composants
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
};
