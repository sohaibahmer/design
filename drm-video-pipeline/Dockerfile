# Build Stage: Install dependencies and compile TypeScript
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json tsconfig.json ./
RUN npm ci

COPY src ./src
RUN npm run build

# Production Stage: Lightweight Alpine container with FFmpeg & Node
FROM node:20-alpine AS runner

RUN apk add --no-cache ffmpeg

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY public ./public

EXPOSE 8080

CMD ["node", "dist/drm-server/server.js"]
