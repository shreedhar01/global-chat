FROM node:20-alpine 

WORKDIR /app
RUN npm install -g pnpm

COPY  package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN mkdir -p backend
COPY backend/package.json ./backend

RUN pnpm install --frozen-lockfile
COPY backend ./backend

WORKDIR /app/backend
RUN pnpm build


EXPOSE 8000
CMD [ "node","-r","dotenv/config","dist/index.js" ]