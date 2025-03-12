# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
COPY package-lock.json ./
RUN corepack enable && npm install --frozen-lockfile
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production

WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/next-i18next.config.js ./

EXPOSE 3000
CMD ["npm", "start"]