# PropertyVisit - Property Management Application

## Overview

PropertyVisit is a comprehensive property management application designed to help users evaluate and track property visits. The system consists of a React frontend built with TypeScript, Vite, and shadcn/ui components, paired with an Express.js backend using Drizzle ORM for database operations. The application is specifically architected for property evaluation workflows, including rating systems, checklists, and visit tracking.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: Zustand for authentication state, TanStack Query for server state
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Authentication**: Simple email/password authentication with session management
- **API Design**: RESTful endpoints with consistent error handling
- **Development**: Hot module replacement via Vite integration

### Database Strategy
- **Primary Database**: PostgreSQL (configured via Drizzle)
- **Connection**: Neon Database serverless connection
- **Schema Management**: Drizzle migrations in `/migrations` directory
- **Schema Definition**: Centralized in `/shared/schema.ts` for type sharing

## Key Components

### Authentication System
- Simple email/password authentication
- User roles (user, manager, admin) for permission management
- Persistent sessions using Zustand with localStorage
- Protected routes with automatic redirects

### Property Management
- Complete CRUD operations for properties
- Support for property images, descriptions, and metadata
- Property categorization by type, location, and specifications
- Created by user tracking for ownership

### Visit Tracking System
- Property visit scheduling and management
- Rating system based on configurable criteria
- Checklist system for property evaluation
- Visit history and comparison features

### Rating & Evaluation System
- Dynamic rating criteria management
- Configurable checklist items
- Scoring algorithms for property comparison
- Data aggregation for decision making

### User Management
- Profile management with avatars
- Role-based access control
- User activity tracking

## Data Flow

1. **Client Requests**: React components make API calls via TanStack Query
2. **API Layer**: Express routes handle requests with validation
3. **Business Logic**: Controllers process data and apply business rules
4. **Data Access**: Drizzle ORM handles database operations
5. **Response Flow**: JSON responses with consistent error handling
6. **Client Updates**: TanStack Query manages cache invalidation and UI updates

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Database connection management
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI primitives
- **react-hook-form**: Form handling and validation
- **zod**: Runtime type validation
- **wouter**: Lightweight routing

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety across the stack
- **Tailwind CSS**: Utility-first styling
- **ESBuild**: Production bundling

## Deployment Strategy

### Development Environment
- Vite development server with HMR
- Express server with automatic restarts
- Shared TypeScript configuration for consistent types
- Environment-based configuration

### Production Build
- Client: Vite build with optimized assets
- Server: ESBuild bundling for Node.js deployment
- Static asset serving via Express
- Database migrations via Drizzle CLI

### Database Management
- Schema changes via Drizzle migrations
- Environment-based database URLs
- Connection pooling for production workloads

### Key Architectural Decisions

1. **Monorepo Structure**: Client and server in same repository for easier development and type sharing
2. **Drizzle ORM**: Chosen for type safety and PostgreSQL optimization over traditional ORMs
3. **shadcn/ui**: Provides accessible, customizable components without framework lock-in
4. **TanStack Query**: Handles complex server state management with caching and optimistic updates
5. **Shared Schema**: TypeScript types shared between client and server for consistency
6. **Simple Authentication**: Email/password approach for MVP, extensible to OAuth later
7. **PostgreSQL**: Relational database chosen for complex property and visit relationships