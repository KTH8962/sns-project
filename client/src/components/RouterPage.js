import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Login from '../pages/Login';
import Join from '../pages/Join';
import NotPage from '../pages/NotPage';
import Main from '../pages/Main';
import Header from './Header';

function RouterPage(props) {
    const location = useLocation();
    const showNavbar = ['/main'].includes(location.pathname);
    if(showNavbar) {
        document.querySelector('#root').classList.add('main');
    }
    return (
        <>
            {showNavbar && <Header />}
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/join' element={<Join />} />
                <Route path='/main' element={<Main />} />
                <Route path='*' element={<NotPage />} />
            </Routes>
        </>
    );
}

export default RouterPage;