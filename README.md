# Pass-in-Closet Frontend

Modern React application built with 2025 best practices.

## 🚀 Tech Stack

### Core

- **React 19** - Latest React with Server Components support
- **TypeScript 5.9** - Strict mode enabled
- **Vite 7** - Lightning-fast build tool with SWC

### State Management

- **TanStack Query v5** - Server state management
- **Zustand 4** - Minimal client state management

### UI & Styling

- **Tailwind CSS v3** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **shadcn/ui** - Beautiful, reusable components
- **CVA** - Component variants
- **Lucide React** - Beautiful icons

### Forms & Validation

- **react-hook-form 7** - Performant form library
- **Zod 3** - TypeScript-first schema validation

### Routing

- **React Router v7** - Client-side routing

### API Layer

- **Axios** - HTTP client with interceptors
- **Zod** - Runtime type validation for API responses

### Testing

- **Vitest** - Fast unit test runner
- **React Testing Library** - Component testing
- **Playwright** - E2E testing

### Code Quality

- **Biome** - Fast linter & formatter
- **Husky** - Git hooks
- **lint-staged** - Pre-commit linting

### i18n

- **react-i18next** - Internationalization

### Error Handling

- **react-error-boundary** - Error boundaries
- **Sentry** (ready to integrate) - Error tracking

## 📁 Project Structure

```
src/
├── app/                    # Application layer
│   ├── providers/         # Global providers
│   ├── routes/            # Route configuration
│   └── layouts/           # Layout components
├── features/              # Feature-based modules
│   ├── auth/
│   │   ├── api/          # API calls
│   │   ├── components/   # Feature components
│   │   ├── hooks/        # React hooks
│   │   ├── schemas/      # Zod schemas
│   │   ├── store/        # Zustand stores
│   │   └── pages/        # Page components
│   ├── workspace/
│   ├── credential-group/
│   └── credential/
└── shared/                # Shared resources
    ├── ui/               # Reusable UI components
    ├── lib/              # Utility functions
    ├── api/              # API client
    ├── config/           # Configuration
    └── hooks/            # Global hooks
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Run E2E tests
npm run test:e2e

# Lint & format
npm run lint
npm run lint:fix
npm run format
```

## 🔑 Environment Variables

Create a `.env` file in the root:

```env
VITE_API_URL=http://localhost:4000
VITE_APP_NAME=Pass-in-Closet
```

## 🎯 Features

- ✅ Authentication (Login, Sign up)
- ✅ Workspace management
- ✅ Credential groups (hierarchical)
- ✅ Credential management with parameters
- ✅ Dark mode ready
- ✅ Responsive design
- ✅ Type-safe API calls
- ✅ Error handling
- ✅ Loading states
- ✅ Form validation

## 📝 Code Quality

- TypeScript strict mode
- Biome for linting & formatting
- Pre-commit hooks
- Comprehensive testing
- Accessibility compliant

## 🔒 Security

- XSS protection
- CSRF tokens
- Secure authentication
- Environment variables
- httpOnly cookies

Built with ❤️ using 2025 best practices
