import { Stack, Title } from '@mantine/core';
import { Link } from 'react-router';

const contests = [
  {
    id: 1,
    name: 'Contest 1',
    description: 'Description 1',
    link: '/contest/1',
  },
];

const AllContestsPages = () => {
  return (
    <section>
      <Title order={1}>All Contest Pages</Title>
      <Stack>
        {contests.map((contest) => (
          <Link key={contest.id} to={contest.link}>
            {contest.name}
          </Link>
        ))}
      </Stack>
    </section>
  );
};

AllContestsPages.displayName = 'AllContestsPages';

export { AllContestsPages };
