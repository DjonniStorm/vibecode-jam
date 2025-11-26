import { Title } from '@mantine/core';
import { CodeBlock } from './CodeBlock';
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
  const { data: interview } = useInterview(id || '');

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
  return (
    <section className={styles.section}>
      <Title order={1}>Contest {id}</Title>
      <CodeBlock className={styles['section__code-block']} />
    </section>
  );
};

ContestPage.displayName = 'ContestPage';

export { ContestPage };
