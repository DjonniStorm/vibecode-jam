## API документация (Jam Backend)

Базовый URL (локально / в Docker): `http://localhost:8080`

- Ответы: JSON.
- Для защищённых эндпоинтов нужен заголовок:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

## 1. Аутентификация

### 1.1 Регистрация пользователя

- **POST** `/api/auth/register`
- Авторизация: не требуется

Тело:

```json
{
  "name": "Иван",
  "surname": "Иванов",
  "email": "ivan@example.com",
  "telegram": "t.me/ivan",
  "password": "password123"
}
```

Ответ:

```json
{
  "id": "c3f2c9c9-1a23-4c23-b9a1-0a1a1c5a9a11",
  "name": "Иван",
  "surname": "Иванов",
  "email": "ivan@example.com",
  "telegram": "t.me/ivan",
  "registeredAt": "2025-11-26T16:00:00"
}
```

Пример curl:

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
        "name": "Иван",
        "surname": "Иванов",
        "email": "ivan@example.com",
        "telegram": "t.me/ivan",
        "password": "password123"
      }'
```

### 1.2 Логин (получить JWT)

- **POST** `/api/auth/login`
- Авторизация: не требуется

Тело:

```json
{
  "email": "ivan@example.com",
  "password": "password123"
}
```

Ответ:

```json
{
  "token": "JWT_TOKEN_HERE"
}
```

Пример curl:

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
        "email": "ivan@example.com",
        "password": "password123"
      }'
```

---

## 2. Пользователь

### 2.0 Как добавить администратора

По умолчанию при регистрации всем пользователям ставится роль `USER`.  
Чтобы выдать права администратора (`ADMIN`), сделайте так:

1. Зарегистрируйте пользователя как обычно:

```json
POST /api/auth/register
{
  "name": "Admin",
  "surname": "Adminov",
  "email": "admin@example.com",
  "telegram": "t.me/admin",
  "password": "admin123"
}
```

2. В базе Postgres выполните SQL:

```sql
UPDATE users
SET role = 'ADMIN'
WHERE email = 'admin@example.com';
```

После этого при логине этим пользователем Spring будет видеть роль `ROLE_ADMIN`,  
и он сможет вызывать эндпоинты только для админов (`/api/users`, `/api/users/{id}`, `/api/users/{id}/stats`).

### 2.1 Текущий пользователь

- **GET** `/api/users/me`
- Авторизация: требуется

Ответ:

```json
{
  "id": "c3f2c9c9-1a23-4c23-b9a1-0a1a1c5a9a11",
  "name": "Иван",
  "surname": "Иванов",
  "email": "ivan@example.com",
  "telegram": "t.me/ivan",
  "registeredAt": "2025-11-26T16:00:00"
}
```

Пример curl:

```bash
curl http://localhost:8080/api/users/me \
  -H "Authorization: Bearer JWT_TOKEN_HERE"
```

### 2.2 Статистика текущего пользователя

- **GET** `/api/users/me/stats`
- Авторизация: требуется

Ответ:

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

### 2.3 Пользователи и статистика (ADMIN)

- **GET** `/api/users`
- **GET** `/api/users/{id}`
- **GET** `/api/users/{id}/stats`
- Авторизация: требуется роль `ADMIN`

---

## 3. Собеседования (Interview)

### 3.1 Создать собеседование

- **POST** `/api/interviews`
- Авторизация: требуется

Тело:

```json
{
  "userId": "c3f2c9c9-1a23-4c23-b9a1-0a1a1c5a9a11",
  "title": "Собеседование на Junior Java-разработчика",
  "type": "AI"
}
```

**Поля:**
- `userId` (обязательно) — UUID пользователя
- `title` (обязательно) — название собеседования
- `type` (опционально) — тип собеседования: `"MANUAL"` или `"AI"`. Если не указано, по умолчанию `"MANUAL"`

**Примеры:**

Обычное собеседование:
```json
{
  "userId": "c3f2c9c9-1a23-4c23-b9a1-0a1a1c5a9a11",
  "title": "Собеседование на Junior Java-разработчика",
  "type": "MANUAL"
}
```

AI‑собеседование:
```json
{
  "userId": "c3f2c9c9-1a23-4c23-b9a1-0a1a1c5a9a11",
  "title": "AI Собеседование по алгоритмам",
  "type": "AI"
}
```

Ответ:

```json
{
  "id": "8d3e8b34-5af4-4df2-9a5e-9a2ed4ce7f10",
  "userId": "c3f2c9c9-1a23-4c23-b9a1-0a1a1c5a9a11",
  "title": "Собеседование на Junior Java-разработчика",
  "status": "IN_PROGRESS",
  "type": "AI",
  "createdAt": "2025-11-26T16:10:00"
}
```

