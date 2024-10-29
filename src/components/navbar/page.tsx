"use client";
import { Box, Button, Heading, Link } from "@chakra-ui/react";
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
    <Box p={5} maxWidth="800px" mx="auto">
      <Heading mb={4}>Menu rapide</Heading>
      <Button colorPalette="teal" variant="solid" size="xl">
        <Link href="/task/new">Créer une tâche</Link>
      </Button>
      {" "}
      <Button colorPalette="teal" variant="solid" size="xl">
        <Link href="/account/edit">Mon Profil</Link>
      </Button>
      {" "}
      <Button
        colorPalette="red"
        variant="solid"
        size="xl"
        onClick={handleLogout}
      >
        <Link href="/task/new">Déconnexion</Link>
      </Button>
    </Box>
  );
};

export default Navbar;
