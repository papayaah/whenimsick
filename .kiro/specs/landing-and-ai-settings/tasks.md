# Implementation Plan

## Phase 1: User-Facing Features (Top-Down)

- [ ] 1. Create Landing Page component
  - Create `src/app/page.tsx` with hero section
  - Add feature highlights section (4 key features: symptom tracking, AI analysis, episode tracking, privacy-first)
  - Add prominent "Start Tracking Symptoms" CTA button that goes to `/episodes`
  - Implement redirect logic for returning users (check `has_visited` in LocalStorage)
  - Style with Tailwind CSS matching app's pastel aesthetic
  - **Performance optimizations for Lighthouse 100**:
    - Use Next.js `<Image>` component with explicit width/height for all images
    - Set `priority` prop on hero image (LCP element)
    - Use `aspect-ratio` CSS or fixed heights to reserve space and prevent CLS
    - Preload critical fonts in layout
    - Lazy load below-the-fold content
    - Minimize JavaScript bundle size
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8_

- [ ]* 1.1 Write property test for landing page redirect logic
  - **Property 7: Landing Page Redirect Logic**
  - **Validates: Requirements 1.5**

- [ ] 2. Update AI Service to default to Shared Gemini
  - Modify `src/lib/ai-service.ts` to default to Shared Gemini API when no provider preference is saved
  - **Note**: `gemini-ai.ts` already uses Supabase Edge Function (`/functions/v1/symptoms`) - no changes needed
  - The Edge Function already handles both initial symptoms and episode progression
  - Ensure initialization works without any user configuration
  - Remove requirement for setup page before using app
  - _Requirements: 2.1_

- [ ] 3. Create AI Settings Service with Rate Limiting
  - Create `src/services/aiSettingsService.ts`
  - Implement `saveProviderConfig()` and `getProviderConfig()`
  - Implement `saveUsageStats()`, `getUsageStats()`, and `resetUsageStats()`
  - **Implement rate limiting for Shared Gemini API**:
    - `checkRateLimit()`: Check if under 10 requests/day limit
    - `incrementRateLimitCounter()`: Increment after successful API call
    - `getRateLimitStatus()`: Get remaining requests and reset time
    - `resetRateLimitIfExpired()`: Auto-reset at midnight UTC
  - Add LocalStorage keys: `whenimsick_ai_provider`, `whenimsick_api_usage_stats`, `whenimsick_rate_limit`
  - _Requirements: 2.7, 2.9, 2.10, 2.11, 3.4, 3.5, 4.5_

- [ ]* 3.1 Write property test for configuration persistence
  - **Property 6: Configuration Persistence Round-Trip**
  - **Validates: Requirements 2.7**

- [ ] 4. Create Settings Page component
  - Create `src/app/settings/page.tsx`
  - Display current AI provider (Shared Gemini, Chrome AI, or Custom API Key)
  - Add three provider option cards (similar to old setup page):
    - Chrome AI: Show availability status and setup instructions
    - Shared Gemini: Show as default, display remaining requests (e.g., "7/10 requests remaining today")
    - Custom API Key: Input field with validation
  - **Display rate limit status for Shared Gemini users**:
    - Show remaining requests
    - Show reset time
    - Warning when approaching limit (< 3 remaining)
  - Display usage statistics for custom API key users (cost tracking)
  - Add "Reset Statistics" button with confirmation
  - Add navigation link back to symptom tracker
  - Style consistently with app design
  - _Requirements: 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [ ]* 4.1 Write unit tests for API key validation
  - Test valid API key formats
  - Test invalid API key formats
  - Test empty input handling
  - _Requirements: 2.6_

- [ ] 5. Add navigation updates
  - Update `FloatingNavigation` component to include Settings link
  - Ensure Settings link is accessible from all pages
  - Update navigation styling for new link
  - _Requirements: 4.6_

- [ ] 6. Checkpoint - Ensure basic flow works
  - Test: Landing → Symptom Tracker → Settings
  - Ensure all tests pass, ask the user if questions arise.

## Phase 2: AI Provider Infrastructure (Bottom-Up)

- [ ] 7. Implement API key security features
  - Create utility function for masking API keys
  - Ensure API keys only stored in LocalStorage
  - Add validation that keys only sent to Gemini API endpoints
  - Update all display locations to show masked keys
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ]* 7.1 Write property test for API key masking
  - **Property 8: Masked API Key Display**
  - **Validates: Requirements 5.5**

- [ ]* 7.2 Write property test for API key storage security
  - **Property 3: API Key Storage Security**
  - **Validates: Requirements 5.2, 5.3**

- [ ] 8. Implement cost tracking and display
  - Add token usage extraction from Gemini API responses
  - Implement cost calculation based on Gemini pricing
  - Update usage stats after each API call
  - Create usage statistics display component
  - Add reset functionality with confirmation dialog
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [ ] 9. Enhance Gemini AI Service for custom API keys and rate limiting
  - Update `src/lib/gemini-ai.ts` to support custom API keys
  - Check for custom API key in settings before using Supabase
  - **Implement rate limiting check before Supabase calls**:
    - Check rate limit before making request
    - Throw clear error if limit exceeded
    - Increment counter after successful request
  - Implement direct Gemini API calls with custom key (bypasses rate limit)
  - Parse token usage from responses for cost tracking
  - Report usage to cost tracking service (only for custom keys)
  - _Requirements: 2.9, 2.10, 2.11, 6.1, 6.2, 6.3, 6.4, 3.1, 3.2, 3.3_

- [ ]* 9.1 Write property test for cost tracking accumulation
  - **Property 4: Cost Tracking Accumulation**
  - **Validates: Requirements 3.3, 3.4**

- [ ] 10. Update error handling
  - Add provider-specific error messages
  - **Add rate limit error handling**:
    - Clear message: "Daily limit reached (10 requests)"
    - Show reset time
    - Suggest Chrome AI or custom API key
  - Implement fallback chain (Chrome → Shared Gemini → Error)
  - Add user-friendly error messages for common issues
  - Add retry logic for network errors (but not for rate limit errors)
  - _Requirements: 2.10, 6.6_

- [ ]* 10.1 Write unit tests for error handling
  - Test Chrome AI unavailable scenario
  - Test invalid API key scenario
  - Test network error scenario
  - Test fallback chain logic
  - _Requirements: 6.6_

- [ ] 11. Add provider availability caching
  - Implement 30-second cache for availability checks
  - Add cache invalidation logic
  - Update all providers to use cached availability
  - _Requirements: 2.3_

- [ ]* 11.1 Write property test for availability caching
  - **Property 5: Provider Availability Idempotence**
  - **Validates: Requirements 2.3**

- [ ] 12. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Phase 3: Final Integration and Polish

- [ ] 13. Final integration and polish
  - Test complete user flow: Landing → Tracker → Settings
  - Verify provider switching works correctly
  - Verify cost tracking accuracy
  - Test offline functionality with Chrome AI
  - Ensure all LocalStorage operations work correctly
  - _Requirements: All_

- [ ] 14. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
