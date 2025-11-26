import {
  Container,
  Title,
  Text,
  Button,
  Stack,
  Paper,
  List,
  Badge,
  Loader,
  Center,
} from '@mantine/core';
import { useParams, useNavigate } from 'react-router';
import { useInterview } from '@entities/interview';
import styles from './ContestStartPage.module.scss';

const ContestStartPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: interview, isLoading } = useInterview(id || '');

  if (isLoading) {
    return (
      <Center h="50vh">
        <Loader />
      </Center>
    );
  }

  if (!interview) {
    return (
      <Container>
        <Text c="red">Собеседование не найдено</Text>
      </Container>
    );
  }

  const handleStart = () => {
    navigate(`/contest/${id}/play`);
  };

  return (
    <Container size="md" py="xl">
      <Paper p="xl" radius="md" withBorder>
        <Stack gap="lg">
          <div>
            <Title order={1} mb="md">
              {interview.title}
            </Title>
            <Badge color={interview.status === 'IN_PROGRESS' ? 'blue' : 'gray'} variant="light">
              {interview.status === 'IN_PROGRESS' ? 'В процессе' : interview.status}
            </Badge>
          </div>

          <div>
            <Title order={3} mb="sm">
              Описание
            </Title>
            <Text c="dimmed">
              Это техническое собеседование, которое поможет оценить ваши навыки программирования.
              Вам будет предложено решить несколько задач различной сложности.
            </Text>
          </div>

          <div>
            <Title order={3} mb="sm">
              Правила
            </Title>
            <List spacing="xs" size="sm">
              <List.Item>Время на выполнение ограничено</List.Item>
              <List.Item>Использование интернета разрешено</List.Item>
              <List.Item>Можно использовать любые справочные материалы</List.Item>
              <List.Item>Решения проверяются автоматически</List.Item>
              <List.Item>После начала контеста его нельзя отменить</List.Item>
            </List>
          </div>

          {interview.createdAt && (
            <Text size="sm" c="dimmed">
              Создано:{' '}
              {new Date(interview.createdAt).toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          )}

          <Button size="lg" onClick={handleStart} disabled={interview.status !== 'IN_PROGRESS'}>
            Начать собеседование
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

ContestStartPage.displayName = 'ContestStartPage';

export { ContestStartPage };
