# 🌙 TodoList Moon

A Momentum-style productivity app built with **Vanilla JavaScript** — no frameworks, no libraries, just clean JS. Features real-time clock, Firebase authentication, cloud sync, Telegram integration, and full task management with drag-and-drop.

🔗 **Live Demo:** [todo-list-moon.vercel.app](https://todo-list-moon.vercel.app)

---

## ✨ Features

### 📝 Task Management
- Add, edit, delete tasks
- Mark tasks as complete
- Set due dates with **overdue detection**
- Track created time and time taken to complete
- Live progress bar showing completion percentage
- Confetti animation on task completion 🎉

### 🔀 Drag & Drop
- Reorder tasks by dragging
- Works on both desktop and mobile (including Samsung keyboard fix)
- Smooth, responsive drag handle

### 📊 Analytics
- Completion statistics
- Progress tracking across sessions

### 🔐 Authentication (Firebase)
- Google Sign-In
- Tasks saved to **Firebase Firestore** per user
- Persistent data across devices

### 📲 Telegram Integration
- Sends task notifications via Telegram Bot API

### 🕐 Live Clock
- Real-time clock display (Momentum-style)
- Today's date shown

### 📱 Responsive Design
- Works on mobile, tablet, and desktop
- Mobile-specific keyboard and interaction fixes

---

## 🛠️ Tech Stack

| Technology | Usage |
|---|---|
| Vanilla JavaScript (ES6+) | Core logic, DOM manipulation, state management |
| HTML5 / CSS3 | Structure and styling |
| Firebase Auth | Google Sign-In |
| Firebase Firestore | Cloud data storage |
| Telegram Bot API | Notifications |
| Vercel | Deployment |

---

## 💡 Technical Highlights

- **State management** without any framework — custom JS state pattern
- **Event delegation** for efficient DOM event handling
- **Drag and Drop API** — fully custom implementation
- **Firebase Firestore** real-time sync
- **localStorage** fallback for offline use
- Mobile keyboard handling fix for Samsung devices

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/Mohirjon013/TodoList-moon.git

# Open in browser
open index.html
```

> Firebase config is required for auth and cloud sync. Create a `.env` or replace config in `api/` folder with your own Firebase project credentials.

---

## 📁 Project Structure

```
TodoList-moon/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── app.js (+ other modules)
├── api/
│   └── firebase config & Telegram API
├── fonts/
├── images/
└── sound/
```

---

## 👤 Author

**Mohirjon To'ychiboyev**
- GitHub: [@Mohirjon013](https://github.com/Mohirjon013)
- LinkedIn: [linkedin.com/in/mohirjon-to-ychiboyev-ba05353a2](https://www.linkedin.com/in/mohirjon-to-ychiboyev-ba05353a2)
