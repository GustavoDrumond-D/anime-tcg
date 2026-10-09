import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './app/App'
import { ProfileProvider } from './app/ProfileProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProfileProvider>
      <App />
    </ProfileProvider>
  </StrictMode>,
)