### 3.2 Список собеседований текущего пользователя

- **GET** `/api/interviews`
- Авторизация: требуется

### 3.3 Получить собеседование

- **GET** `/api/interviews/{id}`
- Авторизация: требуется

### 3.4 Сменить статус

- **PATCH** `/api/interviews/{id}/status?status=COMPLETED`
- Статусы: `IN_PROGRESS`, `COMPLETED`, `CANCELLED`
- Авторизация: требуется

---

## 4. Задания (Task)

### 4.1 Создать задание

- **POST** `/api/tasks`
- Авторизация: требуется

Тело:

```json
{
  "interviewId": "8d3e8b34-5af4-4df2-9a5e-9a2ed4ce7f10",
  "title": "Проверка палиндрома",
  "description": "Напишите функцию, которая проверяет, является ли строка палиндромом",
  "language": "Python"
}
```

Ответ:

```json
{
  "id": "a1b2c3d4-1111-2222-3333-444455556666",
  "interviewId": "8d3e8b34-5af4-4df2-9a5e-9a2ed4ce7f10",
  "title": "Проверка палиндрома",
  "description": "Напишите функцию, которая проверяет, является ли строка палиндромом",
  "language": "Python",
  "userResponse": null,
  "status": "NOT_STARTED",
  "checkResult": null
}
```

### 4.2 Обновить ответ/статус

- **PATCH** `/api/tasks/{taskId}`
- Авторизация: требуется

Тело:

```json
{
  "userResponse": "def is_pal(s): return s == s[::-1]",
  "status": "DONE",
  "checkResult": "Все тесты пройдены"
}
```

### 4.3 Список заданий по собеседованию

- **GET** `/api/tasks/interview/{interviewId}`
- Авторизация: требуется

---

## 5. AI‑собеседование (чат с GPT)

### 5.0 Как протестировать в Postman (пошаговая инструкция)

**Важно**: Перед тестированием AI‑собеседования нужно:
1. Зарегистрировать пользователя (`POST /api/auth/register`)
2. Залогиниться и получить токен (`POST /api/auth/login`)
3. Создать собеседование с типом `AI` (через SQL или через API, если есть эндпоинт)

#### Шаг 1: Регистрация и логин

**1.1 Регистрация:**
- Метод: `POST`
- URL: `http://localhost:8080/api/auth/register`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "name": "Тест",
  "surname": "Пользователь",
  "email": "test@example.com",
  "telegram": "t.me/test",
  "password": "password123"
}
```
- Сохраните `id` пользователя из ответа.

**1.2 Логин:**
- Метод: `POST`
- URL: `http://localhost:8080/api/auth/login`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```
- Сохраните `token` из ответа (например, в переменную Postman `{{jwt_token}}`).

#### Шаг 2: Создание AI‑собеседования

- Метод: `POST`
- URL: `http://localhost:8080/api/interviews`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer {{jwt_token}}`
- Body:
```json
{
  "userId": "UUID_ПОЛЬЗОВАТЕЛЯ_ИЗ_ШАГА_1.1",
  "title": "AI Собеседование по алгоритмам",
  "type": "AI"
}
```

**Важно:** Укажите `"type": "AI"` в теле запроса, чтобы создать AI‑собеседование. Если не указать `type` или указать `"type": "MANUAL"`, будет создано обычное собеседование.

- Сохраните `id` собеседования из ответа (например, в переменную `{{interview_id}}`).

#### Шаг 3: Запуск AI‑собеседования (первый вопрос)

- Метод: `POST`
- URL: `http://localhost:8080/api/ai-interviews/{interviewId}/start`
  - Замените `{interviewId}` на UUID из шага 2.
- Headers:
  - `Authorization: Bearer {{jwt_token}}`
  - `Content-Type: application/json`
- Body: не требуется (или пустой `{}`)

**Ответ:**
```json
{
  "id": "turn-1-uuid",
  "turnNumber": 1,
  "question": "Расскажите, что такое двоичное дерево поиска...",
  "userAnswer": null,
  "codeQuestion": false,
  "codeLanguage": null,
  "evaluation": null,
  "score": null,
  "createdAt": "2025-11-26T16:20:00"
}
```
- Сохраните `id` хода (например, `{{turn_id}}`) и `interviewId` (например, `{{interview_id}}`).

#### Шаг 4: Ответ на вопрос

- Метод: `POST`
- URL: `http://localhost:8080/api/ai-interviews/{{interview_id}}/answer`
- Headers:
  - `Authorization: Bearer {{jwt_token}}`
  - `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "turnId": "{{turn_id}}",
  "answer": "Двоичное дерево поиска (BST) — это структура данных, где каждый узел имеет не более двух потомков, и для каждого узла все значения в левом поддереве меньше значения узла, а все значения в правом поддереве больше."
}
```

