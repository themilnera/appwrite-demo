import { ID } from "appwrite";
import { databaseId, tableId, tablesDB } from "./appwrite";

interface Task {
  $id: string;
  title: string;
  content: string;
  completed: boolean;
}

export const loadTasks = async (): Promise<Task[]> => {
  try {
    const result = await tablesDB.listRows({
      databaseId,
      tableId,
    });
    return result.rows.map(row => ({
      $id: row.$id,
      title: row.title,
      content: row.content,
      completed: row.completed
    }));
  } catch (e) {
    console.log("Error loading tasks", e);
    return [];
  }
};

export const addTaskToDb = async(task: Task): Promise<void> =>{
  await tablesDB.createRow({
    databaseId: databaseId,
    tableId: tableId,
    rowId: ID.unique(),
    data: {
      title: task.title,
      content: task.content,
      completed: task.completed
    }
  }).then(result =>{
    console.log(result);
  }).catch(error =>{
    console.log(error);
  });

};

//updateTaskDb
export const updateTaskDb = async(task: Task): Promise<void> =>{
  console.log(`Attempting to update task. ID: ${task.$id}`)
  await tablesDB.updateRow({
    databaseId: databaseId,
    tableId: tableId,
    rowId: task.$id,
    data: {
      title: task.title,
      content: task.content,
      completed: task.completed
    }
  }).then(result =>{
    console.log(result);
  }).catch(error =>{
    console.log(error);
  });

}

//deleteTaskDb
export const deleteTaskDb = async(task: Task): Promise<void> =>{
  const result = await tablesDB.deleteRow({
    databaseId: databaseId,
    tableId: tableId,
    rowId: task.$id
  });
  console.log(result);
}

// Generate a unique ID for a new task
export const generateTaskId = (): string => {
  return ID.unique();
};