#!/bin/bash
set -e

# Wait for MySQL
if [ "$DB_HOST" != "" ]; then
    echo "Waiting for MySQL at $DB_HOST:$DB_PORT..."
    until nc -z "$DB_HOST" "$DB_PORT"; do
        sleep 1
    done
    echo "MySQL is up!"
fi

# Apply migrations
echo "Applying migrations..."
alembic upgrade head

# Seed admin user
echo "Seeding admin user..."
python seed.py

# Start server
echo "Starting FastAPI server..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --proxy-headers