**Ответ содержит:**
- `previousTurn` — обновлённый ход с вашим ответом и оценкой от GPT
- `nextTurn` — новый ход с следующим вопросом

- Обновите `{{turn_id}}` на `nextTurn.id` из ответа.

#### Шаг 5: Повторение шага 4

Повторяйте шаг 4, каждый раз:
- Используя новый `turnId` из `nextTurn.id` предыдущего ответа
- Отвечая на новый вопрос от GPT

#### Шаг 6: Просмотр истории диалога

- Метод: `GET`
- URL: `http://localhost:8080/api/ai-interviews/{{interview_id}}/turns`
- Headers: `Authorization: Bearer {{jwt_token}}`

**Ответ:** массив всех ходов собеседования.

#### Шаг 7: Завершение собеседования

- Метод: `POST`
- URL: `http://localhost:8080/api/ai-interviews/{{interview_id}}/finish`
- Headers: `Authorization: Bearer {{jwt_token}}`
- Body: не требуется

После этого `Interview.totalScore` будет пересчитан на основе всех ходов.

---

### 5.1 Запустить AI‑собеседование

- **POST** `/api/ai-interviews/{interviewId}/start`
- Требуется: токен, `Interview.type = AI`

Ответ:

```json
{
  "id": "turn-1-uuid",
  "turnNumber": 1,
  "question": "Расскажите, что такое двоичное дерево поиска...",
  "userAnswer": null,
  "codeQuestion": false,
  "codeLanguage": null,
  "evaluation": null,
  "score": null,
  "createdAt": "2025-11-26T16:20:00"
}
```

### 5.2 Ответить на вопрос и получить следующий

- **POST** `/api/ai-interviews/{interviewId}/answer`
- Авторизация: требуется

Тело:

```json
{
  "turnId": "turn-1-uuid",
  "answer": "Двоичное дерево поиска — это ..."
}
```

Ответ:

```json
{
  "previousTurn": {
    "id": "turn-1-uuid",
    "turnNumber": 1,
    "question": "Расскажите, что такое двоичное дерево поиска...",
    "userAnswer": "Двоичное дерево поиска — это ...",
    "codeQuestion": false,
    "codeLanguage": null,
    "evaluation": "Ответ в целом верный, но можно подробнее рассказать про инвариант left<root<right.",
    "score": null,
    "createdAt": "2025-11-26T16:20:00"
  },
  "nextTurn": {
    "id": "turn-2-uuid",
    "turnNumber": 2,
    "question": "Теперь напишите функцию поиска элемента в двоичном дереве поиска.",
    "userAnswer": null,
    "codeQuestion": true,
    "codeLanguage": null,
    "evaluation": null,
    "score": null,
    "createdAt": "2025-11-26T16:21:00"
  }
}
```

### 5.3 История диалога

- **GET** `/api/ai-interviews/{interviewId}/turns`
- Авторизация: требуется

### 5.4 Завершить AI‑собеседование

- **POST** `/api/ai-interviews/{interviewId}/finish`
- Авторизация: требуется
- Результат: пересчитывается `Interview.totalScore`.

---

## 6. Проверка кода (Code Evaluation)

### 6.1 Проверка решения по коду

- **POST** `/api/code-evaluation`
- Авторизация: рекомендуется токен

Тело:

```json
{
  "question": "Напишите функцию, проверяющую, что строка палиндром",
  "language": "Python",
  "code": "def is_pal(s): return s == s[::-1]"
}
```

Ответ:

```json
{
  "correct": true,
  "score": 8,
  "issues": "Нет учёта регистра; нет тестов на пустую строку",
  "suggestedFix": "Нормализовать строку с помощью lower() и добавить проверки граничных случаев",
  "raw": "{... исходный текст ответа модели ...}"
}
```

---

## 7. Кратко для фронтенд‑разработчика

1. Зарегистрировать пользователя: `POST /api/auth/register`.
2. Залогиниться и получить `token`: `POST /api/auth/login`.
3. Во все дальнейшие запросы добавлять:

```http
Authorization: Bearer <token>
```

4. Основные группы эндпоинтов:
   - Auth: `/api/auth/register`, `/api/auth/login`
   - Пользователь: `/api/users/me`, `/api/users/me/stats`, (ADMIN: `/api/users`, `/api/users/{id}`, `/api/users/{id}/stats`)
   - Собеседования: `/api/interviews`, `/api/interviews/{id}`, `/api/interviews/{id}/status`
   - Задания: `/api/tasks`, `/api/tasks/{id}`, `/api/tasks/interview/{interviewId}`
   - AI‑собеседования: `/api/ai-interviews/{id}/start`, `/answer`, `/finish`, `/turns`
   - Проверка кода: `/api/code-evaluation`
