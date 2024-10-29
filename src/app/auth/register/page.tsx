"use client";
import { Box, Button, Heading, HStack, Input } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { FormEvent, useState } from "react";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { app } from "@/firebase";
import { useRouter } from "next/navigation";
import { setDoc, doc, getFirestore } from "firebase/firestore";

const Register = () => {
  const auth = getAuth(app);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const firestore = getFirestore(app);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Création de l'utilisateur
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

       // Ajout de l'utilisateur dans Firestore (db users)
      await setDoc(doc(firestore, "users", user.uid), {
        uid: user.uid,
        firstName,
        lastName,
        email,
      });

      // Mise à jour du profil avec le nom complet
      await updateProfile(user, { displayName: `${firstName} ${lastName}` });
      console.log("Utilisateur créé !")
      router.push('/');
    } catch (error) {
      console.log("Erreur d'inscription :", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={5} maxWidth="800px" mx="auto">
      <Heading mb={4}>Inscription</Heading>
      <form onSubmit={handleSubmit}>
        <HStack gap="10" width="full">
          <Field label="Prénom" required>
            <Input
              type="text"
              placeholder="Prénom"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Field>
          <Field label="Nom" required>
            <Input
              type="text"
              placeholder="Nom"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Field>
        </HStack>
        <HStack gap="10" width="full" mt={4}>
          <Field label="Email" required>
            <Input
              type="email"
              placeholder="me@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field label="Mot de passe" required>
            <Input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
        </HStack>
        <Button type="submit" colorScheme="teal" mt={5} isLoading={loading}>
          M'inscrire
        </Button>
      </form>
    </Box>
  );
};

export default Register;
