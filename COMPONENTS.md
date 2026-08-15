# Component Documentation

Complete reference for all reusable components in this frontend.

## UI Components

### Button

Multiple variants and sizes for different use cases.

```jsx
import { Button } from '../components/ui/Button'

// Primary button
<Button>Click me</Button>

// Variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="danger">Delete</Button>
<Button variant="success">Confirm</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// States
<Button isLoading={true}>Loading...</Button>
<Button disabled={true}>Disabled</Button>

// With Icon
<Button>
  <Save size={16} className="mr-2" />
  Save
</Button>
```

### Input

Text input with label, error, icon support.

```jsx
import { Input } from '../components/ui/Input'
import { Mail, Lock } from 'react-icons/fa'

// Basic
<Input 
  label="Email" 
  placeholder="Enter email"
/>

// With icon
<Input 
  label="Email" 
  icon={Mail}
  placeholder="your@email.com"
/>

// With error
<Input 
  label="Password"
  type="password"
  icon={Lock}
  error="Password is required"
/>

// With help text
<Input 
  label="Username"
  help="Min 3 characters"
/>

// Required field
<Input 
  label="Company Name"
  required={true}
/>
```

### Card

Container component with optional header and footer.

```jsx
import { Card } from '../components/ui/Card'

// Basic
<Card>
  <p>Card content</p>
</Card>

// With header
<Card header="Card Title">
  <p>Card content</p>
</Card>

// With header and footer
<Card 
  header="Form"
  footer={<Button>Submit</Button>}
>
  <form>
    {/* form content */}
  </form>
</Card>

// Hoverable
<Card hoverable onClick={() => console.log('clicked')}>
  <p>Click me</p>
</Card>

// Custom className
<Card className="p-8">
  <p>Custom padding</p>
</Card>
```

### Badge

Status indicators and labels.

```jsx
import { Badge } from '../components/ui/Badge'

// Variants
<Badge variant="default">Default</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="danger">Danger</Badge>
<Badge variant="info">Info</Badge>
<Badge variant="slate">Slate</Badge>

// Sizes
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>

// With icon
<Badge variant="success">
  <CheckCircle size={14} className="mr-1" />
  Active
</Badge>
```

### Modal

Dialog component with animations.

```jsx
import { Modal, ConfirmModal } from '../components/ui/Modal'
import { useState } from 'react'
import { Button } from '../components/ui/Button'

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false)

  // Basic modal
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Open Modal
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="My Modal"
        size="md"
        footer={
          <>
            <Button 
              variant="secondary" 
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button>Confirm</Button>
          </>
        }
      >
        <p>Modal content goes here</p>
      </Modal>
    </>
  )
}

// Confirmation modal
<ConfirmModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onConfirm={handleDelete}
  title="Delete Item"
  description="Are you sure? This cannot be undone."
  confirmText="Delete"
  isDangerous={true}
/>
```

### Avatar

User profile picture with initials fallback.

```jsx
import { Avatar } from '../components/ui/index'

// With image
<Avatar 
  src="https://example.com/avatar.jpg"
  alt="John Doe"
  size="md"
/>

// With name (shows initials)
<Avatar 
  name="John Doe"
  size="lg"
/>

// Sizes
<Avatar name="Jane" size="sm" />      {/* 8x8 */}
<Avatar name="Jane" size="md" />      {/* 10x10 */}
<Avatar name="Jane" size="lg" />      {/* 12x12 */}
<Avatar name="Jane" size="xl" />      {/* 16x16 */}

// Custom styling
<Avatar 
  name="Jane" 
  className="ring-2 ring-blue-600"
/>
```

### Loader

Loading spinner.

```jsx
import { Loader } from '../components/ui/index'

// Sizes
<Loader size="sm" />
<Loader size="md" />
<Loader size="lg" />

// Custom className
<Loader className="text-green-600" />
```

### Skeleton

Placeholder while loading.

```jsx
import { Skeleton } from '../components/ui/index'

<div className="space-y-4">
  <Skeleton className="h-12 w-full" />
  <Skeleton className="h-4 w-2/3" />
  <Skeleton className="h-4 w-1/2" />
</div>
```

### Alert

Colored alert boxes.

