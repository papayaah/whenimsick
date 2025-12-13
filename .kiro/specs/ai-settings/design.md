# Design Document

## Overview

This feature introduces a comprehensive AI provider settings system that allows users to choose between Chrome's built-in AI (offline), a shared Gemini API (via Supabase), or their own API key from any supported LLM provider (OpenAI, Anthropic, Google, etc.) using Vercel's AI SDK for unified integration. The design maintains the existing pastel aesthetic and integrates seamlessly with the current application architecture.

## Architecture

### Vercel AI SDK Integration

The system uses Vercel AI SDK as the unified interface for all LLM providers, providing:

- **Consistent API**: Single interface for all providers
- **Built-in streaming**: Real-time response streaming
- **Token tracking**: Automatic usage monitoring
- **Error handling**: Standardized error responses
- **Type safety**: Full TypeScript support

**Dependencies**:
```json
{
  "ai": "^3.0.0",
  "@ai-sdk/openai": "^0.0.20",
  "@ai-sdk/anthropic": "^0.0.15", 
  "@ai-sdk/google": "^0.0.18",
  "@ai-sdk/cohere": "^0.0.10",
  "@ai-sdk/mistral": "^0.0.8"
}
```

### High-Level Architecture

```
┌──────────────────────────────────────────┐
│         Settings Page (Optional)         │
│  Switch to Chrome AI or Custom API Key   │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│         Symptom Tracker                 │
│    (Default: Shared Gemini API)         │
│    No setup required - works instantly! │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│          AI Service Layer               │
│  ┌─────────────────────────────────┐   │
│  │  Gemini (Shared) ← DEFAULT      │   │
│  │  Chrome AI       ← Optional     │   │
│  │  Vercel AI SDK   ← Optional     │   │
│  │    ├─ OpenAI                    │   │
│  │    ├─ Anthropic                 │   │
│  │    ├─ Google                    │   │
│  │    ├─ Cohere                    │   │
│  │    └─ Mistral                   │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│         Storage Service Layer           │
│  ┌─────────────────────────────────┐   │
│  │  Provider Pref │  Usage Stats   │   │
│  │  API Keys      │  Cost Tracking │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

**Key UX Improvements**: 
- **Zero friction onboarding**: Users can start tracking symptoms immediately with Shared Gemini API (via Supabase Edge Function)
- **No setup required**: The app works out of the box with sensible defaults
- **Maximum flexibility**: Advanced users can choose from 5+ LLM providers with their own API keys
- **Unified experience**: Consistent symptom analysis quality regardless of chosen provider
- **Cost transparency**: Real-time cost tracking across all providers with provider-specific pricing

### Component Structure

- **Enhanced Setup Page** (`src/app/setup/page.tsx`): AI provider selection with multiple LLM options at `/setup`
- **Settings Page** (`src/app/settings/page.tsx`): AI configuration and usage statistics at `/settings`
- **AI Settings Service** (`src/services/aiSettingsService.ts`): Manages API keys and provider preferences for all supported providers
- **Cost Tracking Service** (`src/services/costTrackingService.ts`): Tracks API usage and calculates costs across different providers
- **Unified AI Service** (`src/lib/ai-service.ts`): Uses Vercel AI SDK for custom providers, maintains existing Chrome AI and Shared Gemini
- **Existing Gemini AI Service** (`src/lib/gemini-ai.ts`): UNCHANGED - continues to handle Shared Gemini API via Supabase
- **Provider Adapters** (`src/lib/providers/`): Individual provider configurations for Vercel AI SDK (custom providers only)

## Components and Interfaces

### 1. Enhanced Setup Page

**Location**: `src/app/setup/page.tsx` (modified)

**New Features**:
- Multiple AI provider options displayed as cards:
  1. **Chrome AI** (Recommended if available)
     - Badge: "Offline & Private"
     - Shows availability status
     - Setup instructions if not available
  
  2. **Shared Gemini API** (Recommended if Chrome AI unavailable)
     - Badge: "Works Everywhere"
     - No configuration needed
     - Daily usage limit displayed (10 requests/day)
  
  3. **Custom LLM Provider**
     - Badge: "Bring Your Own Key"
     - Provider dropdown (OpenAI, Anthropic, Google, Cohere, Mistral)
     - Model selection for chosen provider
     - API key input field
     - Validation feedback
     - Cost tracking notice with provider-specific pricing

**Interface**:
```typescript
type LLMProvider = 'openai' | 'anthropic' | 'google' | 'cohere' | 'mistral';
type AIProviderType = 'chrome' | 'gemini-shared' | 'custom-llm';

interface AIProviderOption {
  id: AIProviderType;
  name: string;
  description: string;
  badge: string;
  available: boolean;
  recommended: boolean;
  requiresConfig: boolean;
}

interface CustomLLMConfig {
  provider: LLMProvider;
  model: string;
  apiKey: string;
}

