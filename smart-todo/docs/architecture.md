# Architecture

## High-level
- Monolithic application
- Separate frontend and backend
- REST communication
- Single PostgreSQL database

## Frontend
- Angular
- Stateless UI
- No business logic
- Validation only for UX

## Backend
- .NET Web API
- Contains all business rules
- Entity Framework Core
- Code-first migrations

## Database
- PostgreSQL
- One database
- One TodoItems table

## Constraints
- No microservices
- No message queues
- No background jobs
- No external integrations
