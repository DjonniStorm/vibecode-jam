import { z } from 'zod';

const userSchema = z.object({
  id: z.uuid({ message: 'Неверный ID' }),
  name: z.string().min(1, { message: 'Имя обязательно' }),
  surname: z.string().min(1, { message: 'Фамилия обязательна' }),
  email: z.email({ message: 'Неверный email' }),
  telegram: z.string().min(1, { message: 'Телеграм обязательно' }),
  registeredAt: z.string().optional(),
});

const userStatsSchema = z.object({
  totalInterviews: z.number(),
  manualInterviews: z.number(),
  aiInterviews: z.number(),
  interviewsInProgress: z.number(),
  interviewsCompleted: z.number(),
  interviewsCancelled: z.number(),
  totalTasks: z.number(),
  tasksNotStarted: z.number(),
  tasksInProgress: z.number(),
  tasksDone: z.number(),
  averageAiScore: z.number().nullable(),
});

export { userSchema, userStatsSchema };
