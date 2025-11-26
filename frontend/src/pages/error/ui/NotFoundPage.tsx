import { Container, Title, Text, Button, Stack, Image } from '@mantine/core';
import { Link } from 'react-router';
import { useHead } from '@unhead/react';

const NotFoundPage = () => {
  useHead({
    title: '404 - Страница не найдена - Jam',
    meta: [
      {
        name: 'description',
        content: 'Страница не найдена',
      },
    ],
  });

  return (
    <Container size="md" py="xl">
      <Stack gap="xl" align="center" ta="center">
        <Image src="/images/404.png" alt="404" maw={500} />
        <Title order={1}>404</Title>
        <Text size="lg" c="dimmed">
          Страница, которую вы ищете, не существует
        </Text>
        <Button component={Link} to="/" size="lg">
          Вернуться на главную
        </Button>
      </Stack>
    </Container>
  );
};

NotFoundPage.displayName = 'NotFoundPage';

export { NotFoundPage };
