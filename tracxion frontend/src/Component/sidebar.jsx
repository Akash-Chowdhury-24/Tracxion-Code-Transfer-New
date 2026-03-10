import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/sidebar.css"
import { globalContext } from "../context/context";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { openSidebar } = useContext(globalContext);
  const [selectedButton, setSelectedButton] = useState("");

  // so that i can set the selected button on each page reload
  useEffect(() => {
    const selectedButton = getCurrentSelectedButton();
    setSelectedButton(selectedButton);
  })

  // this function is used to get the current selected button
  const getCurrentSelectedButton = () => {
    const path = location.pathname;
    const routeMapping = [
      { path: '/dashboard', button: 'dashboard' },
      { path: '/companies', button: 'companies' },
      { path: '/staffs', button: 'staffs' },
      { path: '/billings', button: 'billings' },
      { path: '/working-hours', button: 'working-hours' },
      { path: '/reports', button: 'reports' },
      { path: '/announcements', button: 'announcements' },
      { path: '/support-tickets', button: 'support-tickets' },
    ];
    const matchedRoute = routeMapping.find(route =>
      path.startsWith(route.path)
    );

    return matchedRoute ? matchedRoute.button : null;
  };


  // this function is used to handle the button click
  const handleButtonClick = (route, buttonName) => {
    navigate(route);
  };

  // this function is used to get the button style
  const getButtonStyle = (buttonName) => {
    return selectedButton === buttonName
      // ? { filter: "brightness(0) saturate(100%) " }
      ? { filter: "brightness(0) saturate(100%) invert(1)" }
      : {};
  };
  return (
    <aside className={`sidebar ${!openSidebar ? 'collapsed' : ''}`}>
      <img src="/logo.svg" alt="" className="sidebar-logo" />
      <nav className="sidebar-nav">

        {
          openSidebar && <>
            <button onClick={() => handleButtonClick('/dashboard', 'dashboard')} className={selectedButton === 'dashboard' ? 'sidebar-button-active' : ''}>
              <img src="/dashboard-icon.svg" alt="" style={getButtonStyle('dashboard')} />
              <span>Dashboard</span>
            </button>



            <button onClick={() => handleButtonClick('/companies', 'companies')}
              className={selectedButton === 'companies' ? 'sidebar-button-active' : ''}>
              <img src="/companies-icon.svg" alt="" style={getButtonStyle('companies')} />
              <span>Companies</span>
            </button>


            <button onClick={() => handleButtonClick('/staffs', 'staffs')} className={selectedButton === 'staffs' ? 'sidebar-button-active' : ''}>
              <img src="/staffs-icon.svg" alt="" style={getButtonStyle('staffs')} />
              <span>Staffs</span>
            </button>



            <button onClick={() => handleButtonClick('/billings', 'billings')} className={selectedButton === 'billings' ? 'sidebar-button-active' : ''}>
              <img src="/billings-icon.svg" alt="" style={getButtonStyle('billings')} />
              <span>Billings</span>
            </button>



            <button onClick={() => handleButtonClick('/reports', 'reports')} className={selectedButton === 'reports' ? 'sidebar-button-active' : ''}>
              <img src="/reports-icon.svg" alt="" style={getButtonStyle('reports')} />
              <span>Reports</span>
            </button>


            <button onClick={() => handleButtonClick('/working-hours', 'working-hours')} className={selectedButton === 'working-hours' ? 'sidebar-button-active' : ''}>
              <img src="/working-hours-icon.svg" alt="" style={getButtonStyle('working-hours')} />
              <span>Working Hours</span>
            </button>


            <button onClick={() => handleButtonClick('/announcements', 'announcements')} className={selectedButton === 'announcements' ? 'sidebar-button-active' : ''}>
              <img src="/announcements-icon.svg" alt="" style={getButtonStyle('announcements')} />
              <span>Announcements</span>
            </button>


            <button onClick={() => handleButtonClick('/support-tickets', 'support-tickets')} className={selectedButton === 'support-tickets' ? 'sidebar-button-active' : ''}>
              <img src="/support-tickets-icon.svg" alt="" style={getButtonStyle('support-tickets')} />
              <span>Support Tickets</span>
            </button>


            <button onClick={() => {
              console.log('logout');
              localStorage.removeItem('tracxion admin token');
              localStorage.removeItem('tracxion admin user');
              navigate('/auth');
            }} className={selectedButton === 'logout' ? 'sidebar-button-active' : ''}>
              <img src="/logout-icon.svg" alt="" style={getButtonStyle('logout')} />
              <span>Logout</span>
            </button>
          </>
        }

        {
          !openSidebar && <>
            <button onClick={() => handleButtonClick('/dashboard', 'dashboard')} className={selectedButton === 'dashboard' ? 'sidebar-button-active' : ''}>
              <img src="/dashboard-icon.svg" alt="" style={getButtonStyle('dashboard')} />
            </button>



            <button onClick={() => handleButtonClick('/companies', 'companies')}
              className={selectedButton === 'companies' ? 'sidebar-button-active' : ''}>
              <img src="/companies-icon.svg" alt="" style={getButtonStyle('companies')} />
            </button>


            <button onClick={() => handleButtonClick('/staffs', 'staffs')} className={selectedButton === 'staffs' ? 'sidebar-button-active' : ''}>
              <img src="/staffs-icon.svg" alt="" style={getButtonStyle('staffs')} />
            </button>



            <button onClick={() => handleButtonClick('/billings', 'billings')} className={selectedButton === 'billings' ? 'sidebar-button-active' : ''}>
              <img src="/billings-icon.svg" alt="" style={getButtonStyle('billings')} />
            </button>



            <button onClick={() => handleButtonClick('/reports', 'reports')} className={selectedButton === 'reports' ? 'sidebar-button-active' : ''}>
              <img src="/reports-icon.svg" alt="" style={getButtonStyle('reports')} />
            </button>


            <button onClick={() => handleButtonClick('/working-hours', 'working-hours')} className={selectedButton === 'working-hours' ? 'sidebar-button-active' : ''}>
              <img src="/working-hours-icon.svg" alt="" style={getButtonStyle('working-hours')} />
            </button>


            <button onClick={() => handleButtonClick('/announcements', 'announcements')} className={selectedButton === 'announcements' ? 'sidebar-button-active' : ''}>
              <img src="/announcements-icon.svg" alt="" style={getButtonStyle('announcements')} />
            </button>


            <button onClick={() => handleButtonClick('/support-tickets', 'support-tickets')} className={selectedButton === 'support-tickets' ? 'sidebar-button-active' : ''}>
              <img src="/support-tickets-icon.svg" alt="" style={getButtonStyle('support-tickets')} />
            </button>


            <button onClick={() => {
              console.log('logout');
              localStorage.removeItem('tracxion admin token');
              localStorage.removeItem('tracxion admin user');
              navigate('/auth');
            }} className={selectedButton === 'logout' ? 'sidebar-button-active' : ''}>
              <img src="/logout-icon.svg" alt="" style={getButtonStyle('logout')} />
            </button>
          </>
        }
      </nav>

    </aside>
  );
}


export default Sidebar;