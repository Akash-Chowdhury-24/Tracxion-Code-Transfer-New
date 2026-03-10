import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { GlobalProvider } from './context/context.jsx'
import { CustomerMsgProvider } from './context/customer-msg-context.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <GlobalProvider>
      <CustomerMsgProvider>
        <App />
      </CustomerMsgProvider>
    </GlobalProvider>
  </BrowserRouter>
)
