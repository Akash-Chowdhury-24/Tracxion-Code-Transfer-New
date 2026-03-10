import { useContext } from "react";
import { globalContext } from "../context/context";
import "../css/header.css";
import { useNavigate } from "react-router-dom";


function Header() {
  const { openSidebar, setOpenSidebar } = useContext(globalContext);
  const navigate = useNavigate();
  return (
    <div className="header-container" >
      <button onClick={() => setOpenSidebar(!openSidebar)} className="header-button">
        <img src={openSidebar ? "/left-arrow-icon.svg" : "/right-arrow-icon.svg"} alt="" />
      </button>

      <div>
        <img src="/avatar.svg" alt="" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}/>
      </div>
    </div>
  );
}

export default Header;