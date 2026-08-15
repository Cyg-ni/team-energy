# Development Guide

This guide provides best practices and conventions for developing with this React + Vite frontend.

## 🏗️ Architecture

### Component Organization

Components are organized by type for easy discovery:

```
components/
├── ui/               # Basic UI building blocks
├── layout/           # Layout components (Sidebar, Navbar)
├── forms/            # Form-specific components
├── cards/            # Card variants
├── alerts/           # Alert variants
├── tables/           # Table and pagination
└── upload/           # File upload components
```

### Naming Conventions

- **Components**: PascalCase (e.g., `Button.jsx`, `UserCard.jsx`)
- **Files**: Same as component name
- **Hooks**: camelCase with `use` prefix (e.g., `useAuthStore`, `useFileUpload`)
- **Utilities**: camelCase (e.g., `helpers.js`, `mockData.js`)
- **Constants**: UPPER_SNAKE_CASE

## 🎨 Component Development

### Creating a Reusable Component

1. **Create in appropriate folder** (`components/ui/`, `components/forms/`, etc.)
2. **Export from folder index** if needed
3. **Include JSDoc comments** for props
4. **Use `cn()` utility** for className merging
5. **Support className prop** for customization

**Example:**
```jsx
// components/ui/Button.jsx
import { cn } from '../../utils/helpers'

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  ...props
}) {
  const baseClasses = 'inline-flex items-center justify-center...'
  
  const variants = {
    primary: '...',
    secondary: '...',
  }
  
  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {children}
    </button>
  )
}
```

## 📝 Styling Guidelines

### Tailwind CSS Best Practices

1. **Use design tokens** from `tailwind.config.js`
2. **Avoid hardcoded colors** - use theme colors
3. **Use `cn()` helper** for conditional classes
4. **Prefer utility classes** over custom CSS
5. **Use responsive prefixes**: `md:`, `lg:`, etc.

### Color Usage

```jsx
// ✅ Good
<div className="bg-blue-600 text-white">

// ❌ Avoid
<div className="bg-[#2563EB]">
```

### Spacing Pattern

```jsx
// ✅ Good - consistent spacing
<div className="space-y-6">
  <div className="p-6">
  <div className="px-4 py-2.5">

// ❌ Avoid - inconsistent
<div className="p-5 m-3 gap-2">
```

## 🔄 State Management

### Using Zustand Stores

```javascript
// Define store in store/myStore.js
import { create } from 'zustand'

export const useMyStore = create((set) => ({
  state: 'value',
  setState: (newValue) => set({ state: newValue }),
}))

// Use in component
import { useMyStore } from '../store/myStore'

function MyComponent() {
  const state = useMyStore((state) => state.state)
  const setState = useMyStore((state) => state.setState)
  
  return (
    <button onClick={() => setState('new value')}>
      {state}
    </button>
  )
}
```

### Authentication Flow

```javascript
// login
const { login, isLoading, error } = useAuthStore()
await login(email, password)

// logout
const logout = useAuthStore((state) => state.logout)
logout()

// check auth
const user = useAuthStore((state) => state.user)
const isLoggedIn = !!user
```

## 🚀 API Integration

### Making API Calls

```javascript
// Define endpoints in services/api.js
export const myService = {
  getItems: () => api.get('/items'),
  createItem: (data) => api.post('/items', data),
  updateItem: (id, data) => api.put(`/items/${id}`, data),
  deleteItem: (id) => api.delete(`/items/${id}`),
}

// Use in component
import { myService } from '../services/api'

function MyComponent() {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    myService.getItems()
      .then(response => setItems(response.data))
      .catch(error => console.error(error))
      .finally(() => setIsLoading(false))
  }, [])

  return (...)
}
```

### Error Handling

```javascript
import toast from 'react-hot-toast'

try {
  await myService.createItem(data)
  toast.success('Item created!')
} catch (error) {
  const message = error.response?.data?.message || 'An error occurred'
  toast.error(message)
}
```

## 🪝 Custom Hooks

### Creating a Custom Hook

