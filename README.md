# FriendReply AI

> **Turn a message into 3 natural replies — without overthinking what to say.**

FriendReply AI is a small AI-powered web app built for a simple problem: sometimes you know what you want to say, but you don't know how to phrase it naturally.

Paste a message, choose a tone and style, and FriendReply AI generates exactly three reply options that you can quickly copy and use.

## 🌐 Live Demo

**Live app:** https://friendreply-ai.onrender.com

**GitHub:** https://github.com/G-vikas8005/FriendReply-AI

---

## 💡 The Problem

A friend may receive a message and know the answer they want to give, but still spend time thinking:

* "How should I say this?"
* "Does this sound too formal?"
* "Can I make this shorter?"
* "What are a few different ways I could reply?"

Existing AI tools can solve this, but they can also feel too general for such a small everyday task.

FriendReply AI focuses on one specific workflow:

**Message → Tone + Style → 3 usable replies**

---

## 🎯 The Solution

FriendReply AI lets a user:

1. Paste a message.
2. Select a tone.
3. Select a reply style.
4. Generate exactly three reply suggestions.
5. Copy the reply they prefer.

The application uses an open-weight model through the Dahl inference API.

The frontend never communicates directly with the AI provider. Requests go through the backend, which keeps the API key private.

---

## 👥 Built for a Friend

This project was created around a real everyday communication problem rather than as a general-purpose chatbot.

The goal was intentionally small:

> **Make it easier for a friend to reply to messages naturally and quickly.**

The application was tested with a friend using different message situations and settings. The core reply generation, tone/style controls, and copy functionality worked as expected during testing.

---

## 🤖 Why Open-Weight AI?

Open-weight models provide flexibility that is useful for a project like this.

Using an open-weight model makes it possible to:

* experiment with different models
* change the underlying model without redesigning the application
* learn how model inference fits into a real application
* build the AI layer around an OpenAI-compatible API
* explore alternatives to depending on a single closed AI provider

For FriendReply AI, the model is treated as a replaceable part of the backend rather than something directly coupled to the frontend.

---

## ✨ Features

* Natural reply generation
* Exactly **3 reply suggestions**
* Multiple tones:

  * Friendly
  * Casual
  * Polite
  * Professional
  * Warm
* Multiple reply styles
* Individual copy buttons
* Loading and error states
* Responsive interface
* No database required
* API key kept on the backend
* Simple frontend → backend → AI architecture

---

## 🏗️ Architecture

```text
┌─────────────────────┐
│   React Frontend    │
│                     │
│ Message + Tone      │
│ + Style             │
└──────────┬──────────┘
           │
           │ POST /api/reply
           ▼
┌─────────────────────┐
│   Node / Express    │
│      Backend        │
│                     │
│ Validation +        │
│ AI request handling │
└──────────┬──────────┘
           │
           │ OpenAI-compatible API
           ▼
┌─────────────────────┐
│   Dahl Inference    │
│        API          │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Open-weight       │
│      Model          │
└─────────────────────┘
```

This separation keeps the AI credentials away from the browser and makes the model layer easier to change later.

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* JavaScript
* CSS

### Backend

* Node.js
* Express
* JavaScript

### AI

* Dahl API
* OpenAI-compatible API format
* Open-weight model
* Currently configured for `deepseek-ai/DeepSeek-V4-Flash-0731`

### Deployment

* GitHub
* Render

---

## 📁 Project Structure

```text
friendreply-ai/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── routes/
│   │   └── reply.js
│   ├── services/
│   │   └── dahl.js
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── .gitignore
├── README.md
├── package.json
└── package-lock.json
```

---

