#!/bin/bash

# Function to download ngrok if not present
download_ngrok() {
    echo "Downloading ngrok..."
    # Download the ngrok zip file
    wget -q https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz -O ngrok.tgz
    # Unzip the ngrok executable directly to the current directory, overwriting without prompting
    unzip -o ngrok.tgz -d ./
    # Remove the downloaded zip file after extraction
    rm ngrok.tgz
    echo "ngrok downloaded and unzipped into the current directory."
}

# Check if ngrok is available
if [ ! -f "./ngrok" ]; then
    echo "ngrok could not be found in the current directory"
    download_ngrok
else
    echo "ngrok is present."
fi

chmod +x ngrok

# Setup ngrok authtoken
echo "Setting up ngrok authtoken..."
./ngrok authtoken 2golIlBy6lR4I26eAJEaVspKrLa_7F2c3LPbDtewRAKkqYkzD

# Start ngrok in the background
./ngrok http 8000 > /dev/null &

# Give ngrok some time to initialize
sleep 5

# Fetch the ngrok tunnel URL using ngrok's local API
NGROK_URL=$(curl -s http://127.0.0.1:4040/api/tunnels | grep -o "https://[0-9a-z]*\.ngrok.io")

# Output the ngrok URL
echo "Your ngrok URL is: $NGROK_URL"
echo "Visit http://127.0.0.1:4040 to see the ngrok dashboard and URLs."