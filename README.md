# JhiguCocina - Restaurant Management System

A modern restaurant management system built with Next.js, TypeScript, and Supabase. This application provides comprehensive tools for managing restaurant operations including tables, orders, menu items, and staff.

## Features

- **Table Management**: Create, update, and track restaurant tables with QR code generation
- **User Authentication**: Secure login and role-based access control
- **Real-time Updates**: Live data synchronization using React Query
- **Responsive Design**: Mobile-first design with modern UI components
- **API-First Architecture**: RESTful APIs with comprehensive error handling

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **State Management**: React Query (TanStack Query)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **HTTP Client**: Axios
- **Validation**: Zod schemas
- **Notifications**: Sonner

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended)
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/begnasdev/jhigucocina.git
cd jhigucocina
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. Run the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
src/
├── app/                     # Next.js app directory
│   ├── (auth)/             # Authentication pages
│   ├── (dashboard)/        # Dashboard pages
│   └── api/                # API routes
├── components/             # Reusable UI components
├── features/               # Feature-specific components
├── hooks/                  # Custom React hooks
│   ├── queries/           # React Query hooks
│   └── mutations/         # React Query mutations
├── lib/                   # Utility libraries
├── services/              # API service layer
├── types/                 # TypeScript type definitions
├── schemas/               # Zod validation schemas
└── utils/                 # Utility functions
```

## Development Guidelines

### API Development

Follow the comprehensive [API Implementation Guide](./docs/API_IMPLEMENTATION_GUIDE.md) for creating new features:

1. Add endpoints to `src/config.ts`
2. Create service layer in `src/services/`
3. Add React Query hooks in `src/hooks/`
4. Define TypeScript types in `src/types/`
5. Create validation schemas in `src/schemas/`
6. Implement API routes in `src/app/api/`

### Code Standards

- Use TypeScript for all files
- Follow the established folder structure
- Add JSDoc comments to functions
- Use React Query for data fetching
- Implement proper error handling
- Write reusable components

## Documentation

- [API Implementation Guide](./docs/API_IMPLEMENTATION_GUIDE.md) - Complete guide for building APIs
- [Folder Structure](./docs/FOLDER_STRUCTURE.md) - Detailed project organization
- [API Creation Guide](./guide/API_CREATION_GUIDE.md) - Backend API development

## Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the coding standards
4. Add appropriate documentation
5. Submit a pull request

## License

This project is private and proprietary.
