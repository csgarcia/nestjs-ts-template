FROM node:22.2.0-alpine3.20

RUN apk add bash dumb-init \
  && rm -rf /var/cache/apk/*

ENV NODE_ENV=development

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

CMD ["node","--run", "start:dev"]

EXPOSE 3000
