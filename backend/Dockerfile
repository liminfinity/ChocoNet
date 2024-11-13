# Используем официальный Node.js образ версии 20 как базовый
ARG NODE_VERSION=20-alpine

# Создаём временный образ
FROM node:${NODE_VERSION} AS builder

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все остальные файлы приложения
COPY . .

# Генерируем схемы Prisma
RUN npm run prisma:generate

# Строим приложение
RUN npm run build

# Создаём финальный образ
FROM node:${NODE_VERSION} AS runner

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем только необходимые файлы из предыдущего этапа
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

# Устанавливаем переменные окружения
ENV NODE_ENV=production

# Открываем порт
EXPOSE 3000

# Запускаем приложение
CMD ["npm", "run", "start:prod"]
