## Jam Backend — платформа собеседований (в том числе с GPT)

Backend на Spring Boot для проведения технических собеседований:

- классические сущности: пользователь, собеседование, задания;
- AI‑собеседования: GPT задаёт вопросы, кандидат отвечает, модель даёт оценку;
- отдельная проверка кода через LLM.

---

## Быстрый запуск через Docker

### 1. Требования

- Docker и Docker Compose
- Java/Maven **не нужны** для запуска в Docker (нужны только для локальной разработки).

### 2. Запуск одной командой

Из корня репозитория (`/Users/damirmagdeev/OpenideProjects/vibecode-jam`):

```bash
docker compose up --build
```

Поднимутся:

- `postgres` — база данных (порт `5432` на хосте);
- `backend` — Spring Boot приложение (порт `8080` на хосте).

По умолчанию:

- БД: `jdbc:postgresql://postgres:5432/jamdb`, пользователь `jamuser`, пароль `jampassword`;
- LLM API‑ключ считывается из переменной окружения `LLM_API_KEY`.

Пример с передачей реального ключа:

```bash
LLM_API_KEY=sk-... docker compose up --build
```

### 3. Как устроен Dockerfile

Файл `backend/jam-backend/Dockerfile` использует **multi‑stage build**:

- **Stage 1 (build):**
  - Базовый образ: `maven:3.9-eclipse-temurin-21`.
  - Сначала копируется `pom.xml` и выполняется:
    - `mvn -q -B -DskipTests dependency:go-offline` — кэшируются зависимости.
  - Затем копируется `src` и собирается jar:
    - `mvn -q -B -DskipTests clean package`.

- **Stage 2 (runtime):**
  - Базовый образ: `eclipse-temurin:21-jre-alpine`.
  - Копируется только готовый `app.jar`.
  - Приложение запускается командой `java -jar app.jar` (порт `8080`).

За счёт кэширования Maven‑зависимостей повторные билды в Docker происходят быстрее.

---

## Swagger / OpenAPI

Для документации REST API используется **springdoc-openapi**.

После запуска backend доступно:

- Swagger UI: `http://localhost:8080/swagger-ui/index.html`

Через этот интерфейс можно:

- просматривать список эндпоинтов;
- видеть схемы запросов/ответов;
- отправлять тестовые запросы прямо из браузера.

---

## Основные сценарии работы бэкенда

Ниже описаны потоки работы так, чтобы было понятно и фронтендеру, и не‑технарю.

### 1. Регистрация и логин пользователя

#### 1.1 Регистрация

- **Метод**: `POST /api/auth/register`
- **Пример тела запроса**:

```json
{
  "name": "Имя",
  "surname": "Фамилия",
  "email": "email@example.com",
  "telegram": "t.me/123",
  "password": "password123"
}
```

- **Результат**: создаётся пользователь, пароль хранится в БД в виде хэша.
- **Ответ**: объект пользователя без пароля (id, name, surname, email, telegram, registeredAt).

#### 1.2 Логин

- **Метод**: `POST /api/auth/login`
- **Пример тела**:

```json
{
  "email": "email@example.com",
  "password": "password123"
}
```

- **Ответ**:

```json
{ "token": "JWT_TOKEN_HERE" }
```

Этот токен нужно передавать в заголовке **каждого защищённого запроса**:

```http
Authorization: Bearer JWT_TOKEN_HERE
```

#### 1.3 Получить данные «текущего» пользователя

- **Метод**: `GET /api/users/me`
- **Требуется**: `Authorization: Bearer ...`.
- **Ответ**: данные пользователя, соответствующего токену.

---

### 2. Классические сущности: собеседование и задания

#### 2.1 Собеседование (`Interview`)

Сущность включает:

- `id` — идентификатор;
- `user` — к какому пользователю относится;
- `title` — название (например, «Собеседование на Junior Python»);
- `status` — `IN_PROGRESS`, `COMPLETED`, `CANCELLED`;
- `type` — `MANUAL` или `AI`;
- `totalScore` — итоговый балл (для AI‑собеседований);
- `createdAt` — дата создания.

**Создать собеседование**:

- `POST /api/interviews`
- Пример тела:

```json
{
  "userId": "UUID_пользователя",
  "title": "Собеседование на Junior Java"
}
```

**Получить список собеседований текущего пользователя**:

- `GET /api/interviews`

**Получить конкретное собеседование**:

- `GET /api/interviews/{id}`

**Сменить статус**:

- `PATCH /api/interviews/{id}/status?status=COMPLETED`

#### 2.2 Задание (`Task`)

Основные поля:

- `id`, `interviewId`;
- `title`, `description`;
- `language` — язык программирования (строка, например, `"Python"`, `"C/C++"`);
- `userResponse` — текст ответа/кода;
- `status` — `NOT_STARTED`, `IN_PROGRESS`, `DONE`;
- `checkResult` — текстовый результат проверки.

**Создать задание**:

- `POST /api/tasks`
- Пример тела:

```json
{
  "interviewId": "UUID_собеседования",
  "title": "Задача на палиндром",
  "description": "Проверь, является ли строка палиндромом",
  "language": "Python"
}
```

**Обновить ответ и статус**:

- `PATCH /api/tasks/{taskId}`
- Пример тела:

```json
{
  "userResponse": "def is_pal(s): return s == s[::-1]",
  "status": "DONE",
  "checkResult": "5 из 10 тестов пройдено"
}
```

**Получить задания по собеседованию**:

- `GET /api/tasks/interview/{interviewId}`

---

### 3. AI‑собеседование (GPT задаёт вопросы и оценивает ответы)

AI‑собеседование использует:

