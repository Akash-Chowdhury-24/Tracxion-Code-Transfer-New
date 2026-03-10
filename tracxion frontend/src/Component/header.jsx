import { useContext } from "react";
import { globalContext } from "../context/context";
import "../css/header.css";


function Header() {
  const { openSidebar, setOpenSidebar } = useContext(globalContext);
  return (
    <div className="header-container" >
      <button onClick={() => setOpenSidebar(!openSidebar)} className="header-button">
        <img src={openSidebar ? "/left-arrow-icon.svg" : "/right-arrow-icon.svg"} alt="" />
      </button>

      <div>
        <img src="/avatar.svg" alt="" />
      </div>
    </div>
  );
}

export default Header;