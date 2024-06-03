# [CITChat](https://ebuddy-ml.vercel.app/): AI-Machine Learning Powered Support for the CIT Community

## Project Title and Description
**CITChat** is a chat helpdesk system designed to streamline and enhance communication about CIT information services. It leverages machine learning and a Large Language Model (LLM) to provide on-demand responses to queries about CIT operations, enrollment, accounts, and more, available anytime and anywhere.

## API Overview
### High-level API Functionalities
- **LLM Integration**: Provides intelligent responses using a large language model.
- **Real-time Ingestion**: Continuously updates with new information.
- **Customizable AI Personality**: Easily adjustable to match the desired characteristics and tone.

### Low-level API Functionalities
- **Image Support**: Capable of displaying images in responses.
- **Trainable AI**: Allows for easy training on new topics.
- **Question Topic Management**: Identifies and categorizes unknown questions for admin review.
- **Integration**: Easily integrates into institution kiosks for quick access.

## Motivation
Developed to address the need for efficient and effective communication within the CIT community, CITChat focuses on:
- **Privacy**: Ensuring sensitive information is handled securely.
- **Accessibility**: Providing information anytime, anywhere.

## Architecture
- **Technologies**: 
    - Built with FastAPI - for backend 
    - React.js  - for frontend 
- **Components**: 
    - Llama3 - for LLM 
    - MySQL - for Database
    - qdrant - for vector database
    - znbang - for embedding model
    - ollama - acts as a bridge between the complexities of deploying the LLM
    - PrivateGPT - for RAG, API and LLM Inference Abstractions
    - Anaconda
    - Python
    - JavaScript
    - HTML and CSS
    - MaterialUI
    - react-three
- **Features**: 
    - Real-time ingestion
    - Customizable AI characteristics on the fly
    - Image display support
    - Statistics dashboard.

## Getting Started
### Installation Instructions

#### Prerequisites:
* Clone the repository.
* Ensure you have Git, Python 3.11, NPM, VS Code, and MySQL installed.

#### To install the eBuddyFramework, follow these summarized steps:

### **For LLM Backend**
1. **Download Ollama**: 
   - Run `ollama pull llama3`
   - Run `ollama pull nomic-embed-text`
   - Start Ollama with `ollama serve`
2. **Install Make**: Download from [GNUWin32](https://gnuwin32.sourceforge.net/downlinks/make.php) and add to your system PATH.
3. **Create New Virtual Environment**: 
   - Use `conda create -n {env Name} python=3.11`
4. **Install Poetry**: 
   - Run `pip install pipx`
   - Run `pipx install poetry`
   - Run `pipx ensurepath`
5. **Install PrivateGPT**: 
   - Navigate to the PrivateGPT directory.
   - Activate your conda environment.
   - Run `poetry install --extras "ui llms-ollama embeddings-ollama vector-stores-qdrant"`
6. **Configure Settings**: Copy `settings-ollama.yaml` to the PrivateGPT folder.
7. **Run PrivateGPT**: 
   - Activate your environment and run `make run` with the appropriate profile settings.

### **For Database Backend**
1. **Create New Virtual Environment**: 
   - Use `conda create -n {env Name} python=3.11`
   - Install dependencies using `pip install -r requirements.txt`.
   - Run the application using `uvicorn main:app --reload`.

### **For Frontend**
   - `npm install`
   - `npm start`

### Basic Usage Guide
- Access the chat helpdesk via the institution’s kiosk or web interface.
- Ask any questions related to CIT services and receive real-time responses.

## Contributing
* Patrick Oliver Bustamante [![GitHub](https://img.shields.io/badge/GitHub-psychopatz-blue?logo=github)](https://github.com/psychopatz)
* Raphael M. Ubas [![GitHub](https://img.shields.io/badge/GitHub-RaphaelUbas-blue?logo=github)](https://github.com/RaphaelUbas)
* Lloyd Scott Cabido [![GitHub](https://img.shields.io/badge/GitHub-wayddd1-blue?logo=github)](https://github.com/wayddd1)
* Peter Macarulay [![GitHub](https://img.shields.io/badge/GitHub-PeteMacarulay-blue?logo=github)](https://github.com/PeteMacarulay)
* John David Catulong [![GitHub](https://img.shields.io/badge/GitHub-Murphyia09-blue?logo=github)](https://github.com/Murphia09)

### Guidelines
- Fork the repository and create a new branch for your features.
- Submit a pull request with detailed descriptions of your changes.
- Report issues or suggest features via the issue tracker.

## License
CITChat is licensed under the MIT License.

---

This template provides a clear and detailed overview of the CITChat system, highlighting its innovative features and functionalities while encouraging community engagement and contributions.