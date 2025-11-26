import { Group, Select, useMantineColorScheme, type MantineColorScheme } from '@mantine/core';
import styles from './Header.module.scss';

const colorSchemes = ['light', 'dark', 'auto'] as const;
type ColorScheme = (typeof colorSchemes)[number];

const Header = () => {
  const { setColorScheme } = useMantineColorScheme();
  return (
    <Group className={styles.header}>
      <Select
        data={colorSchemes}
        defaultValue="auto"
        onChange={(value: string | null) => {
          const colorScheme = value as ColorScheme;
          if (colorScheme && colorSchemes.includes(colorScheme)) {
            setColorScheme(colorScheme as MantineColorScheme);
          }
        }}
      />
    </Group>
  );
};

Header.displayName = 'Header';

export { Header };
