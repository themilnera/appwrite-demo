// functions.ts

interface Task {
  $id?: string;
  title: string;
  content: string;
  completed: boolean;
}

// Load tasks from localStorage
export const loadTasks = (): Task[] => {
  const storedTasks = localStorage.getItem("tasks");
  return storedTasks ? JSON.parse(storedTasks) : [];
};

// Save tasks to localStorage
export const saveTasks = (tasks: Task[]): void => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Generate a unique ID for a new task
export const generateTaskId = (): string => {
  return Date.now().toString();
};
