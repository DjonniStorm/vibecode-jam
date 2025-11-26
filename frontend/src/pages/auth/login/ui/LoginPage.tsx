import { Button, Container, Paper, Stack, TextInput, Title } from '@mantine/core';
import { useLoginForm } from '../model/use-login-form';
import { useLogin } from '@entities/auth';
import { useNavigate } from 'react-router';
import { useUserContext } from '@entities/user';
import { useMe } from '@entities/user';
import { useEffect } from 'react';
import { useHead } from '@unhead/react';
import styles from './LoginPage.module.scss';
import { notifications } from '@mantine/notifications';

const LoginPage = () => {
  useHead({
    title: 'Вход - Jam',
    meta: [
      {
        name: 'description',
        content:
          'Войдите в свой аккаунт на платформе Jam для прохождения технических собеседований',
      },
      {
        property: 'og:title',
        content: 'Вход - Jam',
      },
      {
        property: 'og:description',
        content: 'Войдите в свой аккаунт на платформе Jam',
      },
    ],
  });
  const form = useLoginForm();
  const loginMutation = useLogin();
  const navigate = useNavigate();
  const { setUser } = useUserContext();
  const { refetch } = useMe();

  useEffect(() => {
    if (loginMutation.isSuccess) {
      refetch().then((result) => {
        if (result.data) {
          setUser(result.data);
          navigate('/');
        }
      });
    }
  }, [loginMutation.isSuccess, refetch, setUser, navigate]);

  const handleSubmit = form.onSubmit(async (values) => {
    try {
      await loginMutation.mutateAsync(values);
    } catch (error: unknown) {
      console.error(error);
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось войти',
        color: 'red',
      });
    }
  });

  return (
    <Container size="xs" className={styles.container}>
      <Paper p="xl" shadow="md" radius="md" className={styles.paper}>
        <Title order={2} ta="center" mb="xl">
          Вход
        </Title>

        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <TextInput
              label="Email"
              placeholder="Введите email"
              type="email"
              required
              {...form.getInputProps('email')}
            />

            <TextInput
              label="Пароль"
              placeholder="Введите пароль"
              type="password"
              required
              {...form.getInputProps('password')}
            />

            <Button type="submit" fullWidth loading={loginMutation.isPending} mt="md">
              Войти
            </Button>

            <Button variant="subtle" fullWidth onClick={() => navigate('/auth/register')}>
              Нет аккаунта? Зарегистрироваться
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

LoginPage.displayName = 'LoginPage';

export { LoginPage };
