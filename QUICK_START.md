# TeamEnergy Frontend - Quick Start Guide

## ✅ Project Setup Complete!

Your production-ready React + Vite frontend is ready. Here's how to get started:

## 📦 Installation & Setup

### 1. Install Dependencies
```bash
npm install
```
This will install all dependencies including:
- React 19
- Vite
- Tailwind CSS
- React Router DOM
- Zustand
- React Hook Form
- And more...

### 2. Start Development Server
```bash
npm run dev
```
The app will automatically open at `http://localhost:5173`

### 3. Login with Demo Credentials
- **Email:** demo@example.com
- **Password:** password123

## 🎯 Next Steps

### For Backend Integration
1. Update API URL in `.env`:
   ```env
   VITE_API_URL=http://your-backend-url/api
   ```

2. The app automatically handles:
   - Token-based authentication
   - 401 redirects to login
   - Request interceptors with auth headers
   - CORS error handling

### Available Services (in `services/api.js`)
```javascript
// Auth
authService.login(email, password)
authService.logout()

// Dashboard
dashboardService.getSummary()
dashboardService.getRecentBills()

// Bills
billsService.getAll()
billsService.upload(formData)
billsService.delete(id)

// Alerts
alertsService.getAll()
alertsService.markAsRead(id)

// Profile
profileService.getProfile()
profileService.updateProfile(data)
```

## 📁 Key Files & Folders

| Path | Purpose |
|------|---------|
| `src/components/` | 20+ reusable UI components |
| `src/pages/` | 5 complete pages (Login, Dashboard, Upload, Alerts, Profile) |
| `src/services/api.js` | Axios instance & API endpoints |
| `src/store/authStore.js` | Auth & UI state with Zustand |
| `src/utils/mockData.js` | Mock data for development |
| `src/hooks/` | Custom React hooks |
| `tailwind.config.js` | Tailwind theme customization |

## 🎨 Pre-built Pages

1. **Login Page** (`/login`)
   - Email/password form
   - Show/hide password toggle
   - Remember me checkbox
   - Forgot password link
   - Loading states

2. **Dashboard** (`/dashboard`)
   - Summary cards (4 metrics)
   - Recent bills table
   - Recent activity feed
   - Quick stats
   - Mock data included

3. **Upload Bills** (`/upload-bills`)
   - Drag & drop area
   - File browser
   - Vendor name input
   - Upload progress
   - OCR processing simulation
   - File preview

4. **Alerts** (`/alerts`)
   - Critical/warning/info alerts
   - Filter by type
   - Mark as read
   - Dismiss functionality
   - Unread badges

5. **Profile** (`/profile`)
   - User info display/edit
   - Password change form
   - Account settings
   - Danger zone for account deletion

## 🔧 Available Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
```

## 🎨 Customization

### Update Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: '#2563EB',    // Change primary color
  secondary: '#1E293B',  // Change secondary
  // ... more
}
```

### Add New Pages
1. Create file in `src/pages/MyPage.jsx`
2. Add route in `src/routes/routes.jsx`
3. Import in app

### Add New Components
1. Create in appropriate folder in `src/components/`
2. Export from folder's index file (if exists)
3. Use throughout app

## 📊 Component Library

**UI Components:**
- Button (5 variants)
- Input (with icon support)
- Card (with header/footer)
- Badge (6 variants)
- Modal & ConfirmModal
- Avatar
- Loader
- Skeleton
- Alert
- SearchBar
- EmptyState

**Layout Components:**
- MainLayout (with Sidebar + Navbar)
- AuthLayout

**Data Components:**
- Table (with custom rendering)
- Pagination

**Upload Components:**
- FileUpload (drag-drop enabled)

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify/Vercel
1. Push to GitHub
2. Connect repository to Netlify/Vercel
3. Set environment variables
4. Deploy!

### Environment Setup
Create `.env` file:
```env
VITE_API_URL=https://your-api.com/api
VITE_APP_NAME=TeamEnergy
```

## 🔐 Security Features

- ✅ Token-based authentication
- ✅ Automatic 401 redirect
- ✅ Protected routes
- ✅ Auth token in localStorage
- ✅ Request interceptors
- ✅ CORS handling

## 📱 Responsive Design

- ✅ Mobile (< 768px)
- ✅ Tablet (768px - 1024px)
- ✅ Desktop (> 1024px)
- ✅ Sidebar collapses on mobile
- ✅ Touch-friendly on mobile

## 🎯 Project Features

- ✅ 5 complete pages
- ✅ 20+ reusable components
- ✅ Responsive design
- ✅ State management (Zustand)
- ✅ Form handling (React Hook Form)
- ✅ Notifications (React Hot Toast)
- ✅ Animations (Framer Motion)
- ✅ API integration (Axios)
- ✅ Mock data for development
- ✅ ESLint + Prettier configured
- ✅ Production-ready code

## 🐛 Common Issues

### CORS Error
**Solution:** Configure CORS on your Spring Boot backend

### Port Already in Use
**Solution:** Change port in `vite.config.js` or kill process using port 5173

### API Not Responding
**Solution:** 
1. Check `.env` API URL
2. Ensure backend is running
3. Check network tab in browser DevTools

## 📞 Need Help?

1. Check `README.md` for detailed documentation
2. Read `DEVELOPMENT.md` for development guidelines
3. Review component comments in code
4. Check `utils/mockData.js` for data structure examples

## ✨ What's Included

```
✅ React 19 with hooks
✅ Vite for fast builds
✅ Tailwind CSS for styling
✅ React Router for navigation
✅ Zustand for state management
✅ React Hook Form for forms
✅ Axios for API calls
✅ Framer Motion for animations
✅ React Hot Toast for notifications
✅ React Icons for icons
✅ ESLint + Prettier for code quality
✅ Mock data for development
✅ Responsive design
✅ Modern UI components
✅ Production-ready code
```

## 🎉 You're Ready!

Everything is configured and ready to use. Start the dev server and begin building amazing features!

```bash
npm install
npm run dev
```

Happy coding! 🚀

---

**Questions?** Check the inline code comments or README.md for more details.
