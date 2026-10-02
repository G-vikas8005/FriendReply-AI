# FriendReply AI

## Problem

People often know what they want to say but struggle to phrase a short, natural reply. FriendReply AI helps turn a pasted message into three friendly, useful response options with a chosen tone and style.

## Solution

FriendReply AI takes a message, tone, and style, sends the request to the backend, then asks a configured open-weight model through Dahl for exactly three reply suggestions. The frontend displays those responses as cards with copy buttons so the user can quickly use the best one.

## Why Open-Weight AI

Open-weight models give the project more flexibility than relying on a single closed model. They make it easier to change models, experiment with different behavior, and understand the stack more transparently. They are also useful for learning AI infrastructure in a small real-world application without a heavy setup.

## Features

- natural reply generation
- multiple tones
- multiple styles
- exactly three reply suggestions
- copy button for each suggestion
- responsive interface
- no database required
- API key stays on the backend only

## Architecture

```text
Frontend → Backend → Dahl → Open-weight model
```

## Tech Stack

- React
- Vite
- JavaScript
- CSS
- Node.js
- Express
- Dahl API
- Open-weight model

## Project Structure

```text
friendreply-ai/
├── frontend/
│   ├── src/
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── routes/
│   ├── services/
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── .gitignore
├── README.md
├── package.json
└── package-lock.json
```

## Setup

1. Clone the repository.
2. Install root dependencies:
   ```bash
   npm install
   ```
3. Install frontend dependencies:
   ```bash
   npm install --prefix frontend
   ```
4. Install backend dependencies:
   ```bash
   npm install --prefix backend
   ```
5. Create the backend environment file:
   ```bash
   copy backend\.env.example backend\.env
   ```
   Or on macOS/Linux:
   ```bash
   cp backend/.env.example backend/.env
   ```
6. Add your real Dahl credentials in `backend/.env`.
7. Set `DAHL_MODEL` to a valid model from Dahl’s `/v1/models` list.
8. Start the backend:
   ```bash
   npm --prefix backend run dev
   ```
9. Start the frontend:
   ```bash
   npm --prefix frontend run dev
   ```
10. Open the app at http://localhost:5173

## Environment Variables

### Backend

Create `backend/.env` with:

```env
DAHL_API_KEY=your_key_here
DAHL_BASE_URL=https://inference.dahl.global/v1
DAHL_MODEL=your_model_id_here
PORT=5000
```

### Frontend

Create `frontend/.env` with:

```env
VITE_API_BASE_URL=http://localhost:5000
```

The frontend should only contain non-secret values.

## API

### GET /api/health

```json
{
  "status": "ok"
}
```

### POST /api/reply

Request body:

```json
{
  "message": "Are you coming tomorrow?",
  "tone": "friendly",
  "style": "short"
}
```

Success response:

```json
{
  "replies": [
    "Sure, I’ll be there tomorrow.",
    "Yep, I’m coming tomorrow.",
    "I’ll be there. Let’s get it done."
  ]
}
```

Error response example:

```json
{
  "error": "Please enter a message first."
}
```

## Security

The Dahl API key must never be exposed to the frontend. It stays in the backend environment file only. The app does not require a database for this version.

## AI Prompt Design

The backend uses a system prompt that enforces:

- exactly three replies
- natural language output
- no invented commitments
- no extra explanations
- JSON-only output

This helps keep the model output structured and reduces prompt-injection risk from user-supplied text.

## Testing

Use the backend to test:

```bash
curl http://localhost:5000/api/health
curl -X POST http://localhost:5000/api/reply -H "Content-Type: application/json" -d '{"message":"Are you coming tomorrow?","tone":"friendly","style":"short"}'
```

Also test invalid input, long messages, invalid tone values, and invalid style values.

## Limitations

- response quality depends on the selected Dahl model
- hosted inference can have temporary availability or rate limits
- AI replies may still need a quick human review

## Future Improvements

- local reply history in browser storage
- more tone and style options
- multi-language support
- user-selectable model choice
- personalization for common friend message patterns

These are intentionally not implemented in this version to keep the project small and reliable.

## Hacktoberfest / DEV Challenge

This project was built as a new application for the Hacktoberfest 2026 DEV Weekend Challenge: Build for a Friend. The application uses an open-weight model as a central part of its AI functionality, solves a real communication problem, and is designed to help a person reply naturally to messages.

Friend feedback:

[Replace this section with the real person's name/relationship and actual feedback after testing.]

## Final Notes

This app is intentionally small, practical, and beginner-friendly. It focuses on one real workflow: taking a message and turning it into three natural replies.
