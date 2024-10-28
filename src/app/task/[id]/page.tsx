import Link from "next/link";

const TaskList = () => {
  const task = [
    {
      id: "1",
      name: "Tâche 1",
      status: "En attente",
      priority: "Haute",
      deadline: "01/11/2025",
      creation_date: "28/10/2024",
      updated_at: "28/10/2024",
    },
  ];

  return (
    <div>
      <ul>
        {task.map((task) => (
          <>
            <h1>Détails de la tâche "{task.name}"</h1>
            <li key={task.id}>
              <p>{task.name}</p>
            </li>
          </>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
