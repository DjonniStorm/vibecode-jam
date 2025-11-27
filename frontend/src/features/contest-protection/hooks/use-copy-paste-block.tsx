import { useEffect } from 'react';
import { modals } from '@mantine/modals';
import { Image, Text, Button, Stack } from '@mantine/core';

export const useCopyPasteBlock = (enabled: boolean = true) => {
  useEffect(() => {
    if (!enabled) return;

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      modals.open({
        title: 'Копирование запрещено',
        centered: true,
        size: 'lg',
        children: (
          <Stack gap="md" align="center">
            <Image src="/images/paste code error.png" alt="Paste error" maw={400} fit="contain" />
            <Text ta="center" c="dimmed">
              Копирование и вставка кода запрещены во время прохождения контеста
            </Text>
            <Button onClick={() => modals.closeAll()} fullWidth>
              Понятно
            </Button>
          </Stack>
        ),
      });
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
    };

    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault();
    };

    document.addEventListener('paste', handlePaste);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCut);

    return () => {
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCut);
    };
  }, [enabled]);
};
