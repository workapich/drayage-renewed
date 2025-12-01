# Drayage Bid Portal

A modern web application for managing drayage bids, built with React 19, TypeScript, Vite, shadcn/ui, Tailwind CSS, Radix UI, and TanStack Query.

## Features

### Vendor Features
- **Authentication**: Login, registration, and email confirmation
- **City Selection**: Browse and select port locations with bid status indicators
- **Bid Submission**: Submit bids with base rates, FSC, and accessorials

### Admin Features
- **Dashboard**: View statistics and manage bids across all cities
- **Vendor Management**: Manage vendor accounts, whitelist emails
- **Route Management**: Create and manage shipping routes
- **Rate Management**: View and analyze vendor bids by port/ramp region and inland location

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **shadcn/ui** - UI component library
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible component primitives
- **TanStack Query** - Data fetching and state management
- **React Router v6** - Routing

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Login Credentials

### Vendor
- Email: `vendor@gmail.com`
- Password: `qwerty`

### Admin
- Email: `admin@gmail.com`
- Password: `123456`

## Project Structure

```
src/
├── features/
│   ├── auth/          # Authentication components and logic
│   ├── vendor/         # Vendor-specific features
│   └── admin/          # Admin-specific features
├── components/         # Shared components
│   └── ui/            # shadcn/ui components
├── lib/               # Utilities, API client, mock data
└── types/             # TypeScript type definitions
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Notes

- This application uses mock data for demonstration purposes
- Authentication uses refresh tokens stored in localStorage
- All API calls are simulated with delays to mimic real backend behavior

