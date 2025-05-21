#!/usr/bin/env sh

# Delete existing DATABASE_URL from environment config.
sed -i '' '/DATABASE_URL/d' .env 2>/dev/null

# Start database in background, extract connection URL and save it to environment config.
{ prisma dev | grep --line-buffered --only-matching 'DATABASE_URL=.\+' >>.env; } &

# Halt the database when it's finished.
trap 'kill -- -$!' EXIT QUIT INT TERM HUP

# Wait for the database to be ready.
sleep 2

# Migrate and seed for testing.
npm run migrate
npm run seed

# Hold until we're stopped.
wait
