import type { Interview, InterviewStatus } from '@entities/interview';
import { Card, Stack, Title, Badge, Button, Text } from '@mantine/core';
import { Link } from 'react-router';

const getStatusLabel = (status: InterviewStatus): string => {
  const statusMap: Record<InterviewStatus, string> = {
    IN_PROGRESS: 'В процессе',
    COMPLETED: 'Завершено',
    CANCELLED: 'Отменено',
  };
  return statusMap[status] || status;
};

const getStatusColor = (status: InterviewStatus): string => {
  const colorMap: Record<InterviewStatus, string> = {
    IN_PROGRESS: 'blue',
    COMPLETED: 'green',
    CANCELLED: 'red',
  };
  return colorMap[status] || 'gray';
};

const ContestCard = ({ interview }: { interview: Interview }) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Title order={3}>{interview.title}</Title>
        <Badge color={getStatusColor(interview.status)} variant="light">
          {getStatusLabel(interview.status)}
        </Badge>
        {interview.createdAt && (
          <Text size="xs" c="dimmed">
            Создано: {new Date(interview.createdAt).toLocaleDateString('ru-RU')}
          </Text>
        )}
        {interview.totalScore !== null && interview.totalScore !== undefined && (
          <Text size="sm" fw={500}>
            Оценка: {interview.totalScore}
          </Text>
        )}
        <Button component={Link} to={`/contest/${interview.id}`} variant="light" fullWidth mt="md">
          Открыть
        </Button>
      </Stack>
    </Card>
  );
};

export { ContestCard };
