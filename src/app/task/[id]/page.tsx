'use client'
import { db } from "@/firebase"; // Assurez-vous d'importer votre instance de Firestore
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Box, Heading, Text, Spinner, Button, Link } from "@chakra-ui/react";
import { use } from "react"; // Importer le hook use
import { useRouter } from "next/navigation";

interface Task {
  name: string;
  category: string;
  priority: string;
  deadline: string;
  status: string;
  description?: string; 
  creation_date: string;
}

const TaskDetail = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();
  const { id } = use(params); // Utilisation de React.use() pour déballer les params
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      if (id) {
        try {
          const taskDoc = doc(db, "tasks", id);
          const taskSnapshot = await getDoc(taskDoc);
          if (taskSnapshot.exists()) {
            setTask(taskSnapshot.data() as Task); // Récupération des données de la tâche
          } else {
            console.error("La tâche n'existe pas.");
          }
        } catch (error) {
          console.error("Erreur lors de la récupération de la tâche :", error);
        } finally {
          setLoading(false); // Fin du chargement
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
      <Text><strong>Nom :</strong> {task.name}</Text>
      <Text><strong>Catégorie :</strong> {task.category}</Text>
      <Text><strong>Priorité :</strong> {task.priority}</Text>
      <Text><strong>Date Limite :</strong> {task.deadline}</Text>
      <Text><strong>Statut :</strong> {task.status}</Text>
      {task.description && <Text><strong>Description :</strong> {task.description}</Text>} 
      <Text><strong>Créée le :</strong> {task.creation_date}</Text>
      <Text><strong>Par</strong> : {task.username}</Text>
      <Button colorPalette="teal" variant="solid" size="sm" mt={3}>
        <Link href={`/task/edit/${id}`}>Modifier</Link>
      </Button>
      <Button type="submit" colorPalette="red" size='sm' ml={2} mt={3} onClick={() => (router.push('/'))}>
          Annuler
      </Button>
    </Box>
  );
};

export default TaskDetail;
