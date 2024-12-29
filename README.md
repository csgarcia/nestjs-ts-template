## Description
NodeJs TS Template for free use. This uses:
- [Nest](https://github.com/nestjs/nest) framework TypeScript
- Postgresql Database with Typeorm
- Docker Container usage

## Requirements
- NodeJs Version >= 22.0.0
- Docker 

## Installation

```bash
$ npm install
```

## Running the app with Docker
After installation section
### Build docker image and DB
```bash
$ docker-compose build service
```

### Run services
```bash
$ docker-compose up -d service
```
### Run Database migrations 
#### At this point you should find the service and database running

Execute: 
```bash
$ docker-compose ps
```
And you will see:
```bash
NAME                           IMAGE                           COMMAND                  SERVICE             CREATED             STATUS              PORTS
nestjs-ts-template-db-1        postgis/postgis:14-3.2-alpine   "docker-entrypoint.s…"   db                  35 minutes ago      Up 35 minutes       0.0.0.0:15432->5432/tcp
nestjs-ts-template-service-1   nestjs-ts-template-service      "docker-entrypoint.s…"   service             35 minutes ago      Up 35 minutes       0.0.0.0:3000->3000/tcp
```
- To run database migrations we need to access the docker container:
```bash
$ docker-compose exec -it service bash  
```

- Then inside docker container run:
```bash
$ npm run migrations:run
```
This will create all Entities mapped in src/database/migrations

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
