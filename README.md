# TidyDesk - Personal Productivity App

A fullstack web application that allows users to sign up, log in, and manage their personal notes and tasks with AI-powered assistance.

## Features

### 🔐 Authentication
- Email/password-based signup and login
- Protected routes with NextAuth.js
- Secure session management
- Graceful logout handling

### 📝 Notes Management
- Create, read, update, and delete notes
- Rich text content support
- Real-time updates
- AI-powered note summarization

### ✅ Task Management
- Add, update, and organize tasks
- Priority levels (Low, Medium, High)
- Mark tasks as complete/incomplete
- Task filtering and organization

### 🤖 AI Integration
- Gemini-powered note summarization
- Intelligent content analysis
- Context-aware suggestions

### 🎨 Modern UI/UX
- Responsive design with Tailwind CSS
- Clean, intuitive interface
- Real-time feedback and notifications
- Mobile-friendly layout

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js with Credentials Provider
- **State Management**: Zustand
- **AI Integration**: Gemini API via AI SDK
- **UI Components**: shadcn/ui
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB database (local or MongoDB Atlas)
- Gemini API key (for AI features)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tidydesk
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/tidydesk
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tidydesk

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key

# Gemini (for AI features)
GOOGLE_GENERATIVE_AI_API_KEY=your-gemini-api-key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
tidydesk/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Protected dashboard
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── dashboard/         # Dashboard components
│   ├── providers/         # Context providers
│   └── ui/                # shadcn/ui components
├── lib/                   # Utility libraries
│   ├── auth.ts            # NextAuth configuration
│   ├── mongodb.ts         # Database connection
│   └── store.ts           # Zustand store
├── models/                # MongoDB models
│   ├── User.ts
│   ├── Note.ts
│   └── Task.ts
└── types/                 # TypeScript definitions
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login (handled by NextAuth)

### Notes
- `GET /api/notes` - Get user's notes
- `POST /api/notes` - Create new note
- `PUT /api/notes/[id]` - Update note
- `DELETE /api/notes/[id]` - Delete note
- `POST /api/notes/[id]/summarize` - Generate AI summary

### Tasks
- `GET /api/tasks` - Get user's tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task

## Database Schema

### User Model
```typescript
{
  name: string
  email: string (unique)
  password: string (hashed)
  timestamps: true
}
```

### Note Model
```typescript
{
  title: string
  content: string
  userEmail: string (indexed)
  timestamps: true
}
```

### Task Model
```typescript
{
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  completed: boolean
  userEmail: string (indexed)
  timestamps: true
}
```

## State Management

The app uses Zustand for global state management with the following structure:

- **Notes State**: Array of user notes with CRUD operations
- **Tasks State**: Array of user tasks with CRUD operations
- **Loading State**: Global loading indicators
- **Actions**: Centralized state mutations

## Security Features

- Password hashing with bcryptjs
- JWT-based session management
- Protected API routes with user verification
- User-specific data isolation
- Input validation and sanitization

## AI Features

The AI integration provides:
- **Note Summarization**: Generate concise summaries of lengthy notes
- **Content Analysis**: Extract key insights from note content
- **Smart Suggestions**: Context-aware recommendations

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

### Environment Variables for Production

```env
MONGODB_URI=your-production-mongodb-uri
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-production-secret
GOOGLE_GENERATIVE_AI_API_KEY=your-gemini-api-key
```

## Development Approach

### Architecture Decisions

1. **Next.js App Router**: Chosen for its modern approach to routing and server components
2. **MongoDB**: Selected for flexible document storage suitable for notes and tasks
3. **NextAuth.js**: Provides robust authentication with minimal setup
4. **Zustand**: Lightweight state management without Redux complexity
5. **AI SDK**: Standardized interface for AI model integration

### Code Organization

- **Separation of Concerns**: Clear separation between UI, business logic, and data layers
- **Type Safety**: Full TypeScript implementation for better developer experience
- **Reusable Components**: Modular component design with shadcn/ui
- **Error Handling**: Comprehensive error handling with user feedback

### Performance Optimizations

- Server-side rendering for initial page loads
- Client-side state management for interactive features
- Optimistic updates for better user experience
- Efficient database queries with proper indexing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
