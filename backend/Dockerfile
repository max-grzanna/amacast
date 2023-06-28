
FROM node:18.16.1-bullseye-slim

WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN  npm install --production

COPY migrations ./migrations
COPY src ./src

EXPOSE 7001

ENTRYPOINT [ "npm" ]
CMD ["start"]
