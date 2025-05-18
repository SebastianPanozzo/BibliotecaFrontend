import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import 'rsuite/dist/rsuite.min.css';
import './Global.css'

createRoot(document.getElementById('root')).render(<App/>)
