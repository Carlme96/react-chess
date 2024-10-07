import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BoardProvider } from './chessboard/BoardContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BoardProvider>
    <App />
    </BoardProvider>
    
  </StrictMode>,
)
