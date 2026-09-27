#!/bin/sh
set -e

if [ ! -f "$DATABASE_DIR/data.db" ]; then
    cp ./application/modules/db/data.db "$DATABASE_DIR/data.db"
fi

exec "$@"
