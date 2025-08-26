# Frontend - Digital Business Card App

## Features

### Card Management
- **View Mode**: Display business cards with contact information, services, products, and gallery
- **Edit Mode**: Click the pencil icon on any card to edit it
- **Create Mode**: Click the plus icon or use the "Create New Card" button to create a new card

### Form Features
- **Live Preview**: See changes in real-time as you type
- **Comprehensive Fields**: 
  - Basic info (name, title, location, company, description)
  - Contact details (phone, email)
  - Social links (Instagram, Facebook, Twitter)
  - Services (dynamic list)
  - Products (dynamic list)
  - Gallery (image URLs)
- **Responsive Design**: Works on all screen sizes
- **Validation**: Required field validation for essential information

### UI Components
- **MainCard**: Displays the business card with edit/create buttons
- **MainCardForm**: Reusable form component for editing/creating cards
- **Placeholder**: Right panel with business features and create button
- **Live Preview**: Real-time preview of card changes

## Usage

1. **Edit Existing Card**: Click the pencil icon on any card
2. **Create New Card**: Click the plus icon or "Create New Card" button
3. **Form Navigation**: Fill out the form fields - changes appear in live preview
4. **Save/Cancel**: Use Save button to submit or Cancel to return to view mode

## Technical Details

- Built with React + TypeScript
- Uses Tailwind CSS for styling
- Responsive design with mobile-first approach
- Form state management with React hooks
- Live preview updates without server calls
- Stubbed API integration (ready for backend connection)

## Development

```bash
npm install
npm run dev
```

The app will run on `http://localhost:5173`
