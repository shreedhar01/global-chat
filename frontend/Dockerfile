FROM node:20-alpine AS build

WORKDIR /app
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN mkdir -p frontend
COPY frontend/package.json ./frontend
RUN pnpm install --frozen-lockfile

COPY frontend ./frontend

# Inject Vite env at build time
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build
RUN pnpm --filter frontend build

FROM nginx:alpine
COPY --from=build /app/frontend/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]