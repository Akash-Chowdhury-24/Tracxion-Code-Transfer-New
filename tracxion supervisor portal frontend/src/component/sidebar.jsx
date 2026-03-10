import { useLocation, useNavigate } from 'react-router-dom';
import '../css/sidebar.css';
import { useEffect, useState } from 'react';

function Sidebar() {
  const location = useLocation();
  const pathname = location.pathname;

  const [selectedButton, setSelectedButton] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (pathname === '/dashboard/chat') {
      setSelectedButton('Dashboard');
    } else if (pathname === '/agent') {
      setSelectedButton('Agent');
    }
  }, [pathname]);


  return (
    <div className='sidebar-container'>
      <div className='sidebar-logo-container'>
        <img src="/logo.svg" alt="logo" />
      </div>
      <nav className='sidebar-nav-container'>
        <button className={selectedButton === 'Dashboard' ? 'selected' : ''} onClick={() => {
          setSelectedButton('Dashboard');
          navigate('/dashboard/chat/null');
        }}>
          <img src="/dashboard-icon.svg" alt="dashboard" />
        </button>
        <button className={selectedButton === 'Agent' ? 'selected' : ''} onClick={() => {
          setSelectedButton('Agent');
          navigate('/agent');
        }}>
          <img src="/agent-icon.svg" alt="agent" />
        </button>
      </nav>
    </div>
  );
}

export default Sidebar;