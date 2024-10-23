import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Login from './Login';
import Join from './Join';
import NotPage from './NotPage';
import Main from './Main';

function RouterPage(props) {
    const location = useLocation();
    const showNavbar = ['/main'];
    return (
        <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/join' element={<Join />} />
            <Route path='/main' element={<Main />} />
            <Route path='*' element={<NotPage />} />
        </Routes>
    );
}

export default RouterPage;