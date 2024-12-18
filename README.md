<div align="center">
  <img src="./public/images/logo.svg" alt="Логотип ChocoNet" width="300"/>
</div>
<br>

# ChocoNet

ChocoNet — это система для оптимизации процесса поиска и заказа кондитерских изделий. Она делает покупку сладких угощений проще и удобнее.

## 🔍 Для чего?

Процесс поиска кондитерских товаров на данный момент требует использования множества платформ: мессенджеров, соцсетей, личных рекомендаций. Новое решение обеспечит удобный доступ к информации о кондитерских услугах и улучшит позиционирование продавцов на рынке.

## 📋 Описание проекта

ChocoNet — это платформа для поиска и заказа кондитерских изделий. Система упрощает взаимодействие между покупателями и продавцами, улучшая поиск и доступность услуг.

### Проект включает в себя несколько компонентов:

- **Бэкенд**: серверная часть, отвечающая за обработку запросов и управление данными;
- **Фронтенд**: пользовательский интерфейс для взаимодействия с платформой.

Дизайн и макеты интерфейсов разработаны в [Figma](https://www.figma.com/design/Yrv2aYA7n5AgjTNSksBsvR/chocoNet?node-id=0-1&t=jnkAhUbMgJawgTe2-1).

### Основные возможности:

- Регистрация и аутентификация пользователей;
- Подтверждение email и номера телефона;
- Множество параметров для фильтрации и сортировки;
- Возможность подписаться на понравившегося кондитера;
- Просмотр товаров, похожих на выбранный;
- Возможность добавить товар в избранное;
- Управление собственным профилем;
- Управление своими кондитерскими изделиями;
- Просмотр кондитерских изделий без авторизации.

## ⚙️ Стек технологий

- **NestJS** — фреймворк для разработки серверных приложений на Node.js;
- **Prisma** — ORM для работы с базой данных;
- **PostgreSQL** — реляционная база данных;
- **Redis** — кэш-сервер;
- **TypeScript** — язык программирования;
- **JWT** — для аутентификации пользователей;
- **Swagger** — для генерации документации API;
- **Docker и Docker Compose** — для контейнеризации приложения;
- **Nginx** — для управления запросами и балансировки нагрузки;
- **GitHub Actions** — для CI/CD;
- **Husky** — для настройки pre-commit хуков и обеспечения качества кода;
- **Makefile** — для упрощения команд и автоматизации задач;

## 🚀 Развертывание
### Запуск с Docker и Docker Compose
Для быстрого развертывания приложения на вашем сервере можно использовать Docker и Docker Compose.

#### 1. Клонируйте репозиторий:

```bash
git clone https://github.com/liminfinity/ChocoNet.git
```

#### 2. Перейдите в каталог проекта и настройте переменные окружения:

```bash
cd backend
cp .env.example .env.local
```

### 3. Запустите приложение с использованием Docker Compose:

```bash
docker-compose up
```

### 4. Запуск через Makefile
Если у вас установлен Make, вы можете использовать удобные команды, прописанные в Makefile. Для сборки и запуска контейнеров через Docker Compose выполните команду:

```bash
make up
```

Приложение будет доступно на http://localhost:80.


## CI/CD с GitHub Actions
Проект использует GitHub Actions для автоматизации процессов CI/CD. Конфигурация находится в директории ```.github/workflows```. При каждом пуше в репозиторий запускаются тесты и сборка проекта.

## Настройка и управление кодом
- **Husky** используется для настройки pre-commit хуков, чтобы автоматически запускать линтеры и тесты перед каждым коммитом;
- **Nginx** используется для проксирования запросов и управления трафиком, обеспечивая высокую доступность и производительность.

## 🚀 Разработка

### Структура проекта:

```plaintext
├── backend/             # Серверная часть проекта (NestJS)
├── public/
│   └── images/          # Папка для хранения изображений.
├── .github/             # Конфигурация для GitHub Actions.
├── .husky/              # Конфигурация для Husky.
├── .gitignore           # Файлы и папки, которые игнорируются Git.
├── .env                 # Файл для общих и открытых переменных окружения.
├── docker-compose.yml   # Конфигурация Docker Compose.
├── .nvmrc               # Файл для установки версии Node.js
├── .npmrc               # Файл для настройки NPM.
├── nginx.conf           # Конфигурация Nginx.
├── Makefile             # Файл для автоматизации задач.
├── package.json         # Зависимости и скрипты проекта.
├── package-lock.json    # Фиксированные версии зависимостей.
└── README.md            # Документация проекта.
```

## 🧑‍🤝‍🧑 Контрибьютинг

Приветствуются предложения по улучшению проекта! Если вы хотите внести изменения или улучшения, пожалуйста, откройте issue или создайте pull request.

1. Форкните репозиторий;
2. Создайте ветку для вашего изменения;
3. Отправьте pull request.

## 💬 Связь

Если у вас есть вопросы или предложения, пожалуйста, не стесняйтесь обращаться через issues или пишите по адресу polieshko04@gmail.com.
