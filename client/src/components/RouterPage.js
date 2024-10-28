import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Login from '../pages/Login';
import Join from '../pages/Join';
import NotPage from '../pages/NotPage';
import Main from '../pages/Main';
import Header from './Header';
import { PopupContext } from '../context/PopupContext';

function RouterPage(props) {
    const location = useLocation();
    const showNavbar = ['/main'].includes(location.pathname);
    const [popup, setPopup] = useState(false);
    const [url, setUrl] = useState();
    const togglePopup = () => {
        setPopup(!popup);
    }
    if(showNavbar) {
        document.querySelector('#root').classList.add('main');
    } else {
        document.querySelector('#root').classList.remove('main');
    }
    return (
        <>
            <PopupContext.Provider value={{popup, togglePopup, url, setUrl}}>
            {showNavbar && <Header />}
                <Routes>
                    <Route path='/' element={<Login />} />
                    <Route path='/join' element={<Join />} />
                    <Route path='/main' element={<Main />} />
                    <Route path='*' element={<NotPage />} />
                </Routes>
            </PopupContext.Provider>
        </>
    );
}

export default RouterPage;