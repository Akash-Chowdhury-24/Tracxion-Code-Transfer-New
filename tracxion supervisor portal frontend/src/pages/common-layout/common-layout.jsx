import Header from '../../component/header';
import Sidebar from '../../component/sidebar';
import { Outlet } from 'react-router-dom';
import './common-layout.css';

function CommonLayout() {
  return (
    <div className='common-layout-container'>
      <div className='common-layout-sidebar-container'>
        <Sidebar />
      </div>
      <div className='common-layout-content-container'>
        <div className='common-layout-header-container'>
          <Header />
        </div>
        <div className='common-layout-content-body-container'>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default CommonLayout;