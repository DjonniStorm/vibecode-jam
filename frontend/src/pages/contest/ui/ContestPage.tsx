import { Title } from '@mantine/core';
import { CodeBlock } from './CodeBlock';
import styles from './ContestPage.module.scss';
import { useParams } from 'react-router';

const ContestPage = () => {
  const { id } = useParams();
  return (
    <section className={styles.section}>
      <Title order={1}>Contest {id}</Title>
      <CodeBlock className={styles['section__code-block']} />
    </section>
  );
};

ContestPage.displayName = 'ContestPage';

export { ContestPage };
