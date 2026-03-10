import { useContext, useEffect } from 'react';
import { globalContext } from '../../../context/context';
import DashboardSidebar from '../dashboard-sidebar/dashboard-sidebar';
import './dashboard-common-layout.css'
import { Outlet } from 'react-router-dom';


function DashboardCommonLayout() {
  const { breadcrumbs, pageTitle, subPageTitle, setBreadcrumbs, setPageTitle } = useContext(globalContext);

  useEffect(() => {
    setBreadcrumbs([{ title: 'Dashboard', link: '/dashboard' }]);
    setPageTitle('Dashboard');
  }, []);

  return (
    <div className='dashboard-common-layout-container'>
      <div className='dashboard-common-layout-sidebar-container'>
        <DashboardSidebar />
      </div>
      <div className='dashboard-common-layout-content-container'>
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardCommonLayout;