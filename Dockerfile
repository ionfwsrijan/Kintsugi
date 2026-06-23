FROM node:24-alpine AS build
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build && pnpm run build:server

FROM node:24-alpine
ENV NODE_ENV=production
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --prod
COPY --from=build /app/server-dist ./server-dist
COPY --from=build /app/dist ./dist
USER node
EXPOSE 8080
CMD ["node", "server-dist/index.js"]
