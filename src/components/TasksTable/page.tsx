import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Box, Button, Heading, Link, Table } from "@chakra-ui/react";

interface Task {
  id: string;
  name: string;
  categoryId: string; 
  priority: string;
  deadline: string;
  status: string;
}

interface Category {
  id: string;
  name: string;
}

const TasksTable = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksCollection = collection(db, "tasks");
        const tasksSnapshot = await getDocs(tasksCollection);
        const tasksList = tasksSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || "Sans nom",
            categoryId: data.category, 
            priority: data.priority || "Non spécifiée",
            deadline: data.deadline || "Aucune date",
            status: data.status || "Indéfini",
          };
        }) as Task[];

        setTasks(tasksList);
      } catch (error) {
        console.error("Erreur lors de la récupération des tâches :", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const categoriesCollection = collection(db, "categories");
        const categoriesSnapshot = await getDocs(categoriesCollection);
        const categoriesList = categoriesSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,  
          };
        }) as Category[];

        const categoriesMap = {};
        categoriesList.forEach(category => {
          categoriesMap[category.id] = category.name; // Mapping dans foreach pour retrouver les names plutôt que les ID dans le tableau
        });

        setCategories(categoriesMap);
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories :", error);
      }
    };

    fetchTasks();
    fetchCategories(); // Appeler la fonction pour récupérer les catégories
  }, []);

  return (
    <Box p={5} maxWidth="800px" mx="auto">
      <Heading mb={4}>Liste des tâches</Heading>
      <Table.ScrollArea borderWidth="1px" maxW="fit-content">
        <Table.Root size="sm" variant="outline">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader minW="20px">Nom</Table.ColumnHeader>
              <Table.ColumnHeader minW="20px">Catégorie</Table.ColumnHeader>
              <Table.ColumnHeader minW="20px">Priorité</Table.ColumnHeader>
              <Table.ColumnHeader minW="20px">Date Limite</Table.ColumnHeader>
              <Table.ColumnHeader minW="20px">Statut</Table.ColumnHeader>
              <Table.ColumnHeader minW="20px">Action</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {tasks
              .filter((task) => task.status !== "Terminée")
              .map((task) => (
                <Table.Row key={task.id}>
                  <Table.Cell>{task.name}</Table.Cell>
                  <Table.Cell>{categories[task.categoryId] || task.categoryId}</Table.Cell> 
                  <Table.Cell>{task.priority}</Table.Cell>
                  <Table.Cell>{task.deadline}</Table.Cell>
                  <Table.Cell>{task.status}</Table.Cell>
                  <Table.Cell>
                    <Button colorPalette="teal" variant="solid" size="sm">
                      <Link href={`/task/${task.id}`}>Voir</Link>
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
    </Box>
  );
};

export default TasksTable;
