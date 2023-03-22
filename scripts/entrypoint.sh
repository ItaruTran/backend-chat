#!/bin/bash
set -e

scripts/wait-for-it.sh $POSTGRES_SERVER:$POSTGRES_PORT -t 60
scripts/wait-for-it.sh $REDIS_HOST:$REDIS_PORT -t 60

exec $@
