import { createContext, useMemo, useState } from "react";

export const globalContext = createContext();

export const GlobalProvider = ({ children }) => {

  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [pageTitle, setPageTitle] = useState('');
  const [subPageTitle, setSubPageTitle] = useState({});
  const [openSidebar, setOpenSidebar] = useState(true);
  const [buttonList, setButtonList] = useState([]);

  return <globalContext.Provider value={{
    breadcrumbs,
    setBreadcrumbs,
    pageTitle,
    setPageTitle,
    openSidebar,
    setOpenSidebar,
    buttonList,
    setButtonList,
    subPageTitle,
    setSubPageTitle,
  }}>
    {children}
  </globalContext.Provider>;
};