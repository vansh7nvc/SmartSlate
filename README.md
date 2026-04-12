# SmartSlate

**SmartSlate** is an AI-driven meeting intelligence platform that converts raw audio and documents into structured, searchable intelligence.

## 🚀 Vision
Eliminate "meeting amnesia" with an automated pipeline: **Upload → Transcribe → Summarize → Display.**

## 🛠️ Tech Stack
- **Frontend**: Next.js (App Router), Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB (Mongoose)
- **AI Engine**: Google Gemini 2.5 Flash (Transcription & Summarization)

## 📦 Features
- **Unified Upload Portal**: Support for `MP3`, `WAV`, and `PDF` files.
- **AI Brain**: Multi-modal processing via Gemini for high-accuracy transcripts and summaries.
- **Action Items**: Automatic extraction of tasks into a checklist.
- **Meeting Dashboard**: Professional table view to manage past sessions.
- **Premium UI**: Dark mode, glassmorphism, and responsive design.

## ⚙️ Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Running locally on `mongodb://localhost:27017/insightsync`)

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in `server/`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/insightsync
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

### 3. Frontend Setup
```bash
cd client
npm install
```

### 4. Running the App
Start the Backend:
```bash
cd server
node index.js
```
Start the Frontend:
```bash
cd client
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

## 📂 Architecture
- `client/`: Next.js application with Tailwind CSS.
- `server/`: Express API with Mongoose and Gemini integration.
- `uploads/`: Temporary local storage for uploaded files.

## 📝 License
MIT
