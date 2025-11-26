import { Loader, Select, Stack } from '@mantine/core';
import { Editor } from '@monaco-editor/react';
import { useState } from 'react';

const languages = ['javascript', 'python', 'cpp', 'c'];
const codeThemes = ['vs-dark', 'light', 'hc-black'];

const CodeBlock = ({ className }: { className?: string }) => {
  const [language, setLanguage] = useState(languages[0]);
  const [theme, setTheme] = useState(codeThemes[0]);
  return (
    <Stack className={className}>
      <Select
        data={languages}
        defaultValue={languages[0]}
        onChange={(value) => {
          if (value && languages.includes(value)) {
            setLanguage(value);
          } else {
            setLanguage(languages[0]);
          }
        }}
      />
      <Select
        data={codeThemes}
        defaultValue={codeThemes[0]}
        onChange={(value) => {
          if (value && codeThemes.includes(value)) {
            setTheme(value);
          } else {
            setTheme(codeThemes[0]);
          }
        }}
      />
      <Editor
        options={{
          fontSize: 14,
          padding: { top: 16, bottom: 16 },
        }}
        height="calc(100% - 48px)"
        width="100%"
        theme={theme}
        defaultLanguage="javascript"
        language={language}
        value='console.log("Hello, world!");'
        loading={<Loader />}
      />
    </Stack>
  );
};

CodeBlock.displayName = 'CodeBlock';

export { CodeBlock };
