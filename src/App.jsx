import { useRoutes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { routes } from './routes/routes'

function App() {
  const element = useRoutes(routes)

  return (
    <>
      {element}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#000',
          },
          success: {
            style: {
              background: '#10b981',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#10b981',
            },
          },
          error: {
            style: {
              background: '#ef4444',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#ef4444',
            },
          },
        }}
      />
    </>
  )
}

export default App
