import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.email({ message: 'Неверный email' }),
  password: z.string().min(1, { message: 'Пароль обязателен' }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const useLoginForm = () => {
  return useForm<LoginFormValues>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: zodResolver(loginSchema),
  });
};
