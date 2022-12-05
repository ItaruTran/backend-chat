# Chat backend

## Setup

- Create `.env` file, you can change the value freely according to your environment

```env
NODE_ENV=development

POSTGRES_SERVER=127.0.0.1
POSTGRES_PORT=5432
POSTGRES_DB=chatdb
POSTGRES_PASSWORD=postgres
POSTGRES_USER=postgres

REDIS_HOST=127.0.0.1
REDIS_PORT=6379

ONESIGNAL_APPID=
ONESIGNAL_APIKEY=

SECRET_KEY=secret-key
# ALLOW_ORGINS=
ADMIN_PASSWORD=123456

MEDIA_URL=
APP_MEDIA_URL=
```

- Install packages `npm install`
- Run debug on VSCode

## Generate migration

- Update env in file `.vscode/tasks.json` match with you config, but DO NOT COMMIT it to git
- Install sequelize-mig `npm install -g sequelize-mig`
- Run VSCode task: `make migration`
- Revert change in file `sequelize/migrations/_current.json`

```json
    // It's wrong
    "path": "C:\\some\\path\\sequelize\\migrations\\_current.json",
    "backupPath": "C:\\some\\path\\sequelize\\migrations\\_current_bak.json",

    // Change back to
    "path": "sequelize/migrations/_current.json",
    "backupPath": "sequelize/migrations/_current_bak.json",
```

## Run in local

- Run command `python scripts/manager.py deploy`

## Deploy to server

- Run command

```bash
python scripts/manager.py deploy -s <local | development | staging | production> --build
```

```
usage: manager.py deploy [-h] [-s S] [-b] ...

Deploy service

optional arguments:
  -h, --help       show this help message and exit
  -s S, --stage S  target environment (default: local)
  -b, --build      build images of stack
```