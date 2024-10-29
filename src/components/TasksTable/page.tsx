"use client";
import { useEffect, useState } from "react";
import { db } from "@/firebase"; // Assure-toi que Firebase est bien configuré ici
import { collection, getDocs } from "firebase/firestore";
import { Button, Link, Table } from "@chakra-ui/react";

interface Task {
  id: string;
  name: string;
  category: string;
  priority: string;
  deadline: string;
  status: string;
}

const TasksTable = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

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
            category: data.category || "Non catégorisé",
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

    fetchTasks();
  }, []);

  return (
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
          {tasks.map((task) => (
            <Table.Row key={task.id}>
              <Table.Cell>{task.name}</Table.Cell>
              <Table.Cell>{task.category}</Table.Cell>
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
  );
};

export default TasksTable;
