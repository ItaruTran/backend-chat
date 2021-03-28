# Chat backend

## Setup

- Create `.env` file, you can change the value freely according to your environment

```env
NODE_ENV=development

POSTGRES_SERVER=127.0.0.1
POSTGRES_DB=chatdb
POSTGRES_PASSWORD=postgres
POSTGRES_USER=postgres

REDIS_HOST=127.0.0.1
REDIS_PORT=6379

SECRET_KEY=secret-key

# Add this if you want login api and auto create friendship data
INCLUDE_USER=true
```

- Install packages `npm install`
- Run debug on VSCode

## Docker compose

- Create secret key `python3 -c 'import secrets; print(secrets.token_urlsafe(32))'`
- Create `.env` file

```env
NODE_ENV=production

POSTGRES_SERVER=db
POSTGRES_DB=chatdb
POSTGRES_PASSWORD=postgres
POSTGRES_USER=postgres

REDIS_HOST=redis
REDIS_PORT=6379

SECRET_KEY=please-add-strong-secret-key
```

- Run command `docker-compose up -d`
