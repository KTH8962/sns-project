import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { PopupContext } from '../context/PopupContext';
import Header from './Header';
import Login from '../pages/Login';
import Join from '../pages/Join';
import NotPage from '../pages/NotPage';
import Main from '../pages/Main';
import MyPage from '../pages/MyPage';

function RouterPage(props) {
    const location = useLocation();
    const showNavbar = ['/main', '/mypage'].includes(location.pathname);
    const [popup, setPopup] = useState(false);
    const [completeFeed, setCompleteFeed] = useState(false);
    const [completeComment, setCompleteComment] = useState(false);
    const togglePopup = () => {
        setPopup(!popup);
    }
    const registerFeed = (state) => {
        setCompleteFeed(state);
    }
    const registerComment = (state) => {
        setCompleteComment(state);
    }
    if(showNavbar) {
        document.querySelector('#root').classList.add('main');
    } else {
        document.querySelector('#root').classList.remove('main');
    }
    return (
        <>
            <PopupContext.Provider value={{popup, togglePopup, completeFeed, registerFeed, completeComment, registerComment}}>
            {showNavbar && <Header />}
                <Routes>
                    <Route path='/' element={<Login />} />
                    <Route path='/join' element={<Join />} />
                    <Route path='/main' element={<Main />} />
                    <Route path='/mypage' element={<MyPage />} />
                    <Route path='*' element={<NotPage />} />
                </Routes>
            </PopupContext.Provider>
        </>
    );
}

export default RouterPage;