# AnswerDock

A fast, AI-powered research assistant built with the MERN stack.

AnswerDock is a Perplexity-inspired web app where users can ask questions, get grounded answers, and explore sources in a clean chat interface.

## Why This Project

Most AI chat apps give answers without enough context.

AnswerDock is designed to be:
- Source-aware
- Fast and minimal
- Easy to scale and customize

## Core Features (Planned)

- AI chat interface with conversation history
- Source-backed answers (links + snippets)
- Follow-up questions in the same thread
- User authentication (JWT)
- Saved chats and bookmarks
- Search history and user dashboard
- Markdown rendering in answers
- Streaming responses for better UX

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Bcrypt

### AI + Search Layer
- LLM provider API (OpenAI / Gemini / Claude)
- Optional web search provider integration

## Project Structure

```text
.
├── client/                # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── server/                # Express backend
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── index.js
│   └── package.json
├── .env.example
├── .gitignore
└── README.md
```

## Getting Started

### 1) Clone the Repository

```bash
git clone https://github.com/your-username/answerdock.git
cd answerdock
```

### 2) Install Dependencies

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### 3) Environment Variables

Create a `.env` file inside the `server` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
AI_API_KEY=your_ai_provider_key
CLIENT_URL=http://localhost:5173
```

### 4) Run the App

In one terminal:

```bash
cd server
npm run dev
```

In another terminal:

```bash
cd client
npm run dev
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:5000`

## API Preview (Example)

### POST `/api/chat/ask`

Request:

```json
{
  "question": "What are the latest trends in edge AI?"
}
```

Response:

```json
{
  "answer": "Edge AI is moving toward...",
  "sources": [
    {
      "title": "Research Paper",
      "url": "https://example.com"
    }
  ]
}
```

## Roadmap

- RAG pipeline for better factual grounding
- Multi-model switching
- Citation confidence scoring
- Workspace/team support
- Export to PDF/Markdown
- Dark mode + accessibility pass

## Contributing

Contributions are welcome.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m "Add amazing feature"`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Author

Built by you. Ship fast.
