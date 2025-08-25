#Auth

POST /api/create-admin - to create the admin(only one admin, and need secret password to create)

POST /api/create-user  (access to only admins)- to create new users, once created the admin can share the password, and email credentials to the users/managers to login later( Can implement a token exchange system for access links( later))

POST /api/login  ( email and password)

#Cards:

GET /api/card - Get cards (role-filtered)
POST /api/card/create - Create card (Admin/Manager)
PUT /api/card/:id - Update card (ownership-based)
DELETE /api/card/:id - Delete card (Admin only)
GET /api/card/:id - Get single card (role-filtered)

#Users:

GET /api/users - Get all users (Admin only)
GET /api/users/profile - Get current user profile
GET /api/users/:id - Get user by ID (Admin only)
