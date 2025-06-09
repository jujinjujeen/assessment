# Architecture Overview

F1 Champions follows a clean, layered architecture with clear separation between frontend, backend, and external services. The application emphasizes type safety, modularity, and production-ready patterns.

## High-Level Architecture

```

┌─────────────────┐    HTTP    ┌─────────────────┐
│   React SPA     │───────────▶│   Express API   │
│   (Frontend)    │            │   (Backend)     │
└─────────────────┘            └─────────────────┘
                                    │
                        ────────────
              ┌────────┼────────┐
              │        │        │
              ▼        ▼        ▼
┌─────────────┐ ┌─────────┐ ┌─────────────┐
│ PostgreSQL  │ │  Redis  │ │ Ergast F1   │
│ (Database)  │ │ (Cache) │ │    API      │
└─────────────┘ └─────────┘ └─────────────┘
                                │
                        (Seeding & Cron only)
```

## Backend Architecture

### Layered Structure
Each API module follows a consistent layered pattern. Races are used as an example:

```
api/races/
├── __tests__           # Unit tests
├── races.route.ts      # Express routes & middleware
├── races.controller.ts # Request/response handling
├── races.service.ts    # Business logic
├── races.repo.ts       # Database operations
├── races.mapper.ts     # Data transformation
├── races.schema.ts     # Zod validation schemas
└── types.ts            # Module-specific types
```

**Flow**: Route → Controller → Service → Repository → Database

### External Integration
Ergast F1 API integration is isolated in `src/service/ergast/` and accessed only during seeding or cron jobs:
- **Client**: Handles business login for seeding and updating data
- **Mapper**: Transform external data to internal models
- **Repository**: Database operations for F1 data
- **Service**: Orchestrates data fetching and storage

### Data Synchronization
- **Initial Seed**: Checks empty database, fetches historical data from Ergast
- **Cron Jobs**: Updates current season data, adds new seasons
  - Development: Handled in Express app
  - Production: Railway cron scheduler

### Infrastructure
- **Rate Limiting**: Protects against abuse
- **CORS**: Production allows only frontend domain
- **Compression**: Gzip/Brotli compression for text responses
- **Redis Caching**: API responses cached (1 hour TTL, configurable)
- **Prisma ORM**: Type-safe database operations

## Frontend Architecture

### Folder Structure

```
src/
├── components/       # F1-specific components
├── components/ui/    # Reusable UI components
├── layout/           # Layout components
├── hooks/            # Custom React hooks
├── pages/            # Route components
└── api/              # API client layer
```
### Data Fetching
- **Custom Hooks**: Type-safe API calls with `{ data, loading, error }`
- **API Client**: Simple fetch functions passed to hooks
- **No State Management**: App complexity doesn't warrant Redux/Zustand
- **Future Caching**: Architecture allows for frontend caching layer

### Type Safety
- Shared typescript config in `config/tsconfig.base.json`
- Shared types from `libs/types/`
- API responses automatically typed
- End-to-end type safety from database to UI

## Data Flow

### User Request Flow
1. User interacts with React component
2. Component calls custom hook
3. Hook makes API request to Express backend
4. Backend checks Redis cache
5. If miss: queries PostgreSQL, caches result
6. Returns typed response to frontend
7. Component renders with type-safe data

### Background Data Sync
1. Cron job triggers (daily/weekly)
2. Ergast service checks for new F1 data
3. Compares with database state
4. Fetches and stores new/updated records
5. Redis cache invalidated

## Deployment Architecture

### Development
- Docker Compose orchestrates all services
- Hot reload for both frontend and backend
- Shared volumes for development

### Production (Railway)
Testing, linting, scanning with CodeQL, publishing Docker images to Dockerhub, and deploying to Railway is automated via GitHub Actions:
- **Docker**: Multi-stage builds for optimized images
  - `frontend/Dockerfile.prod` for frontend with Nginx
  - `backend/Dockerfile` with `NODE_ENV=production` for backend
- **PostgreSQL**: Managed database service
- **Redis**: Managed caching service
- **Cron**: Separate Railway cron jobs for data sync
- Environment isolation and secrets management by Railway

## Key Design Decisions

**Why This Architecture?**
- **Modular**: Each feature isolated with consistent patterns
- **Type-Safe**: End-to-end TypeScript with shared types
- **Scalable**: Clear layers allow easy feature additions
- **Testable**: Each layer can be tested independently
- **Production-Ready**: Caching, rate limiting, proper separation

**Trade-offs**
- Some overhead for small app, but enables easy scaling
- More files per feature, but better organization
- In real life rate limiting and CORS would be more complex, but simplified here for clarity
- No state management library, but custom hooks suffice for current complexity

## Future Improvements
- **Frontend Caching**: Implement caching layer for API responses
- **State Management**: Consider Redux/Zustand if app complexity increases
- **Testing**: Add integration tests for API endpoints, E2E tests for critical flows
- **Monitoring**: Integrate logging and monitoring for production