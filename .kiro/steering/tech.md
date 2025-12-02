# Technology Stack

## Core Technologies

- **Framework**: Next.js 15 (App Router)
- **React**: React 19
- **TypeScript**: TypeScript 5 with strict mode enabled
- **Styling**: Tailwind CSS 4
- **Build Tool**: Turbopack (Next.js built-in)
- **Package Manager**: npm

## Key Libraries

- **UI Components**: React Icons
- **Charts**: Recharts
- **Analytics**: Vercel Analytics (production only)
- **Fonts**: Google Fonts (Geist Sans, Geist Mono, Barrio)

## AI Integration

- **Primary**: Chrome's built-in AI (Gemini Nano) via Prompt API
- **Fallback**: Gemini API (requires API key)
- **Service Pattern**: Unified AI service with automatic provider selection

## Data Storage

- **Client-Side**: LocalStorage for all user data
- **No Backend**: Completely client-side application
- **Storage Structure**: Namespaced keys for episodes, symptom entries, glossary, and settings

## Common Commands

```bash
# Development
npm run dev          # Start dev server with Turbopack

# Production
npm run build        # Build for production with Turbopack
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## TypeScript Configuration

- **Target**: ES2017
- **Module Resolution**: bundler
- **Path Aliases**: `@/*` maps to `./src/*`
- **Strict Mode**: Enabled
- **JSX**: preserve (handled by Next.js)

## Browser Requirements

- Chrome 127+ (for built-in AI features)
- Chrome flags must be enabled for Gemini Nano:
  - `#prompt-api-for-gemini-nano`
  - `#optimization-guide-on-device-model`