```jsx
import { Alert } from '../components/ui/index'

// Variants
<Alert 
  variant="info" 
  title="Info"
  description="This is an info message"
/>

<Alert 
  variant="success" 
  title="Success"
  description="Operation completed successfully"
/>

<Alert 
  variant="warning" 
  title="Warning"
  description="Be careful with this action"
/>

<Alert 
  variant="danger" 
  title="Error"
  description="Something went wrong"
/>

// Closeable
<Alert 
  variant="info"
  title="Notification"
  description="You can close this"
  onClose={() => console.log('closed')}
/>
```

### SearchBar

Search input with clear button.

```jsx
import { SearchBar } from '../components/ui/index'
import { useState } from 'react'

function MyComponent() {
  const [search, setSearch] = useState('')

  return (
    <SearchBar
      value={search}
      onChange={setSearch}
      onClear={() => setSearch('')}
      placeholder="Search bills..."
    />
  )
}
```

### EmptyState

Placeholder for empty data.

```jsx
import { EmptyState } from '../components/ui/index'
import { Inbox, Button } from 'react-icons/fa'

<EmptyState
  icon={Inbox}
  title="No Alerts"
  description="You're all caught up!"
  action={<Button>Create New</Button>}
/>
```

## Data Components

### Table

Data table with custom rendering.

```jsx
import { Table } from '../components/tables/Table'

const columns = [
  {
    key: 'billNumber',
    label: 'Bill Number',
    render: (value) => <strong>{value}</strong>,
  },
  {
    key: 'vendor',
    label: 'Vendor',
  },
  {
    key: 'amount',
    label: 'Amount',
    render: (value) => `$${value.toFixed(2)}`,
  },
  {
    key: 'status',
    label: 'Status',
    render: (value) => <Badge>{value}</Badge>,
  },
]

<Table
  columns={columns}
  data={bills}
  loading={isLoading}
  onRowClick={(row) => console.log(row)}
  empty={<p>No bills found</p>}
/>
```

### Pagination

Page navigation.

```jsx
import { Pagination } from '../components/tables/Table'
import { useState } from 'react'

function MyComponent() {
  const [page, setPage] = useState(1)
  const totalPages = 10

  return (
    <Pagination
      currentPage={page}
      totalPages={totalPages}
      onPageChange={setPage}
    />
  )
}
```

## Upload Component

### FileUpload

Drag-and-drop file upload.

```jsx
import { FileUpload } from '../components/upload/FileUpload'
import { billsService } from '../services/api'
import toast from 'react-hot-toast'

function UploadPage() {
  const handleFilesSelected = (files) => {
    console.log('Selected files:', files)
  }

  const handleUpload = async (files) => {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })
    
    try {
      await billsService.upload(formData)
      toast.success('Files uploaded!')
    } catch (error) {
      toast.error('Upload failed')
    }
  }

  return (
    <FileUpload
      accept=".pdf,.jpg,.jpeg,.png"
      maxSize={10 * 1024 * 1024}
      multiple={true}
      onFilesSelected={handleFilesSelected}
      onUpload={handleUpload}
    />
  )
}
```

## Layout Components

### MainLayout

Main application layout with sidebar and navbar.

```jsx
import { MainLayout } from '../layouts/MainLayout'

export function MyPage() {
  return (
    <MainLayout>
      <div>
        <h1>Page Content</h1>
        {/* Your content here */}
      </div>
    </MainLayout>
  )
}
```

### AuthLayout

Authentication page layout.

```jsx
import { AuthLayout } from '../layouts/MainLayout'

export function LoginPage() {
  return (
    <AuthLayout>
      <div>
        {/* Login form */}
      </div>
    </AuthLayout>
  )
}
```

## Utility Hooks

### useLocalStorage

Persist data in localStorage.

```jsx
import { useLocalStorage } from '../hooks/useCustomHooks'

function MyComponent() {
  const [user, setUser] = useLocalStorage('user', {})

  return (
    <button onClick={() => setUser({ name: 'John' })}>
      Save User
    </button>
  )
}
```

### useAsync

Handle async operations.

```jsx
import { useAsync } from '../hooks/useCustomHooks'
import { dashboardService } from '../services/api'

function Dashboard() {
  const { value, status, error, execute } = useAsync(
    () => dashboardService.getSummary(),
    true // run immediately
  )

  if (status === 'pending') return <Loader />
  if (status === 'error') return <Alert variant="danger" title="Error" />
  
  return <div>{value?.totalBills}</div>
}
```

