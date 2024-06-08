#!/bin/bash

set -e

# Wait for the PostgreSQL container to be ready
until pg_isready -h postgres -U $POSTGRES_USER; do
  echo "Waiting for PostgreSQL to be ready..."
  sleep 2
done

# Dump the database
pg_dumpall -h postgres -U $POSTGRES_USER -f /backups/db_backup.sql
echo "Database backup completed."
