'use client'
import { Button, Link } from "@chakra-ui/react";
import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { app } from "@/firebase";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { user } = useAuth();
  const router = useRouter();
  const auth = getAuth(app);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/auth"); // Redirection vers la page de login après déconnexion
    } catch (error) {
      console.error("Erreur de déconnexion :", error);
    }
  };

  if (!user) return null;

  return (
    <>
      <Button colorPalette="teal" variant="solid" size="xl">
        <Link href="/task/new">Créer une tâche</Link>
      </Button>
      <Button colorPalette="red" variant="solid" size="xl" onClick={handleLogout}>
        <Link href="/task/new">Déconnexion</Link>
      </Button>
    </>
  );
};

export default Navbar;
