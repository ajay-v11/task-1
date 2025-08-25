# Design Document

## Overview

The backend completion focuses on implementing the remaining CRUD operations for cards and users while maintaining the existing authentication and authorization structure. The design leverages the already established JWT authentication, role-based middleware, and MongoDB models.

## Architecture

The system follows a layered architecture:

- **Routes Layer**: Express routes with role-based middleware
- **Controller Layer**: Business logic and request handling
- **Model Layer**: MongoDB schemas with Mongoose (already implemented)
- **Middleware Layer**: Authentication and authorization (already implemented)

## Components and Interfaces

### Card Controller (`src/controllers/card.controller.ts`)

**Methods:**

- `getAllCards`: Returns cards based on user role
  - Admin: All cards
  - Manager: All cards (read-only for others)
  - User: Only assigned cards
- `createCard`: Creates new card (Admin/Manager only)
- `updateCard`: Updates card with ownership validation
- `deleteCard`: Deletes card (Admin only)
- `getCardById`: Retrieves single card with role-based access

**Role-based Access Logic:**

```typescript
// Card viewing permissions
if (role === 'admin') return allCards;
if (role === 'manager') return allCards;
if (role === 'user') return cardsAssignedToUser;

// Card editing permissions
if (role === 'admin') return allowEdit;
if (role === 'manager' && createdBy === userId) return allowEdit;
if (role === 'user' && assignedTo === userId) return allowEdit;
return denyEdit;
```

### User Controller (`src/controllers/user.controller.ts`)

**Methods:**

- `getAllUsers`: Returns all users (Admin only)
- `getUserProfile`: Returns current user's profile
- `getUserById`: Returns specific user info (Admin only)

### Route Updates

**Card Routes (`src/routes/card.route.ts`):**

- `GET /api/card` - Get cards (role-filtered)
- `POST /api/card` - Create card (Admin/Manager)
- `PUT /api/card/:id` - Update card (ownership-based)
- `DELETE /api/card/:id` - Delete card (Admin only)
- `GET /api/card/:id` - Get single card (role-filtered)

**User Routes (`src/routes/user.route.ts`):**

- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/profile` - Get current user profile
- `GET /api/users/:id` - Get user by ID (Admin only)

## Data Models

### Card Population Strategy

Cards will be populated with user information for `createdBy` and `assignedTo` fields:

```typescript
.populate('createdBy', 'firstName lastName email role')
.populate('assignedTo', 'firstName lastName email role')
```

### Response Format

All API responses follow the established format:

```typescript
{
  success: boolean,
  message: string,
  data?: any,
  error?: string
}
```

## Error Handling

### Validation Errors

- Card creation/update validation using Mongoose schema validation
- Custom validation for role-based operations
- Proper HTTP status codes (400, 401, 403, 404, 500)

### Permission Errors

- 403 Forbidden for insufficient permissions
- 404 Not Found for non-existent or inaccessible resources
- 401 Unauthorized for authentication failures

### Database Errors

- Mongoose validation errors mapped to user-friendly messages
- Database connection errors handled gracefully
- Duplicate key errors for unique constraints

## Testing Strategy

### Manual Testing Approach (Given Time Constraints)

1. **Authentication Testing**

   - Login with different roles
   - Token validation

2. **Card CRUD Testing**

   - Create cards as Admin/Manager
   - View cards with different roles
   - Edit cards with ownership validation
   - Delete cards as Admin

3. **User Management Testing**
   - Create users as Admin
   - View user profiles
   - List users as Admin

### Test Scenarios by Role

**Admin:**

- Can perform all operations
- Can create users/managers
- Can view/edit/delete any card

**Manager:**

- Can create cards
- Can edit only own cards
- Can view all cards
- Cannot create users

**User:**

- Cannot create cards
- Can edit only assigned cards
- Can view only assigned cards
- Cannot create users

## Implementation Priority

Given the 2-hour constraint, implement in this order:

1. Card controller with role-based CRUD operations
2. User controller for profile and listing
3. Update route handlers to use new controllers
4. Test critical paths manually
5. Add error handling and validation
