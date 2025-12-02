# Requirements Document

## Introduction

This feature adds a landing page to introduce new users to When I'm Sick and provides comprehensive AI provider settings that allow users to choose between Chrome's built-in AI (free, offline), the shared Gemini API (limited free usage), or their own Gemini API key (unlimited usage with cost tracking).

## Glossary

- **Chrome AI**: Google's built-in AI (Gemini Nano) that runs locally in Chrome browsers, requiring no API key and working completely offline
- **Shared Gemini API**: A Supabase Edge Function that provides limited free access to Gemini API for users without their own API key
- **Custom Gemini API Key**: A user-provided Google AI API key that enables unlimited usage with cost tracking
- **Landing Page**: The initial page users see when first visiting the application, providing an overview and call-to-action
- **AI Provider**: The service used to analyze symptoms (Chrome AI, Shared Gemini, or Custom Gemini)
- **Cost Tracking**: Monitoring and displaying the estimated cost of API calls when using a custom Gemini API key
- **LocalStorage**: Browser-based storage where user preferences and cost data are persisted
- **Settings Page**: A dedicated page where users can configure their AI provider preferences and view usage statistics

## Requirements

### Requirement 1

**User Story:** As a new visitor, I want to see a landing page that explains what When I'm Sick does, so that I can understand the value proposition before using the app.

#### Acceptance Criteria

1. WHEN a user visits the root URL for the first time, THE system SHALL display a landing page with product overview
2. WHEN the landing page is displayed, THE system SHALL show key features including symptom tracking, AI analysis, episode tracking, and privacy-first design
3. WHEN the landing page is displayed, THE system SHALL provide a prominent call-to-action button to begin using the app
4. WHEN a user clicks the call-to-action button, THE system SHALL navigate directly to the symptom tracker with default AI provider
5. WHEN a returning user visits the root URL, THE system SHALL redirect directly to the symptom tracker
6. WHEN the landing page loads, THE system SHALL achieve a Cumulative Layout Shift (CLS) score of 0 by reserving space for all content
7. WHEN the landing page loads, THE system SHALL achieve Largest Contentful Paint (LCP) under 2.5 seconds
8. WHEN images are loaded, THE system SHALL use Next.js Image component with explicit width and height to prevent layout shifts

### Requirement 2

**User Story:** As a user, I want to choose my AI provider, so that I can select between free offline AI, limited free online AI, or unlimited usage with my own API key.

#### Acceptance Criteria

1. WHEN the system initializes without a saved provider preference, THE system SHALL default to the Shared Gemini API
2. WHEN a user accesses the settings page, THE system SHALL display three AI provider options: Chrome AI, Shared Gemini API, and Custom Gemini API Key
3. WHEN Chrome AI is available in the browser, THE system SHALL mark it as the recommended option for privacy
4. WHEN a user selects Chrome AI, THE system SHALL verify browser compatibility and show setup instructions if needed
5. WHEN a user selects Shared Gemini API, THE system SHALL inform them about limited free usage (10 requests per day)
6. WHEN a user selects Custom Gemini API Key, THE system SHALL provide an input field for the API key
7. WHEN a user enters a custom API key, THE system SHALL validate the key format before saving
8. WHEN a user saves their AI provider selection, THE system SHALL persist the choice to LocalStorage and reinitialize the AI service
9. WHEN using Shared Gemini API, THE system SHALL enforce a rate limit of 10 requests per 24-hour period per device
10. WHEN a user reaches the rate limit, THE system SHALL display a clear message suggesting Chrome AI or custom API key options
11. WHEN the rate limit resets, THE system SHALL allow the user to make requests again

### Requirement 3

**User Story:** As a user with a custom API key, I want to track my API usage costs, so that I can monitor my spending on AI analysis.

#### Acceptance Criteria

1. WHEN a user uses a custom Gemini API key, THE system SHALL track the number of API calls made
2. WHEN an API call completes, THE system SHALL extract token usage information from the response
3. WHEN token usage is available, THE system SHALL calculate the estimated cost based on Gemini pricing
4. WHEN cost data is calculated, THE system SHALL persist it to LocalStorage
5. WHEN a user views the settings page, THE system SHALL display total API calls, total tokens used, and estimated total cost
6. WHEN cost tracking data exists, THE system SHALL provide an option to reset the usage statistics

### Requirement 4

**User Story:** As a user, I want to access a settings page, so that I can change my AI provider or view my usage statistics at any time.

#### Acceptance Criteria

1. WHEN a user navigates to the settings page, THE system SHALL display the current AI provider configuration
2. WHEN the settings page is displayed, THE system SHALL show an option to change the AI provider
3. WHEN a user changes their AI provider, THE system SHALL re-initialize the AI service with the new provider
4. WHEN a custom API key is configured, THE system SHALL display usage statistics including calls, tokens, and costs
5. WHEN a user requests to reset usage statistics, THE system SHALL clear the cost tracking data from LocalStorage
6. WHEN the settings page is displayed, THE system SHALL provide a link to return to the symptom tracker

### Requirement 5

**User Story:** As a user, I want my API key to be stored securely, so that my credentials remain private and are not exposed.

#### Acceptance Criteria

1. WHEN a user enters a custom API key, THE system SHALL store it only in LocalStorage
2. WHEN the API key is stored, THE system SHALL never transmit it to any server except Google's Gemini API
3. WHEN the API key is used, THE system SHALL include it only in direct requests to Google's Gemini API endpoints
4. WHEN a user clears their browser data, THE system SHALL remove the stored API key
5. WHEN displaying the API key in settings, THE system SHALL mask all characters except the last 4 characters

### Requirement 6

**User Story:** As a developer, I want to refactor the Gemini AI service to support both shared and custom API keys, so that the codebase can handle multiple API configurations.

#### Acceptance Criteria

1. WHEN the Gemini AI service initializes, THE system SHALL check for a custom API key in LocalStorage
2. WHEN a custom API key exists, THE system SHALL use direct Gemini API calls instead of the Supabase Edge Function
3. WHEN no custom API key exists, THE system SHALL fall back to the Supabase Edge Function
4. WHEN making API calls with a custom key, THE system SHALL use the same prompt structure as the Supabase function
5. WHEN API responses are received, THE system SHALL parse them consistently regardless of the API source
6. WHEN API errors occur, THE system SHALL provide clear error messages indicating whether the issue is with the custom key or shared service
