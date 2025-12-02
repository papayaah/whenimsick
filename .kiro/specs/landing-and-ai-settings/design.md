# Design Document

## Overview

This feature introduces a landing page for new users and a comprehensive AI provider settings system that allows users to choose between three AI options: Chrome's built-in AI (free, offline), a shared Gemini API (limited free usage via Supabase), or their own Gemini API key (unlimited usage with cost tracking). The design maintains the existing pastel aesthetic and integrates seamlessly with the current application architecture.

## Architecture

### High-Level Architecture

```
┌─────────────────┐
│  Landing Page   │
│   (New Users)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Setup Page    │
│ (AI Selection)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌──────────────────┐
│ Symptom Tracker │────▶│  Settings Page   │
│  (Main App)     │     │ (AI Management)  │
└────────┬────────┘     └──────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│          AI Service Layer               │
│  ┌─────────────────────────────────┐   │
│  │  Chrome AI  │  Gemini (Shared)  │   │
│  │             │  Gemini (Custom)  │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│         Storage Service Layer           │
│  ┌─────────────────────────────────┐   │
│  │  API Keys  │  Usage Stats       │   │
│  │  Provider  │  Cost Tracking     │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### Component Structure

- **Landing Page** (`src/app/landing/page.tsx`): Marketing page for new visitors
- **Enhanced Setup Page** (`src/app/setup/page.tsx`): AI provider selection with three options
- **Settings Page** (`src/app/settings/page.tsx`): AI configuration and usage statistics
- **AI Settings Service** (`src/services/aiSettingsService.ts`): Manages API keys and provider preferences
- **Cost Tracking Service** (`src/services/costTrackingService.ts`): Tracks API usage and calculates costs
- **Enhanced Gemini AI Service** (`src/lib/gemini-ai.ts`): Supports both shared and custom API keys
- **Enhanced AI Service** (`src/lib/ai-service.ts`): Updated to handle custom API keys

## Components and Interfaces

### 1. Landing Page Component

**Location**: `src/app/page.tsx` (modified to show landing for new users)

**Purpose**: Serve as both marketing landing page for new users AND redirect returning users to the app

**Routing Logic**:
```typescript
// On page load:
if (aiSetupService.isAISetup()) {
  // Returning user - show symptom tracker (existing behavior)
  return <SymptomTrackerPage />;
} else {
  // New user - show landing page
  return <LandingPage />;
}
```

**Landing Page Features**:
- **Hero Section**: 
  - Product name and tagline
  - Brief description of what When I'm Sick does
  - Prominent "Get Started" button
  
- **Feature Highlights**:
  - Symptom tracking with AI analysis
  - Episode tracking and trends
  - Medical glossary
  - Privacy-first (data stays local)
  
- **Visual Elements**:
  - Screenshots or demo video
  - Capybara mascot integration
  - Pastel color scheme matching app aesthetic
  
- **Call-to-Action**:
  - Primary: "Get Started" → navigates to `/setup`
  - Secondary: "Learn More" → scrolls to features section

**State Management**:
- Check AI setup status on mount
- Simple navigation to setup page
- No complex state needed

**Design Notes**:
- This creates a seamless experience where the root URL (`/`) serves both purposes:
  - Marketing landing for new visitors
  - Direct app access for returning users
- No separate `/landing` route needed
- Maintains existing URL structure

### 2. Enhanced Setup Page

**Location**: `src/app/setup/page.tsx` (modified)

**New Features**:
- Three AI provider options displayed as cards:
  1. **Chrome AI** (Recommended if available)
     - Badge: "Free & Offline"
     - Shows availability status
     - Setup instructions if not available
  
  2. **Shared Gemini API** (Recommended if Chrome AI unavailable)
     - Badge: "Limited Free Usage"
     - No configuration needed
     - Usage limits displayed
  
  3. **Custom Gemini API Key**
     - Badge: "Unlimited Usage"
     - API key input field
     - Validation feedback
     - Cost tracking notice

**Interface**:
```typescript
interface AIProviderOption {
  id: 'chrome' | 'gemini-shared' | 'gemini-custom';
  name: string;
  description: string;
  badge: string;
  available: boolean;
  recommended: boolean;
  requiresConfig: boolean;
}

