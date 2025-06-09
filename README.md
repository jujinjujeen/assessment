# F1 Champions

Check out the [live demo](https://humorous-learning-production.up.railway.app/) to see the app in action!

A modern, full-stack web application showcasing Formula 1 World Champions from 2005 to present. Built with React, Node.js, and PostgreSQL, featuring real-time data from the Ergast F1 API.

- **Interactive SPA** displaying F1 champions with detailed race results
- **Real-time data sync** with official F1 statistics via Ergast API  
- **Production-ready architecture** with Docker, Redis caching, and automated CI/CD

> Check out the assessment goal and task completion checklist [here](./docs/CHECKLIST.md).

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js 20+ (for local development)
- Git

### Installation
```bash
# Clone the repository
git clone git@github.com:jujinjujeen/f1-champions.git
cd f1-champions

# Start all services (frontend, backend, database, db ui, redis)
# this will seed the db on first run
make up
```

### Environment Variables

> **NOTE**: The env variables are exposed in the `docker-compose.yml` file, which is an anti-pattern, and in real-life repo you should use a `.env` file to store sensitive information. However, for this demo, I am using the `docker-compose.yml` file to keep things simple.

### Quick Start
After running `make up`, visit:
- **Frontend**: http://localhost:5445
- **Backend API**: http://localhost:5444
- **API Docs**: http://localhost:5444/docs
- **Database UI** http://localhost:8081 (pgweb)

> You can find openAPI spec at `docs/openapi.yaml` or view in the browser on endpoint above.

The application will automatically fetch and seed F1 data on first startup.

## Architecture

Check out architecture reasoning [here](./docs/ARCHITECTURE.md).

### Project Structure
```
f1-champions/
├── frontend/             # React + TypeScript SPA
│   ├── src/components    # Components for displaying F1 data
│   ├── src/components/ui # Reusable UI components
│   ├── src/layout/       # Layout components
│   ├── src/hooks/        # Custom React hooks
│   ├── src/pages/        # Route components
│   └── src/api/          # API client layer
├── backend/              # Express + TypeScript API
│   ├── src/api/          # REST endpoints
│   ├── src/service/      # External API integration
│   ├── src/constants/    # Constants and enums
│   ├── src/middleware/   # Middleware functions
│   ├── src/lib/          # Instance creation modules
│   ├── src/types/        # TypeScript types
│   ├── src/utils/        # Utility functions
│   └── prisma/           # Database schema & migrations
├── libs/types/           # Shared TypeScript definitions
└── config/               # Shared configuration files
```

### Tech Stack

**Frontend**: React 19, TypeScript, Vite, TailwindCSS, React Router  
**Backend**: Node.js, Express, TypeScript, Prisma ORM, Zod validation  
**Database**: PostgreSQL 15 with Redis caching  
**Infrastructure**: Docker, Railway deployment, Nginx (production)

## Usage

### Development Commands
```bash
# Start all services
make up

# Stop all services  
make down

# View logs
make logs

# Restart services
make restart

# Generate TypeScript types from API is run on `make up`
make generate-types
```

> Use `make` or `make help` to see all available commands.

### Backend Operations

```bash
cd backend

# Run tests in watch mode
npm run test
# Get test coverage report
npm run test:coverage
# Lint code
npm run lint
# Build for production
npm run build

# Look up backend/package.json for more commands
# Most of them are run with additional env setup
```

### Frontend Operations
```bash
cd frontend

# Development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Lint code
npm run lint
```

### Environment Setup
Default configuration works out-of-the-box with `docker-compose`. For custom setups:

- Create a `.env` file in the root directory with the following variables:
  ```env
  DATABASE_URL=your_postgres_connection_string
  REDIS_URL=your_redis_connection_string
  PORT={your_desired_port}
  ```
- Create a `.env` file in the `frontend` directory with:
  ```env
  VITE_BASE_URL=http://example.com
  ```
