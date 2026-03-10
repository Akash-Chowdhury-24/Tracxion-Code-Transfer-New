import { Route, Routes } from 'react-router-dom'
import './App.css'
import CommonLayout from './pages/common-layout/common-layout'
import DashboardCommonLayout from './pages/dashboard/dashboard-common-layout/dashboard-common-layout'
import DashboardChat from './pages/dashboard/dashboard-chat/dashboard-chat'

function App() {

  return (
    <>
      <Routes>

        <Route path="/" element={<CommonLayout />}>
          <Route path="dashboard" element={<DashboardCommonLayout />}>
            <Route path="chat/:conversationId" element={<DashboardChat />} />
          </Route>
          <Route path="agent" element={<h1>Agent</h1>} />
        </Route>
      </Routes>
    </>
  )
}

export default App
