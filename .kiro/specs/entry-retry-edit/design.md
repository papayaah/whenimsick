# Design Document

## Overview

The Entry Retry/Edit feature enables users to modify existing symptom entries and retry AI analysis to get updated health insights. This feature addresses the need for users to correct mistakes, add forgotten symptoms, or update their symptom tracking data while maintaining the integrity of episode progression and timeline analysis.

The system will provide an intuitive editing interface that preserves data relationships and automatically reconciles subsequent entries when changes affect episode progression context. This ensures that all AI analysis remains accurate and reflects the updated symptom timeline.

## Architecture

The feature extends the existing episode management system with new editing capabilities while leveraging the current AI service, storage service, and episode service infrastructure. The architecture follows the established service layer pattern with clear separation of concerns.

### Core Components

1. **Entry Edit Service** - Manages entry modifications and validation
2. **Reconciliation Service** - Handles cascading updates to subsequent entries
3. **Edit UI Components** - Provides user interface for editing entries
4. **Validation Layer** - Ensures data integrity during modifications

### Integration Points

- **Episode Service** - For episode reassignment and progression analysis
- **AI Service** - For retry analysis and reconciliation
- **Storage Service** - For persisting entry modifications
- **Glossary Service** - For updating medical terms from retry analysis

## Components and Interfaces

### Extended EpisodeService

```typescript
// Reuse existing EpisodeService with new methods
class EpisodeService {
  // New methods for editing (reuse existing patterns)
  async updateSymptomEntry(entryId: string, updates: Partial<CreateSymptomEntryParams>): Promise<SymptomEntry>
  async retryEntryAnalysis(entryId: string): Promise<SymptomEntry>
  async deleteSymptomEntry(entryId: string): Promise<void>
  
  // Reuse existing reconciliation patterns
  async reconcileEpisodeAfterEntryChange(episodeId: string, fromDate: string): Promise<void>
}

// Reuse existing result types
// EpisodeCreationResult already handles episode changes
// No need for new EditResult interface
```

### Edit UI Components

```typescript
// Entry edit form component
interface EntryEditFormProps {
  entry: SymptomEntry
  episode: Episode
  onSave: (updates: Partial<SymptomEntry>) => Promise<void>
  onCancel: () => void
  onRetryAnalysis: () => Promise<void>
}

// Edit button component for entry views
interface EntryEditButtonProps {
  entry: SymptomEntry
  onEdit: (entry: SymptomEntry) => void
  disabled?: boolean
}
```

### Minimal Entry Extensions

```typescript
// Extend existing SymptomEntry with minimal tracking
interface SymptomEntry {
  // ... existing fields (no changes needed)
  // Use existing updatedAt field to track modifications
  // Use existing createdAt vs updatedAt comparison to detect edits
}

// Reuse existing CreateSymptomEntryParams for updates
// No need for new EntryEditRequest interface
```

## Data Models

### Entry Modification Tracking

The system will track entry modifications using existing fields:

- Use existing `updatedAt` field - when different from `createdAt`, indicates modification
- No need for additional `isModified` field - derive from timestamp comparison
- No need for modification history - keep it simple with just last modified timestamp

### Episode Reassignment Data

When entries change dates and potentially move episodes:

- Reuse existing `determineEpisodeForEntry` logic
- Reuse existing episode count management from `incrementEntryCount`
- Reuse existing episode summary updates from `updateEpisodeSummaryFromAnalysis`

### Reconciliation State

For tracking bulk reanalysis operations:

- Reuse existing episode progression analysis patterns
- Simple progress feedback (no complex state tracking needed initially)
- Leverage existing error handling patterns from AI service

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After reviewing all identified properties, several can be consolidated to eliminate redundancy:

- Properties 1.4 and 3.3 both test timestamp handling and can be combined
- Properties 2.4 and 6.4 both test episode summary updates and can be combined  
- Properties 5.2 and 8.1 both test entry count updates and can be combined
- Properties 6.2 and 8.3 both test subsequent entry reanalysis and can be combined

### Core Edit Properties

**Property 1: Entry edit form population**
*For any* existing entry, when the edit option is clicked, the system should present a form pre-populated with all current entry data including symptoms, notes, severity, and date
**Validates: Requirements 1.1, 1.2**

**Property 2: Entry data persistence**
*For any* entry modification, when saved, the system should update the entry with the new information while preserving the original creation timestamp and updating the modification timestamp
**Validates: Requirements 1.3, 1.4, 3.3**

**Property 3: Timeline position maintenance**
*For any* entry edit, the entry should maintain its correct chronological position in the episode timeline based on its date
**Validates: Requirements 1.5**

### Analysis Retry Properties

**Property 4: Analysis retry execution**
*For any* entry retry request, the system should re-run AI analysis using the current entry data and the same episode context as the original analysis
**Validates: Requirements 2.1, 2.3**

**Property 5: Analysis replacement**
*For any* successful analysis retry, the system should replace the previous analysis results with the new analysis while preserving the entry structure
**Validates: Requirements 2.2**

**Property 6: Episode summary updates**
*For any* entry modification that changes analysis results, the system should update episode-level summaries and titles based on the new insights
**Validates: Requirements 2.4, 6.4**

