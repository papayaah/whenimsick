# Capy Context-Aware Messaging System

This document outlines all the different contexts where Capy (the capybara mascot) provides contextual messages to users.

## Context Detection

Capy's context is determined by:
1. **Current Page** (`appState.currentPage`): `tracker`, `episodes`, or `glossary`
2. **App State** (`appState`): symptom selection, analysis status, results status
3. **User Actions**: symptom selection, analysis triggers, navigation

## Animation Segments & Speech Bubble Rules

### Segment Types:
- **wake** (0.0-4.0s): Initial wake-up animation
- **waving** (4.0-7.25s): Waving animation after wake-up
- **chat** (4.0-12.0s): Normal chatting pose - shows speech bubbles
- **analyzing** (13.0-19.25s): Thinking/analyzing pose - **NO speech bubbles**
- **idle** (20.0-24.0s): Idle pose - **NO speech bubbles**
- **eat** (24.25-29.0s): Eating animation - **NO speech bubbles**
- **result** (29.5-33.0s): Results pose - shows speech bubbles

### Speech Bubble Suppression:
Speech bubbles are **hidden** during:
- `analyzing` segment (when AI is processing)
- `idle` segment (when Capy is idle)
- `eat` segment (when Capy is eating)
- Any time `appState.isAnalyzing === true`

### Animation Flow:
1. **App Start/Reload**: **wake** → **waving** → **chat** or **idle** (depending on context)
2. **Has Something to Say**: **chat** (loops with speech bubbles)
3. **Has Nothing to Say**: **idle** (70% chance, loops) or **eat** (30% chance, then returns to idle/chat)
4. **Analyzing**: **analyzing** (no speech bubbles)
5. **Results**: **result** (shows once, no speech bubbles, holds last frame)
6. **Navigation Away from Results**: Restarts entire cycle with **wake** → **waving** → **chat**/idle/eat

### Speech Bubble Logic:
- **Shows bubbles**: When Capy has something meaningful to say (symptoms selected, on specific pages)
- **Hides bubbles**: During idle, eat, analyzing, result, or when Capy has nothing relevant to communicate

### Result Segment Behavior:
- **Shows once**: No looping, displays the result animation once
- **No speech bubbles**: Capy doesn't talk during results
- **Holds last frame**: Stays on the last frame of the result animation
- **Cycle restart**: When user navigates away, restarts with wake → waving → chat/idle/eat

## Context List & Prompts

### 1. **Symptom Tracker Page** (`/` - `tracker`)

#### A. Initial State (No Symptoms Selected)
- **Trigger**: `currentPage === 'tracker'` + `hasSelectedSymptoms === false`
- **AI Prompt**: Welcome message for first-time app users
- **Fallback Messages**:
  - "Hey! I'm Capy, your health buddy!"
  - "Welcome! Let's track symptoms!"
  - "Hi! Ready to check in?"
  - "Heyyy! Capy here!"
  - "Hello! I'm here to help!"
  - "Yo! Let's see how you're doing!"

#### B. Has Selected Symptoms (Pre-Analysis)
- **Trigger**: `currentPage === 'tracker'` + `hasSelectedSymptoms === true` + `isAnalyzing === false`
- **AI Prompt**: Guidance about adding severity details or analyzing
- **Fallback Messages**:
  - "Nice! Ready to analyze X symptom(s)?"
  - "Got X logged! Hit analyze when ready!"
  - "Awesome! Add details or analyze now!"
  - "Looking good! Ready to analyze?"
  - "Perfect! Analyze or add more details!"
  - "Sweet! Click analyze when ready!"

#### C. Analyzing Symptoms
- **Trigger**: `isAnalyzing === true`
- **AI Prompt**: Encouraging messages during AI analysis with doctor capybara humor
- **Fallback Messages**:
  - "Let me put on my tiny doctor glasses!"
  - "Capy brain activated!"
  - "Time to be a medical capybara!"
  - "Working my capy magic!"
  - "Putting on my lab coat!"
  - "Analyzing like a pro!"

#### D. Has Results (Post-Analysis)
- **Trigger**: `hasResults === true`
- **AI Prompt**: Encouraging messages about taking care of themselves
- **Fallback Messages**:
  - "Great job tracking your health!"
  - "You've got this!"
  - "You're doing awesome!"
  - "Hope you feel better soon!"
  - "Keep it up!"
  - "Self-care champion!"

### 2. **Episodes Page** (`/episodes` - `episodes`)

#### A. Viewing Episodes
- **Trigger**: `currentPage === 'episodes'`
- **AI Prompt**: Supportive messages about reviewing health history
- **Fallback Messages**:
  - "Looking at your health history?"
  - "Great job tracking episodes!"
  - "Reviewing your health journey?"
  - "Past episodes teach us a lot!"
  - "Staying on top of health tracking!"
  - "Looking back helps us look forward!"

### 3. **Glossary Page** (`/glossary` - `glossary`)

#### A. Browsing Glossary
- **Trigger**: `currentPage === 'glossary'`
- **AI Prompt**: Encouraging messages about learning health terms
- **Fallback Messages**:
  - "Learning health terms?"
  - "Exploring the glossary?"
  - "Curious about symptoms?"
  - "Becoming a health advocate!"
  - "Smart move reading up!"
  - "Knowledge is power!"

## Message Generation Logic

1. **AI Generation**: 50% chance of using AI-generated messages
2. **Fallback Messages**: 50% chance of using predefined messages
3. **Message Length**: All messages are limited to ONE sentence maximum (very short and concise)
4. **No Emojis**: All messages are stripped of emojis and emoticons
5. **Reading Time**: Auto-calculated based on word/character count (2-8 seconds)
6. **Focus**: Keep responses brief and to the point - Cappy should be supportive but not verbose

## Adding New Contexts

To add a new context:

1. **Add to FloatingNavigation**: Update `getActiveTab()` function if new page
2. **Add to CappyChat**: Add new `else if` condition in `generateCapyMessage()`
3. **Update this file**: Document the new context with trigger conditions and messages
4. **Test**: Verify messages appear correctly on the new page

## Message Guidelines

- **Tone**: Friendly, supportive, slightly playful
- **Length**: ONE sentence maximum (very short and concise)
- **Purpose**: Contextual guidance and encouragement
- **Consistency**: Always positive and helpful
- **Variety**: Multiple fallback messages to avoid repetition
- **Focus**: Keep responses brief and to the point - Cappy should be supportive but not verbose
