"use client";
import { useState, FormEvent, useEffect } from "react";
import { db } from "@/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { Fieldset, Heading, Input, Textarea } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import {
  NativeSelectField,
  NativeSelectRoot,
} from "@/components/ui/native-select";
import { Box } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import Select from "react-select";
import Creatable from "react-select/creatable";
import { sendEmail } from "@/components/emailjs/page";
interface Task {
  name: string;
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

interface Categorie {
  name: string;
}

const CreateTask = () => {
  const router = useRouter();
  const [task, setTask] = useState<Task>({
    name: "",
    priority: "",
    deadline: "",
    description: "",
    category: "",
    creation_date: "",
    updated_at: "",
    assignedUsers: "",
  });
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [categorieOptions, setCategorieOptions] = useState<any>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string>("");

  // Récupère les users en DB pour les attributions de tâche
  useEffect(() => {
    const fetchUsers = async () => {
      const usersSnapshot = await getDocs(collection(db, "users"));
      const usersList = usersSnapshot.docs.map((doc) => ({
        uid: doc.id,
        firstName: doc.data().firstName,
      }));
      setUsers(usersList);
    };
    fetchUsers();
  }, []);

  // Récupère les catégories en DB
  useEffect(() => {
    const fetchCategories = async () => {
      const catSnapshot = await getDocs(collection(db, "categories"));
      const catList = catSnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name
      }));
      setCategories(catList);

      const options = catList.map((cat) => ({
        value: cat.id,
        label: cat.name
      }));
      setCategorieOptions(options);
    };
    fetchCategories();
  }, []);

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

    if (
      !task.name ||
      task.priority === "Sélectionnez..." ||
      !task.deadline ||
      !task.description ||
      task.category === "Sélectionnez..."
    ) {
      setError("Tous les champs doivent être remplis !");
      console.log(task);
      return; // Ne pas soumettre si des champs sont vides
    }

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const currentDate = new Date().toLocaleDateString();

      // Ajouter la tâche
      await addDoc(collection(db, "tasks"), {
        ...task,
        userUid: user?.uid,
        displayName: user?.displayName,
        creation_date: currentDate,
        updated_at: null,
        status: "En attente",
      });

      sendEmail(
        user.email,
        user?.displayName,
        task.name,
        task.description,
        task.assignedUsers.split(",")
      );
      console.log(user)
      console.log("Tache ajoutée!");

      // Réinitialiser l'état de la tâche
      setTask({
        name: "",
        priority: "",
        deadline: "",
        description: "",
        category: "",
        creation_date: "",
        updated_at: "",
        assignedUsers: "",
      });

      router.push("/"); // Redirection une fois l'ajout terminé
    } catch (error) {
      console.error("Erreur lors de l’ajout de la tâche :", error);
    }
  };

  const userOptions = users.map((user) => ({
    value: user.uid,
    label: user.firstName,
  }));

  const handleUserChange = (selectedOptions: any) => {
    const selectedUserIds = selectedOptions
      ? selectedOptions.map((option: any) => option.value).join(",")
      : "";
    setTask((prevTask) => ({ ...prevTask, assignedUsers: selectedUserIds }));
  };

  const handleCategoryChange = (selectedOption: any) => {
    setTask((prevTask) => ({ ...prevTask, category: selectedOption.value }));
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
              <Creatable
                options={categorieOptions}
                onChange={handleCategoryChange}
                placeholder="Sélectionnez ou ajoutez une catégorie..."
                formatCreateLabel={(inputValue) => `Créer la catégorie : "${inputValue}"`}
                styles={{
                  control: (base) => ({
                    ...base,
                    backgroundColor: 'transparent',
                    color: 'black',
                    borderColor: 'gray',
                    width: '760px'
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: 'white',
                  }),
                  menu: (base) => ({
                    ...base,
                    backgroundColor: 'white',
                    color: 'black',
                  }),
                  option: (base, { isFocused, isSelected }) => ({
                    ...base,
                    backgroundColor: isSelected ? '#ccc' : isFocused ? '#eee' : 'white',
                    color: 'black',
                  }),
                  placeholder: (base) => ({
                    ...base,
                    color: 'gray',
                  }),
                }}
              />
            </Field>
            <Field>
              <Field label="Priorité">
                <NativeSelectRoot>
                  <NativeSelectField
                    name="priority"
                    items={["Sélectionnez...", "Faible", "Moyenne", "Haute"]}
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
            <Field label="Attribuer à">
              <Select
                options={userOptions}
                isMulti
                onChange={handleUserChange}
                placeholder="Sélectionnez des utilisateurs..."
                styles={{
                  control: (base) => ({
                    ...base,
                    backgroundColor: 'transparent',
                    color: 'black',
                    borderColor: 'gray',
                    width: '760px'
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: 'black',
                  }),
                  menu: (base) => ({
                    ...base,
                    backgroundColor: 'white',
                    color: 'black',
                  }),
                  option: (base, { isFocused, isSelected }) => ({
                    ...base,
                    backgroundColor: isSelected ? '#ccc' : isFocused ? '#eee' : 'white',
                    color: 'black',
                  }),
                  placeholder: (base) => ({
                    ...base,
                    color: 'gray',
                  }),
                }}
              />
            </Field>
          </Fieldset.Content>
          {error && <Fieldset.ErrorText>{error}</Fieldset.ErrorText>}
        </Fieldset.Root>
        <Button type="submit" mt={5}>
          Ajouter Tâche
        </Button>
      </form>
      <Button
        type="submit"
        colorPalette="red"
        mt={2}
        onClick={() => router.push("/")}
      >
        Annuler
      </Button>
    </Box>
  );
};

export default CreateTask;
