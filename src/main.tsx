import './index.css' 
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { SynthProvider } from './context/SynthProvider'

// 1. Buscamos el elemento 'root' en el HTML
const rootElement = document.getElementById('root')

// 2. Seguridad de TypeScript: Aseguramos que existe antes de renderizar
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <SynthProvider>
        <App />
      </SynthProvider>
    </React.StrictMode>,
  )
}