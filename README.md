# Live Demo Site

[CodeHire](https://codehire-ie8o.onrender.com)

---

# CodeHire

A full-stack job application tracker and search assistant for tech jobs. Built with Express, Sequelize, PostgreSQL, and React. Designed to help users stay organized while applying to jobs and generating resumes.

---

## Tech Stack

- **Frontend:** React, Redux
- **Backend:** Node.js, Express
- **Database:** PostgreSQL (with Sequelize ORM)
- **Authentication:** AuthMe (session-based)
- **APIs:** JSearch (via RapidAPI), OpenAI (resume generator), Remotive (via API)
- **Deployment:** Render (frontend + backend)

---

## Getting Started (Local Development)

1. **Clone the Repo**

```bash
git clone https://github.com/your-username/codehire.git
cd codehire
```

2. **Set up Backend**

```bash
cd backend
npm install
```

Create a `.env` file in the backend folder:

```env
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=jobsearchtracker_dev
DB_HOST=localhost
PORT=8000
SESSION_SECRET=your_secret_key
```

Then run:

```bash
npx dotenv sequelize db:create
npx dotenv sequelize db:migrate
npx dotenv sequelize db:seed:all
npm start
```

3. **Set up Frontend**

```bash
cd frontend
npm install
npm start
```

---

## API Integrations

- **JSearch API**: Used to search for tech jobs across the U.S.
- **OpenAI API**: Used to generate AI-assisted resume drafts from user summaries
- **Remotive API**: Used to search for remote tech jobs

APIs are connected through backend proxy routes to protect API keys.

---

## Core Features

- Track job applications (full CRUD)
- Log interview follow-ups and notes (full CRUD)
- Search live tech jobs via JSearch API (read + save)
- Generate resume drafts using OpenAI API (create + optional save)
- Session-based authentication with AuthMe

---

## Coming Soon

- PDF resume export
- Job search filters (remote, hybrid, on-site)


---

## Author

**Jen W.**  
Capstone project for App Academy  
[GitHub](https://github.com/JenW79)
