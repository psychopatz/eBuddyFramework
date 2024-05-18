# View This tutorial for backend https://www.youtube.com/watch?v=Ww2oelybDz8
Ollama Google Colab: [Here](https://colab.research.google.com/drive/1Ez7NJSmqhXbQAL9hNvom5cVtavA_Q1gj?usp=sharing)

Prereq:
Git
Python 3.11
IDE: Vscode
Mysql

# PS: Gibutngan nakog asterisk ang code pra copyhon siya 1 by one

## 1: Download Ollama
### Download Model
*ollama pull llama3
### Download Embeddings
*ollama pull nomic-embed-text
### run ollama
*ollama serve

## 2: Configure Make
### Download Make
 Link: https://gnuwin32.sourceforge.net/downlinks/make.php
### Add the installation location to Env Path:
Environmental Variables -> System Variable Path ->edit -> New
And Paste the location in there; Default Path(C:\Program Files (x86)\GnuWin32\bin)

## 3: Installing Poetry
*pip install pipx
### after it
*pipx install poetry

*pipx ensurepath

## 4: Create new Env
* conda create -n {env Name} python=3.11

## 5: Install PrivateGPT
### Cd to the privategpt directory
### Make sure to be in your conda Env 
### Install it by running the code
*poetry install --extras "ui llms-ollama embeddings-ollama vector-stores-qdrant"

## 6: Copy the settings-ollama.yaml in init/Settings Temp Folder to privategpt folder and ovewrite it

## 7: Running the privateGPT
### Open a new anaconda POWERSHELL console and conda activate to the env
### also make sure youre in the right path

### if Using PowerShell:
*$env:PGPT_PROFILES="ollama"
*make run

### If Using just CMD:
*set PGPT_PROFILES=ollama
*make run
