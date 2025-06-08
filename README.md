# F1 Champions

Check out the [live demo](https://humorous-learning-production.up.railway.app/) to see the app in action!

A modern, full-stack web application showcasing Formula 1 World Champions from 2005 to present. Built with React, Node.js, and PostgreSQL, featuring real-time data from the Ergast F1 API.

- **Interactive SPA** displaying F1 champions with detailed race results
- **Real-time data sync** with official F1 statistics via Ergast API  
- **Production-ready architecture** with Docker, Redis caching, and automated CI/CD

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Git

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd f1-champions

# Start all services (frontend, backend, database, redis)
make up
```

### Quick Start
After running `make up`, visit:
- **Frontend**: http://localhost:5445
- **Backend API**: http://localhost:5444
- **API Docs**: http://localhost:5444/docs

The application will automatically fetch and seed F1 data on first startup.

## Architecture

Check out architecture reasoning [here](ARCHITECTURE.md).

### Project Structure
```
f1-champions/
├── frontend/          # React + TypeScript SPA
│   ├── src/components # Reusable UI components
│   ├── src/pages/     # Route components
│   └── src/api/       # API client layer
├── backend/           # Express + TypeScript API
│   ├── src/api/       # REST endpoints
│   ├── src/service/   # External API integration
│   └── prisma/        # Database schema & migrations
├── libs/types/        # Shared TypeScript definitions
└── infra/            # Deployment configurations
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

# Generate TypeScript types from API
make generate-types
```

### Backend Operations
```bash
cd backend

# Development server with hot reload
npm run dev

# Run tests
npm run test

# Database operations
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate     # Run migrations
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
Default configuration works out-of-the-box with Docker. For custom setups:

- Database: PostgreSQL connection via `DATABASE_URL`
- Redis: Cache connection via `REDIS_URL`  
- External API: Ergast F1 API (no auth required)
