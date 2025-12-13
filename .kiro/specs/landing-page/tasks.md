# Implementation Plan

- [x] 1. Create landing page and move symptom tracker to /app
  - Build a marketing landing page at root `/` and move the symptom tracker to `/app`
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 1.1 Move symptom tracker to /app route
  - Create `src/app/app/page.tsx` 
  - Move all symptom tracker code from `src/app/page.tsx` to the new `/app` route
  - Update any internal navigation to use `/app` instead of `/`
  - _Requirements: 1.5_

- [x] 1.2 Extend DemoSimulation component with episode view
  - Update `src/components/demo/DemoSimulation.tsx` to add episode view step
  - After showing analysis results, add "View Episode" button
  - Show episode tracking mockup with the analyzed symptom entry
  - Display episode timeline, trend, and entry details
  - This gives users full preview of app functionality
  - _Requirements: 1.2_

- [x] 1.3 Create landing page at root with isolated layout
  - Update `src/app/page.tsx` to be the landing page (always shows at `/`)
  - Create a completely isolated layout for landing page (no shared components with app)
  - Build hero section with product name, tagline, and description
  - Integrate extended DemoSimulation component
  - Add feature highlights section below demo
  - Add prominent "Get Started" CTA button (both in hero and after demo)
  - Ensure NO navigation bar on landing page
  - Ensure NO alpha banner on landing page
  - Ensure NO Capybara mascot on landing page (only in terms page and app)
  - Ensure NO legal gate on landing page (only appears as overlay on app routes)
  - Ensure NO FloatingNavigation on landing page
  - Landing page should be completely isolated to prevent any flickering
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 1.4 Update navigation and redirects
  - Wire up "Get Started" button to navigate to `/setup`
  - Update setup page to redirect to `/app` after completion (not `/`)
  - Update FloatingNavigation to link home icon to `/app` (not `/`)
  - _Requirements: 1.4_

- [x] 2. Update layout and legal gate behavior
  - Modify the root layout to conditionally show alpha banner and update legal gate to be an overlay
  - _Requirements: 1.1_

- [x] 2.1 Create isolated layout for landing page
  - Create `src/components/RootLayoutClient.tsx` for conditional rendering
  - Ensure landing page does NOT use the root layout's shared components
  - Landing page should have its own minimal layout (no FloatingNavigation, no alpha banner, no LegalGate)
  - This prevents any flickering or shared state between landing and app
  - _Requirements: 1.1_

- [x] 2.2 Modify root layout for app routes only
  - Update `src/app/layout.tsx` to use RootLayoutClient
  - Only render alpha banner, FloatingNavigation when NOT on landing page (`/`)
  - Ensure clean separation between landing and app layouts
  - _Requirements: 1.1_

- [x] 2.3 Update LegalGate to allow landing page access
  - Modify `src/components/LegalGate.tsx` to allow access to landing page (`/`)
  - Only show legal gate on app routes (`/app`, `/setup`, `/settings`, `/episodes`, `/glossary`)
  - Do NOT show legal gate on landing page (`/`)
  - _Requirements: 1.1_

## Status: COMPLETE ✅

All tasks have been implemented and tested. The landing page is now live at `/` with complete isolation from app components, and the symptom tracker has been moved to `/app`.