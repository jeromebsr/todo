"use client";
import { useState, FormEvent } from "react";
import { db } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";
import { Fieldset, Heading, Input, Textarea } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import {
  NativeSelectField,
  NativeSelectRoot,
} from "@/components/ui/native-select";
import { Box } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { toaster } from "@/components/ui/toaster";
import { HStack } from "@chakra-ui/react";
import {
  RadioCardItem,
  RadioCardLabel,
  RadioCardRoot,
} from "@/components/ui/radio-card";

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

const CreateTask = () => {
  const [task, setTask] = useState<Task>({
    name: "",
    status: "",
    priority: "",
    deadline: "",
    description: "",
    category: "",
    creation_date: "",
    updated_at: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const currentDate = new Date().toLocaleDateString();

    try {
      // Ajouter la tâche
      await addDoc(collection(db, "tasks"), {
        ...task,
        creation_date: currentDate,
        updated_at: null,
        status: "En attente"
      });

      // Message de succès
      toaster.create({
        title: "Tâche ajoutée",
        description: "C'est fait, la tâche a bien été ajoutée à la liste !",
        type: "success",
      });

      // Réinitialiser l'état de la tâche
      setTask({
        name: "",
        status: "",
        priority: "",
        deadline: "",
        description: "",
        category: "",
        creation_date: "",
        updated_at: "",
      });
    } catch (error) {
      console.error("Erreur lors de l’ajout de la tâche :", error);
      //toast error
    }
  };

  return (
    <Box p={5} maxWidth="800px" mx="auto">
      <Heading mb={4}>Créer une Nouvelle Tâche</Heading>
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
            <Field>
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
          </Fieldset.Content>
          {/* <Fieldset.ErrorText>
            Some fields are invalid. Please check them.
          </Fieldset.ErrorText> */}
        </Fieldset.Root>
        <Button type="submit" colorScheme="teal" mt={5}>
          Ajouter Tâche
        </Button>
      </form>
    </Box>
  );
};

export default CreateTask;
