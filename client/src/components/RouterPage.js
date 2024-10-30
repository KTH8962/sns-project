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
    const [view, setView] = useState(false);
    const [profileImg, setProfileImg] = useState(false);
    const [completeFeed, setCompleteFeed] = useState(false);
    const [completeComment, setCompleteComment] = useState(false);
    const [completeFavorite, setCompleteFavorite] = useState(false);
    const [completeProfile, setCompleteProfile] = useState(false);
    const togglePopup = () => {
        setPopup(!popup);
    }
    const toggleView = () => {
        setView(!view);
    }
    const toggleProfileImg = () => {
        setProfileImg(!profileImg);
    }
    const registerFeed = (state) => {
        setCompleteFeed(state);
    }
    const registerComment = (state) => {
        setCompleteComment(state);
    }
    const registerProfile = (state) => {
        setCompleteProfile(state);
    }
    if(showNavbar) {
        document.querySelector('#root').classList.add('main');
    } else {
        document.querySelector('#root').classList.remove('main');
    }
    return (
        <>
            <PopupContext.Provider value={{popup, togglePopup, view, toggleView, completeFeed, registerFeed, completeComment, registerComment, completeProfile, registerProfile, completeFavorite, setCompleteFavorite, profileImg, toggleProfileImg}}>
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