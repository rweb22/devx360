#!/bin/bash

# status.sh - Check the status of the DevX360 Node.js application

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# PID file location
PID_FILE="devx360.pid"

echo -e "${BLUE}=== DevX360 Application Status ===${NC}"
echo ""

# Check if PID file exists
if [ ! -f "$PID_FILE" ]; then
    echo -e "${RED}Status: Not Running${NC}"
    echo -e "${YELLOW}No PID file found. Application may not have been started with run.sh${NC}"
    exit 1
fi

# Read PID from file
PID=$(cat "$PID_FILE")

# Check if process is running
if ps -p "$PID" > /dev/null 2>&1; then
    echo -e "${GREEN}Status: Running ✓${NC}"
    echo -e "${BLUE}PID: $PID${NC}"
    
    # Get process details
    echo ""
    echo -e "${BLUE}Process Details:${NC}"
    ps -p "$PID" -o pid,ppid,cmd,%cpu,%mem,etime
    
    # Try to find the port from the process
    echo ""
    PORT=$(lsof -Pan -p "$PID" -i 2>/dev/null | grep LISTEN | awk '{print $9}' | cut -d':' -f2 | head -1)
    if [ -n "$PORT" ]; then
        echo -e "${BLUE}Port: $PORT${NC}"
        echo -e "${BLUE}URL: http://localhost:$PORT${NC}"
    fi
    
    # Show log file info if it exists
    if [ -f "devx360.log" ]; then
        echo ""
        echo -e "${BLUE}Log file: devx360.log${NC}"
        LOG_SIZE=$(du -h devx360.log | cut -f1)
        echo -e "${BLUE}Log size: $LOG_SIZE${NC}"
        echo ""
        echo -e "${YELLOW}Last 10 lines of log:${NC}"
        tail -10 devx360.log
    fi
else
    echo -e "${RED}Status: Not Running ✗${NC}"
    echo -e "${YELLOW}PID file exists but process $PID is not running${NC}"
    echo -e "${YELLOW}Cleaning up stale PID file...${NC}"
    rm -f "$PID_FILE"
    exit 1
fi

