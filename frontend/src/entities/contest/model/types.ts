interface Contest {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'inactive';
}

interface Task {
  id: string;
  name: string;
}

type TaskStatusResult = 'ok' | 'error' | 'pending';

interface TaskStatus {
  taskId: string;
  status: TaskStatusResult;
}

interface ContestStore {
  tasks: TaskStatus[];
  setTasks: (tasks: TaskStatus[]) => void;
  updateTaskStatus: (taskId: string, status: TaskStatusResult) => void;
}

export type { Contest, Task, TaskStatus, TaskStatusResult, ContestStore };
