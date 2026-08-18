# TeamEnergy Bill Management Frontend

A modern bill management interface for tracking, reviewing, and approving invoices in a finance workflow.

## Features
- Login with role-based access
- Dashboard summary and activity overview
- Bill logging form with validation and file upload
- Searchable bill history and filters
- Bill detail view with status timeline
- Settings page with profile and organization controls
- Admin-only organization accounts screen
- Responsive layout

## Tech stack
- React 19
- Vite
- Tailwind CSS
- React Router
- Zustand
- Axios
- React Hook Form

## Run locally
```bash
npm install
npm run dev
```

## Demo accounts
- Admin: admin@teamenergy.com / password123
- Approver: approver@teamenergy.com / password123
- Staff: staff@teamenergy.com / password123

## Main routes
- /login
- /dashboard
- /bills/logging
- /bills/history
- /settings
- /organization-accounts

## Production build
```bash
npm run build
```

## Notes
This version uses realistic mock data and mock authentication, with the service layer structured for future Spring Boot backend integration.
