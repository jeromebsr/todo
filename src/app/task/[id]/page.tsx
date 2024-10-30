"use client";
import { db } from "@/firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Box, Heading, Text, Spinner, Button, Link, Badge } from "@chakra-ui/react";
import { useParams, useRouter } from "next/navigation";

interface Task {
  name: string;
  category: string;
  priority: string;
  deadline: string;
  status: string;
  description: string;
  creation_date: string;
  assignedUsers: string;
}

interface User {
  uid: string;
  firstName: string;
}

const TaskDetail = () => {
  const router = useRouter();
  const { id } = useParams();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [assignedUsers, setAssignedUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchAssignedUsers = async () => {
      if (task && task.assignedUsers.length > 0) {
        try {
          const uids = task.assignedUsers.split(",");

          const usersQuery = query(
            collection(db, "users"),
            where("__name__", "in", uids)
          );

          const querySnapshot = await getDocs(usersQuery);
          const users = querySnapshot.docs.map((doc) => ({
            uid: doc.id,
            firstName: doc.data().firstName,
          }));

          setAssignedUsers(users);
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchAssignedUsers();
  }, [task]);

  useEffect(() => {
    const fetchTask = async () => {
      if (id) {
        try {
          const taskDoc = doc(db, "tasks", id);
          const taskSnapshot = await getDoc(taskDoc);
          if (taskSnapshot.exists()) {
            setTask(taskSnapshot.data() as Task); // Récupération des données de la tâche puis typer
          } else {
            console.error("La tâche n'existe pas.");
          }
        } catch (error) {
          console.error("Erreur lors de la récupération de la tâche :", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTask();
  }, [id]);

  if (loading) {
    return <Spinner />;
  }

  if (!task) {
    return <Text>Aucune tâche trouvée.</Text>;
  }

  return (
    <Box p={5} maxWidth="600px" mx="auto">
      <Heading mb={4}>Détails de la tâche</Heading>
      <Text>
        <strong>Nom :</strong> {task.name}
      </Text>
      <Text>
        <strong>Catégorie :</strong> {task.category}
      </Text>
      <Text>
        <strong>Priorité :</strong> {task.priority}
      </Text>
      <Text>
        <strong>Date Limite :</strong> {task.deadline}
      </Text>
      <Text>
        <strong>Statut :</strong> {task.status}
      </Text>
      {task.description && (
        <Text>
          <strong>Description :</strong> {task.description}
        </Text>
      )}
      <Text>
        <strong>Créée le :</strong> {task.creation_date}
      </Text>
      <Text>
        <strong>Par :</strong> {task.displayName}
      </Text>
      <Text>
        <strong>Assigné(s) :</strong>
        {assignedUsers.map((user) => (
          <Badge colorPalette="purple" size="lg" mr={1} ml={1} key={user.uid}>{user.firstName}</Badge>
        ))}
      </Text>
      <Button colorPalette="teal" variant="solid" size="sm" mt={3}>
        <Link href={`/task/edit/${id}`}>Modifier</Link>
      </Button>
      <Button
        type="submit"
        colorPalette="red"
        size="sm"
        ml={2}
        mt={3}
        onClick={() => router.push("/")}
      >
        Retour
      </Button>
    </Box>
  );
};

export default TaskDetail;
