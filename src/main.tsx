import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import LightPanel from './feature/control-panel/index.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode >
    <App />
    <LightPanel />
  </StrictMode>,
)
