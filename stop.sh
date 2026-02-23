#!/bin/bash

# stop.sh - Stop the DevX360 Node.js application

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# PID file location
PID_FILE="devx360.pid"

echo -e "${BLUE}=== DevX360 Application Shutdown ===${NC}"
echo ""

# Check if PID file exists
if [ ! -f "$PID_FILE" ]; then
    echo -e "${YELLOW}No PID file found. Application may not be running.${NC}"
    exit 1
fi

# Read PID from file
PID=$(cat "$PID_FILE")

# Check if process is running
if ! ps -p "$PID" > /dev/null 2>&1; then
    echo -e "${YELLOW}Process $PID is not running${NC}"
    echo -e "${YELLOW}Cleaning up PID file...${NC}"
    rm -f "$PID_FILE"
    exit 1
fi

# Stop the process
echo -e "${YELLOW}Stopping application (PID: $PID)...${NC}"

# Try graceful shutdown first (SIGTERM)
kill "$PID" 2>/dev/null

# Wait for process to stop (max 10 seconds)
COUNTER=0
while ps -p "$PID" > /dev/null 2>&1 && [ $COUNTER -lt 10 ]; do
    sleep 1
    COUNTER=$((COUNTER + 1))
    echo -n "."
done
echo ""

# Check if process stopped
if ps -p "$PID" > /dev/null 2>&1; then
    echo -e "${YELLOW}Process did not stop gracefully, forcing shutdown...${NC}"
    kill -9 "$PID" 2>/dev/null
    sleep 1
fi

# Verify process is stopped
if ps -p "$PID" > /dev/null 2>&1; then
    echo -e "${RED}✗ Failed to stop process $PID${NC}"
    exit 1
else
    echo -e "${GREEN}✓ Application stopped successfully${NC}"
    rm -f "$PID_FILE"
    echo -e "${BLUE}PID file removed${NC}"
fi

