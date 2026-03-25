# Real Estate Property Management System

A modern, responsive web application for managing real estate property listings built with React, TypeScript, and custom CSS.

## Features

- **Property Management**: Add, edit, delete, and view property listings
- **Pagination**: Server-side pagination
- **User Authentication**: Secure login and registration system
- **Form Validation**: Formik and Yup
- **Toast Notifications**: For Success/error

## Tech Stack

### Frontend
- **React** - UI library
- **TypeScript** - Type safety
- **React Router DOM** - Routing
- **React Query (TanStack Query)** - State management
- **Formik** - Form handling
- **Yup** - Schema validation
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

### Styling
- **Custom CSS** - no frameworks

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd realestate-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables (if needed):
```bash
# Create .env file with your API endpoint
VITE_API_URL=http://localhost:5101/api
```

4. Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production

## API Integration

The application connects to a REST API with the following endpoints:

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /properties` - Get properties (with pagination & search)
- `POST /properties` - Create property
- `PUT /properties/:id` - Update property
- `DELETE /properties/:id` - Delete property

## Environment Variables

```env
VITE_API_URL=<your-api-url>
```
