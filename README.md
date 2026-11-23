# FILM!

Задеплоенное приложение: http://film-review3.duckdns.org

## Запуск локально

### База данных

Нужен запущенный PostgreSQL.

### Бэкенд

Перейдите в папку с исходным кодом бэкенда

`cd backend`

Установите зависимости

`npm ci`

Создайте `.env` файл из примера `.env.example`, при необходимости поправьте параметры подключения к базе.

Запустите бэкенд:

`npm run start:dev`

Формат логов задаётся переменной `LOG_FORMAT`: `dev` (по умолчанию), `json` или `tskv`.

### Фронтенд

`cd frontend`

`npm ci`

`npm run dev`

### Наполнение базы тестовыми данными

Выполните sql-файлы из `backend/test` в порядке: `prac.init.sql`, `prac.films.sql`, `prac.shedules.sql`.

## Запуск в Docker

`cp .env.example .env`

`docker compose up -d --build`

Приложение будет доступно на http://localhost:80, pgAdmin — на http://localhost:8080 (данные входа в `.env`).

## Деплой

При каждом пуше GitHub Actions собирает образы и публикует их в ghcr.io (см. `.github/workflows/publish.yml`).

На сервере в каталоге проекта лежат `docker-compose.prod.yml` и `.env`, образы берутся из реестра:

`docker compose -f docker-compose.prod.yml up -d`

Обновление до свежих образов — скрипт `deploy.sh` в каталоге проекта на сервере. pgAdmin доступен только с localhost сервера, подключаться через ssh-туннель:

`ssh -L 8080:localhost:8080 <user>@<server>`

## Тесты

`cd backend`

`npm test`
