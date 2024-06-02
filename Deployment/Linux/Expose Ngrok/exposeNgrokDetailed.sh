#!/bin/bash

# Check if jq is installed, if not install it
if ! command -v jq &> /dev/null
then
    echo "jq could not be found, installing jq..."
    sudo apt-get update
    sudo apt-get install -y jq
else
    echo "jq is already installed."
fi

# Function to download ngrok if not present
download_ngrok() {
    echo "Downloading ngrok..."
    # Download the ngrok zip file
    wget -q https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz -O ngrok.tgz
    # Extract the ngrok executable directly to the current directory, overwriting without prompting
    tar -xzf ngrok.tgz -C ./
    # Remove the downloaded tgz file after extraction
    rm ngrok.tgz
    echo "ngrok downloaded and extracted into the current directory."
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
./ngrok http 8000 