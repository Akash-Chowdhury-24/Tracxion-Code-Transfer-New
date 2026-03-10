import { createContext, useMemo, useState } from "react";

export const globalContext = createContext();

export const GlobalProvider = ({ children }) => {

  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [pageTitle, setPageTitle] = useState('');
  const [subPageTitle, setSubPageTitle] = useState({});

  const value = useMemo(() => ({
    breadcrumbs,
    setBreadcrumbs,
    pageTitle,
    setPageTitle,
    subPageTitle,
    setSubPageTitle,
  }), [breadcrumbs, pageTitle, subPageTitle]);

  return <globalContext.Provider value={value}>
    {children}
  </globalContext.Provider>;
};