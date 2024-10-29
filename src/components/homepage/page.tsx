"use client";
import { useAuth } from "@/context/AuthContext";
import { Table } from "@chakra-ui/react";
import TasksTable from "../TasksTable/page";

const items = [
  { id: 1, name: "Laptop", category: "Electronics", price: 999.99 },
  { id: 2, name: "Coffee Maker", category: "Home Appliances", price: 49.99 },
  { id: 3, name: "Desk Chair", category: "Furniture", price: 150.0 },
  { id: 4, name: "Smartphone", category: "Electronics", price: 799.99 },
  { id: 5, name: "Headphones", category: "Accessories", price: 199.99 },
];

const Homepage = () => {
  const { user, loading } = useAuth();

  if (loading) return <p>Chargement...</p>;
  if (!user) return null;

  return (
    <>
      <div>
        <h1>Bienvenue, {user.email}</h1>
      </div>

      <TasksTable />
    </>
  );
};

export default Homepage;
