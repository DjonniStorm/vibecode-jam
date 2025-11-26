import {
  Container,
  Title,
  Card,
  Stack,
  Text,
  Group,
  Badge,
  Grid,
  Paper,
  Loader,
  Divider,
} from '@mantine/core';
import { useHead } from '@unhead/react';
import { useMe, useMyStats } from '@entities/user';
import styles from './ProfilePage.module.scss';

const ProfilePage = () => {
  const { data: user, isLoading: userLoading } = useMe();
  const { data: stats, isLoading: statsLoading } = useMyStats();

  useHead({
    title: user ? `${user.name} ${user.surname} - Профиль - Jam` : 'Профиль - Jam',
    meta: [
      {
        name: 'description',
        content: 'Профиль пользователя на платформе Jam',
      },
      {
        property: 'og:title',
        content: 'Профиль - Jam',
      },
    ],
  });

  if (userLoading || statsLoading) {
    return (
      <Container size="lg" py="xl">
        <Stack align="center" justify="center" h="100%">
          <Loader size="lg" />
          <Text>Загрузка данных...</Text>
        </Stack>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container size="lg" py="xl">
        <Text size="lg" c="red">
          Пользователь не найден
        </Text>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl" className={styles.container}>
      <Stack gap="xl">
        <Title order={1}>Профиль</Title>

        {/* Информация о пользователе */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Title order={2}>Личная информация</Title>
            <Divider />
            <Grid>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Stack gap="xs">
                  <Text size="sm" c="dimmed">
                    Имя
                  </Text>
                  <Text size="lg" fw={500}>
                    {user.name}
                  </Text>
                </Stack>
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Stack gap="xs">
                  <Text size="sm" c="dimmed">
                    Фамилия
                  </Text>
                  <Text size="lg" fw={500}>
                    {user.surname}
                  </Text>
                </Stack>
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Stack gap="xs">
                  <Text size="sm" c="dimmed">
                    Email
                  </Text>
                  <Text size="lg" fw={500}>
                    {user.email}
                  </Text>
                </Stack>
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Stack gap="xs">
                  <Text size="sm" c="dimmed">
                    Telegram
                  </Text>
                  <Text size="lg" fw={500}>
                    {user.telegram || 'Не указан'}
                  </Text>
                </Stack>
              </Grid.Col>
              {user.registeredAt && (
                <Grid.Col span={12}>
                  <Stack gap="xs">
                    <Text size="sm" c="dimmed">
                      Дата регистрации
                    </Text>
                    <Text size="lg" fw={500}>
                      {new Date(user.registeredAt).toLocaleDateString('ru-RU', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Text>
                  </Stack>
                </Grid.Col>
              )}
            </Grid>
          </Stack>
        </Card>

        {/* Статистика */}
        {stats && (
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack gap="md">
              <Title order={2}>Статистика</Title>
              <Divider />

              {/* Статистика по собеседованиям */}
              <Paper p="md" withBorder radius="md">
                <Title order={3} mb="md">
                  Собеседования
                </Title>
                <Grid>
                  <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                    <Stack gap="xs" align="center">
                      <Text size="sm" c="dimmed" ta="center">
                        Всего
                      </Text>
                      <Badge size="xl" variant="light" color="blue">
                        {stats.totalInterviews}
                      </Badge>
                    </Stack>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                    <Stack gap="xs" align="center">
                      <Text size="sm" c="dimmed" ta="center">
                        Ручные
                      </Text>
                      <Badge size="xl" variant="light" color="cyan">
                        {stats.manualInterviews}
                      </Badge>
                    </Stack>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                    <Stack gap="xs" align="center">
                      <Text size="sm" c="dimmed" ta="center">
                        AI
                      </Text>
                      <Badge size="xl" variant="light" color="violet">
                        {stats.aiInterviews}
                      </Badge>
                    </Stack>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                    <Stack gap="xs" align="center">
                      <Text size="sm" c="dimmed" ta="center">
                        В процессе
                      </Text>
                      <Badge size="xl" variant="light" color="yellow">
                        {stats.interviewsInProgress}
                      </Badge>
                    </Stack>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                    <Stack gap="xs" align="center">
                      <Text size="sm" c="dimmed" ta="center">
                        Завершено
                      </Text>
                      <Badge size="xl" variant="light" color="green">
                        {stats.interviewsCompleted}
                      </Badge>
                    </Stack>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                    <Stack gap="xs" align="center">
                      <Text size="sm" c="dimmed" ta="center">
                        Отменено
                      </Text>
                      <Badge size="xl" variant="light" color="red">
                        {stats.interviewsCancelled}
                      </Badge>
                    </Stack>
                  </Grid.Col>
                  {stats.averageAiScore !== null && (
                    <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                      <Stack gap="xs" align="center">
                        <Text size="sm" c="dimmed" ta="center">
                          Средний балл (AI)
                        </Text>
                        <Badge size="xl" variant="filled" color="violet">
                          {stats.averageAiScore}
                        </Badge>
                      </Stack>
                    </Grid.Col>
                  )}
                </Grid>
              </Paper>

              {/* Статистика по заданиям */}
              <Paper p="md" withBorder radius="md">
                <Title order={3} mb="md">
                  Задания
                </Title>
                <Grid>
                  <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                    <Stack gap="xs" align="center">
                      <Text size="sm" c="dimmed" ta="center">
                        Всего
                      </Text>
                      <Badge size="xl" variant="light" color="blue">
                        {stats.totalTasks}
                      </Badge>
                    </Stack>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                    <Stack gap="xs" align="center">
                      <Text size="sm" c="dimmed" ta="center">
                        Не начато
                      </Text>
                      <Badge size="xl" variant="light" color="gray">
                        {stats.tasksNotStarted}
                      </Badge>
                    </Stack>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                    <Stack gap="xs" align="center">
                      <Text size="sm" c="dimmed" ta="center">
                        В процессе
                      </Text>
                      <Badge size="xl" variant="light" color="yellow">
                        {stats.tasksInProgress}
                      </Badge>
                    </Stack>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                    <Stack gap="xs" align="center">
                      <Text size="sm" c="dimmed" ta="center">
                        Выполнено
                      </Text>
                      <Badge size="xl" variant="light" color="green">
                        {stats.tasksDone}
                      </Badge>
                    </Stack>
                  </Grid.Col>
                </Grid>
              </Paper>
            </Stack>
          </Card>
        )}
      </Stack>
    </Container>
  );
};

ProfilePage.displayName = 'ProfilePage';

export { ProfilePage };
