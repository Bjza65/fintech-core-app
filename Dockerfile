# Etapa 1: imagen base
FROM node:22-bookworm-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable && corepack prepare pnpm@11.22.0 --activate

WORKDIR /app

# Etapa 2: instalar dependencias de desarrollo
FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY frontend/package.json ./frontend/package.json

RUN pnpm install --frozen-lockfile

# Etapa 3: generar Prisma Client y compilar TypeScript
FROM deps AS build

COPY . .

# URL temporal solo para cargar la configuración de Prisma durante generate
ENV DATABASE_URL="postgresql://postgres:local_build_password@localhost:5432/fintech_core?schema=public"

RUN pnpm exec prisma generate
RUN pnpm build

# Etapa 4: instalar solamente dependencias de producción
FROM base AS production-deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY frontend/package.json ./frontend/package.json

RUN pnpm install --prod --frozen-lockfile

# Etapa 5: imagen final
FROM node:22-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=production-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./prisma.config.ts
COPY package.json ./package.json

EXPOSE 3000

# Aplicar migraciones pendientes antes de iniciar Express
CMD ["sh", "-c", "./node_modules/.bin/prisma migrate deploy && node dist/server.js"]
