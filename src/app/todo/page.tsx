"use client";
import { useState, useEffect } from "react";

interface Task {
  text: string;
  completed: boolean;
}

export default function Home() {
  const [task, setTask] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState<string>("");

  // Load tasks from localStorage when the component mounts
  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  // Update localStorage whenever the tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (): void => {
    if (task.trim() === "") return;
    setTasks([...tasks, { text: task, completed: false }]);
    setTask("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  const toggleTaskCompletion = (index: number): void => {
    const updatedTasks = tasks.map((t, i) =>
      i === index ? { ...t, completed: !t.completed } : t
    );
    setTasks(updatedTasks);
  };

  const deleteTask = (index: number): void => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const startEditing = (index: number): void => {
    setEditingIndex(index);
    setEditingText(tasks[index].text);
  };

  const saveTask = (index: number): void => {
    const updatedTasks = tasks.map((t, i) =>
      i === index ? { ...t, text: editingText } : t
    );
    setTasks(updatedTasks);
    setEditingIndex(null); // Exit editing mode
  };

  const cancelEditing = (): void => {
    setEditingIndex(null); // Exit editing mode without saving
  };

  return (
    <div className="root-container">
      <div className="task-container">
        <h1 className="header">My Tasks</h1>
        <div className="flex items-center mb-6">
          <input
            type="text"
            className="input-field"
            placeholder="What do you need to do?"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={handleKeyDown} // Listen for Enter key press
          />
          <button onClick={addTask} className="edit-button ml-2">
            Add
          </button>
        </div>
        <ul className="space-y-3">
          {tasks.map((t, index) => (
            <li
              key={index}
              className={`flex items-center justify-between p-4 rounded-lg shadow-md ${
                t.completed ? "bg-green-100" : "bg-gray-100"
              } transition-all ease-in-out duration-200`}
            >
              {editingIndex === index ? (
                <input
                  type="text"
                  className="input-field"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" ? saveTask(index) : undefined
                  }
                />
              ) : (
                <span
                  className={`flex-grow cursor-pointer ${
                    t.completed ? "line-through text-gray-500" : "text-gray-900"
                  }`}
                  onClick={() => toggleTaskCompletion(index)}
                >
                  {t.text}
                </span>
              )}

              {editingIndex === index ? (
                <>
                  <button
                    onClick={() => saveTask(index)}
                    className="save-button"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="cancel-button ml-2"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => startEditing(index)}
                    className="edit-button"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTask(index)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
