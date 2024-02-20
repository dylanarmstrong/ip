#!/usr/bin/env sh

set -e

if [[ "$NODE_ENV" == "development" ]]; then
  pnpm run dev
else
  pnpm run start
fi
