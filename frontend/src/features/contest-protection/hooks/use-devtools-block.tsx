import { useEffect } from 'react';
import { modals } from '@mantine/modals';
import { Image, Text, Button, Stack } from '@mantine/core';
import React from 'react';

export const useDevToolsBlock = (enabled: boolean = true) => {
  useEffect(() => {
    if (!enabled) return;

    let devToolsOpened = false;

    const checkDevTools = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;

      if (widthThreshold || heightThreshold) {
        if (!devToolsOpened) {
          devToolsOpened = true;
          modals.open({
            title: 'Открытие DevTools запрещено',
            centered: true,
            children: (
              <Stack gap="md" align="center">
                <Image src="/images/f12 key detected.png" alt="DevTools detected" maw={400} />
                <Text ta="center" c="dimmed">
                  Открытие инструментов разработчика запрещено во время прохождения контеста
                </Text>
                <Button onClick={() => modals.closeAll()}>Понятно</Button>
              </Stack>
            ),
          });
        }
      } else {
        devToolsOpened = false;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
        if (!devToolsOpened) {
          devToolsOpened = true;
          modals.open({
            title: 'Открытие DevTools запрещено',
            centered: true,
            children: (
              <Stack gap="md" align="center">
                <Image src="/images/f12 key detected.png" alt="DevTools detected" maw={400} />
                <Text ta="center" c="dimmed">
                  Открытие инструментов разработчика запрещено во время прохождения контеста
                </Text>
                <Button onClick={() => modals.closeAll()}>Понятно</Button>
              </Stack>
            ),
          });
        }
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const interval = setInterval(checkDevTools, 500);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      clearInterval(interval);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [enabled]);
};
