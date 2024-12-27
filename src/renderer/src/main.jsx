import './assets/main.scss'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router'

import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
)
