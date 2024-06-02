#!/bin/bash

# Script to install the latest version of Anaconda for Linux

echo "Downloading the latest Anaconda installer..."
wget https://repo.anaconda.com/archive/Anaconda3-2024.02-1-Linux-x86_64.sh -O anaconda.sh

echo "Installing Anaconda..."
bash anaconda.sh -b -p $HOME/anaconda3

echo "Adding Anaconda to PATH"
export PATH="$HOME/anaconda3/bin:$PATH"
echo 'export PATH="$HOME/anaconda3/bin:$PATH"' >> $HOME/.bashrc

echo "Initializing conda..."
source $HOME/anaconda3/bin/activate
conda init

echo "Anaconda installation completed."
echo "Please close and reopen your terminal to start using Anaconda."

# Clean up the installer
rm anaconda.sh
