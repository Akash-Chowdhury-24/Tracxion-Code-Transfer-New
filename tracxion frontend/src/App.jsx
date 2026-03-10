import { Outlet, Route, Routes } from 'react-router-dom'
import './App.css'
import CommonLayout from './pages/common-layout/common-layout'
import AllCompanies from './pages/companies/all-companies/all-companies'
import AddCompany from './pages/companies/add-company/add-company'
import EditCompany from './pages/companies/edit-company/edit-company'
import ViewCompany from './pages/companies/view-company/view-company'
import CompanyStaffs from './pages/companies/company-staffs/company-staffs'
import AllStaffs from './pages/staffs/all-staffs/all-staffs'
import AddStaff from './pages/staffs/add-staff/add-staff'
import EditStaff from './pages/staffs/edit-staff/edit-staff'
import AllDepartments from './pages/staffs/all-departments/all-departments'
import SingleDepartment from './pages/staffs/single-department/single-department'
import AllRoles from './pages/staffs/all-roles/all-roles'
import SingleRole from './pages/staffs/single-role/single-role'
import AllAnnouncements from './pages/announcements/all-announcements/all-announcements'
import AllBills from './pages/billings/all-bills/all-bills'
import CreateInvoice from './pages/billings/create-invoice/create-invoice'
import ViewInvoice from './pages/billings/view-invoice/view-invoice'
import EditInvoice from './pages/billings/edit-invoice/edit-invoice'
import WorkingHours from './pages/working-hours/working-hours/working-hours'
import Holidays from './pages/working-hours/holidays/holidays'
import SupportTickets from './pages/support-tickets/support-tickets'
import ViewTicket from './pages/support-tickets/view-ticket/view-ticket'
import Login from './pages/authentication/login/login'
import ForgetPassword from './pages/authentication/forget-password/forget-paasword/forget-password'
import NewPassword from './pages/authentication/forget-password/new-password/new-password'
import OtpVerify from './pages/authentication/forget-password/otp-verify/otp-verify'
import Success from './pages/authentication/forget-password/success/success'

function App() {

  return (
    <>
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


          <Route path="companies" element={<Outlet />}>
            <Route index element={<AllCompanies />} />
            <Route path="add-company" element={<AddCompany />} />
            <Route path="edit-company/:id" element={<EditCompany />} />
            <Route path="view-company/:id" element={<Outlet />}>
              <Route index element={<ViewCompany />} />
              <Route path="staffs" element={<CompanyStaffs />} />
            </Route>
          </Route>


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



          <Route path="billings" element={<Outlet />}>
            <Route index element={<AllBills />} />
            <Route path="create-invoice" element={<CreateInvoice />} />
            <Route path="view-invoice/:id" element={<ViewInvoice />} />
            <Route path="edit-invoice/:id" element={<EditInvoice />} />
          </Route>
          <Route path="reports" element={<>Reports</>} />


          <Route path="announcements" element={<AllAnnouncements />} />


          <Route path="support-tickets" element={<Outlet />}>
            <Route index element={<SupportTickets />} />
            <Route path="view-ticket/:id" element={<ViewTicket />} />
          </Route>


          <Route path="working-hours" element={<Outlet />}>
            <Route index element={<WorkingHours />} />
            <Route path="holidays" element={<Holidays />} />
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
