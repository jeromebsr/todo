"use client";
import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation"; // Utilisez 'next/navigation' pour le routing
import { db } from "@/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Fieldset, Heading, Input, Textarea } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import {
  NativeSelectField,
  NativeSelectRoot,
} from "@/components/ui/native-select";
import { Box } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { toaster } from "@/components/ui/toaster";
import { use } from "react";

interface Task {
  name: string;
  status: string;
  priority: string;
  deadline: string;
  description: string;
  category: string;
  creation_date: string;
  updated_at: string;
}

const EditTask = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [error, setError] = useState<string>("");
  const { id } = use(params);

  useEffect(() => {
    const fetchTask = async () => {
      const taskDoc = await getDoc(doc(db, "tasks", id));
      if (taskDoc.exists()) {
        setTask(taskDoc.data() as Task); // Charger les données de la tâche
      } else {
        console.error("Tâche non trouvée !");
      }
    };

    if (id) {
      fetchTask(); // Appel de fetchTask uniquement si id est disponible
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setTask((prevTask) => (prevTask ? { ...prevTask, [name]: value } : null));
    setError(""); // Réinitialiser l'erreur lors de la modification
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Vérifier si tous les champs sont remplis
    if (
      !task?.name ||
      !task.status ||
      !task.priority  ||
      !task.deadline ||
      !task.description ||
      !task.category
    ) {
      setError("Tous les champs doivent être remplis !");
      return; // Ne pas soumettre si des champs sont vides
    }

    try {
      const taskRef = doc(db, "tasks", id);
      const updatedAt = new Date().toLocaleDateString();
      await updateDoc(taskRef, { ...task, updated_at: updatedAt }); // Mettre à jour la tâche

      // Message de succès
      toaster.create({
        title: "Tâche mise à jour",
        description: "C'est fait, la tâche a bien été mise à jour !",
        type: "success",
      });

      // Rediriger vers la page de détails de la tâche ou une autre page
      router.push(`/task/${id}`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la tâche :", error);
      // Ici vous pouvez afficher un message d'erreur en cas de problème avec Firestore
    }
  };

  if (!task) {
    return <p>Chargement de la tâche...</p>; // Afficher un message de chargement
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
          </Fieldset.Content>
          {error && (
            <Fieldset.ErrorText>
              {error}
            </Fieldset.ErrorText>
          )}
        </Fieldset.Root>
        <Button type="submit" colorScheme="teal" mt={5}>
          Mettre à Jour Tâche
        </Button>
      </form>
    </Box>
  );
};

export default EditTask;
