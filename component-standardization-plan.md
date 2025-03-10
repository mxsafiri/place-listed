# PlaceListed Component Standardization Plan

## Current Issue
We've identified a structural issue in the PlaceListed codebase where components are duplicated across two directories:
- `/src/components/`
- `/src/frontend/components/`

This has led to confusion during development, where changes to one component don't reflect in the other location, causing inconsistent behavior.

## Analysis
- The `/src/frontend/components/` directory is the primary location with 30 imports across the codebase
- Only one file is importing from `/src/components/` (BusinessCard importing Card)
- We've already fixed the BusinessCard component to use the frontend components

## Standardization Plan

### 1. Adopt `/src/frontend/components/` as the Standard
All components should be located in the `/src/frontend/components/` directory structure.

### 2. Update Import Paths
- ✅ Update BusinessCard component to import from the frontend directory
- Ensure all new components are created in the frontend directory
- Update any remaining imports that reference the old location

### 3. Remove Duplicate Components
Once all imports are updated, the duplicate components in `/src/components/` can be safely removed.

### 4. Documentation
- Add a note in the project README about the component structure
- Consider adding a linting rule to enforce the correct import paths

### 5. Future Development Guidelines
- All new components should be created in `/src/frontend/components/`
- Follow the established directory structure:
  - `/src/frontend/components/ui/` - For reusable UI components
  - `/src/frontend/components/layout/` - For layout components
  - `/src/frontend/components/business/` - For business-specific components
  - `/src/frontend/components/common/` - For common components used across the app

## Implementation Timeline
- Immediate: Fix current imports (completed)
- Short-term: Remove duplicate components
- Long-term: Add documentation and linting rules

## Benefits
- Consistent component structure
- Reduced maintenance overhead
- Clearer development guidelines
- Prevention of future discrepancies