### usePagination

Pagination helper.

```jsx
import { usePagination } from '../hooks/useCustomHooks'

function MyList() {
  const {
    currentPage,
    totalPages,
    currentItems,
    goToPage,
    goToNextPage,
    goToPreviousPage,
  } = usePagination(allItems, 10)

  return (
    <>
      <Table data={currentItems} columns={columns} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
      />
    </>
  )
}
```

### useDebounce

Debounce values (useful for search).

```jsx
import { useDebounce } from '../hooks/useCustomHooks'
import { useState, useEffect } from 'react'

function SearchBills() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)

  useEffect(() => {
    if (debouncedSearch) {
      // Make API call
      billsService.search(debouncedSearch)
    }
  }, [debouncedSearch])

  return (
    <input 
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  )
}
```

### useFileUpload

File upload helper.

```jsx
import { useFileUpload } from '../hooks/useCustomHooks'

function MyUploader() {
  const {
    files,
    isUploading,
    handleDrop,
    handleSelectFiles,
    removeFile,
    clearFiles,
  } = useFileUpload()

  return (
    <div onDrop={handleDrop}>
      <input onChange={handleSelectFiles} />
      {files.map((f, i) => (
        <div key={i}>
          {f.name}
          <button onClick={() => removeFile(i)}>Remove</button>
        </div>
      ))}
    </div>
  )
}
```

## Utility Functions

### cn() - Class Name Merger

Merge Tailwind classes with conditions.

```jsx
import { cn } from '../utils/helpers'

<div className={cn(
  'p-4 rounded-lg',
  isActive && 'bg-blue-600 text-white',
  isDisabled && 'opacity-50 cursor-not-allowed'
)}>
```

### Format Functions

```jsx
import { 
  formatCurrency,
  formatDate,
  formatDateTime,
  getStatusColor,
  getInitials,
  validateEmail,
  truncate,
} from '../utils/helpers'

formatCurrency(1000)           // $1,000.00
formatDate('2024-01-15')       // Jan 15, 2024
formatDateTime('2024-01-15')   // Jan 15, 2024 10:30 AM
getStatusColor('paid')         // 'bg-green-100 text-green-800'
getInitials('John Doe')        // 'JD'
validateEmail('test@test.com') // true
truncate('Long text...', 20)   // 'Long text that is...'
```

## State Management

### useAuthStore

```jsx
import { useAuthStore } from '../store/authStore'

function MyComponent() {
  const user = useAuthStore((state) => state.user)
  const login = useAuthStore((state) => state.login)
  const logout = useAuthStore((state) => state.logout)
  const isLoading = useAuthStore((state) => state.isLoading)
  const error = useAuthStore((state) => state.error)

  return (
    <>
      <p>{user?.name}</p>
      <button onClick={() => login(email, password)}>
        Login
      </button>
    </>
  )
}
```

### useUIStore

```jsx
import { useUIStore } from '../store/authStore'

function MyComponent() {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen)
  const toggleSidebar = useUIStore((state) => state.toggleSidebar)
  const setSidebarOpen = useUIStore((state) => state.setSidebarOpen)

  return (
    <button onClick={toggleSidebar}>
      {sidebarOpen ? 'Close' : 'Open'} Sidebar
    </button>
  )
}
```

---

## Tips & Best Practices

1. **Always use `cn()` for conditional classes**
   ```jsx
   // ✅ Good
   className={cn('p-4', isActive && 'bg-blue-600')}
   
   // ❌ Avoid
   className={'p-4 ' + (isActive ? 'bg-blue-600' : '')}
   ```

2. **Use mock data for development**
   ```jsx
   import { mockBills } from '../utils/mockData'
   const [bills, setBills] = useState(mockBills)
   ```

3. **Handle loading and error states**
   ```jsx
   if (isLoading) return <Loader />
   if (error) return <Alert variant="danger" title="Error" />
   return <MyContent data={data} />
   ```

4. **Use toast for feedback**
   ```jsx
   import toast from 'react-hot-toast'
   toast.success('Saved!')
   toast.error('Failed to save')
   ```

---

For more examples, check the pages in `src/pages/` folder.
