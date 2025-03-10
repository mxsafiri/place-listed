# PlaceListed Architecture

This document outlines the architecture of the PlaceListed platform.

## System Overview

PlaceListed is a business discovery platform for small and SME businesses, helping them become digitally discoverable without needing a website. The platform consists of a web application built with Next.js and a mobile application built with React Native (Expo).

## Tech Stack

### Frontend
- **Web**: Next.js (React) with TypeScript
- **Mobile**: React Native (Expo)
- **Styling**: Tailwind CSS
- **State Management**: React Context API / Redux (if needed)
- **Form Handling**: React Hook Form

### Backend
- **Database**: Firebase Firestore
- **Authentication**: Firebase Authentication
- **Serverless Functions**: Firebase Cloud Functions
- **Storage**: Firebase Storage

### Search Engine
- **Primary**: Algolia for fast and relevant search results
- **Secondary**: Firebase Firestore for basic queries

### Hosting
- **Frontend**: Vercel
- **Backend**: Firebase

## Architecture Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Web Frontend   │     │  Mobile App     │     │  Admin Panel    │
│  (Next.js)      │     │  (React Native) │     │  (Next.js)      │
│                 │     │                 │     │                 │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                      Firebase Authentication                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                      Firebase Cloud Functions                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│    Firestore    │     │    Storage      │     │     Algolia     │
│    Database     │     │                 │     │     Search      │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Component Structure

The frontend is organized into the following component structure:

- **Layout Components**: Components that define the overall layout of the application
  - Navbar
  - Footer
  - Layout wrapper

- **UI Components**: Reusable UI components
  - Button
  - Card
  - Input
  - Modal
  - etc.

- **Business Components**: Components related to business listings
  - BusinessCard
  - BusinessGrid
  - BusinessDetail
  - etc.

- **Auth Components**: Components related to authentication
  - LoginForm
  - RegisterForm
  - ForgotPasswordForm
  - etc.

- **Common Components**: Common components used across the application
  - SearchBar
  - Pagination
  - Rating
  - etc.

## Data Flow

1. User interacts with the frontend (web or mobile)
2. Frontend makes API calls to Firebase Cloud Functions
3. Cloud Functions interact with Firestore and/or Algolia
4. Data is returned to the frontend
5. Frontend updates the UI

## Authentication Flow

1. User enters credentials or uses social login
2. Firebase Authentication validates the credentials
3. Upon successful authentication, a JWT token is returned
4. Token is stored in the browser/app for subsequent requests
5. Token is included in API calls to verify the user's identity

## Search Flow

1. User enters search query
2. Query is sent to Algolia
3. Algolia returns relevant results
4. Results are displayed to the user
5. User can filter and sort results

## Deployment Strategy

- **Frontend**: Continuous deployment with Vercel
- **Backend**: Continuous deployment with Firebase
- **Environment Variables**: Managed through Vercel and Firebase
- **Testing**: Automated testing before deployment
