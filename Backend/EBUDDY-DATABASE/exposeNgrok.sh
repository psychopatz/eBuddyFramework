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
if [ ! -f "./ngrok" ]; then
    echo "ngrok could not be found in the current directory"
    download_ngrok
else
    echo "ngrok is present."
fi


# Setup ngrok authtoken
echo "Setting up ngrok authtoken..."
./ngrok authtoken 2golIlBy6lR4I26eAJEaVspKrLa_7F2c3LPbDtewRAKkqYkzD

# Start ngrok in the background
clear
echo "Starting ngrok to expose port 8000..."
./ngrok http 8000 
