# 🎓 How to Run the Analogy Practice App

## Quick Start (3 steps)

### 1. Install Node.js
If you don't have Node.js installed:
- Download from: https://nodejs.org/
- Install the LTS version

### 2. Install Dependencies
Open Terminal/Command Prompt in the project folder and run:
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 3. Start the App
Open **2 terminals** in the project folder:

**Terminal 1 (Backend):**
```bash
cd backend
npm start
```
You should see: "Backend server running on port 5000"

**Terminal 2 (Frontend):**
```bash
npm start
```
You should see: "webpack compiled successfully"

### 4. Open the App
- Open your browser
- Go to: http://localhost:3000
- You should see the Hebrew interface with "648 שאלות זמינות לתרגול"

## What You'll See

### Home Page
- Question count: 648 questions available
- Performance analytics (if you've practiced before)
- "התחל תרגול!" button to start practicing

### Practice Page
- Adaptive difficulty questions
- Timer functionality
- AI tutor button (works with or without API key)
- Visual difficulty indicators

### Results Page
- Performance analytics
- Session history
- Difficulty breakdown

## Features

- **648 Real Questions** from 2013-2025 psychometric tests
- **Adaptive Learning** - difficulty adjusts based on performance
- **AI Tutor** - ask questions during practice
- **Analytics** - track your progress
- **Hebrew Interface** - full RTL support

## Troubleshooting

### If the app doesn't start:
1. Make sure both terminals are running
2. Check that ports 3000 and 5000 are available
3. Try refreshing the browser

### If questions don't load:
- Check that the `public/analogies_completed_items/` folder exists
- Look at browser console (F12) for error messages

### If AI tutor doesn't work:
- It will use mock responses (still helpful!)
- For real AI responses, add OpenAI API key to `.env` file

## Optional: AI Tutor Setup
To enable real AI responses:
1. Get API key from: https://platform.openai.com/api-keys
2. Create `.env` file in project root:
   ```
   REACT_APP_OPENAI_API_KEY=your_api_key_here
   ```
3. Restart both terminals

---

**Enjoy practicing! 🎯**
