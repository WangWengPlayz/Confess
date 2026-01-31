# Confess Your Love - Valentine's Confession Bot

## Overview

This is an anonymous Valentine's confession web application built with Next.js 16. Users can submit anonymous confessions that go through a moderation workflow before being displayed publicly. The app includes a public confession wall and an admin dashboard for managing submissions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 16 with App Router and React Server Components
- **Styling**: Tailwind CSS with CSS variables for theming (light/dark mode support)
- **UI Components**: shadcn/ui component library (New York style) with Radix UI primitives
- **Icons**: Lucide React
- **Form Handling**: React Hook Form with Zod validation via @hookform/resolvers

### Backend Architecture
- **API Routes**: Next.js App Router API routes located in `app/api/`
- **Public Endpoints**:
  - `POST /api/confessions` - Submit new confession
  - `GET /api/confessions` - Fetch approved confessions
- **Admin Endpoints**:
  - `POST /api/admin/login` - Admin authentication
  - `GET/PATCH /api/admin/confessions` - Manage confessions
  - `GET/POST /api/admin/settings` - Application settings
  - `GET /api/admin/statistics` - Dashboard statistics
- **Webhook**: `app/api/cmd/route.ts` handles Facebook Messenger webhook integration

### Data Storage
- **Database**: Supabase (PostgreSQL)
- **Tables**: 
  - `confessions` - Stores user submissions with status (pending/approved/rejected)
  - `admin_settings` - Application configuration
  - `testing_logs` - Webhook and debugging logs
- **Client**: Lazy-initialized Supabase client in `lib/supabase.ts` with graceful fallback when credentials unavailable

### Authentication
- **Admin Auth**: Simple password-based authentication with Base64 token stored in localStorage
- **Token Storage**: Client-side localStorage for admin session persistence
- **Password**: Configured via `ADMIN_PASSWORD` environment variable

### Key Design Patterns
- Client components marked with `'use client'` directive
- API routes return graceful error responses when Supabase is unavailable
- Real-time updates via polling (10-second interval on confession wall)
- Moderation workflow: all confessions start as "pending" and require admin approval

## External Dependencies

### Third-Party Services
- **Supabase**: Backend-as-a-Service for PostgreSQL database
  - Required env vars: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- **Vercel Analytics**: Usage tracking via `@vercel/analytics`
- **Facebook Messenger**: Webhook integration for receiving confessions via Messenger
  - Required env var: `WEBHOOK_VERIFY_TOKEN`

### Key NPM Packages
- `@supabase/supabase-js` - Database client
- `next-themes` - Theme switching support
- `date-fns` - Date formatting
- `class-variance-authority` - Component variant styling
- `cmdk` - Command palette component
- `vaul` - Drawer component
- `embla-carousel-react` - Carousel functionality
- `recharts` - Charts for statistics dashboard