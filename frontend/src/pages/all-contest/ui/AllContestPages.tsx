import { Title, Grid, Text, Center, Loader } from '@mantine/core';
import { useInterviews } from '@entities/interview';
import styles from './AllContestPages.module.scss';
import { ContestCard } from './ContestCard';

const AllContestsPages = () => {
  const { data: interviews, isLoading } = useInterviews();

  if (isLoading) {
    return (
      <Center>
        <Loader />
      </Center>
    );
  }

  return (
    <section className={styles.section}>
      <Title order={1} mb="xl">
        Все собеседования
      </Title>
      <Grid>
        {interviews && interviews.length > 0 ? (
          interviews.map((interview) => (
            <Grid.Col key={interview.id} span={{ base: 12, sm: 6, md: 4 }}>
              <ContestCard interview={interview} />
            </Grid.Col>
          ))
        ) : (
          <Grid.Col span={12}>
            <Text c="dimmed" ta="center">
              Нет доступных собеседований
            </Text>
          </Grid.Col>
        )}
      </Grid>
    </section>
  );
};

AllContestsPages.displayName = 'AllContestsPages';

export { AllContestsPages };
