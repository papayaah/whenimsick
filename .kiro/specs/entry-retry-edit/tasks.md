# Implementation Plan

- [ ] 1. Prepare for entry editing (minimal changes)
  - No new interfaces needed - reuse existing SymptomEntry and CreateSymptomEntryParams
  - Use existing createdAt vs updatedAt comparison to detect modifications
  - Reuse existing EpisodeCreationResult for episode changes
  - _Requirements: 3.1, 3.2, 3.3, 3.5_

- [ ]* 1.1 Write property test for modification tracking
  - **Property 8: Modification indicators**
  - **Validates: Requirements 3.1, 3.2**

- [ ]* 1.2 Write property test for data integrity preservation
  - **Property 9: Data integrity preservation**
  - **Validates: Requirements 3.5**

- [ ] 2. Extend EpisodeService with editing operations
  - Add updateSymptomEntry method (reuse existing patterns)
  - Add retryEntryAnalysis method for AI analysis retry
  - Add deleteSymptomEntry method with reconciliation
  - Reuse existing validation patterns from createSymptomEntry
  - _Requirements: 1.3, 2.1, 2.2, 7.1, 8.1_

- [ ]* 2.1 Write property test for entry data persistence
  - **Property 2: Entry data persistence**
  - **Validates: Requirements 1.3, 1.4, 3.3**

- [ ]* 2.2 Write property test for analysis retry execution
  - **Property 4: Analysis retry execution**
  - **Validates: Requirements 2.1, 2.3**

- [ ]* 2.3 Write property test for analysis replacement
  - **Property 5: Analysis replacement**
  - **Validates: Requirements 2.2**

- [ ]* 2.4 Write property test for input validation
  - **Property 18: Input validation**
  - **Validates: Requirements 7.1, 7.5**

- [ ] 3. Add reconciliation logic to EpisodeService
  - Add reconcileEpisodeAfterEntryChange method (reuse existing progression analysis)
  - Reuse existing getSymptomEntriesByEpisode for identifying affected entries
  - Reuse existing analyzeEpisodeProgression for context updates
  - Add simple progress feedback for bulk operations
  - _Requirements: 6.1, 6.2, 6.3, 6.5_

- [ ]* 3.1 Write property test for subsequent entry identification
  - **Property 15: Subsequent entry identification**
  - **Validates: Requirements 6.1**

- [ ]* 3.2 Write property test for chronological reanalysis
  - **Property 16: Chronological reanalysis**
  - **Validates: Requirements 6.2, 6.3, 8.3**

- [ ]* 3.3 Write property test for reconciliation feedback
  - **Property 17: Reconciliation feedback**
  - **Validates: Requirements 6.5**

- [ ] 4. Add episode reassignment logic to EpisodeService
  - Implement episode reassignment logic for date changes (reuse determineEpisodeForEntry)
  - Add episode count maintenance for entry moves
  - Create episode summary update triggers (reuse existing update methods)
  - _Requirements: 4.5, 5.1, 5.2, 5.3, 2.4_

- [ ]* 4.1 Write property test for episode reassignment logic
  - **Property 11: Episode reassignment logic**
  - **Validates: Requirements 4.5, 5.1**

- [ ]* 4.2 Write property test for episode count maintenance
  - **Property 12: Episode count maintenance**
  - **Validates: Requirements 5.2, 8.1**

- [ ]* 4.3 Write property test for cross-episode updates
  - **Property 13: Cross-episode updates**
  - **Validates: Requirements 5.3, 5.4**

- [ ]* 4.4 Write property test for episode summary updates
  - **Property 6: Episode summary updates**
  - **Validates: Requirements 2.4, 6.4**

- [ ] 5. Create EntryEditForm component
  - Build editable form with symptom selector integration
  - Add date picker for entry date modification
  - Implement notes and severity editing
  - Add save/cancel/retry analysis buttons
  - _Requirements: 1.1, 1.2, 4.1, 4.2, 4.3, 4.4_

- [ ]* 5.1 Write property test for entry edit form population
  - **Property 1: Entry edit form population**
  - **Validates: Requirements 1.1, 1.2**

- [ ]* 5.2 Write property test for comprehensive field editing
  - **Property 10: Comprehensive field editing**
  - **Validates: Requirements 4.1, 4.2, 4.3, 4.4**

- [ ] 6. Add edit buttons to existing entry display components
  - Modify EntryDetail component to include edit button
  - Update TimelineItem component with edit option
  - Add edit functionality to episode entry lists
  - Implement edit mode state management
  - _Requirements: 1.1_

- [ ] 7. Implement error handling and validation
  - Add comprehensive input validation
  - Create error handling for AI service failures
  - Implement storage error resilience
  - Add user feedback for validation failures
  - _Requirements: 7.1, 7.2, 7.3, 7.5_

- [ ]* 7.1 Write property test for analysis failure handling
  - **Property 19: Analysis failure handling**
  - **Validates: Requirements 7.2**

- [ ]* 7.2 Write property test for storage error resilience
  - **Property 20: Storage error resilience**
  - **Validates: Requirements 7.3**

- [ ] 8. Add entry deletion functionality
  - Implement delete entry UI controls
  - Add confirmation dialogs for deletion
  - Create deletion reconciliation logic
  - Handle episode maintenance after deletion
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ]* 8.1 Write property test for deletion reconciliation
  - **Property 21: Deletion reconciliation**
  - **Validates: Requirements 8.2, 8.3**

- [ ]* 8.2 Write property test for episode maintenance after deletion
  - **Property 22: Episode maintenance after deletion**
  - **Validates: Requirements 8.4, 8.5**

- [ ] 9. Integrate with existing services (minimal changes)
  - Reuse existing aiService.analyzeSymptoms for retry analysis
  - Reuse existing glossaryService.addTerms for new medical terms
  - Reuse existing storageService.setItem for entry updates
  - Reuse existing invalidateEpisodesCache for cache management
  - _Requirements: 2.5_

- [ ]* 9.1 Write property test for glossary integration
  - **Property 7: Glossary integration**
  - **Validates: Requirements 2.5**

- [ ] 10. Add visual indicators for modified entries
  - Show "edited" badge when createdAt !== updatedAt
  - Display both creation and modification timestamps
  - Reuse existing timeline sorting logic for position maintenance
  - Keep modification tracking simple (just timestamps)
  - _Requirements: 3.1, 3.2, 1.5_

- [ ]* 10.1 Write property test for timeline position maintenance
  - **Property 3: Timeline position maintenance**
  - **Validates: Requirements 1.5**

- [ ]* 10.2 Write property test for episode progression continuity
  - **Property 14: Episode progression continuity**
  - **Validates: Requirements 5.5**

- [ ] 11. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 12. Add loading states and progress indicators
  - Implement loading states for edit operations
  - Add progress indicators for reconciliation
  - Create user feedback for bulk operations
  - Add confirmation dialogs for destructive actions
  - _Requirements: 6.5_

- [ ] 13. Final integration and testing
  - Test edit functionality across all entry views
  - Verify reconciliation works with complex episode scenarios
  - Test error handling with various failure conditions
  - Validate UI responsiveness during bulk operations
  - _Requirements: All_

- [ ] 14. Final Checkpoint - Make sure all tests are passing
  - Ensure all tests pass, ask the user if questions arise.