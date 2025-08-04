# Overview

CareerGuide AI is a modern web application that provides personalized career guidance and recommendations powered by artificial intelligence. The platform offers users an interactive career assessment tool, AI-powered chat interface for career counseling, and generates customized career path recommendations based on user inputs. Built with a React frontend and Express.js backend, the application leverages OpenAI's GPT-4 model to deliver intelligent career advice and actionable career development plans.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client-side is built with React 18 using TypeScript and follows a component-based architecture. The application uses Vite as the build tool for fast development and optimized production builds. Key architectural decisions include:

- **UI Framework**: Radix UI components with shadcn/ui for consistent, accessible design patterns
- **Styling**: Tailwind CSS with custom CSS variables for theming and responsive design
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

The frontend follows a modular structure with reusable components organized in logical directories, enabling maintainable and scalable code organization.

## Backend Architecture
The server is built with Express.js and TypeScript, implementing a RESTful API architecture. Key design decisions include:

- **Session Management**: Session-based user tracking without traditional authentication
- **Data Storage**: Dual storage strategy with in-memory storage for development and Drizzle ORM with PostgreSQL for production
- **API Design**: RESTful endpoints for assessment submission, career recommendations, and chat interactions
- **Error Handling**: Centralized error handling middleware with structured error responses

The backend uses a layered architecture separating concerns between routes, services, and storage layers.

## Database Design
The application uses PostgreSQL with Drizzle ORM for type-safe database operations. The schema includes:

- **Users Table**: Stores session IDs and assessment data as JSONB for flexible data structure
- **Conversations Table**: Manages chat message history with JSONB storage for message arrays
- **Career Recommendations Table**: Stores AI-generated career paths and associated assessment data

The database design prioritizes flexibility with JSONB columns for complex data structures while maintaining referential integrity through session-based relationships.

## AI Integration Architecture
The application integrates with OpenAI's GPT-4 model for intelligent career guidance:

- **Career Assessment Processing**: Converts user assessment data into structured career recommendations
- **Chat Interface**: Provides contextual career counseling through conversational AI
- **Custom Career Paths**: Generates personalized step-by-step career development plans

The AI service layer abstracts the complexity of prompt engineering and response parsing, providing clean interfaces for the application logic.

# External Dependencies

## Core AI Services
- **OpenAI API**: GPT-4 model integration for career recommendations and chat functionality
- **Alternative**: Anthropic Claude SDK is also configured as a backup AI provider

## Database and Storage
- **Neon Database**: Serverless PostgreSQL hosting for production data storage
- **Drizzle ORM**: Type-safe database toolkit for PostgreSQL operations
- **connect-pg-simple**: PostgreSQL session store for Express sessions

## Frontend Libraries
- **Radix UI**: Headless UI component library for accessibility and customization
- **TanStack Query**: Server state management and data synchronization
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Wouter**: Lightweight React router for client-side navigation
- **React Hook Form**: Performant form library with validation support
- **Zod**: TypeScript-first schema validation library

## Development Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Static type checking and enhanced developer experience
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind CSS integration

## UI and Styling
- **Lucide React**: Icon library for consistent iconography
- **class-variance-authority**: Utility for creating variant-based component APIs
- **clsx**: Conditional className utility for dynamic styling
- **cmdk**: Command palette component for enhanced user interactions