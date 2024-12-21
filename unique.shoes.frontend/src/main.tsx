import { createRoot } from 'react-dom/client'
import './preprocessor/Main.sass'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
    <App />
)
