# FootballHub

Football club management web app. Built with React + NestJS + PostgreSQL.

## Requirements

- Node.js 18+
- PostgreSQL

## Quick Start

**1. Clone and install**

```bash
git clone <repo-url>
cd ISTTP_LAB1-1
npm run install:all
```

**2. Create `server/.env`**

```env
DATABASE_URL="postgresql://<user>:<password>@localhost:5432/<database>"
```

**3. Seed the database**

```bash
psql -U <user> -d <database> -f server/prisma/seed.sql
```

**4. Run**

```bash
# Terminal 1
npm run dev:server

# Terminal 2
npm run dev:client
```

Open http://localhost:5173

## Stack

- **Frontend** — React 19, TypeScript, Vite, React Router, styled-components
- **Backend** — NestJS, TypeScript, Prisma 7, PostgreSQL
