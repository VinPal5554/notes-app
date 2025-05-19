# Notebook-app
 A full-stack note-taking application built with **TypeScript**, **Express**, **Tailwind CSS**, and **MongoDB**. It features a frontend built in plain HTML/JS and allows users to add and view, and delete notes stored in a MongoDB database.

# Features
- Add and delete notes via web interface
- Persistent storage with MongoDB database
- RESTful API built with Express
- Clean layout with Tailwind CSS

# Installation (Manual)
**Clone the repository:**
```
git clone https://github.com/VinPal5554/notes-app.git
cd notes-app
```
**Install dependencies:**
```
npm install
```
**Setup MongoDB:**
```
net start MongoDB
```
**Run the Server:**
```
cd backend
npx ts-node index.ts
```

# Installation (Docker)
**Clone the repository:**
```
git clone https://github.com/VinPal5554/notes-app.git
cd notes-app\backend
```
**Run via Docker Compose:**
```
docker-compose up --build
```