interface SetupState {
  selectedProvider: AIProviderOption['id'] | null;
  customApiKey: string;
  isValidating: boolean;
  validationError: string | null;
  isInitializing: boolean;
}
```

### 3. Settings Page Component

**Location**: `src/app/settings/page.tsx` (new)

**Purpose**: Allow users to manage AI provider and view usage statistics

**Sections**:
1. **Current AI Provider**
   - Display active provider
   - Option to change provider
   - API key management (for custom keys)

2. **Usage Statistics** (for custom API keys only)
   - Total API calls
   - Total tokens used (input + output)
   - Estimated cost
   - Reset statistics button

3. **API Key Management** (for custom keys)
   - Masked API key display
   - Update API key
   - Remove API key

**Interface**:
```typescript
interface SettingsPageState {
  currentProvider: AIProvider | null;
  isChangingProvider: boolean;
  showApiKeyInput: boolean;
  newApiKey: string;
  usageStats: UsageStats | null;
}

interface UsageStats {
  totalCalls: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  estimatedCost: number;
  lastUpdated: string;
}
```

### 4. AI Settings Service

**Location**: `src/services/aiSettingsService.ts` (new)

**Purpose**: Manage AI provider preferences and API keys

**Methods**:
```typescript
class AISettingsService {
  // Provider management
  getProvider(): AIProvider | null;
  setProvider(provider: AIProvider): void;
  
  // API key management
  getCustomApiKey(): string | null;
  setCustomApiKey(key: string): void;
  removeCustomApiKey(): void;
  getMaskedApiKey(): string | null;
  
  // Validation
  validateApiKey(key: string): boolean;
  testApiKey(key: string): Promise<boolean>;
}
```

**Storage Keys**:
- `ai_provider`: Current AI provider ('chrome' | 'gemini-shared' | 'gemini-custom')
- `gemini_api_key`: Custom Gemini API key (encrypted in future)

### 5. Cost Tracking Service

**Location**: `src/services/costTrackingService.ts` (new)

**Purpose**: Track API usage and calculate costs for custom API keys

**Methods**:
```typescript
class CostTrackingService {
  // Usage tracking
  recordApiCall(inputTokens: number, outputTokens: number): void;
  getUsageStats(): UsageStats;
  resetUsageStats(): void;
  
  // Cost calculation
  calculateCost(inputTokens: number, outputTokens: number): number;
  getTotalCost(): number;
}
```

**Pricing** (Gemini 1.5 Flash as of 2024):
- Input: $0.075 per 1M tokens
- Output: $0.30 per 1M tokens

**Storage Structure**:
```typescript
interface StoredUsageData {
  totalCalls: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  lastUpdated: string;
  history: Array<{
    timestamp: string;
    inputTokens: number;
    outputTokens: number;
    cost: number;
  }>;
}
```

**Storage Key**: `api_usage_stats`

### 6. Enhanced Gemini AI Service

**Location**: `src/lib/gemini-ai.ts` (modified)

**Changes**:
- Check for custom API key before using Supabase
- Support direct Gemini API calls with custom key
- Parse token usage from responses
- Report usage to cost tracking service

**New Interface**:
```typescript
interface GeminiConfig {
  useCustomKey: boolean;
  apiKey?: string;
  supabaseUrl?: string;
  supabaseKey?: string;
}

interface GeminiResponse {
  success: boolean;
  data: SymptomAnalysisResult;
  usage?: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
}
```

**API Endpoint** (for custom keys):
- `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`

### 7. Enhanced AI Service

**Location**: `src/lib/ai-service.ts` (modified)

**Changes**:
- Check AI settings service for provider preference
- Initialize appropriate provider based on settings
- Support switching between providers
- Handle custom API key configuration

## Data Models

### AI Provider Settings

```typescript
type AIProvider = 'chrome' | 'gemini-shared' | 'gemini-custom';

interface AIProviderSettings {
  provider: AIProvider;
  customApiKey?: string;
  lastUpdated: string;
}
```

### Usage Statistics

```typescript
interface UsageStats {
  totalCalls: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  estimatedCost: number;
  lastUpdated: string;
}

