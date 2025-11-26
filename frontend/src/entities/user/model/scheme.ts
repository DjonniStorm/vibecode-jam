import { z } from 'zod';

const userCreateSchema = z.object({
  name: z.string().min(1, { message: 'Имя обязательно' }),
  surname: z.string().min(1, { message: 'Фамилия обязательна' }),
  email: z.email({ message: 'Неверный email' }),
  telegram: z.string().min(1, { message: 'Телеграм обязательно' }),
});

const userSchema = z.object({
  id: z.uuid({ message: 'Неверный ID' }),
  name: z.string().min(1, { message: 'Имя обязательно' }),
  surname: z.string().min(1, { message: 'Фамилия обязательна' }),
  email: z.email({ message: 'Неверный email' }),
  telegram: z.string().min(1, { message: 'Телеграм обязательно' }),
});

export { userCreateSchema, userSchema };