- `Interview` с `type = AI`;
- сущность `InterviewTurn` — шаг диалога (вопрос, ответ, оценка);
- сервис `AiInterviewService` и контроллер `AiInterviewController`.

#### 3.1 Настроить AI‑собеседование

Нужно, чтобы у выбранного `Interview` было `type = "AI"`. Это можно сделать:

- либо через миграцию / SQL / админку;
- либо добавить/расширить эндпоинт (при необходимости).

Главное: для всех запросов под AI‑сценарий использовать такой `interviewId`.

#### 3.2 Запуск AI‑собеседования (первый вопрос)

- **Метод**: `POST /api/ai-interviews/{interviewId}/start`
- **Требуется**: `Authorization: Bearer ...`.
- **Ответ** — DTO хода (`TurnDto`):

```json
{
  "id": "UUID_хода",
  "turnNumber": 1,
  "question": "Первый вопрос интервьюера...",
  "userAnswer": null,
  "codeQuestion": true,
  "codeLanguage": null,
  "evaluation": null,
  "score": null,
  "createdAt": "2025-01-01T12:00:00"
}
```

Фронтенд показывает пользователю `question` и сохраняет `id` хода.

#### 3.3 Ответ на вопрос и получение следующего

- **Метод**: `POST /api/ai-interviews/{interviewId}/answer`
- **Тело**:

```json
{
  "turnId": "UUID_хода_из_start",
  "answer": "Ответ кандидата (в том числе код, если просили)"
}
```

- **Ответ**:

```json
{
  "previousTurn": {
    "id": "UUID_хода",
    "turnNumber": 1,
    "question": "Первый вопрос...",
    "userAnswer": "Ответ кандидата",
    "codeQuestion": true,
    "codeLanguage": null,
    "evaluation": "Краткая оценка ответа...",
    "score": null,
    "createdAt": "..."
  },
  "nextTurn": {
    "id": "UUID_нового_хода",
    "turnNumber": 2,
    "question": "Следующий вопрос интервьюера...",
    "userAnswer": null,
    "codeQuestion": false,
    "codeLanguage": null,
    "evaluation": null,
    "score": null,
    "createdAt": "..."
  }
}
```

Цикл:

1. front показывает `previousTurn.evaluation` как фидбек;
2. показывает `nextTurn.question`;
3. сохраняет `nextTurn.id` и снова вызывает `/answer` с этим `turnId`, когда пользователь ответит.

#### 3.4 История диалога и завершение

- **Получить все ходы**:

  - `GET /api/ai-interviews/{interviewId}/turns`

- **Завершить собеседование**:

  - `POST /api/ai-interviews/{interviewId}/finish`
  - Бэкенд суммирует `score` по ходам и записывает в `Interview.totalScore`.

---

### 4. Отдельная проверка кода (без диалога)

Если нужно только проверить кусок кода по задаче, без полноценного диалога:

- **Метод**: `POST /api/code-evaluation`
- **Тело**:

```json
{
  "question": "Напишите функцию, проверяющую, что строка палиндром",
  "language": "Python",
  "code": "def is_pal(s): return s == s[::-1]"
}
```

- **Ответ** (упрощённый пример структуры):

```json
{
  "correct": true,
  "score": 8,
  "issues": "Нет проверки регистра; нет тестов на пустую строку",
  "suggestedFix": "Добавить нормализацию строки и несколько тестов",
  "raw": "{... сырой ответ модели ...}"
}
```

Фронтенд может:

- показать `score` как числовую оценку;
- `issues` — список проблем;
- `suggestedFix` — рекомендуемое улучшение.

---

### 5. Статистика по пользователю

Бэкенд умеет собирать агрегированную статистику по каждому пользователю.

#### 5.1 Статистика для текущего пользователя

- **Метод**: `GET /api/users/me/stats`
- **Требуется**: `Authorization: Bearer ...`.
- **Пример ответа**:

```json
{
  "totalInterviews": 3,
  "manualInterviews": 2,
  "aiInterviews": 1,
  "interviewsInProgress": 1,
  "interviewsCompleted": 2,
  "interviewsCancelled": 0,
  "totalTasks": 10,
  "tasksNotStarted": 2,
  "tasksInProgress": 3,
  "tasksDone": 5,
  "averageAiScore": 78
}
```

`averageAiScore` — средний итоговый балл по AI‑собеседованиям (если такой информации ещё нет — `null`).

#### 5.2 Статистика по любому пользователю (для администратора)

- **Метод**: `GET /api/users/{id}/stats`
- **Требуется роль**: `ADMIN`.
- Формат ответа такой же, как у `/api/users/me/stats`.

---

## Кратко для фронтенд‑разработчика

- **Авторизация**:
  - сначала `POST /api/auth/register` (один раз на пользователя);
  - затем `POST /api/auth/login` и сохранить `token`;
  - во все защищённые запросы добавлять:

    ```http
    Authorization: Bearer <token>
    ```

- **Основные группы эндпоинтов**:
  - Auth: `/api/auth/register`, `/api/auth/login`;
  - Пользователи: `/api/users/me`;
  - Собеседования: `/api/interviews`, `/api/interviews/{id}`, `/api/interviews/{id}/status`;
  - Задания: `/api/tasks`, `/api/tasks/{id}`, `/api/tasks/interview/{interviewId}`;
  - AI‑собеседования: `/api/ai-interviews/{id}/start`, `/answer`, `/finish`, `/turns`;
  - Проверка кода: `/api/code-evaluation`.

- **Swagger** (`/swagger-ui/index.html`) — источник правды по схемам и параметрам. Рекомендуется начинать интеграцию с фронта именно оттуда.


