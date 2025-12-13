# Design Document

## Overview

This feature introduces a landing page for new users and moves the symptom tracker to a dedicated `/app` route. The design maintains the existing pastel aesthetic and provides a completely isolated landing experience with no shared app components.

## Architecture

### High-Level Architecture

```
┌─────────────────┐
│  Landing Page   │
│   (Root `/`)    │
│  - Hero Section │
│  - Demo         │
│  - Features     │
│  - CTA          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Setup Page    │
│   (`/setup`)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Symptom Tracker │
│   (`/app`)      │
└─────────────────┘
```

### Component Structure

- **Landing Page** (`src/app/page.tsx`): Marketing page at root URL `/`
- **Symptom Tracker** (`src/app/app/page.tsx`): Main application at `/app`
- **Enhanced Demo** (`src/components/demo/DemoSimulation.tsx`): Interactive demo with episode view
- **Layout Isolation**: Landing page uses completely isolated layout with no shared app components

## Components and Interfaces

### 1. Landing Page Component

**Location**: `src/app/page.tsx`

**Features**:
- **Hero Section**: Product name, tagline, description, and primary CTA
- **Interactive Demo**: Extended DemoSimulation with episode tracking preview
- **Feature Highlights**: Four key features with icons and descriptions
- **Secondary CTA**: Additional call-to-action after features
- **Footer**: Simple footer with disclaimer

**Design Constraints**:
- No navigation bar on landing page
- No alpha banner on landing page
- No Capybara mascot on landing page
- No legal gate on landing page
- No FloatingNavigation on landing page
- Complete isolation from app components

### 2. Enhanced Demo Simulation

**Location**: `src/components/demo/DemoSimulation.tsx`

**Enhanced Flow**:
1. Select symptoms
2. Analyze symptoms → Show full analysis results
3. "View Episode Tracking" button → Show episode timeline mockup
4. Reset demo

**New Features**:
- Full analysis results display (newspaper-style layout)
- Episode tracking preview with timeline
- Multiple demo entries showing progression
- Trend analysis demonstration

## Data Models

### Demo Episode Structure

```typescript
interface DemoEpisode {
  id: string;
  title: string;
  startDate: string;
  endDate: string | null;
  status: 'active' | 'resolved';
  severity: 'mild' | 'moderate' | 'severe';
  symptoms: string[];
  entryCount: number;
  aiSummary: string;
  entries: DemoEntry[];
}

interface DemoEntry {
  id: string;
  date: string;
  dayNumber: number;
  symptoms: string[];
  severity: string;
  dailySummary: string;
  analysis: string;
  informationNotes: string[];
  selfCareTips: string[];
  trend: string;
  estimatedRecoveryWindow: string;
}
```

## Error Handling

### Navigation Errors
- **Invalid Routes**: Graceful fallback to landing page
- **Demo Errors**: Reset to initial state with error message

### Performance Errors
- **Slow Loading**: Progressive enhancement with loading states
- **Image Loading**: Fallback to placeholder images

## Performance Considerations

### Lighthouse 100 Optimization
- **Zero Layout Shift**: Reserved space for all content
- **Fast LCP**: Optimized images and critical CSS
- **Instant Interaction**: Minimal JavaScript on landing page

### Loading Strategy
- **Critical Path**: Hero section loads first
- **Progressive Enhancement**: Demo and features load after hero
- **Lazy Loading**: Below-the-fold content loads on scroll

## Testing Strategy

### Manual Testing
- Landing page displays correctly on desktop and mobile
- Demo flow works end-to-end (select → analyze → episode view)
- Navigation flows work correctly (landing → setup → app)
- Performance metrics meet targets (CLS = 0, LCP < 2.5s)

### Integration Testing
- Landing page isolation (no shared app state)
- Demo component integration with landing page
- Navigation between landing, setup, and app routes

## Migration Strategy

### Existing Users
- Symptom tracker moved from `/` to `/app`
- FloatingNavigation updated to link to `/app`
- Setup page redirects to `/app` after completion

### URL Structure
- **Before**: Symptom tracker at `/`
- **After**: Landing page at `/`, symptom tracker at `/app`

## Future Enhancements

### Phase 2 Features
- **Analytics Integration**: Track landing page conversion rates
- **A/B Testing**: Test different hero messages and CTAs
- **SEO Optimization**: Enhanced metadata and structured data
- **Accessibility**: Full WCAG 2.1 AA compliance

### Phase 3 Features
- **Internationalization**: Multi-language support
- **Dynamic Content**: CMS-driven feature highlights
- **User Testimonials**: Social proof section
- **Video Demo**: Animated walkthrough of features