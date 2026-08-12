#!/usr/bin/env bash
# Per-boot startup: ensure a local MongoDB instance is running and ready.
# Idempotent: does nothing if mongod is already up.
set -euo pipefail

DBPATH="${MONGO_DBPATH:-$HOME/.local/share/mongodb/data}"
LOGPATH="${MONGO_LOGPATH:-$HOME/.local/share/mongodb/mongod.log}"

mkdir -p "$DBPATH" "$(dirname "$LOGPATH")"

if pgrep -x mongod >/dev/null 2>&1; then
  echo "mongod already running"
else
  echo "Starting mongod (dbpath=$DBPATH)"
  mongod --dbpath "$DBPATH" --logpath "$LOGPATH" \
    --port 27017 --bind_ip 127.0.0.1 --fork
fi

# Wait for MongoDB to accept connections before terminals/servers start.
for _ in $(seq 1 30); do
  if mongosh --quiet --eval 'quit(db.runCommand({ ping: 1 }).ok ? 0 : 1)' \
      "mongodb://127.0.0.1:27017/admin" >/dev/null 2>&1; then
    echo "MongoDB is ready on 127.0.0.1:27017"
    exit 0
  fi
  sleep 1
done

echo "MongoDB did not become ready in time" >&2
exit 1
