'use client'
import { getAuth, updateProfile } from "firebase/auth";
import { useState } from "react";
import { Button, Input, Box, Heading } from "@chakra-ui/react";

const UpdateUserProfile = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleUpdateProfile = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      setError("L'utilisateur n'est pas connecté.");
      return;
    }

    try {
      // Mise à jour du profil de l'utilisateur
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`, // Met à jour le nom d'affichage
      });
      setSuccess("Profil mis à jour avec succès !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil :", error);
      setError("Une erreur s'est produite lors de la mise à jour du profil.");
    }
  };

  return (
    <Box p={5} maxWidth="500px" mx="auto">
      <Heading mb={4}>Mettez à jour votre profile</Heading>
      <Input
        placeholder="Prénom"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        mb={3}
      />
      <Input
        placeholder="Nom"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        mb={3}
      />
      <Button colorScheme="teal" onClick={handleUpdateProfile}>
        Mettre à Jour le Profil
      </Button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </Box>
  );
};

export default UpdateUserProfile;