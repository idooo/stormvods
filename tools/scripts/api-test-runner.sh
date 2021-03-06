#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/../../" && pwd )"
CONFIG=$1

echo "Starting Test server... [config "$CONFIG"]"
echo "Waiting 10 seconds to run tests..."
echo "NOTE: check h.get() to pass all three params correctly if you are receiving Socket Hang Out error"

eval "(config="$CONFIG"  node server.js) &"
PID=$!

sleep 10

echo "Running API integration tests..."
grunt nodeunit:integration $2

echo "Killing Test server..."
kill -9 $PID
echo "Done"
