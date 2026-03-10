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
      { path: '/staffs', button: 'staffs' },
      { path: '/billings', button: 'billings' },
      { path: '/reports', button: 'reports' },
      { path: '/queue', button: 'queue' },
      { path: '/raise-a-dispute', button: 'raise-a-dispute' },
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

            <button onClick={() => handleButtonClick('/queue', 'queue')} className={selectedButton === 'queue' ? 'sidebar-button-active' : ''}>
              <img src="/queue-icon.svg" alt="" style={getButtonStyle('queue')} />
              <span>Queue</span>
            </button>



            <button onClick={() => handleButtonClick('/raise-a-dispute', 'raise-a-dispute')} className={selectedButton === 'raise-a-dispute' ? 'sidebar-button-active' : ''}>
              <img src="/raise-a-dispute-icon.svg" alt="" style={getButtonStyle('raise-a-dispute')} />
              <span>Raise a Dispute</span>
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



            <button onClick={() => handleButtonClick('/staffs', 'staffs')} className={selectedButton === 'staffs' ? 'sidebar-button-active' : ''}>
              <img src="/staffs-icon.svg" alt="" style={getButtonStyle('staffs')} />
            </button>



            <button onClick={() => handleButtonClick('/billings', 'billings')} className={selectedButton === 'billings' ? 'sidebar-button-active' : ''}>
              <img src="/billings-icon.svg" alt="" style={getButtonStyle('billings')} />
            </button>



            <button onClick={() => handleButtonClick('/reports', 'reports')} className={selectedButton === 'reports' ? 'sidebar-button-active' : ''}>
              <img src="/reports-icon.svg" alt="" style={getButtonStyle('reports')} />
            </button>


            <button onClick={() => handleButtonClick('/queue', 'queue')} className={selectedButton === 'queue' ? 'sidebar-button-active' : ''}>
              <img src="/queue-icon.svg" alt="" style={getButtonStyle('queue')} />
            </button>


            <button onClick={() => handleButtonClick('/raise-a-dispute', 'raise-a-dispute')} className={selectedButton === 'raise-a-dispute' ? 'sidebar-button-active' : ''}>
              <img src="/raise-a-dispute-icon.svg" alt="" style={getButtonStyle('raise-a-dispute')} />
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