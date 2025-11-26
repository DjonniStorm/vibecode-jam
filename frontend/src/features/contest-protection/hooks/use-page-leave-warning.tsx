import { useEffect } from 'react';
import { useBlocker } from 'react-router';
import { modals } from '@mantine/modals';
import { Image, Text, Button, Stack } from '@mantine/core';

// @ts-expect-error - React is not used in this file
import React from 'react';

export const usePageLeaveWarning = (enabled: boolean = true) => {
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      enabled && currentLocation.pathname !== nextLocation.pathname,
  );

  useEffect(() => {
    if (!enabled || blocker.state !== 'blocked') return;

    if (blocker.state === 'blocked') {
      modals.open({
        title: 'Внимание!',
        centered: true,
        children: (
          <Stack gap="md" align="center">
            <Image src="/images/focus lost.png" alt="Focus lost" maw={400} />
            <Text ta="center" c="dimmed">
              Вы пытаетесь покинуть страницу контеста. Весь несохраненный прогресс будет потерян.
            </Text>
            <Stack gap="sm" w="100%">
              <Button
                onClick={() => {
                  blocker.proceed();
                  modals.closeAll();
                }}
                color="red"
              >
                Покинуть страницу
              </Button>
              <Button
                variant="light"
                onClick={() => {
                  blocker.reset();
                  modals.closeAll();
                }}
              >
                Остаться на странице
              </Button>
            </Stack>
          </Stack>
        ),
        onClose: () => blocker.reset(),
      });
    }
  }, [blocker, enabled]);

  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'Вы пытаетесь закрыть страницу. Весь несохраненный прогресс будет потерян.';
      return e.returnValue;
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        modals.open({
          title: 'Внимание!',
          centered: true,
          children: (
            <Stack gap="md" align="center">
              <Image src="/images/focus lost.png" alt="Focus lost" maw={400} />
              <Text ta="center" c="dimmed">
                Вы переключились на другую вкладку. Пожалуйста, вернитесь к контесту.
              </Text>
              <Button onClick={() => modals.closeAll()}>Понятно</Button>
            </Stack>
          ),
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled]);
};
