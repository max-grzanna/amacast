
FROM node:18.16.1-bullseye-slim as builder

WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN  npm install --production

COPY tsconfig.json .
COPY tsconfig.server.json .
COPY server.ts .
COPY pages ./pages

RUN ls && ls
RUN npm run build

FROM node:18-alpine AS production

WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/.next ./build

ENV PORT 7001
EXPOSE 7001

CMD ["/app/build/index.js"]
