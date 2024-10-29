"use client";
import { useAuth } from "@/context/AuthContext";
import TasksTable from "../TasksTable/page";
import { Box, Heading } from "@chakra-ui/react";

const Homepage = () => {
  const { user, loading } = useAuth();

  if (loading) return <p>Chargement...</p>;
  if (!user) return null;

  const [firstName] = user.displayName
    ? user.displayName.split(" ")
    : ["Utilisateur"];

  return (
    <>
      <Box p={5} maxWidth="800px" mx="auto">
        <Heading mb={4}>Bienvenue, {firstName} !</Heading>
      </Box>

      <TasksTable />
    </>
  );
};

export default Homepage;
