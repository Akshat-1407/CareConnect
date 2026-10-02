#!/usr/bin/env bash
# Render Build Script for CareConnect Backend
set -o errexit

echo "Installing dependencies..."
pip install -r requirements.txt

echo "Collecting static files..."
python manage.py collectstatic --no-input

echo "Running database migrations..."
python manage.py migrate

# Optional auto-creation of admin if environment variables are provided
if [ -n "$ADMIN_USERNAME" ] && [ -n "$ADMIN_PASSWORD" ]; then
    echo "Creating or ensuring admin user..."
    python manage.py create_admin --username "$ADMIN_USERNAME" --email "${ADMIN_EMAIL:-admin@careconnect.com}" --password "$ADMIN_PASSWORD"
fi

echo "Build complete."
