FROM node:20-alpine 

WORKDIR /app
RUN npm install -g pnpm

COPY  package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN mkdir -p apps/backend
COPY apps/backend/package.json ./apps/backend

RUN pnpm install --frozen-lockfile
COPY apps/backend ./apps/backend

WORKDIR /app/apps/backend
RUN pnpm build


EXPOSE 8000
CMD [ "node","-r","dotenv/config","dist/index.js" ]