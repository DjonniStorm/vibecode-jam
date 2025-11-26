import { Button, Container, Paper, Stack, TextInput, Title } from '@mantine/core';
import { useRegisterForm } from '../model/use-register-form';
import { useRegister, useLogin } from '@entities/auth';
import { useNavigate } from 'react-router';
import { useUserContext } from '@entities/user';
import { useMe } from '@entities/user';
import styles from './RegisterPage.module.scss';
import { notifications } from '@mantine/notifications';

const RegisterPage = () => {
  const form = useRegisterForm();
  const registerMutation = useRegister();
  const loginMutation = useLogin();
  const navigate = useNavigate();
  const { setUser } = useUserContext();
  const { refetch } = useMe();

  const handleSubmit = form.onSubmit(async (values) => {
    try {
      const response = await registerMutation.mutateAsync(values);
      // Автоматически логиним пользователя после регистрации
      await loginMutation.mutateAsync({
        email: values.email,
        password: values.password,
      });
      // Загружаем данные пользователя
      const userResult = await refetch();
      if (userResult.data) {
        setUser(userResult.data);
      } else {
        setUser(response);
      }
      navigate('/');
    } catch (error: unknown) {
      console.error(error);
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось зарегистрироваться',
        color: 'red',
      });
    }
  });

  return (
    <Container size="xs" className={styles.container}>
      <Paper p="xl" shadow="md" radius="md" className={styles.paper}>
        <Title order={2} ta="center" mb="xl">
          Регистрация
        </Title>

        <form onSubmit={handleSubmit} className={styles.form}>
          <Stack gap="md">
            <TextInput
              label="Имя"
              placeholder="Введите имя"
              required
              {...form.getInputProps('name')}
            />

            <TextInput
              label="Фамилия"
              placeholder="Введите фамилию"
              required
              {...form.getInputProps('surname')}
            />

            <TextInput
              label="Email"
              placeholder="Введите email"
              type="email"
              required
              {...form.getInputProps('email')}
            />

            <TextInput
              label="Telegram"
              placeholder="Введите telegram"
              required
              {...form.getInputProps('telegram')}
            />

            <TextInput
              label="Пароль"
              placeholder="Введите пароль"
              type="password"
              required
              {...form.getInputProps('password')}
            />

            <Button type="submit" fullWidth loading={registerMutation.isPending} mt="md">
              Зарегистрироваться
            </Button>

            <Button variant="subtle" fullWidth onClick={() => navigate('/auth/login')}>
              Уже есть аккаунт? Войти
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

RegisterPage.displayName = 'RegisterPage';

export { RegisterPage };