## 🚀 Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/G-vikas8005/FriendReply-AI.git
cd FriendReply-AI
```

### 2. Install dependencies

```bash
npm install
npm install --prefix frontend
npm install --prefix backend
```

### 3. Configure the backend

Create:

```text
backend/.env
```

Use:

```env
DAHL_API_KEY=your_key_here
DAHL_BASE_URL=https://inference.dahl.global/v1
DAHL_MODEL=your_model_id_here
PORT=5000
```

Never commit the real API key.

### 4. Configure the frontend

Create:

```text
frontend/.env
```

For local development:

```env
VITE_API_BASE_URL=http://localhost:5000
```

### 5. Start the backend

```bash
npm --prefix backend run dev
```

### 6. Start the frontend

In another terminal:

```bash
npm --prefix frontend run dev
```

### 7. Open the application

```text
http://localhost:5173
```

---

## 🔐 Environment Variables

### Backend

```env
DAHL_API_KEY=your_key_here
DAHL_BASE_URL=https://inference.dahl.global/v1
DAHL_MODEL=your_model_id_here
PORT=5000
```

### Frontend

```env
VITE_API_BASE_URL=http://localhost:5000
```

The Dahl API key belongs only in the backend environment.

The frontend receives the backend URL, not the Dahl API key.

---

## 🔌 API

### `GET /api/health`

Used to check whether the backend is running.

Response:

```json
{
  "status": "ok"
}
```

### `POST /api/reply`

Request:

```json
{
  "message": "Are you coming tomorrow?",
  "tone": "friendly",
  "style": "short"
}
```

Response:

```json
{
  "replies": [
    "Sure, I'll be there tomorrow.",
    "Yep, I'm coming tomorrow.",
    "I'll be there. See you then!"
  ]
}
```

Example error:

```json
{
  "error": "Please enter a message first."
}
```

---

## 🧠 AI Prompt Design

The backend instructs the model to:

* generate exactly three replies
* preserve the user's intended meaning
* avoid inventing facts or commitments
* follow the requested tone
* keep replies concise
* make the three suggestions meaningfully different
* return structured JSON

The backend then parses the model response and returns the three replies to the frontend.

This keeps the application's expected output simple and predictable.

---

## 🧪 Testing

The backend health endpoint can be tested with:

```bash
curl http://localhost:5000/api/health
```

The reply endpoint can be tested with:

```bash
curl -X POST http://localhost:5000/api/reply \
  -H "Content-Type: application/json" \
  -d '{"message":"Are you coming tomorrow?","tone":"friendly","style":"short"}'
```

The application was also tested through the deployed frontend and backend.

Testing included:

* normal messages
* different tones
* different styles
* reply generation
* copying individual replies
* clearing the input
* real-user testing with a friend

---

## ⚠️ Limitations

* Reply quality depends on the selected model.
* AI-generated replies may still need a quick human review.
* Hosted inference can experience temporary availability or rate limits.
* The current version does not store conversation history.
* The application is intentionally focused on short reply generation rather than being a general-purpose chatbot.

---

## 🔮 Future Improvements

Possible future improvements include:

* browser-based reply history
* more tone and style options
* multilingual replies
* optional personalization
* user-selectable models
* additional controls for reply length
* improved handling of context from longer conversations

These features are intentionally not included in the current version so the project remains focused on its core workflow.

---

## 🏆 Hacktoberfest 2026 — DEV Weekend Challenge

FriendReply AI was created for the **Hacktoberfest 2026 DEV Weekend Challenge: Build for a Friend**.

The project focuses on a small, real-world communication problem and uses open-weight AI as a central part of the application.

The project demonstrates how an AI model can be integrated into a practical application without making the application itself a general-purpose chatbot.

### Challenge Focus

**Problem:** Writing natural replies can sometimes take more thought than the message itself.

**Approach:** Give the user three concise alternatives based on their chosen tone and style.

**AI:** Open-weight model accessed through Dahl.

**Application:** React frontend + Node/Express backend + AI inference.

**User testing:** Tested with a real friend using different messages and settings.

---

## 📸 Screenshots

Screenshots of the application will be added here.

### Main Interface

*Add screenshot here.*

### Generated Replies

*Add screenshot here.*

---

## 📄 License

This project is available as an open-source project on GitHub.

See the repository for the current license and source code.

---

## 🙌 Final Note

FriendReply AI intentionally does one thing instead of trying to do everything:

> **Take a message and give the user three natural ways to reply.**

The project started with a simple problem, uses an open-weight AI model behind a small backend, and keeps the overall architecture easy to understand and extend.