interface UsageHistoryEntry {
  timestamp: string;
  inputTokens: number;
  outputTokens: number;
  cost: number;
  episodeId?: string;
  entryId?: string;
}
```

### API Key Validation

```typescript
interface ApiKeyValidation {
  isValid: boolean;
  error?: string;
  model?: string;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: API key format validation consistency
*For any* string input to the API key validator, the validation result should be deterministic and follow the expected format rules (non-empty, minimum length, valid characters).
**Validates: Requirements 2.6**

### Property 2: Provider persistence consistency
*For any* AI provider selection (chrome, gemini-shared, gemini-custom), saving the selection should result in the same value being retrievable from LocalStorage.
**Validates: Requirements 2.7**

### Property 3: API call counting accuracy
*For any* sequence of API calls made with a custom key, the tracked count should equal the number of calls made.
**Validates: Requirements 3.1**

### Property 4: Token extraction completeness
*For any* valid Gemini API response, the token extraction should successfully retrieve both input and output token counts.
**Validates: Requirements 3.2**

### Property 5: Cost calculation accuracy
*For any* pair of token counts (input, output), the calculated cost should match the formula: (inputTokens × $0.075 / 1M) + (outputTokens × $0.30 / 1M).
**Validates: Requirements 3.3**

### Property 6: Usage data persistence
*For any* calculated usage statistics, persisting to LocalStorage and then retrieving should yield equivalent data.
**Validates: Requirements 3.4**

### Property 7: Provider display consistency
*For any* stored AI provider configuration, displaying it in the settings page should show the correct provider name and configuration.
**Validates: Requirements 4.1**

### Property 8: Provider change triggers re-initialization
*For any* provider change operation, the AI service should be re-initialized with the new provider configuration.
**Validates: Requirements 4.3**

### Property 9: API key storage locality
*For any* API key stored by the application, it should only exist in LocalStorage and not be transmitted to any server except Google's Gemini API.
**Validates: Requirements 5.1**

### Property 10: API key masking correctness
*For any* API key string with length ≥ 4, the masked version should show only the last 4 characters with all other characters replaced by asterisks.
**Validates: Requirements 5.5**

### Property 11: API routing based on key presence
*For any* Gemini AI service call, if a custom API key exists in storage, direct Gemini API calls should be used; otherwise, the Supabase Edge Function should be used.
**Validates: Requirements 6.2**

### Property 12: Prompt structure consistency
*For any* symptom analysis request, the prompt structure should be identical whether using custom API key or Supabase Edge Function.
**Validates: Requirements 6.4**

### Property 13: Response parsing consistency
*For any* valid API response (from either Gemini direct or Supabase), parsing should produce a consistent SymptomAnalysisResult structure.
**Validates: Requirements 6.5**

### Property 14: Error message clarity
*For any* API error, the error message should clearly indicate whether the issue is with the custom API key or the shared service.
**Validates: Requirements 6.6**

## Error Handling

### API Key Validation Errors
- **Invalid Format**: "API key format is invalid. Please check your key and try again."
- **Empty Key**: "API key cannot be empty."
- **Test Failed**: "Unable to verify API key. Please check that the key is active and has the necessary permissions."

### API Call Errors
- **Custom Key Error**: "API call failed with your custom key: [error message]. Please check your API key in settings."
- **Shared Service Error**: "Shared AI service is temporarily unavailable: [error message]. Please try again later or configure a custom API key."
- **Network Error**: "Network error occurred. Please check your internet connection and try again."

### Storage Errors
- **LocalStorage Full**: "Unable to save settings. Browser storage is full. Please clear some data and try again."
- **LocalStorage Unavailable**: "Browser storage is not available. Settings cannot be saved."

### Provider Switching Errors
- **Initialization Failed**: "Failed to initialize [provider name]. Please try again or select a different provider."
- **Provider Unavailable**: "[Provider name] is not available on this device."

## Testing Strategy

### Unit Testing

**Framework**: Jest with React Testing Library

**Test Coverage**:
1. **Landing Page**
   - Renders all key features
   - CTA button navigates to setup
   - Redirects returning users

2. **Setup Page**
   - Displays three provider options
   - Validates API key format
   - Persists provider selection
   - Handles provider initialization

3. **Settings Page**
   - Displays current provider
   - Shows usage statistics for custom keys
   - Masks API keys correctly
   - Resets usage statistics

4. **AI Settings Service**
   - Stores and retrieves provider preferences
   - Manages API keys securely
   - Validates API key format

5. **Cost Tracking Service**
   - Records API calls accurately
   - Calculates costs correctly
   - Persists usage data
   - Resets statistics

6. **Enhanced Gemini AI Service**
   - Routes to correct API based on configuration
   - Extracts token usage from responses
   - Maintains consistent prompt structure
   - Handles errors appropriately

### Property-Based Testing

**Framework**: fast-check (JavaScript property-based testing library)

**Configuration**: Each property test should run a minimum of 100 iterations

**Test Tagging**: Each property-based test must include a comment with the format:
`// Feature: landing-and-ai-settings, Property X: [property description]`

**Properties to Test**:
1. API key validation consistency (Property 1)
2. Provider persistence round-trip (Property 2)
3. API call counting (Property 3)
4. Token extraction (Property 4)
5. Cost calculation (Property 5)
6. Usage data persistence (Property 6)
7. Provider display (Property 7)
8. Provider change re-initialization (Property 8)
9. API key storage locality (Property 9)
10. API key masking (Property 10)
11. API routing logic (Property 11)
12. Prompt structure consistency (Property 12)
13. Response parsing consistency (Property 13)
14. Error message clarity (Property 14)

### Integration Testing

**Scenarios**:
1. **First-time user flow**: Landing → Setup → Symptom Tracker
2. **Provider switching**: Chrome AI → Custom Key → Shared Gemini
3. **Cost tracking**: Make multiple API calls → View statistics → Reset
4. **API key management**: Add key → Use key → Update key → Remove key

### Manual Testing Checklist

- [ ] Landing page displays correctly on desktop and mobile
- [ ] All three AI provider options are clearly explained
- [ ] API key input accepts valid keys and rejects invalid ones
- [ ] Usage statistics update in real-time
- [ ] Cost calculations match expected values
- [ ] API key masking works correctly
- [ ] Provider switching works without data loss
- [ ] Error messages are clear and actionable
- [ ] Settings persist across browser sessions
- [ ] Navigation flows work correctly

## Security Considerations

### API Key Storage
- Store API keys in LocalStorage (client-side only)
- Never log API keys to console
- Never transmit API keys to any server except Google's Gemini API
- Consider encryption for API keys in future iterations

### Data Privacy
- Usage statistics stored locally only
- No telemetry or analytics on API usage
- Users can clear all data at any time

### Input Validation
- Validate API key format before storage
- Sanitize all user inputs
- Prevent XSS attacks in error messages

### Rate Limiting
- Implement client-side rate limiting for API calls
- Warn users about potential costs with custom keys
- Provide usage alerts at certain thresholds

## Performance Considerations

### LocalStorage Access
- Cache provider settings in memory to reduce LocalStorage reads
- Batch usage statistics updates to reduce write operations
- Use async operations for storage access where possible

### API Calls
- Reuse AI service instances to avoid re-initialization
- Implement request queuing for multiple simultaneous calls
- Add timeout handling for API requests

### UI Responsiveness
- Show loading states during API key validation
- Provide immediate feedback for user actions
- Use optimistic updates for settings changes

## Future Enhancements

### Phase 2 Features
- **API Key Encryption**: Encrypt API keys in LocalStorage using Web Crypto API
- **Usage Alerts**: Notify users when approaching cost thresholds
- **Multiple API Keys**: Support multiple API keys with automatic rotation
- **Usage Analytics**: Detailed breakdown of costs by episode/entry
- **Export Usage Data**: Allow users to export usage history as CSV

### Phase 3 Features
- **Budget Management**: Set monthly budget limits with alerts
- **Provider Comparison**: Show cost comparison between providers
- **Batch Operations**: Optimize multiple API calls for cost efficiency
- **Caching**: Cache AI responses to reduce API calls for similar symptoms

## Migration Strategy

### Existing Users
1. Detect existing AI setup on first load after update
2. Automatically configure as "gemini-shared" if using Supabase
3. Show one-time notification about new provider options
4. Provide link to settings to explore custom API key option

### Data Migration
- No data migration needed (new feature)
- Existing episodes and entries remain unchanged
- Usage tracking starts from zero for all users

### Rollback Plan
- Feature can be disabled via feature flag
- Fallback to original Supabase-only implementation
- No data loss if feature is rolled back