#!/bin/bash
set -e

npm run migrate $NODE_ENV

node .