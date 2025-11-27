import {
  Button,
  Card,
  Stack,
  Text,
  Textarea,
  Title,
  Paper,
  ScrollArea,
  Badge,
  Group,
  Loader,
  Alert,
} from '@mantine/core';
import { Editor } from '@monaco-editor/react';
import { useEffect, useRef } from 'react';
import {
  useStartAiInterview,
  useAnswerAiQuestion,
  useFinishAiInterview,
  useAiInterviewTurns,
} from '@entities/ai-interview';
import { notifications } from '@mantine/notifications';
import type { AiTurn, AiStartResponse } from '@entities/ai-interview';
import { useInterviewFlowContext } from '../model/use-interview-flow-context';
import styles from './InterviewFlow.module.scss';

interface InterviewFlowProps {
  interviewId: string;
}

const InterviewFlow = ({ interviewId }: InterviewFlowProps) => {
  const {
    state,
    setCurrentTurn,
    setAnswer,
    setCodeAnswer,
    setIsStarted,
    setIsFinished,
    resetAnswers,
  } = useInterviewFlowContext();

  const { currentTurn, answer, codeAnswer, isStarted, isFinished } = state;

  const { data: turns, isLoading: turnsLoading } = useAiInterviewTurns(interviewId);
  const startMutation = useStartAiInterview();
  const answerMutation = useAnswerAiQuestion();
  const finishMutation = useFinishAiInterview();

  const editorRef = useRef<{ getValue: () => string } | null>(null);

  // Инициализация: проверяем, есть ли уже ходы
  useEffect(() => {
    if (!turns || turns.length === 0 || isStarted) return;

    const lastTurn = turns[turns.length - 1];
    // Используем requestAnimationFrame для асинхронного обновления состояния
    requestAnimationFrame(() => {
      if (lastTurn.userAnswer === null) {
        // Если это первый вопрос и codeQuestion не установлен, принудительно устанавливаем
        if (lastTurn.turnNumber === 1 && !lastTurn.codeQuestion) {
          const updatedTurn = {
            ...lastTurn,
            codeQuestion: true,
            codeLanguage: lastTurn.codeLanguage || 'python',
          };
          setCurrentTurn(updatedTurn);
        } else {
          setCurrentTurn(lastTurn);
        }
        setIsStarted(true);
      } else {
        setIsFinished(true);
        setIsStarted(true);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turns, isStarted]);

  const handleStart = async () => {
    try {
      const response: AiStartResponse = await startMutation.mutateAsync(interviewId);
      console.log('Start response:', response); // Отладка
      // Преобразуем AiStartResponse в AiTurn
      // Принудительно устанавливаем codeQuestion = true для первого вопроса
      const turn: AiTurn = {
        id: response.id,
        turnNumber: response.turnNumber,
        question: response.question,
        userAnswer: response.userAnswer,
        codeQuestion: response.codeQuestion !== undefined ? response.codeQuestion : true, // Принудительно true для первого вопроса
        codeLanguage: response.codeLanguage || 'python', // По умолчанию python
        evaluation: response.evaluation,
        score: response.score,
        createdAt: response.createdAt,
      };
      console.log('Setting turn:', turn); // Отладка
      setCurrentTurn(turn);
      setIsStarted(true);
      notifications.show({
        title: 'Собеседование начато',
        message: 'Первый вопрос загружен',
        color: 'blue',
      });
    } catch (error) {
      console.error(error);
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось начать собеседование',
        color: 'red',
      });
    }
  };

  const handleAnswer = async () => {
    if (!currentTurn) return;

    const answerText = currentTurn.codeQuestion ? codeAnswer : answer;
    if (!answerText.trim()) {
      notifications.show({
        title: 'Внимание',
        message: 'Пожалуйста, введите ответ',
        color: 'yellow',
      });
      return;
    }

    try {
      const response = await answerMutation.mutateAsync({
        interviewId,
        data: {
          turnId: currentTurn.id,
          answer: answerText,
        },
      });

      // Показываем оценку предыдущего ответа
      if (response.previousTurn.evaluation) {
        notifications.show({
          title: 'Оценка получена',
          message: response.previousTurn.evaluation,
          color: response.previousTurn.score && response.previousTurn.score >= 7 ? 'green' : 'blue',
          autoClose: 10000,
        });
      }

      // Если есть следующий вопрос
      if (response.nextTurn) {
        setCurrentTurn(response.nextTurn);
        resetAnswers();
      } else {
        setIsFinished(true);
        notifications.show({
          title: 'Собеседование завершено',
          message: 'Все вопросы пройдены',
          color: 'green',
        });
      }
    } catch (error) {
      console.error(error);
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось отправить ответ',
        color: 'red',
      });
    }
  };

  const handleFinish = async () => {
    try {
      await finishMutation.mutateAsync(interviewId);
      notifications.show({
        title: 'Собеседование завершено',
        message: 'Итоговый балл будет рассчитан',
        color: 'green',
      });
      setIsFinished(true);
    } catch (error) {
      console.error(error);
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось завершить собеседование',
        color: 'red',
      });
    }
  };

  if (turnsLoading) {
    return (
      <Stack align="center" justify="center" h="100%">
        <Loader size="lg" />
        <Text>Загрузка...</Text>
      </Stack>
    );
  }

  if (!isStarted) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="md" align="center">
          <Title order={2}>Готовы начать собеседование?</Title>
          <Text c="dimmed" ta="center">
            После начала вы получите первый вопрос. Отвечайте на вопросы последовательно.
          </Text>
          <Button size="lg" onClick={handleStart} loading={startMutation.isPending}>
            Начать собеседование
          </Button>
        </Stack>
      </Card>
    );
  }

  // Fallback: если нет текущего вопроса, но собеседование начато
  if (!currentTurn && isStarted && !isFinished) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="md" align="center">
          <Title order={2}>Ожидание вопроса...</Title>
          <Text c="dimmed" ta="center">
            Загрузка вопроса. Если вопрос не появился, попробуйте обновить страницу.
          </Text>
          <Button size="lg" onClick={handleStart} loading={startMutation.isPending}>
            Загрузить вопрос
          </Button>
        </Stack>
      </Card>
    );
  }

  if (isFinished && currentTurn === null) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="md" align="center">
          <Title order={2}>Собеседование завершено</Title>
          <Text c="dimmed" ta="center">
            Все вопросы пройдены. Спасибо за участие!
          </Text>
        </Stack>
      </Card>
    );
  }

  return (
    <Stack gap="md" className={styles.container}>
      {/* История вопросов */}
      {turns && turns.length > 0 && (
        <Paper p="md" withBorder>
          <Title order={4} mb="md">
            История вопросов ({turns.length})
          </Title>
          <ScrollArea h={250} type="auto">
            <Stack gap="sm">
              {turns.map((turn) => (
                <Card key={turn.id} padding="md" withBorder radius="md">
                  <Group justify="space-between" mb="xs">
                    <Badge size="lg" variant="light">
                      Вопрос {turn.turnNumber}
                    </Badge>
                    <Group gap="xs">
                      {turn.codeQuestion && (
                        <Badge color="blue" variant="light">
                          Код
                        </Badge>
                      )}
                      {turn.score !== null && (
                        <Badge
                          color={turn.score >= 7 ? 'green' : turn.score >= 5 ? 'yellow' : 'red'}
                          variant="filled"
                          size="lg"
                        >
                          {turn.score}/10
                        </Badge>
                      )}
                    </Group>
                  </Group>
                  <Text size="sm" fw={500} mb="xs" c="dimmed">
                    {turn.question}
                  </Text>
                  {turn.userAnswer && (
                    <Alert color="blue" title="Ваш ответ" mb="xs" radius="md">
                      <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                        {turn.userAnswer}
                      </Text>
                    </Alert>
                  )}
                  {turn.evaluation && (
                    <Alert
                      color={turn.score && turn.score >= 7 ? 'green' : 'blue'}
                      title="Оценка"
                      mb="xs"
                      radius="md"
                    >
                      <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                        {turn.evaluation}
                      </Text>
                    </Alert>
                  )}
                </Card>
              ))}
            </Stack>
          </ScrollArea>
        </Paper>
      )}

      {/* Текущий вопрос */}
      {currentTurn && (
        <Card shadow="md" padding="xl" radius="md" withBorder>
          <Stack gap="lg">
            <Group justify="space-between" align="flex-start">
              <Stack gap="xs">
                <Title order={2}>Вопрос {currentTurn.turnNumber}</Title>
                <Text size="lg" fw={500}>
                  {currentTurn.question}
                </Text>
              </Stack>
              <Group>
                {currentTurn.codeQuestion && (
                  <Badge color="blue" size="lg" variant="light">
                    Задание на код
                  </Badge>
                )}
                {currentTurn.codeLanguage && (
                  <Badge variant="filled" size="lg">
                    {currentTurn.codeLanguage}
                  </Badge>
                )}
              </Group>
            </Group>

            {/* Принудительно показываем Monaco Editor для первого вопроса или если codeQuestion === true */}
            {currentTurn.codeQuestion === true ||
            (currentTurn.turnNumber === 1 && !currentTurn.userAnswer) ? (
              <div className={styles.editorContainer}>
                <Editor
                  height="400px"
                  defaultLanguage={currentTurn.codeLanguage || 'python'}
                  language={currentTurn.codeLanguage || 'python'}
                  theme="vs-dark"
                  value={codeAnswer}
                  onChange={(value) => setCodeAnswer(value || '')}
                  options={{
                    fontSize: 14,
                    padding: { top: 16, bottom: 16 },
                    readOnly: false,
                    contextmenu: false,
                    minimap: { enabled: false },
                  }}
                  onMount={(editor) => {
                    editorRef.current = editor;
                    editor.onKeyDown((e) => {
                      if (
                        (e.ctrlKey || e.metaKey) &&
                        (e.keyCode === 67 || e.keyCode === 86 || e.keyCode === 88)
                      ) {
                        e.preventDefault();
                        e.stopPropagation();
                      }
                    });
                  }}
                />
              </div>
            ) : (
              <Textarea
                placeholder="Введите ваш ответ..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                minRows={6}
                autosize
              />
            )}

            <Group justify="flex-end" mt="md">
              {turns && turns.length > 0 && (
                <Button
                  variant="light"
                  color="red"
                  onClick={handleFinish}
                  loading={finishMutation.isPending}
                  size="md"
                >
                  Завершить собеседование
                </Button>
              )}
              <Button
                onClick={handleAnswer}
                loading={answerMutation.isPending}
                disabled={!answer.trim() && !codeAnswer.trim()}
                size="md"
              >
                Отправить ответ
              </Button>
            </Group>
          </Stack>
        </Card>
      )}
    </Stack>
  );
};

InterviewFlow.displayName = 'InterviewFlow';

export { InterviewFlow };
