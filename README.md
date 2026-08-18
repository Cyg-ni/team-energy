# TeamEnergy

Electricity bill management and energy monitoring frontend.

## Features
- OCR upload for electricity bills
- Review and validate extracted bill data
- Energy dashboard with reduction goal tracking
- Searchable electricity bill history
- Role-based access for Admin, Approver, Staff, and Viewer
- Responsive enterprise dashboard UI

## Unique features by user
- Admin: full access, manages users and accounts
- Approver: reviews pending bill approvals
- Staff: uploads bills, validates OCR data, tracks usage
- Viewer: reads dashboard and bill history only

## Tech stack
- React 19
- Vite
- Tailwind CSS
- React Router
- Zustand
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
- Viewer: viewer@teamenergy.com / password123

## Main routes
- /login
- /dashboard
- /bills/logging
- /bills/history
- /approvals
- /settings
- /organization-accounts

## Production build
```bash
npm run build
```

## Notes
This project uses mock data and mock authentication for frontend demo purposes.
