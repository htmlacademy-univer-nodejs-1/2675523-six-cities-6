# Как работать над проектом

## Окружение

Для работы над проектом нужны Node.js и npm. Поддерживаемая версия Node.js указана в поле `engines.node` файла `package.json`.

Перед первым запуском установите зависимости:

```bash
npm install
```

## Переменные окружения

Для запуска REST API используется файл `.env` в корне проекта. Пример заполнения находится в `.env.example`.

```text
PORT=4000 - порт REST API сервера.
SALT=extrasalt - соль для хеширования паролей пользователей.
DB_HOST=127.0.0.1 - адрес MongoDB.
DB_PORT=27017 - порт MongoDB.
DB_USER=user - имя пользователя MongoDB.
DB_PASSWORD=password - пароль пользователя MongoDB.
DB_NAME=six-cities - имя базы данных MongoDB.
UPLOAD_DIRECTORY=upload - директория для загружаемых файлов.
JWT_SECRET=secret - секрет для подписи JWT.
SERVER_HOST_PROTOCOL=http - протокол сервера, используется при формировании абсолютных ссылок.
HOST=localhost - хост сервера, используется при формировании абсолютных ссылок.
STATIC_DIRECTORY=static - директория со статическими файлами.
```

Если обязательная переменная окружения не задана или `.env` недоступен, приложение завершит запуск с ошибкой.

## Запуск проекта

1. Установите зависимости:

```bash
npm install
```

2. Создайте `.env` на основе `.env.example` и проверьте параметры подключения к MongoDB.

3. Запустите MongoDB. Если база данных разворачивается отдельно, убедитесь, что значения `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` и `DB_NAME` соответствуют её настройкам.

4. Запустите REST API в режиме разработки:

```bash
npm run start:dev
```

5. Для production-сборки выполните:

```bash
npm run build
```

После сборки скомпилированные файлы будут находиться в директории `dist`.

## Сценарии

В `package.json` доступны следующие сценарии.

### `npm start`

Собирает проект и запускает скомпилированный REST API сервер из `dist/main.rest.js`.

```bash
npm start
```

### `npm run start:dev`

Запускает REST API без предварительной компиляции через `ts-node`.

```bash
npm run start:dev
```

### `npm run build`

Удаляет предыдущую сборку и компилирует проект заново.

```bash
npm run build
```

### `npm run lint`

Проверяет TypeScript-файлы в директории `src` статическим анализатором ESLint.

```bash
npm run lint
```

### `npm run ts`

Запускает TypeScript-модуль без предварительной компиляции.

```bash
npm run ts -- <Путь к модулю>
```

### `npm run compile`

Компилирует проект по настройкам `tsconfig.json`.

```bash
npm run compile
```

### `npm run clean`

Удаляет директорию `dist`.

```bash
npm run clean
```

### `npm run cli`

Запускает CLI-приложение. Команда без аргументов выводит справку.

```bash
npm run cli -- --help
```

### `npm run mock:server`

Запускает локальный mock-сервер JSON Server на порту `3123` с данными из `mocks/mock-server-data.json`.

```bash
npm run mock:server
```

### `npm run cli:version`

Выводит версию приложения из `package.json`.

```bash
npm run cli:version
```

### `npm run cli:import`

Импортирует данные из TSV-файла в MongoDB.

```bash
npm run cli:import
```

### `npm run cli:generate`

Генерирует тестовый TSV-файл с предложениями, используя данные mock-сервера.

Перед запуском поднимите mock-сервер:

```bash
npm run mock:server
```

Затем выполните:

```bash
npm run cli:generate
```

## Структура проекта

### Директория `src`

Исходный код проекта: CLI, REST API, общие библиотеки, модели и модули бизнес-логики.

### Директория `specification`

OpenAPI-спецификация REST API в формате YAML.

### Директория `mocks`

Mock-данные и файлы для генерации или импорта тестовых предложений.

### Директория `static`

Статические файлы, которые может отдавать REST API.

### Файл `Readme.md`

Инструкции по работе с учебным репозиторием.

### Файл `Contributing.md`

Советы и инструкции по внесению изменений в учебный репозиторий.