interface SetupState {
  selectedProvider: AIProviderType | null;
  customLLMConfig: CustomLLMConfig;
  availableModels: Record<LLMProvider, string[]>;
  isValidating: boolean;
  validationError: string | null;
  isInitializing: boolean;
}
```

### 2. Settings Page Component

**Location**: `src/app/settings/page.tsx` (new)

**Purpose**: Allow users to manage AI provider and view usage statistics

**Sections**:
1. **Current AI Provider**
   - Display active provider
   - Option to change provider
   - API key management (for custom keys)

2. **Usage Statistics** (ONLY shown for custom API keys)
   - Total API calls
   - Total tokens used (input + output)
   - Estimated cost in USD
   - Reset statistics button
   - **Note**: Only shown for Custom API Key users

3. **API Key Management** (for custom keys)
   - Masked API key display
   - Update API key
   - Remove API key

**Interface**:
```typescript
interface SettingsPageState {
  currentProvider: AIProviderConfig | null;
  isChangingProvider: boolean;
  showProviderConfig: boolean;
  newLLMConfig: CustomLLMConfig;
  usageStats: UsageStats | null;
  providerStats: Record<LLMProvider, ProviderUsageStats>;
}

interface UsageStats {
  totalCalls: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  estimatedCost: number;
  lastUpdated: string;
}

interface ProviderUsageStats {
  provider: LLMProvider;
  model: string;
  calls: number;
  inputTokens: number;
  outputTokens: number;
  cost: number;
  lastUsed: string;
}
```

### 3. AI Settings Service

**Location**: `src/services/aiSettingsService.ts` (new)

**Purpose**: Manage AI provider preferences and API keys

**Methods**:
```typescript
class AISettingsService {
  // Provider management
  getProviderConfig(): AIProviderConfig | null;
  setProviderConfig(config: AIProviderConfig): void;
  
  // LLM provider management
  getCustomLLMConfig(): CustomLLMConfig | null;
  setCustomLLMConfig(config: CustomLLMConfig): void;
  removeCustomLLMConfig(): void;
  getMaskedApiKey(provider: LLMProvider): string | null;
  
  // Model management
  getAvailableModels(provider: LLMProvider): string[];
  getDefaultModel(provider: LLMProvider): string;
  
  // Validation
  validateApiKey(provider: LLMProvider, key: string): boolean;
  testProviderConnection(config: CustomLLMConfig): Promise<boolean>;
}
```

**Storage Keys**:
- `ai_provider_config`: Current AI provider configuration
- `custom_llm_configs`: Stored API keys and settings for each LLM provider
- `provider_preferences`: User preferences for models and settings

### 4. Cost Tracking Service

**Location**: `src/services/costTrackingService.ts` (new)

**Purpose**: Track API usage and calculate costs **ONLY for custom API keys**

**Important**: 
- Chrome AI (built-in): **No tracking needed** - runs offline locally
- Shared Gemini API: **Track daily usage only** - rate limited to 10 requests/day
- Custom API Key: **Track usage and costs** - user pays per token

**Methods**:
```typescript
class CostTrackingService {
  // Usage tracking (for all custom providers)
  recordApiCall(provider: LLMProvider, model: string, inputTokens: number, outputTokens: number): void;
  getUsageStats(): UsageStats | null;
  getProviderStats(provider: LLMProvider): ProviderUsageStats | null;
  resetUsageStats(provider?: LLMProvider): void;
  
  // Cost calculation with provider-specific pricing
  calculateCost(provider: LLMProvider, model: string, inputTokens: number, outputTokens: number): number;
  getTotalCost(): number;
  getProviderCost(provider: LLMProvider): number;
  
  // Pricing management
  getPricingModel(provider: LLMProvider, model: string): PricingModel;
  updatePricingModel(provider: LLMProvider, model: string, pricing: PricingModel): void;
  
  // Check if tracking is active
  isTrackingEnabled(): boolean; // Returns true for any custom provider
}
```

**Provider Pricing Models** (as of 2024):
- **OpenAI GPT-4**: Input $0.03/1K, Output $0.06/1K tokens
- **OpenAI GPT-3.5**: Input $0.0015/1K, Output $0.002/1K tokens  
- **Anthropic Claude 3.5**: Input $0.003/1K, Output $0.015/1K tokens
- **Google Gemini Pro**: Input $0.00025/1K, Output $0.0005/1K tokens
- **Cohere Command**: Input $0.0015/1K, Output $0.002/1K tokens
- **Note**: Pricing automatically updated and configurable per provider

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

**Storage Key**: `api_usage_stats` (only exists when using custom API key)

### 5. Unified AI Service with Vercel AI SDK

**Location**: `src/lib/ai-service.ts` (major refactor)

**Changes**:
- Integrate Vercel AI SDK for custom LLM providers only
- MAINTAIN existing Chrome AI and Shared Gemini implementations (no changes to chrome-ai.ts or gemini-ai.ts)
- ADD support for custom providers via Vercel AI SDK
- Consistent symptom analysis across all providers
- Automatic token usage tracking and cost calculation for custom providers only

**New Interface**:
```typescript
interface AIServiceConfig {
  providerType: AIProviderType;
  customLLMConfig?: CustomLLMConfig;
}

