# Requirements Document

## Introduction

This feature enables users to edit and retry existing symptom entries within episodes to update their symptom tracking data and receive fresh AI analysis. Users can modify symptoms, notes, severity ratings, and dates for existing entries, triggering new AI analysis while preserving the original entry's context within the episode timeline.

## Glossary

- **Entry**: A single symptom tracking record containing symptoms, notes, severity, date, and AI analysis
- **Episode**: A collection of related symptom entries representing a single illness period
- **Retry**: The process of re-running AI analysis on an entry with modified or unchanged data
- **Edit Mode**: A UI state that allows modification of entry data before retrying analysis
- **AI Analysis**: The automated health insights generated from symptom data including severity assessment, recommendations, and medical information
- **Entry Timeline**: The chronological sequence of entries within an episode

## Requirements

### Requirement 1

**User Story:** As a user tracking my symptoms, I want to edit existing entries in my episodes, so that I can correct mistakes or add forgotten symptoms and get updated analysis.

#### Acceptance Criteria

1. WHEN a user views an existing entry THEN the system SHALL display an edit button or option to modify the entry
2. WHEN a user clicks the edit option THEN the system SHALL present an editable form pre-populated with the current entry data
3. WHEN a user modifies entry data and saves THEN the system SHALL update the entry with the new information
4. WHEN an entry is updated THEN the system SHALL preserve the original creation timestamp while updating the modification timestamp
5. WHEN an entry is edited THEN the system SHALL maintain the entry's position in the episode timeline based on its date

### Requirement 2

**User Story:** As a user who wants accurate health insights, I want to retry AI analysis on existing entries, so that I can get fresh analysis based on corrected or updated symptom information.

#### Acceptance Criteria

1. WHEN a user requests to retry analysis on an entry THEN the system SHALL re-run the AI analysis using the current entry data
2. WHEN AI analysis is retried THEN the system SHALL replace the previous analysis results with the new analysis
3. WHEN analysis is retried THEN the system SHALL use the same episode context and progression data as the original analysis
4. WHEN retrying analysis THEN the system SHALL update episode-level summaries and titles if the AI provides new insights
5. WHEN analysis retry completes THEN the system SHALL save the updated medical terms to the glossary service

### Requirement 3

**User Story:** As a user managing my health data, I want to see when entries have been modified, so that I can track the history of my symptom reporting.

#### Acceptance Criteria

1. WHEN an entry has been modified THEN the system SHALL display a visual indicator showing the entry was edited
2. WHEN displaying entry timestamps THEN the system SHALL show both creation date and last modified date if different
3. WHEN an entry is edited multiple times THEN the system SHALL track the most recent modification timestamp
4. WHEN viewing entry details THEN the system SHALL clearly distinguish between original and modified data presentation
5. WHEN an entry is modified THEN the system SHALL preserve the original entry ID and episode association

### Requirement 4

**User Story:** As a user correcting my symptom data, I want to modify all aspects of an entry including symptoms, notes, severity, and date, so that I can ensure my health tracking is accurate.

#### Acceptance Criteria

1. WHEN editing an entry THEN the system SHALL allow modification of the symptom selection
2. WHEN editing an entry THEN the system SHALL allow modification of the notes text
3. WHEN editing an entry THEN the system SHALL allow modification of the severity ratings for applicable symptoms
4. WHEN editing an entry THEN the system SHALL allow modification of the entry date
5. WHEN the entry date is changed THEN the system SHALL validate the new date and potentially reassign the entry to a different episode if needed

### Requirement 5

**User Story:** As a user tracking episode progression, I want edited entries to maintain proper episode relationships, so that my illness timeline remains coherent and accurate.

#### Acceptance Criteria

1. WHEN an entry date is changed THEN the system SHALL re-evaluate episode assignment using the same logic as new entries
2. WHEN an entry moves to a different episode THEN the system SHALL update entry counts for both source and destination episodes
3. WHEN an entry is moved between episodes THEN the system SHALL trigger reanalysis of episode summaries for affected episodes
4. WHEN episode assignment changes THEN the system SHALL preserve the entry's analysis history and modification timestamps
5. WHEN an entry remains in the same episode after date change THEN the system SHALL maintain the episode's progression analysis continuity

### Requirement 6

**User Story:** As a user who needs accurate episode progression tracking, I want the system to reconcile subsequent entries when I edit an entry, so that all analysis reflects the updated episode timeline and symptom progression.

#### Acceptance Criteria

1. WHEN an entry is edited with symptom changes THEN the system SHALL identify all subsequent entries in the same episode that need reanalysis
2. WHEN subsequent entries require reanalysis THEN the system SHALL re-run AI analysis for each affected entry using the updated episode progression context
3. WHEN reconciling subsequent entries THEN the system SHALL process them in chronological order to maintain proper progression analysis
4. WHEN reanalysis of subsequent entries completes THEN the system SHALL update episode-level summaries and trends based on the new progression data
5. WHEN reconciliation affects multiple entries THEN the system SHALL provide user feedback about the reanalysis progress and completion

### Requirement 7

**User Story:** As a user who values data integrity, I want the system to handle edit operations safely, so that I don't lose my health data due to errors or conflicts.

#### Acceptance Criteria

1. WHEN editing an entry THEN the system SHALL validate all input data before saving changes
2. WHEN AI analysis fails during retry THEN the system SHALL preserve the previous analysis and notify the user of the failure
3. WHEN network or storage errors occur during editing THEN the system SHALL maintain data consistency and provide error feedback
4. WHEN multiple edit operations are attempted simultaneously THEN the system SHALL handle conflicts gracefully
5. WHEN validation fails THEN the system SHALL display specific error messages and allow the user to correct the issues

### Requirement 8

**User Story:** As a user managing complex episode data, I want the system to handle entry deletion and its impact on episode progression, so that removing incorrect entries maintains accurate episode analysis.

#### Acceptance Criteria

1. WHEN a user deletes an entry from an episode THEN the system SHALL remove the entry from storage and update the episode entry count
2. WHEN an entry is deleted THEN the system SHALL identify all subsequent entries in the episode that need reanalysis due to changed progression context
3. WHEN subsequent entries require reanalysis after deletion THEN the system SHALL re-run AI analysis using the updated episode timeline
4. WHEN entry deletion affects episode progression THEN the system SHALL update episode summaries and trends to reflect the new timeline
5. WHEN deleting the first entry in an episode THEN the system SHALL update the episode start date to the next earliest entry or delete the episode if no entries remain