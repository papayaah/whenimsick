# Requirements Document

## Introduction

This feature provides comprehensive AI provider settings that allow users to choose between Chrome's built-in AI (free, offline), the shared Gemini API (limited free usage), or their own API key for any supported LLM provider (OpenAI, Anthropic, Google, etc.) with unified cost tracking.

## Glossary

- **Chrome AI**: Google's built-in AI (Gemini Nano) that runs locally in Chrome browsers, requiring no API key and working completely offline
- **Shared Gemini API**: A Supabase Edge Function that provides limited free access to Gemini API for users without their own API key
- **Custom LLM Provider**: A user-selected AI provider (OpenAI, Anthropic, Google, etc.) with their own API key that enables unlimited usage with cost tracking
- **AI Provider**: The service used to analyze symptoms (Chrome AI, Shared Gemini, or Custom LLM Provider)
- **Vercel AI SDK**: A unified interface library that provides consistent access to multiple LLM providers
- **Cost Tracking**: Monitoring and displaying the estimated cost of API calls when using a custom API key across different providers
- **LocalStorage**: Browser-based storage where user preferences and cost data are persisted
- **Settings Page**: A dedicated page where users can configure their AI provider preferences and view usage statistics

## Requirements

### Requirement 2

**User Story:** As a user, I want to choose my AI provider, so that I can select between free offline AI, limited free online AI, or unlimited usage with my own API key from any supported provider.

#### Acceptance Criteria

1. WHEN the system initializes without a saved provider preference, THE system SHALL default to the Shared Gemini API
2. WHEN a user accesses the settings page, THE system SHALL display AI provider options: Chrome AI, Shared Gemini API, and Custom LLM Provider
3. WHEN Chrome AI is available in the browser, THE system SHALL mark it as the recommended option for privacy
4. WHEN a user selects Chrome AI, THE system SHALL verify browser compatibility and show setup instructions if needed
5. WHEN a user selects Shared Gemini API, THE system SHALL inform them about limited free usage (10 requests per day)
6. WHEN a user selects Custom LLM Provider, THE system SHALL display a dropdown of supported providers (OpenAI, Anthropic, Google, Cohere, Mistral)
7. WHEN a user selects a custom provider, THE system SHALL provide an input field for the API key and model selection
8. WHEN a user enters a custom API key, THE system SHALL validate the key format and test connectivity before saving
9. WHEN a user saves their AI provider selection, THE system SHALL persist the choice to LocalStorage and reinitialize the AI service using Vercel AI SDK
10. WHEN using Shared Gemini API, THE system SHALL enforce a rate limit of 10 requests per 24-hour period per device
11. WHEN a user reaches the rate limit, THE system SHALL display a clear message suggesting Chrome AI or custom API key options
12. WHEN the rate limit resets, THE system SHALL allow the user to make requests again

### Requirement 3

**User Story:** As a user with a custom API key, I want to track my API usage costs across different providers, so that I can monitor my spending on AI analysis.

#### Acceptance Criteria

1. WHEN a user uses a custom API key from any provider, THE system SHALL track the number of API calls made
2. WHEN an API call completes, THE system SHALL extract token usage information from the Vercel AI SDK response
3. WHEN token usage is available, THE system SHALL calculate the estimated cost based on the specific provider's pricing model
4. WHEN cost data is calculated, THE system SHALL persist it to LocalStorage with provider-specific breakdowns
5. WHEN a user views the settings page, THE system SHALL display total API calls, total tokens used, estimated total cost, and per-provider statistics
6. WHEN cost tracking data exists, THE system SHALL provide an option to reset the usage statistics
7. WHEN switching between providers, THE system SHALL maintain separate cost tracking for each provider
8. WHEN displaying costs, THE system SHALL show the pricing model used for each provider (per token, per request, etc.)

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

**User Story:** As a developer, I want to refactor the AI service to use Vercel AI SDK for unified provider support, so that the codebase can handle multiple LLM providers with a single interface.

#### Acceptance Criteria

1. WHEN the AI service initializes, THE system SHALL check for saved provider configuration in LocalStorage
2. WHEN a custom provider is configured, THE system SHALL initialize the appropriate Vercel AI SDK provider with the stored API key
3. WHEN no custom provider exists, THE system SHALL fall back to the Supabase Edge Function for shared Gemini access
4. WHEN making API calls with any provider, THE system SHALL use consistent prompt structure through Vercel AI SDK
5. WHEN API responses are received, THE system SHALL parse them consistently using Vercel AI SDK's unified response format
6. WHEN API errors occur, THE system SHALL provide clear error messages indicating the specific provider and error type
7. WHEN switching providers, THE system SHALL gracefully handle provider initialization and cleanup
8. WHEN using Vercel AI SDK, THE system SHALL maintain the same symptom analysis output format regardless of underlying provider