import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import '@utils/i18n/index.ts'
import { Provider } from 'react-redux'
import { store } from './stores/index.ts'
ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
  <App />
  </Provider>
)
