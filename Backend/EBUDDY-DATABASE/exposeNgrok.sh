#!/bin/bash

# Function to download ngrok if not present
download_ngrok() {
    echo "Downloading ngrok..."
    wget -q https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-linux-amd64.zip
    unzip ngrok-stable-linux-amd64.zip
    rm ngrok-stable-linux-amd64.zip
    echo "ngrok downloaded and unzipped."
}

# Check if ngrok is available
if ! command -v ngrok &> /dev/null
then
    echo "ngrok could not be found"
    download_ngrok
fi

# Setup ngrok authtoken
echo "Setting up ngrok authtoken..."
./ngrok authtoken 2golIlBy6lR4I26eAJEaVspKrLa_7F2c3LPbDtewRAKkqYkz

# Start ngrok in the background
echo "Starting ngrok to expose port 8000..."
./ngrok http 8000 > /dev/null &

# Give ngrok some time to initialize
sleep 2

# Fetch the ngrok tunnel URL using ngrok's local API
NGROK_URL=$(curl -s http://127.0.0.1:4040/api/tunnels | grep -o "https://[0-9a-z]*\.ngrok.io")

# Output the ngrok URL
echo "Your ngrok URL is: $NGROK_URL"
echo "Visit http://127.0.0.1:4040 to see the ngrok dashboard and URLs."
