
FROM node:18.16.1-bullseye-slim

WORKDIR /app

COPY ./analysis/data ./data
RUN  npm install -g http-server

EXPOSE 8080

ENTRYPOINT [ "http-server", "/app", "--cors", "-i", "true", "-d", "true" ]
