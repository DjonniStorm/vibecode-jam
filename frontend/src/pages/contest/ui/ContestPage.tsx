import { Container, Title, Stack, Loader, Text } from '@mantine/core';
import { InterviewFlow } from './InterviewFlow';
import { useHead } from '@unhead/react';
import {
  useCopyPasteBlock,
  useDevToolsBlock,
  usePageLeaveWarning,
} from '@features/contest-protection';
import styles from './ContestPage.module.scss';
import { useParams } from 'react-router';
import { useInterview } from '@entities/interview';

const ContestPage = () => {
  const { id } = useParams();
  const { data: interview, isLoading } = useInterview(id || '');

  // Защита контеста
  useCopyPasteBlock(true);
  useDevToolsBlock(true);
  usePageLeaveWarning(true);

  useHead({
    title: interview ? `Собеседование: ${interview.title} - Jam` : 'Собеседование - Jam',
    meta: [
      {
        name: 'description',
        content: interview
          ? `Прохождение собеседования: ${interview.title}`
          : 'Прохождение технического собеседования',
      },
      {
        property: 'og:title',
        content: interview ? `Собеседование: ${interview.title}` : 'Собеседование - Jam',
      },
      {
        property: 'og:description',
        content: interview
          ? `Прохождение собеседования: ${interview.title}`
          : 'Прохождение технического собеседования',
      },
    ],
  });

  if (isLoading) {
    return (
      <Container size="xl" py="xl">
        <Stack align="center" justify="center" h="100%">
          <Loader size="lg" />
          <Text>Загрузка собеседования...</Text>
        </Stack>
      </Container>
    );
  }

  if (!interview) {
    return (
      <Container size="xl" py="xl">
        <Stack align="center" justify="center" h="100%">
          <Text size="lg" c="red">
            Собеседование не найдено
          </Text>
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl" className={styles.section}>
      <Stack gap="lg">
        <Title order={1}>{interview.title}</Title>
        {id && <InterviewFlow interviewId={id} />}
      </Stack>
    </Container>
  );
};

ContestPage.displayName = 'ContestPage';

export { ContestPage };
