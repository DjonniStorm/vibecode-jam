import { createContext, useState } from 'react';
import type { ContestStore, TaskStatus, TaskStatusResult } from '../model/types';

const ContestStoreContext = createContext<ContestStore | null>(null);

const ContestStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasksStatus, setTasksStatus] = useState<TaskStatus[]>([]);
  const setTasks = (tasks: TaskStatus[]) => {
    setTasksStatus(tasks);
  };

  const updateTaskStatus = (taskId: string, status: TaskStatusResult) => {
    setTasksStatus(
      tasksStatus.map((task) => (task.taskId === taskId ? { ...task, status } : task)),
    );
  };

  return (
    <ContestStoreContext.Provider value={{ tasks: tasksStatus, setTasks, updateTaskStatus }}>
      {children}
    </ContestStoreContext.Provider>
  );
};

export { ContestStoreProvider, ContestStoreContext };
