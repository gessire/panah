# Panaah (پناه) 🏥🛡️

**Panaah** is a full-stack crisis response platform designed to help people find safe shelters, emergency accommodations, and secure routes during natural disasters and emergency situations. The platform provides real-time access to shelter information, emergency resources, and AI-powered emotional support to improve safety and well-being during crises.

---

# 🌟 Features

- 🤖 AI-powered emotional support chatbot
- 🎵 Relaxing music for stress reduction
- 💬 Daily affirmations and motivational messages
- 📱 Responsive design for desktop and mobile devices
- 🔒 Secure backend API for application services

---

# 🏗️ Project Architecture

The project is separated into two independent applications:

```
Panaah
│
├── frontend/     → React + Vite Client
│
└── backend/      → Node.js + Express API
```

The frontend communicates with the backend through REST APIs.

---

# 🚀 Getting Started

## Prerequisites

Before running the project, install:

- Node.js (v18 or newer recommended)
- npm

Download Node.js:

https://nodejs.org

---

# 📥 Clone the Repository

```bash
git clone https://github.com/gessire/panah.git
cd panah
```

---

# 💻 Frontend Setup

Navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will be available at:

```
http://localhost:5173
```

---

# ⚙️ Backend Setup

Open another terminal.

Navigate to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Start the backend server:

```bash
npm start
```

or (if using nodemon)

```bash
npm run dev
```

The backend API will be available at:

```
http://localhost:3000
```

(or the port configured in your environment variables.)

---

# 🔑 Environment Variables

The backend requires environment variables.

Create a `.env` file inside the **backend** directory.

Example:

```env
PORT=3000

OPENAI_API_KEY=your_api_key

MONGODB_URI=your_database_connection

JWT_SECRET=your_secret_key
```

> Replace the example values with your own credentials.

---

# 🛠️ Tech Stack

## Frontend

- React
- Vite
- JavaScript
- Tailwind CSS
- Shadcn UI
- React Router

## Backend

- Node.js
- Express.js
- REST API
- OpenAI API
- MongoDB (if configured)

---

# 📂 Project Structure

```
Panaah
│
├── frontend
│   ├── src
│   ├── public
│   ├── assets
│   ├── package.json
│   └── vite.config.js
│
├── backend
│   ├── controllers
│   ├── routes
│   ├── middleware
│   ├── services
│   ├── utils
│   ├── package.json
│   └── server.js
│
└── README.md
```

---

# 🔄 Application Flow

```
User

   │

Frontend (React)

   │ REST API

Backend (Node.js + Express)

   │

External Services
(OpenAI API / Database)
```

---

# 📦 Scripts

## Frontend

Install dependencies

```bash
npm install
```

Run development server

```bash
npm run dev
```

Build production files

```bash
npm run build
```

Preview production build

```bash
npm run preview
```

---

## Backend

Install dependencies

```bash
npm install
```

Run production server

```bash
npm start
```

Run development server

```bash
npm run dev
```

---

# ⚠️ Important Notes

- Do **not** upload the `node_modules` folders.
- Do **not** commit `.env` files.
- Install dependencies separately inside both the `frontend` and `backend` directories.
- Ensure the backend server is running before starting the frontend if API features are required.
- Store sensitive API keys securely using environment variables.

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository.

2. Create a feature branch.

```bash
git checkout -b feature/NewFeature
```

3. Commit your changes.

```bash
git commit -m "Add new feature"
```

4. Push to GitHub.

```bash
git push origin feature/NewFeature
```

5. Open a Pull Request.

---

# 📄 License

This project is licensed under the MIT License.

---

# 👩‍💻 Developed By

Developed as part of a Software Engineering project focused on crisis management, emergency response, and user-centered web application design.

---

## ❤️ Panaah

**Stay Safe . Support Each Other . Be calm**
