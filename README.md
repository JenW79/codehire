# Live Demo Site
currently being ported to railway

You can create a new account or explore the app using the demo login.

---

# CodeHire

A full-stack job application tracker and search assistant for tech jobs. Built with Express, Sequelize, PostgreSQL, and React. Designed to help users stay organized while applying to jobs and generating resumes.

---

## Tech Stack

- **Frontend:** React, Redux
- **Backend:** Node.js, Express
- **Database:** PostgreSQL (with Sequelize ORM)
- **Authentication:** AuthMe (session-based)
- **APIs:** JSearch (job search), OpenAI (resume generator), Remotive (remote job search)
- **Deployment:** Render (full-stack deployment)

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
RAPIDAPI_KEY=your_jsearch_key
RAPIDAPI_HOST=jsearch.p.rapidapi.com
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
- **OpenAI API**: OpenAI API: Used to generate AI-assisted resume drafts from user summaries (with token limits and validation)
- **Remotive API**: Used to search for remote tech jobs


---

## Core Features

- Track job applications (full CRUD)
- Log interview follow-ups and notes (full CRUD)
- Search and save real job listings from JSearch and Remotive
- View and apply directly from your saved jobs list
- Session-based authentication with AuthMe
- PDF resume export
- Generate resume drafts using OpenAI API (create + auto save)

---

## Author

**Jen W.**  
Capstone project for App Academy  
[GitHub](https://github.com/JenW79)

---

## Coming Soon

- Edit resumes 
- User account panel

---
  
## Screenshots, short videos (coming soon)

###  Job Search
![Job Search](h)

###  Resume Generator
![Resume](h)
  
