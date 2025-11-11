FROM node:20-alpine 

WORKDIR /app

RUN npm install -g pnpm@10.20.0

COPY  package.json pnpm-lock.yaml ./

RUN pnpm install
COPY . .
RUN pnpm build


EXPOSE 8000
CMD [ "node","-r","dotenv/config","dist/index.js" ]