import { Title } from '@mantine/core';
import { CodeBlock } from './CodeBlock';
import styles from './ContestPage.module.scss';

const ContestPage = () => {
  return (
    <section className={styles.section}>
      <Title order={1}>Contest</Title>
      <CodeBlock className={styles['section__code-block']} />
    </section>
  );
};

ContestPage.displayName = 'ContestPage';

export { ContestPage };
