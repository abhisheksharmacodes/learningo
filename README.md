# Learningo

An AI-powered platform for mastering concepts through dynamic MCQ practice, personalized quizzes, and real-time competition.

---

## 🚀 Features

- 🤖 **AI-Driven Question Generation:** Instantly create MCQs on any topic, in your chosen language and difficulty, powered by Google Gemini API.
- 🌐 **Multi-Language & Level Support:** Practice in 70+ languages and select from beginner, intermediate, or advanced levels.
- 🏆 **Live Leaderboard:** Compete with learners worldwide and track your ranking as you improve.
- 📚 **Diverse Subjects:** Choose from a wide range of fields—engineering, sciences, mathematics, and more—or add your own topics.
- 📈 **Progress Tracking:** Monitor your correct answers, revisit topics, and see your learning growth over time.
- 🔒 **User Accounts:** Secure sign up and login to save your progress, preferences, and leaderboard stats.
- 💡 **Intuitive UI:** Clean, responsive design for seamless use on desktop and mobile.

---

## 🛠️ Tech Stack

- **Frontend:** React, Vite, React Router, Bootstrap, Tailwind CSS
- **Backend:** Node.js, Express (REST API)
- **AI Integration:** Google Gemini API for question generation
- **Authentication:** Custom backend authentication
- **Leaderboard/Data:** RESTful API, Axios
- **Deployment:** Vercel (backend), any static host (frontend)

---

## 🏁 How to Run

### 1. Clone & Install
```bash
git clone https://github.com/abhisheksharmacodes/learningo
cd learningo/front
npm install
```

### 2. Configure Environment
Create a `.env` file in `front/` and `back/` as needed:
```env
VITE_API_KEY=your_gemini_api_key
```

### 3. Start the App
```bash
npm run dev
```
Visit [http://localhost:5173](http://localhost:5173) to get started!

---

## 📦 Deployment

- Frontend can be deployed to any static host (e.g., Vercel, Netlify).
- Backend is ready for cloud deployment (e.g., Vercel, Render). Set required environment variables in your deployment environment.

---

> Built with ❤️ using [Vite](https://vitejs.dev/) and [React](https://react.dev/). AI by Google Gemini.
