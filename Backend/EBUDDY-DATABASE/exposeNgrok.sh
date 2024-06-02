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
clear
echo "Starting ngrok to expose port 8000..."
./ngrok http 8000 
