import {
  AppShell,
  Burger,
  Group,
  UnstyledButton,
  Select,
  useMantineColorScheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link, Outlet, useNavigate } from 'react-router';
import { useUserContext } from '@entities/user';
import { logout } from '@entities/auth';
import type { MantineColorScheme } from '@mantine/core';
import styles from './AppLayout.module.scss';

const colorSchemes = ['light', 'dark', 'auto'] as const;
type ColorScheme = (typeof colorSchemes)[number];

export const AppLayout = () => {
  const [opened, { toggle }] = useDisclosure();
  const { user } = useUserContext();
  const navigate = useNavigate();
  const { setColorScheme, colorScheme } = useMantineColorScheme();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleColorSchemeChange = (value: string | null) => {
    const scheme = value as ColorScheme;
    if (scheme && colorSchemes.includes(scheme)) {
      setColorScheme(scheme as MantineColorScheme);
    }
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { desktop: true, mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Group justify="space-between" style={{ flex: 1 }}>
            <Link to="/" className={styles.logo}>
              Jam
            </Link>
            <Group ml="xl" gap="md" visibleFrom="sm">
              <UnstyledButton component={Link} to="/" className={styles.control}>
                Главная
              </UnstyledButton>
              {user ? (
                <>
                  <UnstyledButton component={Link} to="/contests" className={styles.control}>
                    Собеседования
                  </UnstyledButton>
                  <UnstyledButton component={Link} to="/profile" className={styles.control}>
                    Личный кабинет
                  </UnstyledButton>
                  <UnstyledButton onClick={handleLogout} className={styles.control}>
                    Выйти
                  </UnstyledButton>
                </>
              ) : (
                <UnstyledButton component={Link} to="/auth/login" className={styles.control}>
                  Войти
                </UnstyledButton>
              )}
              <Select
                data={colorSchemes}
                value={colorScheme || 'auto'}
                onChange={handleColorSchemeChange}
                w={100}
              />
            </Group>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar py="md" px={4}>
        <UnstyledButton component={Link} to="/" className={styles.control}>
          Главная
        </UnstyledButton>
        {user ? (
          <>
            <UnstyledButton component={Link} to="/contests" className={styles.control}>
              Собеседования
            </UnstyledButton>
            <UnstyledButton component={Link} to="/profile" className={styles.control}>
              Личный кабинет
            </UnstyledButton>
            <UnstyledButton onClick={handleLogout} className={styles.control}>
              Выйти
            </UnstyledButton>
          </>
        ) : (
          <UnstyledButton component={Link} to="/auth/login" className={styles.control}>
            Войти
          </UnstyledButton>
        )}
        <Select
          data={colorSchemes}
          value={colorScheme || 'auto'}
          onChange={handleColorSchemeChange}
          w="100%"
          mt="md"
        />
      </AppShell.Navbar>

      <AppShell.Main className={styles.main}>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};
