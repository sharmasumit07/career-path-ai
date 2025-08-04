# CareerGuide AI

A modern web application that provides personalized career guidance and recommendations powered by artificial intelligence. The platform offers users an interactive career assessment tool, AI-powered chat interface for career counseling, and generates customized career path recommendations.

## 🚀 Features

- **Career Assessment**: Interactive questionnaire to evaluate skills, interests, and goals
- **AI-Powered Recommendations**: Personalized career path suggestions using OpenAI's GPT-4
- **Chat Interface**: Real-time career counseling with AI assistant
- **Career Path Visualization**: Step-by-step career development plans
- **Resource Library**: Curated learning resources and course recommendations
- **Responsive Design**: Modern UI built with React and Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Radix UI** components with shadcn/ui
- **TanStack Query** for server state management
- **Wouter** for routing
- **React Hook Form** with Zod validation

### Backend
- **Express.js** with TypeScript
- **Drizzle ORM** with PostgreSQL
- **Session-based user tracking**
- **OpenAI API** integration
- **RESTful API design**

### Database
- **PostgreSQL** (production)
- **In-memory storage** (development fallback)

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL (optional for production)
- OpenAI API key (optional - demo mode available)

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd career-guide-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   # AI Services (optional - demo mode available without API keys)
   OPENAI_API_KEY=your_openai_api_key_here
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   
   # Database (optional - uses in-memory storage if not provided)
   # DATABASE_URL=postgresql://username:password@localhost:5432/career_guide_db
   
   # Server Configuration
   NODE_ENV=development
   PORT=5000
   SESSION_SECRET=your_secure_session_secret
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5000`

## 🗄️ Database Setup (Optional)

### Development with PostgreSQL

1. Install PostgreSQL and create a database:
   ```sql
   CREATE DATABASE career_guide_db;
   ```

2. Set the `DATABASE_URL` in your `.env` file:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/career_guide_db
   ```

3. Push the database schema:
   ```bash
   npm run db:push
   ```

### Production with Neon Database

1. Create a Neon database account
2. Create a new database project
3. Copy the connection string to your `.env` file:
   ```env
   DATABASE_URL=postgresql://user:password@ep-xyz.us-east-1.postgres.neon.tech/neondb?sslmode=require
   ```

## 🤖 AI Configuration

### OpenAI Setup (Recommended)

1. Get an API key from [OpenAI](https://platform.openai.com/api-keys)
2. Add it to your `.env` file:
   ```env
   OPENAI_API_KEY=sk-your-key-here
   ```

### Anthropic Claude (Alternative)

1. Get an API key from [Anthropic](https://console.anthropic.com/)
2. Add it to your `.env` file:
   ```env
   ANTHROPIC_API_KEY=your-key-here
   ```

### Demo Mode

If no API keys are provided, the application will run in demo mode with pre-configured responses for testing purposes.

## 📁 Project Structure

```
career-guide-app/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utility functions
│   │   └── hooks/         # Custom React hooks
├── server/                # Backend Express application
│   ├── services/          # Business logic and AI integration
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Data storage abstraction
│   └── index.ts           # Server entry point
├── shared/                # Shared TypeScript types and schemas
└── migrations/            # Database migration files
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Environment Variables for Production

Make sure to set the following environment variables:

- `NODE_ENV=production`
- `DATABASE_URL` (PostgreSQL connection string)
- `OPENAI_API_KEY` or `ANTHROPIC_API_KEY`
- `SESSION_SECRET` (secure random string)
- `PORT` (default: 5000)

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run check` - TypeScript type checking
- `npm run db:push` - Push database schema

### Code Quality

The project uses:
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Tailwind CSS for consistent styling

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋‍♂️ Support

If you have any questions or need help setting up the project, please open an issue in the repository.