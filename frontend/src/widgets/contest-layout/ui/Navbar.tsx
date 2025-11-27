import { Stack, Button } from '@mantine/core';
import { Link } from 'react-router';

const Navbar = () => {
  return (
    <Stack gap="md">
      <Button component={Link} to="/" variant="light" fullWidth>
        На главную
      </Button>
    </Stack>
  );
};

Navbar.displayName = 'Navbar';

export { Navbar };
