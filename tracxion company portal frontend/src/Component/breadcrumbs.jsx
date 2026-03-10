import React, { useContext } from "react";
import { globalContext } from "../context/context";
import { useNavigate } from "react-router-dom";
import "../css/breadcrumbs.css";


function breadcrumbs() {
  const { breadcrumbs } = useContext(globalContext);
  const navigate = useNavigate();
  return (
    <div className="breadcrumbs-container">
      {
        breadcrumbs?.map((item, index) => (
          <React.Fragment key={index}>
            <span className={'breadcrumbs ' + (index === breadcrumbs.length - 1 ? 'breadcrumbs-active' : '')} onClick={() => navigate(item.link, (item.state ? { state: item.state } : {}))}> {item.title} </span>
            {
              index !== breadcrumbs.length - 1 && <span className="breadcrumbs-divider" > / </span>
            }
          </React.Fragment>
        ))
      }
    </div>
  );
}

export default breadcrumbs;