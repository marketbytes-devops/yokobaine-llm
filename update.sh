#!/bin/bash

echo "Starting Yokobaine LLM Update..."

# Ensure we are in the directory of the script
cd "$(dirname "$0")"

# 1. Pull latest changes from GitHub
echo "Pulling latest changes from GitHub..."
git pull

# 2. Rebuild and restart Docker containers
echo "Rebuilding and restarting Docker containers..."
docker compose up -d --build

# 3. Clean up old images
echo "Cleaning up old Docker images..."
docker image prune -f

echo "Update Complete! Yokobaine LLM is now running in production mode."
echo "Frontend: http://app.yokobaine.com (Port 7400)"
echo "Backend: http://appbackend.yokobaine.com (Port 7401)"
