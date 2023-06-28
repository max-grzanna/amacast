
FROM node:18.16.1-bullseye-slim

WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN  npm install --production

COPY migrations ./migrations
COPY src ./src

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT [ "npm" ]
CMD ["start"]
