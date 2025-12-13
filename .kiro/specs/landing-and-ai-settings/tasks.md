# Implementation Plan

- [ ] 1. Create landing page and move symptom tracker to /app
  - Build a marketing landing page at root `/` and move the symptom tracker to `/app`
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ] 1.1 Move symptom tracker to /app route
  - Create `src/app/app/page.tsx` 
  - Move all symptom tracker code from `src/app/page.tsx` to the new `/app` route
  - Update any internal navigation to use `/app` instead of `/`
  - _Requirements: 1.5_

- [ ] 1.2 Extend DemoSimulation component with episode view
  - Update `src/components/demo/DemoSimulation.tsx` to add episode view step
  - After showing analysis results, add "View Episode" button
  - Show episode tracking mockup with the analyzed symptom entry
  - Display episode timeline, trend, and entry details
  - This gives users full preview of app functionality
  - _Requirements: 1.2_

- [ ] 1.3 Create landing page at root with isolated layout
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

- [ ] 1.4 Update navigation and redirects
  - Wire up "Get Started" button to navigate to `/setup`
  - Update setup page to redirect to `/app` after completion (not `/`)
  - Update FloatingNavigation to link home icon to `/app` (not `/`)
  - _Requirements: 1.4_

- [ ] 2. Update layout and legal gate behavior
  - Modify the root layout to conditionally show alpha banner and update legal gate to be an overlay
  - _Requirements: 1.1_

- [ ] 2.1 Create isolated layout for landing page
  - Create `src/app/layout-landing.tsx` or use inline layout in landing page
  - Ensure landing page does NOT use the root layout's shared components
  - Landing page should have its own minimal layout (no FloatingNavigation, no alpha banner, no LegalGate)
  - This prevents any flickering or shared state between landing and app
  - _Requirements: 1.1_

- [ ] 2.2 Modify root layout for app routes only
  - Update `src/app/layout.tsx` to check current route
  - Only render alpha banner, FloatingNavigation when NOT on landing page (`/`)
  - Ensure clean separation between landing and app layouts
  - _Requirements: 1.1_

- [ ] 2.3 Update LegalGate to be a modal overlay
  - Modify `src/components/LegalGate.tsx` to show as overlay instead of redirect
  - Only show legal gate on app routes (`/app`, `/setup`, `/settings`, `/episodes`, `/glossary`)
  - Do NOT show legal gate on landing page (`/`)
  - Show modal with dimmed background when terms not accepted
  - After acceptance, dismiss overlay and continue to requested page
  - _Requirements: 1.1_

- [ ] 3. Set up AI settings and cost tracking services
  - Create core service infrastructure for managing AI provider preferences and tracking API usage
  - _Requirements: 2.7, 3.1, 3.4, 5.1_

- [ ] 3.1 Create AI Settings Service
  - Implement `src/services/aiSettingsService.ts` with methods for provider management and API key storage
  - Include validation for API key format
  - _Requirements: 2.6, 2.7, 5.1_

- [ ] 3.2 Create Cost Tracking Service
  - Implement `src/services/costTrackingService.ts` with methods for recording API calls and calculating costs
  - Include Gemini pricing constants and cost calculation logic
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ] 4. Enhance Gemini AI service to support custom API keys
  - Modify the Gemini AI service to check for custom API keys and route requests appropriately
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

- [ ] 4.1 Update Gemini AI service initialization
  - Modify `src/lib/gemini-ai.ts` to check for custom API key in localStorage
  - Implement logic to choose between direct Gemini API and Supabase Edge Function
  - _Requirements: 6.1, 6.2, 6.3_

- [ ] 4.2 Implement direct Gemini API calls
  - Add method to call Google's Gemini API directly with custom API key
  - Use the same prompt structure as Supabase function
  - Parse responses consistently
  - _Requirements: 6.4, 6.5_

- [ ] 4.3 Add token usage extraction and cost tracking
  - Extract token usage from Gemini API responses
  - Report usage to cost tracking service when using custom API key
  - _Requirements: 3.2_

- [ ] 4.4 Implement error handling with clear messages
  - Add error handling that distinguishes between custom key errors and shared service errors
  - Provide actionable error messages
  - _Requirements: 6.6_

