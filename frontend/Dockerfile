
# Etapa 1: construir React con Vite
FROM node:22-bookworm-slim AS build

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable && corepack prepare pnpm@11.22.0 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY frontend/package.json ./frontend/package.json

RUN pnpm install --frozen-lockfile

COPY . .

ARG VITE_API_URL=http://localhost:3000/api
ENV VITE_API_URL=${VITE_API_URL}

RUN pnpm --filter frontend run build

# Etapa 2: servir los archivos con Nginx
FROM nginx:alpine AS runner

COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]