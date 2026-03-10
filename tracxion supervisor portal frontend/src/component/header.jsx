import { useContext } from 'react';
import { globalContext } from '../context/context';
import '../css/header.css';
import Breadcrumbs from './breadcrumbs';

function Header() {
  const { breadcrumbs, pageTitle } = useContext(globalContext);
  return (
    <div className='header-container'>
      <div className='header-left-container'>
        <Breadcrumbs />
        <h1>{pageTitle}</h1>
      </div>
      <div className='header-right-container'>
        <img src="/avatar.svg" alt="" />
      </div>
    </div>
  );
}

export default Header;