- [ ] 5. Update AI service to use settings
  - Modify the main AI service to check AI settings and initialize the appropriate provider
  - _Requirements: 2.7, 4.3_

- [ ] 5.1 Modify AI service initialization
  - Update `src/lib/ai-service.ts` to check aiSettingsService for provider preference
  - Initialize the selected provider based on settings
  - _Requirements: 2.7_

- [ ] 5.2 Implement provider switching
  - Add method to switch between providers dynamically
  - Re-initialize AI service when provider changes
  - _Requirements: 4.3_

- [ ] 6. Enhance setup page with three AI provider options
  - Modify the setup page to show three provider options with selection and configuration
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.8_

- [ ] 6.1 Update setup page UI
  - Modify `src/app/setup/page.tsx` to display three provider option cards
  - Add badges: "Offline & Private", "Works Everywhere", "Bring Your Own Key"
  - Show Chrome AI availability status
  - _Requirements: 2.1, 2.2_

- [ ] 6.2 Implement Chrome AI selection flow
  - Add selection handler for Chrome AI option
  - Verify browser compatibility when selected
  - Show setup instructions if not available
  - _Requirements: 2.3_

- [ ] 6.3 Implement Shared Gemini API selection flow
  - Add selection handler for Shared Gemini API option
  - Display daily usage limit information (10 requests/day)
  - _Requirements: 2.4_

- [ ] 6.4 Implement Custom API Key selection flow
  - Add selection handler for Custom API Key option
  - Show API key input field when selected
  - Implement API key validation on input
  - Show validation feedback
  - _Requirements: 2.5, 2.6_

- [ ] 6.5 Implement provider save and redirect
  - Save selected provider to aiSettingsService
  - Save custom API key if provided
  - Redirect to symptom tracker after successful configuration
  - _Requirements: 2.7, 2.8_

- [ ] 7. Create settings page
  - Build a settings page where users can view and change their AI provider configuration
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [ ] 7.1 Create settings page component
  - Create `src/app/settings/page.tsx`
  - Display current AI provider configuration
  - Show option to change provider
  - Add navigation link back to symptom tracker
  - _Requirements: 4.1, 4.2, 4.6_

- [ ] 7.2 Implement provider change functionality
  - Add UI for selecting a new provider
  - Call aiService.switchProvider() when changed
  - Show success/error feedback
  - _Requirements: 4.3_

- [ ] 7.3 Add usage statistics section
  - Display total API calls, tokens, and estimated cost
  - Only show for users with custom API keys
  - Add reset statistics button
  - _Requirements: 3.5, 4.4_

- [ ] 7.4 Implement usage statistics reset
  - Wire up reset button to costTrackingService.resetUsageStats()
  - Clear usage data from localStorage
  - Show confirmation before reset
  - _Requirements: 3.6, 4.5_

- [ ] 7.5 Add API key management section
  - Display masked API key for custom key users
  - Add option to update API key
  - Add option to remove API key
  - _Requirements: 5.5_

- [ ] 8. Add navigation to settings page
  - Add a link to the settings page in the floating navigation
  - _Requirements: 4.1_

- [ ] 8.1 Update FloatingNavigation component
  - Add settings icon/link to `src/components/FloatingNavigation/FloatingNavigation.tsx`
  - Link to `/settings` route
  - _Requirements: 4.1_

- [ ] 9. Implement rate limiting for shared Gemini API
  - Add client-side rate limiting to prevent abuse of the shared API
  - _Requirements: 2.4_

- [ ] 9.1 Add rate limiting logic to Gemini AI service
  - Track daily request count in localStorage for shared API
  - Implement 10 requests/day limit
  - Reset count at midnight
  - Show clear error message when limit reached
  - _Requirements: 2.4_

- [ ] 10. Manual testing and polish
  - Test complete user flows (landing → setup → symptom tracker)
  - Verify styling matches existing aesthetic
  - Check responsive design on desktop and mobile
  - Test error scenarios (invalid API keys, rate limits, etc.)
  - Verify legal gate → landing page → app flow works correctly
  - _Requirements: All_
