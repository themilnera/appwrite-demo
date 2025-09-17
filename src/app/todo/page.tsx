"use client";
import { useState, useEffect } from "react";
import { loadTasks, addTaskToDb, updateTaskDb, deleteTaskDb, generateTaskId } from "../functions";

interface Task {
  $id: string;
  title: string;
  content: string;
  completed: boolean;
}

export default function Home() {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>("");
  const [editingContent, setEditingContent] = useState<string>("");

  // Load tasks when the component mounts
  useEffect(() => {
    loadTasks().then(setTasks);
  }, []);

  // Save tasks whenever they change
  // useEffect(() => {
  //   saveTasks(tasks);
  // }, [tasks]);

  const addTask = (): void => {
    if (title.trim() === "" || content.trim() === "") return;
    const newTask: Task = {
      $id: generateTaskId(),
      title,
      content,
      completed: false,
    };
    addTaskToDb(newTask)

    setTasks([...tasks, newTask]);
    setTitle("");
    setContent("");
  };

  const toggleTaskCompletion = (index: number): void => {
    const updatedTasks = tasks.map((t, i) =>
      i === index ? { ...t, completed: !t.completed } : t
    );
    setTasks(updatedTasks);
  };

  const deleteTask = async (index: number): Promise<void> => {
    const taskToDelete = tasks[index];
    console.log(`Attempting to delete task ID: ${taskToDelete.$id}`)
    if (taskToDelete.$id) {
      try {
        await deleteTaskDb(taskToDelete);
      } catch (error) {
        console.error("Failed to delete task: "+error);
        return;
      }
    }
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const saveTask = (index: number): void => {
    const updatedTasks = tasks.map((t, i) => {
      if(i === index){ 
        let updTask: Task = {
          $id: t.$id,
          title: editingTitle,
          content: editingContent,
          completed: t.completed
        }
        updateTaskDb(updTask);
        return { ...t, title: editingTitle, content: editingContent } 
      }
      else{ 
        return t;
      }
    }
    );
    setTasks(updatedTasks);
    setEditingIndex(null);
  };

  const startEditing = (index: number): void => {
    setEditingIndex(index);
    setEditingTitle(tasks[index].title || "");
    setEditingContent(tasks[index].content || "");
  };

  const cancelEditing = (): void => {
    setEditingIndex(null);
  };

  return (
    <div className="root-container">
      <div className="task-container">
        <h1 className="header">My Tasks</h1>
        <div className="flex flex-col mb-6">
          <input
            type="text"
            className="input-field"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="input-field mt-2"
            placeholder="Task Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button onClick={addTask} className="edit-button mt-2">
            Add Task
          </button>
        </div>
        <ul className="space-y-3">
          {tasks.map((t, index) => (
            <li
              key={t.$id || index}
              className={`flex flex-col p-4 rounded-lg shadow-md ${
                t.completed ? "bg-green-100" : "bg-gray-100"
              } transition-all ease-in-out duration-200`}
            >
              <div className="flex items-center">
                {editingIndex !== index && (
                  <input
                    type="checkbox"
                    checked={!!t.completed}
                    onChange={() => toggleTaskCompletion(index)}
                    className="mr-2"
                  />
                )}
                {editingIndex === index ? (
                  <div className="flex flex-col">
                    <input
                      type="text"
                      className="input-field"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                    />
                    <textarea
                      rows={4}
                      className="input-field mt-2"
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                    />
                  </div>
                ) : (
                  <div>
                    <h2
                      className={`text-lg font-semibold ${
                        t.completed
                          ? "line-through text-gray-500"
                          : "text-gray-900"
                      }`}
                    >
                      {t.title}
                    </h2>
                    <p
                      className={`${
                        t.completed
                          ? "line-through text-gray-500"
                          : "text-gray-700"
                      }`}
                    >
                      {t.content}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex mt-2">
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
                      className="delete-button ml-2"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