interface AIResponse {
  success: boolean;
  data: SymptomAnalysisResult;
  usage?: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
  provider: string;
  model: string;
}
```

**Implementation**:
```typescript
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';

class AIService {
  private getModel(config: CustomLLMConfig) {
    switch (config.provider) {
      case 'openai':
        return openai(config.model, { apiKey: config.apiKey });
      case 'anthropic':
        return anthropic(config.model, { apiKey: config.apiKey });
      case 'google':
        return google(config.model, { apiKey: config.apiKey });
      // ... other providers
    }
  }
}
```

### 6. Provider Adapters

**Location**: `src/lib/providers/` (new directory)

**Files**:
- `openai.ts`: OpenAI provider configuration and models
- `anthropic.ts`: Anthropic provider configuration and models  
- `google.ts`: Google provider configuration and models
- `cohere.ts`: Cohere provider configuration and models
- `mistral.ts`: Mistral provider configuration and models
- `index.ts`: Unified provider registry and utilities

## Rate Limiting and Cost Protection

**Shared Gemini API Rate Limiting**:

Implement client-side rate limiting for shared API:

| Provider | Rate Limit | Tracking | Reason |
|----------|------------|----------|--------|
| **Chrome AI** | ❌ None | ❌ No | Runs locally offline |
| **Shared Gemini API** | ✅ 10/day | ✅ Yes | Prevent abuse of shared resource |
| **Custom API Key** | ❌ None | ✅ Yes (cost) | User manages their own usage |

**Rate Limit Implementation**:
```typescript
interface RateLimitData {
  count: number;
  resetTime: string; // ISO timestamp
  deviceId: string;
}

// Check rate limit before API call
if (currentProvider === 'gemini-shared') {
  const rateLimitData = getRateLimitData();
  
  if (rateLimitData.count >= 10 && !isResetTimeExpired(rateLimitData.resetTime)) {
    throw new RateLimitError(
      'Daily limit reached (10 requests). Try Chrome AI (offline) or add your own API key for more usage.',
      rateLimitData.resetTime
    );
  }
  
  // Increment counter after successful call
  incrementRateLimitCounter();
}

// Only track cost when using custom API key
if (currentProvider === 'gemini-custom' && customApiKey) {
  costTrackingService.recordApiCall(inputTokens, outputTokens);
}
```

**Storage**:
```typescript
// LocalStorage key: whenimsick_rate_limit
{
  "count": 7,
  "resetTime": "2024-12-03T00:00:00Z",
  "deviceId": "device-abc"
}
```

**User Experience**:
- Show remaining requests in Settings page
- Clear error message when limit reached
- Suggest alternatives (Chrome AI or custom key)
- Auto-reset at midnight UTC

## Data Models

### AI Provider Configuration

```typescript
type AIProviderType = 'chrome' | 'gemini-shared' | 'custom-llm';
type LLMProvider = 'openai' | 'anthropic' | 'google' | 'cohere' | 'mistral';

interface AIProviderConfig {
  type: AIProviderType;
  customLLM?: CustomLLMConfig;
  lastUpdated: string;
}

interface CustomLLMConfig {
  provider: LLMProvider;
  model: string;
  apiKey: string;
  baseUrl?: string; // For custom endpoints
}

interface PricingModel {
  inputCostPer1K: number;
  outputCostPer1K: number;
  currency: string;
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
  byProvider: Record<LLMProvider, ProviderUsageStats>;
}

interface ProviderUsageStats {
  provider: LLMProvider;
  model: string;
  calls: number;
  inputTokens: number;
  outputTokens: number;
  cost: number;
  lastUsed: string;
}

interface UsageHistoryEntry {
  timestamp: string;
  provider: LLMProvider;
  model: string;
  inputTokens: number;
  outputTokens: number;
  cost: number;
  episodeId?: string;
  entryId?: string;
}
```

### Provider Validation

```typescript
interface ProviderValidation {
  isValid: boolean;
  error?: string;
  availableModels?: string[];
  defaultModel?: string;
}

interface ModelInfo {
  id: string;
  name: string;
  description: string;
  contextLength: number;
  pricing: PricingModel;
}
```

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
- **Provider Unavailable**: "[provider name] is not available on this device."

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

## Testing Strategy

### Unit Tests
- AI Settings Service methods
- Cost Tracking Service calculations
- API key validation logic
- Rate limiting implementation

### Integration Tests
- Provider switching workflows
- API key management flows
- Cost tracking accuracy
- Error handling scenarios

### Manual Testing
- Three-provider setup flow
- Settings page functionality
- Usage statistics display
- Rate limiting enforcement

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