"use client";
import { Box, Button, Heading, HStack, Input } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { FormEvent, useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "@/firebase";
import { useRouter } from "next/navigation";

const Auth = () => {
  const auth = getAuth(app);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Connexion réussie")
      router.push("/");
    } catch (error) {
      console.log("Erreur de connexion :", error);
    } finally {
        setLoading(false)
    }
  };

  return (
    <Box p={5} maxWidth="800px" mx="auto">
      <Heading mb={4}>Connexion</Heading>
      <form onSubmit={handleSubmit}>
        <HStack gap="10" width="full">
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
              placeholder="me@example.com"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
        </HStack>
        <Button type="submit" colorScheme="teal" mt={5}>
          Me connecter
        </Button>
      </form>
    </Box>
  );
};

export default Auth;
