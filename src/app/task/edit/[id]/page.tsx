"use client";
import { useEffect, useState, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { db } from "@/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { Fieldset, Heading, Input, Textarea } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import {
  NativeSelectField,
  NativeSelectRoot,
} from "@/components/ui/native-select";
import { Box } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import Select from "react-select";

interface Task {
  name: string;
  status: string;
  priority: string;
  deadline: string;
  description: string;
  category: string;
  creation_date: string;
  updated_at: string;
  assignedUsers: string;
}

interface User {
  uid: string;
  firstName: string;
}

const EditTask = () => {
  const router = useRouter();
  const { id } = useParams();
  const [task, setTask] = useState<Task | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [userOptions, setUserOptions] = useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [error, setError] = useState<string>("");

  // Charger les utilisateurs et créer les options de sélection
  useEffect(() => {
    const fetchUsers = async () => {
      const usersSnapshot = await getDocs(collection(db, "users"));
      const usersList = usersSnapshot.docs.map((doc) => ({
        uid: doc.id,
        firstName: doc.data().firstName,
      }));
      setUsers(usersList);

      // Définir les options de Select
      const options = usersList.map((user) => ({
        value: user.uid,
        label: user.firstName,
      }));
      setUserOptions(options);
    };
    fetchUsers();
  }, []);

  // Charger les détails de la tâche et initialiser les utilisateurs assignés
  useEffect(() => {
    const fetchTask = async () => {
      const taskDoc = await getDoc(doc(db, "tasks", id));
      if (taskDoc.exists()) {
        const fetchedTask = taskDoc.data() as Task;
        setTask(fetchedTask);

        // Initialiser les utilisateurs sélectionnés
        const assignedUserIds = fetchedTask.assignedUsers.split(",");
        const selectedOptions = userOptions.filter((option) =>
          assignedUserIds.includes(option.value)
        );
        setSelectedUsers(selectedOptions);
      } else {
        console.error("Tâche non trouvée !");
      }
    };

    if (id) {
      fetchTask();
    }
  }, [id, userOptions]);

  // Gérer les changements de champs
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setTask((prevTask) => (prevTask ? { ...prevTask, [name]: value } : null));
    setError("");
  };

  // Gérer la mise à jour des utilisateurs assignés
  const handleUserChange = (selectedOptions: any) => {
    setSelectedUsers(selectedOptions); // pour re-render le prénom
    const selectedUserIds = selectedOptions
      .map((option: any) => option.value)
      .join(","); // ajoute les ids dans un array
    setTask((prevTask) =>
      prevTask ? { ...prevTask, assignedUsers: selectedUserIds } : null
    ); // met à jour la tâche avec les nvx uids (personnes tag)
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !task?.name ||
      !task.status ||
      !task.priority ||
      !task.deadline ||
      !task.description ||
      !task.category
    ) {
      setError("Tous les champs doivent être remplis !");
      return;
    }

    try {
      const taskRef = doc(db, "tasks", id);
      const updatedAt = new Date().toLocaleDateString();
      await updateDoc(taskRef, { ...task, updated_at: updatedAt });

      console.log("Tache mise à jour");
      router.push(`/task/${id}`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la tâche :", error);
    }
  };

  if (!task) {
    return <p>Chargement de la tâche...</p>;
  }

  return (
    <Box p={5} maxWidth="800px" mx="auto">
      <Heading mb={4}>Modifier la Tâche</Heading>
      <form onSubmit={handleSubmit}>
        <Fieldset.Root size="lg" invalid>
          <Fieldset.Content>
            <Field label="Nom">
              <Input
                type="text"
                name="name"
                value={task.name}
                onChange={handleChange}
                placeholder="Nom de la tâche"
              />
            </Field>
            <Field label="Catégorie">
              <NativeSelectRoot>
                <NativeSelectField
                  name="category"
                  items={["Travail", "Course", "Ménage"]}
                  value={task.category}
                  onChange={handleChange}
                />
              </NativeSelectRoot>
            </Field>
            <Field label="Priorité">
              <NativeSelectRoot>
                <NativeSelectField
                  name="priority"
                  items={["Faible", "Moyenne", "Haute"]}
                  value={task.priority}
                  onChange={handleChange}
                />
              </NativeSelectRoot>
            </Field>
            <Field label="Description">
              <Textarea
                name="description"
                placeholder="Décrire la tâche en détails"
                value={task.description}
                onChange={handleChange}
              />
            </Field>
            <Field label="Deadline">
              <Input
                type="date"
                name="deadline"
                value={task.deadline}
                onChange={handleChange}
              />
            </Field>
            <Field label="Status">
              <NativeSelectRoot>
                <NativeSelectField
                  name="status"
                  items={["En attente", "En cours", "Terminée"]}
                  value={task.status}
                  onChange={handleChange}
                />
              </NativeSelectRoot>
            </Field>
            <Field label="Attribuer à">
              <Select
                options={userOptions}
                isMulti
                value={selectedUsers}
                onChange={handleUserChange}
                placeholder="Sélectionnez des utilisateurs..."
              />
            </Field>
          </Fieldset.Content>
          {error && <Fieldset.ErrorText>{error}</Fieldset.ErrorText>}
        </Fieldset.Root>
        <Button type="submit" colorScheme="teal" mt={5}>
          Mettre à Jour Tâche
        </Button>
      </form>
      <Button
        type="submit"
        colorPalette="red"
        mt={3}
        onClick={() => router.push("/")}
      >
        Annuler
      </Button>
    </Box>
  );
};

export default EditTask;
