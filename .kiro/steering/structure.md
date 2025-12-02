# Project Structure

## Directory Organization

```
src/
├── app/                    # Next.js App Router pages
│   ├── episodes/          # Episode tracking pages
│   ├── glossary/          # Medical glossary page
│   ├── setup/             # AI setup page
│   ├── tools/             # Tools page
│   ├── about/             # About page
│   ├── privacy/           # Privacy policy
│   ├── terms/             # Terms of service
│   ├── legal-acceptance/  # Legal acceptance gate
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── CappyChat/        # AI chat component
│   ├── FloatingNavigation/ # Persistent navigation
│   ├── demo/             # Demo simulation components
│   └── episodes/         # Episode-specific components
├── lib/                   # Core utilities and AI integration
│   ├── ai-service.ts     # Unified AI service (Chrome + Gemini)
│   ├── chrome-ai.ts      # Chrome AI implementation
│   ├── gemini-ai.ts      # Gemini API implementation
│   ├── medicalTerms.ts   # Medical terminology data
│   └── utils.ts          # Utility functions
├── services/              # Business logic layer
│   ├── episodeService.ts # Episode management
│   ├── storageService.ts # LocalStorage abstraction
│   ├── glossaryService.ts # Medical glossary
│   ├── aiSetupService.ts # AI configuration
│   └── legalAcceptanceService.ts # Legal consent
└── types/                 # TypeScript type definitions
    ├── episode.ts        # Episode and entry types
    └── symptoms.ts       # Symptom types
```

## Architecture Patterns

### Service Layer Pattern
- All business logic encapsulated in singleton services
- Services accessed via `ServiceName.getInstance()`
- Clear separation between UI components and data management

### Storage Abstraction
- `storageService` provides unified interface to LocalStorage
- Namespaced keys: `episodes`, `symptom_entries`, `glossary`, `settings`
- Cache invalidation for performance optimization

### AI Provider Pattern
- `aiService` abstracts Chrome AI and Gemini API
- Automatic provider selection and fallback
- Unified interface for symptom analysis

### Episode Management
- Episodes automatically created/linked based on date proximity (2-day threshold)
- Retroactive entry support with automatic reanalysis
- Auto-resolution of old episodes when new ones start

## Component Organization

### Page Components
- Located in `src/app/` following Next.js App Router conventions
- Use `'use client'` directive for client-side interactivity
- Import from `@/components` using path aliases

### Reusable Components
- Organized by feature in `src/components/`
- Each major component has its own folder with index.ts for clean imports
- CSS modules for component-specific styles (e.g., `CappyChat.css`)

### Type Definitions
- Centralized in `src/types/`
- Shared interfaces for data models
- Export types for use across the application

## Naming Conventions

- **Files**: PascalCase for components (`EpisodeDetail.tsx`), camelCase for utilities (`ai-service.ts`)
- **Components**: PascalCase (`SymptomSelector`)
- **Services**: camelCase instances (`episodeService`, `storageService`)
- **Types**: PascalCase interfaces (`Episode`, `SymptomEntry`)
- **Constants**: UPPER_SNAKE_CASE

## Key Design Decisions

- **No Backend**: Entirely client-side for privacy
- **LocalStorage**: Simple, synchronous storage for small datasets
- **Singleton Services**: Ensure single source of truth for state
- **Episode Auto-Detection**: Smart grouping of related symptom entries
- **AI Fallback**: Graceful degradation from Chrome AI to Gemini API
