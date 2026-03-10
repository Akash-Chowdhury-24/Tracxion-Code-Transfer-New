import { Outlet, Route, Routes } from 'react-router-dom'
import './App.css'
import CommonLayout from './pages/common-layout/common-layout'
import { GlobalProvider } from './context/context'
import AllStaffs from './pages/staffs/all-staffs/all-staffs'
import AddStaff from './pages/staffs/add-staff/add-staff'
import EditStaff from './pages/staffs/edit-staff/edit-staff'
import AllDepartments from './pages/staffs/all-departments/all-departments'
import SingleDepartment from './pages/staffs/single-department/single-department'
import AllRoles from './pages/staffs/all-roles/all-roles'
import SingleRole from './pages/staffs/single-role/single-role'
import AllBills from './pages/billings/all-bills/all-bills'
import ViewInvoice from './pages/billings/view-invoice/view-invoice'
import Login from './pages/authentication/login/login'
import ForgetPassword from './pages/authentication/forget-password/forget-paasword/forget-password'
import NewPassword from './pages/authentication/forget-password/new-password/new-password'
import OtpVerify from './pages/authentication/forget-password/otp-verify/otp-verify'
import Success from './pages/authentication/forget-password/success/success'
import Queue from './pages/queue/queue'
import ViewProfile from './pages/profile/view-profile/view-profile'
import EditProfile from './pages/profile/edit-profile/edit-profile'
import AllRaiseADispute from './pages/raise-a-dispute/all-raise-a-dispute/all-raise-a-dispute'
import AddDispute from './pages/raise-a-dispute/add-dispute/add-dispute'
import EditDispute from './pages/raise-a-dispute/edit-dispute/edit-dispute'
import ViewDispute from './pages/raise-a-dispute/view-dispute/view-dispute'

function App() {

  return (
    <GlobalProvider>
      <Routes>

        <Route path="/auth" element={<Outlet />}>
          <Route index element={<Login />} />
          <Route path='forget-password' element={<Outlet />}>
            <Route index element={<ForgetPassword />} />
            <Route path='otp-verify' element={<OtpVerify />} />
            <Route path='new-password' element={<NewPassword />} />
            <Route path='success' element={<Success />} />
          </Route>
        </Route>


        <Route path="/" element={<CommonLayout />}>
          <Route path="dashboard" element={<>Dashboard</>} />

          {/* <Route path='test-route/:id' element={<ViewTicket />} /> */}


          <Route path="staffs" element={<Outlet />}>
            <Route index element={<AllStaffs />} />
            <Route path="add-staff" element={<AddStaff />} />
            <Route path="edit-staff/:id" element={<EditStaff />} />
            <Route path="all-departments" element={<Outlet />}>
              <Route index element={<AllDepartments />} />
              <Route path=':id' element={<SingleDepartment />} />
            </Route>
            <Route path="all-roles" element={<Outlet />}>
              <Route index element={<AllRoles />} />
              <Route path=':id' element={<SingleRole />} />
            </Route>
          </Route>

          <Route path="profile" element={<Outlet />}>
            <Route index element={<ViewProfile />} />
            <Route path="edit-profile" element={<EditProfile />} />
          </Route>

          <Route path="billings" element={<Outlet />}>
            <Route index element={<AllBills />} />
            <Route path="view-invoice/:id" element={<ViewInvoice />} />
          </Route>
          <Route path="reports" element={<>Reports</>} />

          <Route path="raise-a-dispute" element={<Outlet/>}>
            <Route index element={<AllRaiseADispute />} />
            <Route path="add-ticket" element={<AddDispute />} />
            <Route path="edit-ticket/:id" element={<EditDispute />} />
            <Route path="view-ticket/:id" element={<ViewDispute />} />
          </Route>
          <Route path="queue" element={<Queue />} />



        </Route>
      </Routes>
    </GlobalProvider>
  )
}

export default App
