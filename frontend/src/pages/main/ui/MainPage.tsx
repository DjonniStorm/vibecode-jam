import { Container, Title, Text, Button, Stack, Center } from '@mantine/core';
import { Link } from 'react-router';
import { useUserContext } from '@entities/user';

const MainPage = () => {
  const { user } = useUserContext();

  return (
    <Center style={{ flex: 1 }}>
      <Container size="md" py="xl">
        <Stack gap="xl" align="center" ta="center">
          <Title order={1}>Добро пожаловать в Jam</Title>
          <Text size="lg" c="dimmed">
            Платформа для проведения технических собеседований
          </Text>
          {user ? (
            <Button component={Link} to="/contests" size="lg">
              Перейти к собеседованиям
            </Button>
          ) : (
            <Stack gap="md">
              <Button component={Link} to="/auth/login" size="lg">
                Войти
              </Button>
              <Button component={Link} to="/auth/register" variant="light" size="lg">
                Зарегистрироваться
              </Button>
            </Stack>
          )}
        </Stack>
      </Container>
    </Center>
  );
};

MainPage.displayName = 'MainPage';

export { MainPage };
