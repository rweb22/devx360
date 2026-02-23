#!/bin/bash

# run.sh - Start the DevX360 Node.js application
# This script prompts for a port number and starts the application

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# PID file location
PID_FILE="devx360.pid"

# Check if application is already running
if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if ps -p "$PID" > /dev/null 2>&1; then
        echo -e "${RED}Error: Application is already running with PID $PID${NC}"
        echo -e "${YELLOW}Use ./stop.sh to stop it first, or ./status.sh to check status${NC}"
        exit 1
    else
        # PID file exists but process is not running, clean up
        rm -f "$PID_FILE"
    fi
fi

# Prompt for port number
echo -e "${BLUE}=== DevX360 Application Startup ===${NC}"
echo -e "${YELLOW}Enter the port number to run the application on:${NC}"
read -p "Port (default: 3000): " PORT

# Use default port if none provided
if [ -z "$PORT" ]; then
    PORT=3000
fi

# Validate port number
if ! [[ "$PORT" =~ ^[0-9]+$ ]] || [ "$PORT" -lt 1 ] || [ "$PORT" -gt 65535 ]; then
    echo -e "${RED}Error: Invalid port number. Please enter a number between 1 and 65535${NC}"
    exit 1
fi

# Check if port is already in use
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${RED}Error: Port $PORT is already in use${NC}"
    echo -e "${YELLOW}Please choose a different port or stop the process using that port${NC}"
    exit 1
fi

# Start the application
echo -e "${GREEN}Starting DevX360 application on port $PORT...${NC}"

# Export PORT and start the application in background
PORT=$PORT nohup node app.js > devx360.log 2>&1 &

# Save the PID
echo $! > "$PID_FILE"

# Wait a moment to check if the process started successfully
sleep 2

if ps -p $(cat "$PID_FILE") > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Application started successfully!${NC}"
    echo -e "${BLUE}PID: $(cat "$PID_FILE")${NC}"
    echo -e "${BLUE}Port: $PORT${NC}"
    echo -e "${BLUE}URL: http://localhost:$PORT${NC}"
    echo -e "${BLUE}Log file: devx360.log${NC}"
    echo ""
    echo -e "${YELLOW}Use ./status.sh to check status${NC}"
    echo -e "${YELLOW}Use ./stop.sh to stop the application${NC}"
else
    echo -e "${RED}✗ Failed to start application${NC}"
    echo -e "${YELLOW}Check devx360.log for error details${NC}"
    rm -f "$PID_FILE"
    exit 1
fi

