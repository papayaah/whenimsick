# Requirements Document

## Introduction

This feature adds a landing page to introduce new users to When I'm Sick and moves the symptom tracker to a dedicated `/app` route. The landing page provides an overview of the application's features and includes an interactive demo.

## Glossary

- **Landing Page**: The initial page users see when first visiting the application, providing an overview and call-to-action
- **Symptom Tracker**: The main application functionality for tracking symptoms and getting AI analysis
- **Demo Simulation**: An interactive preview of the symptom tracking functionality using pre-generated sample data
- **Episode View**: A mockup showing how the app tracks symptoms over multiple days with timeline and trend analysis

## Requirements

### Requirement 1

**User Story:** As a new visitor, I want to see a landing page that explains what When I'm Sick does, so that I can understand the value proposition before using the app.

#### Acceptance Criteria

1. WHEN a user visits the root URL, THE system SHALL display a landing page with product overview
2. WHEN the landing page is displayed, THE system SHALL show key features including symptom tracking, AI analysis, episode tracking, and privacy-first design
3. WHEN the landing page is displayed, THE system SHALL provide a prominent call-to-action button to begin using the app
4. WHEN a user clicks the call-to-action button, THE system SHALL navigate to the AI setup page
5. WHEN the symptom tracker is accessed, THE system SHALL serve it at the `/app` route
6. WHEN the landing page loads, THE system SHALL achieve a Cumulative Layout Shift (CLS) score of 0 by reserving space for all content
7. WHEN the landing page loads, THE system SHALL achieve Largest Contentful Paint (LCP) under 2.5 seconds
8. WHEN images are loaded, THE system SHALL use Next.js Image component with explicit width and height to prevent layout shifts