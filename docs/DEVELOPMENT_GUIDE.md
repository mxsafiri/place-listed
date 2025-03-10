# PlaceListed Development Guide

This guide provides instructions for setting up and developing the PlaceListed platform.

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/place-listed.git
   cd place-listed
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   ```bash
   cp config/env.example.js .env.local
   ```
   Then edit `.env.local` and add your actual values.

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
place-listed/
├── config/                 # Configuration files
├── docs/                   # Documentation
├── public/                 # Static assets
├── scripts/                # Build and deployment scripts
├── src/
│   ├── app/                # Next.js app router pages
│   ├── components/         # React components
│   │   ├── auth/           # Authentication components
│   │   ├── business/       # Business-related components
│   │   ├── common/         # Common components
│   │   ├── layout/         # Layout components
│   │   └── ui/             # UI components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   │   ├── algolia/        # Algolia configuration
│   │   ├── firebase/       # Firebase configuration
│   │   └── utils.ts        # Utility functions
│   ├── services/           # API services
│   ├── styles/             # Global styles
│   └── types/              # TypeScript type definitions
├── .env.local              # Environment variables (not in git)
├── .eslintrc.json          # ESLint configuration
├── .gitignore              # Git ignore file
├── FRONTEND_ROADMAP.md     # Frontend development roadmap
├── next.config.js          # Next.js configuration
├── package.json            # Project dependencies
├── postcss.config.js       # PostCSS configuration
├── README.md               # Project overview
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Development Workflow

### Component Development

1. Identify the component you want to create
2. Determine which category it belongs to (ui, business, auth, etc.)
3. Create the component in the appropriate directory
4. Use existing UI components when possible
5. Test the component in isolation
6. Integrate the component into the application

### Page Development

1. Create a new page in the `src/app` directory
2. Import and use the necessary components
3. Implement the page logic
4. Test the page functionality
5. Add the page to the navigation if needed

### State Management

For simple state management, use React's built-in Context API. For more complex state management, consider using Redux or Zustand.

### API Integration

1. Create a service in the `src/services` directory
2. Use the service to interact with the API
3. Handle loading, error, and success states
4. Update the UI based on the API response

## Firebase Integration

### Authentication

Use Firebase Authentication for user authentication:

```typescript
import { auth } from '@/lib/firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';

// Sign in with email and password
const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};
```

### Firestore

Use Firestore for database operations:

```typescript
import { db } from '@/lib/firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';

// Get businesses by category
const getBusinessesByCategory = async (category: string) => {
  try {
    const q = query(collection(db, 'businesses'), where('category', '==', category));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting businesses:', error);
    throw error;
  }
};
```

## Algolia Integration

Use Algolia for search functionality:

```typescript
import { searchClient, businessIndex } from '@/lib/algolia/config';

// Search businesses
const searchBusinesses = async (query: string) => {
  try {
    const results = await businessIndex.search(query);
    return results.hits;
  } catch (error) {
    console.error('Error searching businesses:', error);
    throw error;
  }
};
```

## Styling Guidelines

### Tailwind CSS

Use Tailwind CSS for styling components:

```jsx
<div className="bg-white rounded-lg shadow-md p-6">
  <h2 className="text-2xl font-bold mb-4">About</h2>
  <p className="text-gray-700 mb-6">{description}</p>
</div>
```

### Component Styling

For complex components, consider using Tailwind's `@apply` directive in a separate CSS file:

```css
.business-card {
  @apply bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300;
}

.business-card-title {
  @apply text-xl font-bold mb-2;
}
```

## Testing

### Unit Testing

Use Jest and React Testing Library for unit testing:

```typescript
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

### Integration Testing

Use Cypress for integration testing:

```typescript
describe('Homepage', () => {
  it('should navigate to the business detail page when clicking on a business card', () => {
    cy.visit('/');
    cy.get('[data-testid="business-card"]').first().click();
    cy.url().should('include', '/business/');
  });
});
```

## Deployment

### Vercel Deployment

The frontend is deployed to Vercel:

1. Connect your GitHub repository to Vercel
2. Configure the environment variables
3. Deploy the application

### Firebase Deployment

The backend is deployed to Firebase:

1. Install the Firebase CLI
2. Configure the Firebase project
3. Deploy the Firebase functions and Firestore rules

## Best Practices

1. Use TypeScript for type safety
2. Write clean, maintainable code
3. Follow the component structure
4. Use existing UI components when possible
5. Write tests for critical functionality
6. Document your code
7. Use meaningful commit messages
8. Review code before merging