**Property 7: Glossary integration**
*For any* completed analysis retry, the system should save new medical terms to the glossary service with proper episode context
**Validates: Requirements 2.5**

### Modification Tracking Properties

**Property 8: Modification indicators**
*For any* modified entry, the system should display visual indicators and show both creation and modification timestamps when they differ
**Validates: Requirements 3.1, 3.2**

**Property 9: Data integrity preservation**
*For any* entry modification, the system should preserve the original entry ID and episode association
**Validates: Requirements 3.5**

### Field Modification Properties

**Property 10: Comprehensive field editing**
*For any* entry edit operation, the system should allow modification of symptoms, notes, severity ratings, and date with proper validation
**Validates: Requirements 4.1, 4.2, 4.3, 4.4**

**Property 11: Episode reassignment logic**
*For any* entry date change, the system should re-evaluate episode assignment using the same logic as new entries and handle episode moves correctly
**Validates: Requirements 4.5, 5.1**

### Episode Management Properties

**Property 12: Episode count maintenance**
*For any* entry that moves between episodes or is deleted, the system should update entry counts for all affected episodes
**Validates: Requirements 5.2, 8.1**

**Property 13: Cross-episode updates**
*For any* entry move between episodes, the system should trigger reanalysis of episode summaries for both source and destination episodes while preserving entry data
**Validates: Requirements 5.3, 5.4**

**Property 14: Episode progression continuity**
*For any* entry that remains in the same episode after date change, the system should maintain the episode's progression analysis continuity
**Validates: Requirements 5.5**

### Reconciliation Properties

**Property 15: Subsequent entry identification**
*For any* entry edit with symptom changes, the system should correctly identify all subsequent entries in the same episode that need reanalysis
**Validates: Requirements 6.1**

**Property 16: Chronological reanalysis**
*For any* reconciliation operation, the system should process subsequent entries in chronological order using updated episode progression context
**Validates: Requirements 6.2, 6.3, 8.3**

**Property 17: Reconciliation feedback**
*For any* reconciliation affecting multiple entries, the system should provide user feedback about reanalysis progress and completion
**Validates: Requirements 6.5**

### Error Handling Properties

**Property 18: Input validation**
*For any* entry edit attempt, the system should validate all input data before saving and display specific error messages for validation failures
**Validates: Requirements 7.1, 7.5**

**Property 19: Analysis failure handling**
*For any* AI analysis failure during retry, the system should preserve the previous analysis and notify the user without corrupting data
**Validates: Requirements 7.2**

**Property 20: Storage error resilience**
*For any* network or storage error during editing, the system should maintain data consistency and provide appropriate error feedback
**Validates: Requirements 7.3**

### Deletion Properties

**Property 21: Deletion reconciliation**
*For any* entry deletion, the system should identify and reanalyze all subsequent entries in the episode using the updated timeline
**Validates: Requirements 8.2, 8.3**

**Property 22: Episode maintenance after deletion**
*For any* entry deletion, the system should update episode summaries and handle special cases like first entry deletion by updating start dates or deleting empty episodes
**Validates: Requirements 8.4, 8.5**

## Error Handling

### Validation Errors
- Invalid date formats or future dates
- Empty or invalid symptom selections
- Notes exceeding character limits
- Severity ratings for non-applicable symptoms

### AI Service Errors
- Network failures during analysis retry
- AI service unavailability
- Analysis timeout or rate limiting
- Malformed AI responses

### Storage Errors
- LocalStorage quota exceeded
- Concurrent modification conflicts
- Data corruption detection
- Rollback mechanisms for failed operations

### Reconciliation Errors
- Partial failure during bulk reanalysis
- Episode reassignment conflicts
- Timeline inconsistencies
- Progress tracking failures

## Testing Strategy

### Dual Testing Approach

The testing strategy employs both unit testing and property-based testing to ensure comprehensive coverage:

**Unit Tests:**
- Specific examples of entry editing workflows
- Error condition handling scenarios
- UI component behavior verification
- Integration points between services

**Property-Based Tests:**
- Universal properties across all entry modifications using **fast-check** library
- Each property-based test configured to run minimum 100 iterations
- Comprehensive input space coverage through smart generators

### Property-Based Testing Requirements

- **Library**: fast-check for TypeScript/JavaScript property-based testing
- **Iterations**: Minimum 100 iterations per property test
- **Tagging**: Each property-based test tagged with format: `**Feature: entry-retry-edit, Property {number}: {property_text}**`
- **Coverage**: Each correctness property implemented by a single property-based test
- **Generators**: Smart generators that create realistic entry data, episode contexts, and modification scenarios

### Test Categories

1. **Entry Modification Tests** - Verify edit operations preserve data integrity
2. **Analysis Retry Tests** - Ensure AI analysis retry works correctly
3. **Reconciliation Tests** - Validate cascading updates to subsequent entries
4. **Episode Management Tests** - Verify episode reassignment and count updates
5. **Error Handling Tests** - Ensure graceful failure handling
6. **UI Integration Tests** - Verify edit interface behavior

The combination of unit and property tests provides comprehensive coverage: unit tests catch specific bugs and verify concrete examples, while property tests verify general correctness across the entire input space.