```javascript
// hooks/useMyHook.js
import { useState, useEffect, useCallback } from 'react'

export function useMyHook(initialValue) {
  const [state, setState] = useState(initialValue)

  const updateState = useCallback((newValue) => {
    setState(newValue)
  }, [])

  return { state, updateState }
}
```

### Available Hooks

- `useLocalStorage` - Persist data in localStorage
- `useAsync` - Handle async operations
- `usePagination` - Pagination logic
- `useDebounce` - Debounce values
- `useIsAuthenticated` - Check auth status
- `useFileUpload` - File upload handling

## 📱 Responsive Design

### Breakpoints

```jsx
// Mobile: < 768px
// Tablet: 768px - 1024px
// Desktop: > 1024px

// ✅ Good pattern
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
  {/* 1 column on mobile, 2 on tablet, 4 on desktop */}
</div>

// Mobile-first approach
<div className="hidden lg:block">
  {/* Show only on desktop */}
</div>

<div className="lg:hidden">
  {/* Show only on mobile/tablet */}
</div>
```

## 🧪 Testing

### Mock Data

Use mock data from `utils/mockData.js` during development:

```javascript
import { mockBills, mockUser } from '../utils/mockData'

function MyComponent() {
  const [bills, setBills] = useState(mockBills)
  // ...
}
```

### Testing Components

```javascript
// Basic test structure
describe('Button', () => {
  it('should render with text', () => {
    const { getByText } = render(<Button>Click me</Button>)
    expect(getByText('Click me')).toBeInTheDocument()
  })
})
```

## 📊 Form Handling

### Using React Hook Form

```javascript
import { useForm } from 'react-hook-form'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'

function MyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (data) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Email"
        type="email"
        {...register('email', {
          required: 'Email is required',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Invalid email format',
          },
        })}
        error={errors.email?.message}
      />
      
      <Button type="submit">Submit</Button>
    </form>
  )
}
```

## 🎯 Performance Tips

### Code Splitting

```jsx
import { lazy, Suspense } from 'react'

const Dashboard = lazy(() => import('./pages/Dashboard'))

export function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Dashboard />
    </Suspense>
  )
}
```

### Memoization

```jsx
import { memo, useMemo, useCallback } from 'react'

// Prevent unnecessary re-renders
export const MyComponent = memo(function MyComponent({ prop }) {
  // component code
})

// Memoize expensive computations
const memoizedValue = useMemo(() => {
  return expensiveCalculation(a, b)
}, [a, b])

// Memoize callbacks
const memoizedCallback = useCallback(() => {
  doSomething(a, b)
}, [a, b])
```

## 🔍 Debugging

### React DevTools

Install React DevTools browser extension for:
- Component tree inspection
- Props and state monitoring
- Performance profiling

### Zustand DevTools

Monitor store updates:
```javascript
import { devtools } from 'zustand/middleware'

export const useStore = create(
  devtools((set) => ({
    // store definition
  }))
)
```

### Console Logging

```javascript
// ✅ Good - descriptive
console.log('User data:', userData)
console.error('Failed to fetch bills:', error)

// ❌ Avoid - vague
console.log('data')
console.log(error)
```

## 🚀 Deployment Checklist

- [ ] Update `.env` with production API URL
- [ ] Remove console.logs
- [ ] Test all routes
- [ ] Verify responsive design
- [ ] Check accessibility (WCAG)
- [ ] Test error states
- [ ] Optimize images
- [ ] Run build: `npm run build`
- [ ] Test production build: `npm run preview`

## 📚 Resources

- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion)
- [React Hook Form](https://react-hook-form.com)
- [Zustand](https://github.com/pmndrs/zustand)

## 💡 Code Review Checklist

Before submitting code:

- [ ] Component is reusable or in correct folder
- [ ] Props are documented
- [ ] Error handling is implemented
- [ ] Loading states are handled
- [ ] Responsive design is tested
- [ ] No console errors/warnings
- [ ] Code follows naming conventions
- [ ] No code duplication
- [ ] Accessibility is considered
- [ ] Performance is optimized

---

Happy coding! 🎉
