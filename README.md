This is a project files for a workshop to create your digital assistant with speech and video animation functions.

The structure of the repo is that every step have its own branch. You can start from  any of them or go to the 'final' directly to get the final code.
- [main](https://github.com/Ajasra/ChatWorkshop/tree/main) Basic setup, required packages and app structure.
- [basic_ui](https://github.com/Ajasra/ChatWorkshop/tree/basic_ui) Setting up basic user interface and storage.
- [conversation](https://github.com/Ajasra/ChatWorkshop/tree/conversation)Conversation model. Memory. Multiple conversations.
- [speech](https://github.com/Ajasra/ChatWorkshop/tree/speech) Elevenlabs api for a text-to-speech. Managing audio files and different way to use api.
- [video](https://github.com/Ajasra/ChatWorkshop/tree/video) D-ID api for a text-to-video
- [final](https://github.com/Ajasra/ChatWorkshop/tree/final) Updating user interface for a chat-like assistant. Connecting everything together.

## Getting Started
First, clone the project and install required packages
```bash
npm i
```
Start development server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
