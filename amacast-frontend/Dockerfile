
FROM node:18.16.1-bullseye-slim as builder

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED 1

COPY package.json .
COPY package-lock.json .
RUN  npm install --production

COPY public ./public
COPY src ./src
COPY *.json .
COPY *.js .

RUN npm run build

FROM node:18-alpine AS production

WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]
