# TeamEnergy - Bill Management Dashboard

A modern, production-ready React + Vite frontend application for bill management. Built with React 19, Tailwind CSS, and Framer Motion.

## 🎯 Features

- **Authentication**: Secure login/logout with token-based auth
- **Dashboard**: Real-time summary cards, recent bills, and activity feeds
- **Bill Upload**: Drag-and-drop file upload with OCR processing simulation
- **Alerts Management**: Critical alerts, warnings, and notifications
- **User Profile**: Account settings and password management
- **Responsive Design**: Mobile, tablet, and desktop support
- **State Management**: Zustand for global state
- **Form Handling**: React Hook Form with validation
- **Notifications**: React Hot Toast for user feedback
- **Animations**: Framer Motion for smooth transitions
- **Reusable Components**: 20+ production-ready UI components

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm or yarn
- A Spring Boot REST API running on `http://localhost:8080`

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env
   ```

3. **Configure API endpoint** (optional)
   Edit `.env` to point to your backend:
   ```
   VITE_API_URL=http://localhost:8080/api
   ```

### Development

Start the development server:
```bash
npm run dev
```

The app will open at `http://localhost:5173`

**Demo Credentials:**
- Email: `demo@example.com`
- Password: `password123`

### Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── assets/                 # Images, icons, static files
├── components/            # Reusable UI components
│   ├── layout/           # Sidebar, Navbar
│   ├── ui/               # Button, Input, Card, Badge, Modal, etc.
│   ├── forms/            # Form components
│   ├── cards/            # Card variants
│   ├── tables/           # Table, Pagination
│   ├── upload/           # File upload components
│   └── alerts/           # Alert components
├── layouts/              # Page layouts (Main, Auth)
├── pages/                # Page components
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── UploadBills.jsx
│   ├── Alerts.jsx
│   ├── Profile.jsx
│   └── NotFound.jsx
├── services/             # API service layer
│   └── api.js           # Axios instance and endpoints
├── hooks/                # Custom React hooks
├── routes/               # Routing configuration
├── store/                # Zustand stores
│   └── authStore.js     # Auth and UI state
├── utils/                # Utility functions
│   ├── helpers.js       # Common utilities
│   └── mockData.js      # Mock data for development
├── App.jsx              # Main app component
├── main.jsx             # Entry point
└── index.css            # Tailwind CSS
```

## 🎨 UI Components

### Core Components

- **Button**: Multiple variants (primary, secondary, danger, outline, ghost)
- **Input**: Text input with validation and icon support
- **Card**: Container component with header/footer
- **Badge**: Status indicators and labels
- **Modal**: Dialog component with animations
- **Avatar**: User profile pictures with initials fallback
- **Loader**: Spinning loading indicator
- **Skeleton**: Placeholder loading state
- **Alert**: Colored alert boxes
- **EmptyState**: Placeholder for empty data
- **SearchBar**: Search input with clear button
- **Table**: Data table with columns and sorting
- **Pagination**: Page navigation
- **FileUpload**: Drag-and-drop file upload

## 🔗 API Integration

The app is configured to connect to a Spring Boot REST API. Update the base URL in `.env`:

```javascript
// API Endpoints (services/api.js)
POST   /api/auth/login           // Login
POST   /api/auth/logout          // Logout
GET    /api/dashboard/summary    // Dashboard stats
GET    /api/bills                // Get bills list
POST   /api/bills/upload         // Upload bills
GET    /api/alerts               // Get alerts
GET    /api/profile              // Get user profile
```

## 🎨 Tailwind CSS Theme

**Color Palette:**
- Primary: Blue (#2563EB)
- Secondary: Slate (#1E293B)
- Success: Green (#22C55E)
- Warning: Amber (#F59E0B)
- Danger: Red (#EF4444)

**Spacing:** Consistent 4px base unit
**Rounded Corners:** xl (12px) for cards
**Shadows:** Soft and medium variants

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

Sidebar collapses on mobile with hamburger menu toggle.

## ⚙️ Configuration Files

### tailwind.config.js
Customize colors, spacing, and other design tokens

### postcss.config.js
Processes Tailwind CSS

### vite.config.js
Vite build and dev server configuration

### .eslintrc.json
ESLint rules and React plugin config

### .prettierrc
Code formatting preferences

## 🔐 State Management

### useAuthStore (Zustand)
```javascript
const { user, login, logout, isLoading, error } = useAuthStore()
```

### useUIStore (Zustand)
```javascript
const { sidebarOpen, toggleSidebar } = useUIStore()
```

## 🪝 Custom Hooks

- **useLocalStorage**: Persist data in localStorage
- **useAsync**: Handle async operations
- **usePagination**: Pagination logic
- **useDebounce**: Debounce values
- **useIsAuthenticated**: Check auth status
- **useFileUpload**: File upload handling

## 📊 Mock Data

Development mock data is stored in `utils/mockData.js` for:
- Bills
- Dashboard summary
- Recent activity
- Alerts
- User profile
- Chart data

Replace with real API calls in production.

## 🚀 Deployment

### Build
```bash
npm run build
```

### Deploy to Netlify/Vercel
The `dist` folder contains the optimized build ready for deployment.

### Environment Variables
Set `VITE_API_URL` to your production API endpoint in your hosting provider.

## 🛠️ Development Tools

### Linting
```bash
npm run lint
npm run lint:fix
```

### Formatting
```bash
npm run format
```

## 📚 Dependencies

### Core
- React 19
- React Router DOM 6
- Vite 5

### UI & Animation
- Tailwind CSS 3.4
- Framer Motion 10
- React Icons
- React Hot Toast

### Forms & Validation
- React Hook Form
- Axios

### State Management
- Zustand

### Development
- ESLint
- Prettier

## 🤝 Integration with Spring Boot

The frontend is ready to connect to your Spring Boot API. Follow these steps:

1. **Update API Base URL**
   ```env
   VITE_API_URL=http://your-backend-url/api
   ```

2. **Add Auth Token**
   The app automatically includes auth tokens from localStorage:
   ```javascript
   // In api.js
   api.interceptors.request.use((config) => {
     const token = localStorage.getItem('authToken')
     if (token) {
       config.headers.Authorization = `Bearer ${token}`
     }
     return config
   })
   ```

3. **Handle 401 Errors**
   Automatic redirect to login on token expiration

## 📝 Code Quality

- Clean, modular architecture
- Reusable components
- No code duplication
- Proper error handling
- TypeScript-ready (can be added)
- ESLint + Prettier configured

## 🐛 Troubleshooting

### CORS Issues
If you get CORS errors, configure CORS on your Spring Boot backend:
```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins("http://localhost:5173")
                    .allowedMethods("*")
                    .allowedHeaders("*");
            }
        };
    }
}
```

### Port Already in Use
Change Vite dev port in `vite.config.js`:
```javascript
server: {
  port: 3000, // or any available port
}
```

## 📖 Learn More

- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Framer Motion Docs](https://www.framer.com/motion)
- [Zustand Docs](https://github.com/pmndrs/zustand)

## 📄 License

MIT

## 🤝 Support

For issues or questions, refer to the inline code comments or open an issue in your repository.

---

**Built with ❤️ using React, Vite, and Tailwind CSS**
