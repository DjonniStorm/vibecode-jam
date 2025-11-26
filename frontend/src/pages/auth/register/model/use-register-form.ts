import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(1, { message: 'Имя обязательно' }),
  surname: z.string().min(1, { message: 'Фамилия обязательна' }),
  email: z.email({ message: 'Неверный email' }),
  telegram: z.string().min(1, { message: 'Телеграм обязательно' }),
  password: z.string().min(6, { message: 'Пароль должен содержать минимум 6 символов' }),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const useRegisterForm = () => {
  return useForm<RegisterFormValues>({
    initialValues: {
      name: '',
      surname: '',
      email: '',
      telegram: '',
      password: '',
    },
    validate: zodResolver(registerSchema),
  });
};
