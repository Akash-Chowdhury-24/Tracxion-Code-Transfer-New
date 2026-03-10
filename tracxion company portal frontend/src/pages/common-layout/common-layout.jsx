import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../../Component/sidebar"
import { globalContext } from "../../context/context";
import { useContext, useState, useEffect, useRef } from "react";
import "./common-layout.css";
import Breadcrums from "../../Component/breadcrumbs";
import Header from "../../Component/header";
import CommonButton from "../../Component/common-button";
import CommonInput from "../../Component/common-input";

function CommonLayout() {

  const { pageTitle, openSidebar, buttonList, subPageTitle } = useContext(globalContext);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const location = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);
  return (
    <div>
      <div className="common-layout-container">
        <div
          className="common-layout-sidebar"
          style={{
            width: openSidebar ? '250px' : '80px'
          }}>
          <Sidebar />
        </div>
        <div className="common-layout-content-container">
          <Header />

          {
            // location.pathname !== '/dashboard' &&
            // <>
            //   {/* <Breadcrums /> */}

            //   <div className="common-layout-title-icon-container">
            //     <div className="common-layout-title-container">
            //       {/* <h2 className="common-layout-title">{pageTitle}</h2> */}
            //     </div>
            //     {/* <div className="common-layout-icon-container">{renderIcons(iconList)}</div> */}
            //   </div>
            // </>
          }
          <div className="common-layout-header">
            <div className="common-layout-header-title-container">
              <Breadcrums />
              <h2>
                {pageTitle}
                {subPageTitle?.text && <div className={`${subPageTitle?.className}`}>{subPageTitle?.text}</div>}
              </h2>
            </div>
            <div className="common-layout-header-icon-container">
              {
                buttonList?.map((item, index) => {
                  if (item.type === 'button') {
                    return <CommonButton
                      key={index}
                      text={item.text}
                      label={''}
                      onClick={item.onClick}
                      backgroundColor={item.backgroundColor}
                      textColor={item.textColor}
                      borderColor={item.borderColor}
                      className="common-layout-header-icon-button"
                    />
                  }
                  if (item.type === 'search') {
                    return <div className="common-layout-header-icon-search-container">
                      <img src="/search-icon.svg" alt="" />
                      <input
                        type={item.inputType}
                        placeholder="Search..." className="common-layout-header-icon-search-input"
                        onChange={item.onChange}
                        value={item.value}
                        name={item.name}
                        key={index}
                      />
                    </div>
                  }
                  if (item.type === 'dropdown') {
                    return <div
                      ref={dropdownRef}
                      className="common-layout-header-icon-dropdown-container"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                      <img src="/triple-dot-icon.svg" alt="" />
                      {dropdownOpen && <div className="common-layout-header-icon-dropdown-items-container">
                        {
                          item.dropdownItems?.map((dropdownItem, index) => {
                            return (
                              <button
                                key={index}
                                onClick={() => {
                                  dropdownItem.onClick();
                                  setDropdownOpen(false);
                                }}
                              >
                                {dropdownItem.text}
                              </button>
                            )
                          })
                        }
                      </div>}
                    </div>
                  }
                })
              }
            </div>
          </div>
          {/* <div className={`common-layout-content ${location.pathname === '/dashboard' ? 'dashboard-special' : ''}`}> */}
          <div className={`common-layout-content`}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommonLayout;