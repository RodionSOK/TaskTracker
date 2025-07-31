import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import authSlice from './store/authslice.js'
import projectslice from './store/projectslice.js'
import categoryslice from './store/categoryslice.js'
import taskslice from './store/taskslice.js'
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({
  reducer: {
    auth: authSlice,
    projects: projectslice,
    categories: categoryslice,
    tasks: taskslice,
  }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider> 
  </StrictMode>,
)
