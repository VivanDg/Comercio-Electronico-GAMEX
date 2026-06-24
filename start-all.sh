#!/bin/bash
set -e

# Config
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 20

export LD_LIBRARY_PATH=/tmp/pg-local/usr/lib/postgresql/16/lib
export PATH="/tmp/pg-local/usr/lib/postgresql/16/bin:$PATH"

export PGDATA=/tmp/pg-data

BASE_DIR="/home/vivand/Documentos/2026 - I CICLO 8/COMERCIO ELECTRÓNICO/TRABAJOS/Ecooomers"

# Start PostgreSQL
pg_ctl -D /tmp/pg-data -l /tmp/pg-logfile start
sleep 2
echo "[OK] PostgreSQL on port 5432"

# Start Backend
cd "$BASE_DIR/backend"
npx tsx src/server.ts > /tmp/backend.log 2>&1 &
BPID=$!
sleep 3
echo "[OK] Backend on port 4000 (PID $BPID)"

# Start Frontend
cd "$BASE_DIR/frontend"
npx next dev > /tmp/frontend.log 2>&1 &
FPID=$!
sleep 5
echo "[OK] Frontend on port 3000 (PID $FPID)"

echo ""
echo "=== Servicios iniciados ==="
echo "  Frontend: http://localhost:3000"
echo "  API:      http://localhost:4000/api/v1"
echo "  Admin:    admin@gameximport.com / Admin123!"
echo ""
echo "PIDs: Backend=$BPID Frontend=$FPID"
