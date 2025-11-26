interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  telegram: string;
  registeredAt?: string;
}

interface UserStats {
  totalInterviews: number;
  manualInterviews: number;
  aiInterviews: number;
  interviewsInProgress: number;
  interviewsCompleted: number;
  interviewsCancelled: number;
  totalTasks: number;
  tasksNotStarted: number;
  tasksInProgress: number;
  tasksDone: number;
  averageAiScore: number | null;
}

export type { User, UserStats };
