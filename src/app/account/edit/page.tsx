'use client'
import { getAuth, updateProfile } from "firebase/auth";
import { useState } from "react";
import { Button, Input, Box, Heading } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { getFirestore, setDoc, doc } from "firebase/firestore";

const UpdateUserProfile = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const firestore = getFirestore(); 
  
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

      // Mise à jour du profil dans la base de données Firestore
      await setDoc(doc(firestore, "users", user.uid), {
        firstName,
        lastName,
      }, { merge: true });

      console.log("Profil mis à jour avec succès !");
      router.push('/')
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
      <Button type="submit" colorPalette="red" ml={3} onClick={() => (router.push('/'))}>
          Retour
      </Button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </Box>
  );
};

export default UpdateUserProfile;